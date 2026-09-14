/**
 * End-to-end check of organiser management through the real Edge Function,
 * as a browser would call it: sign in, add an organiser, sign in as them,
 * reset, remove. Run it against the local stack, never against production:
 * it creates and deletes accounts.
 *
 *   supabase start && supabase db reset
 *   supabase functions serve            # in another terminal
 *   node scripts/create-organiser.mjs --url http://127.0.0.1:54721 --key <service_role> \
 *     --email organiser@example.com --password organiser-local-pass-1
 *   node scripts/smoke-organisers.mjs --email organiser@example.com --password organiser-local-pass-1
 *
 * Reads .env for the project URL and anon key, so it points wherever the app
 * points. Refuses to run against anything that is not local.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const args = {};
for (let i = 2; i < process.argv.length; i += 1) {
  const token = process.argv[i];
  if (token.startsWith('--')) {
    const next = process.argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[token.slice(2)] = true;
    } else {
      args[token.slice(2)] = next;
      i += 1;
    }
  }
}

if (!args.email || !args.password) {
  console.error('Usage: node scripts/smoke-organisers.mjs --email <organiser> --password <password>');
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')];
    }),
);

if (!/^(http:\/\/)?(127\.0\.0\.1|localhost)/.test(env.VITE_SUPABASE_URL ?? '')) {
  console.error(`Refusing to run against ${env.VITE_SUPABASE_URL}: this creates and deletes accounts.`);
  process.exit(1);
}

let failures = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  ${detail}` : ''}`);
  if (!ok) failures++;
};

const fresh = () =>
  createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

/** Calls the function the way src/lib/admins.ts does, and returns {status, body}. */
async function manage(client, body) {
  const { data, error } = await client.functions.invoke('manage-admins', { body });
  if (error && error.context) {
    return { status: error.context.status, body: await error.context.json().catch(() => null) };
  }
  if (error) return { status: 0, body: { error: error.message } };
  return { status: 200, body: data };
}

// --- who is calling ----------------------------------------------------------
{
  const anon = fresh();
  const { status } = await manage(anon, { action: 'add', email: 'nobody@example.com' });
  check('anon (no session) is refused', status === 401, `status ${status}`);
}

const organiser = fresh();
const { error: signInError } = await organiser.auth.signInWithPassword({
  email: args.email,
  password: args.password,
});
check('organiser signs in', !signInError, signInError?.message);
if (signInError) process.exit(1);

const me = (await organiser.auth.getUser()).data.user;

// --- add ---------------------------------------------------------------------
const newEmail = `smoke-${Date.now()}@example.com`;
const added = await manage(organiser, { action: 'add', email: newEmail });
check('organiser adds a new organiser', added.status === 200, JSON.stringify(added.body));
const tempPassword = added.body?.temporary_password;
check('a temporary password comes back', typeof tempPassword === 'string' && tempPassword.length >= 20);

{
  const { data } = await organiser.from('admins').select('email').eq('email', newEmail);
  check('the new organiser is in public.admins', data?.length === 1);
}
{
  const again = await manage(organiser, { action: 'add', email: newEmail.toUpperCase() });
  check('adding them twice is refused', again.status === 409, again.body?.error);
}

// --- the new organiser can actually get in ------------------------------------
const newcomer = fresh();
{
  const { error } = await newcomer.auth.signInWithPassword({ email: newEmail, password: tempPassword });
  check('new organiser signs in with the temporary password', !error, error?.message);
}
{
  const { data } = await newcomer.rpc('is_admin');
  check('new organiser is recognised by is_admin()', data === true);
}
{
  const { error } = await newcomer.auth.updateUser({ password: 'their-own-long-password-1' });
  check('new organiser can set their own password', !error, error?.message);
}
{
  const self = await manage(newcomer, { action: 'remove', user_id: (await newcomer.auth.getUser()).data.user.id });
  check('nobody can remove themselves', self.status === 400, self.body?.error);
}

// --- reset -------------------------------------------------------------------
const reset = await manage(organiser, { action: 'reset', user_id: added.body.user_id });
check('organiser resets the newcomer’s password', reset.status === 200 && typeof reset.body?.temporary_password === 'string');
{
  const probe = fresh();
  const { error } = await probe.auth.signInWithPassword({ email: newEmail, password: reset.body.temporary_password });
  check('the reset password works', !error, error?.message);
  const { error: oldError } = await fresh().auth.signInWithPassword({ email: newEmail, password: 'their-own-long-password-1' });
  check('the old password no longer does', !!oldError);
}
{
  const selfReset = await manage(organiser, { action: 'reset', user_id: me.id });
  check('resetting your own password is refused', selfReset.status === 400, selfReset.body?.error);
}

// --- a signed-in non-organiser is refused -------------------------------------
// Made with the service key straight into Auth, so there is no admins row.
if (args.service) {
  const service = createClient(env.VITE_SUPABASE_URL, args.service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const strangerEmail = `stranger-${Date.now()}@example.com`;
  await service.auth.admin.createUser({ email: strangerEmail, password: 'stranger-long-password-1', email_confirm: true });
  const stranger = fresh();
  await stranger.auth.signInWithPassword({ email: strangerEmail, password: 'stranger-long-password-1' });
  const refused = await manage(stranger, { action: 'add', email: 'x@example.com' });
  check('a signed-in non-organiser is refused', refused.status === 403, refused.body?.error);
  const { data: users } = await service.auth.admin.listUsers({ perPage: 1000 });
  const s = users.users.find((u) => u.email === strangerEmail);
  if (s) await service.auth.admin.deleteUser(s.id);
} else {
  console.log('SKIP  non-organiser check (pass --service <service_role key> to run it)');
}

// --- remove ------------------------------------------------------------------
const removed = await manage(organiser, { action: 'remove', user_id: added.body.user_id });
check('organiser removes the newcomer', removed.status === 200 && removed.body?.email === newEmail, JSON.stringify(removed.body));
{
  const { data } = await organiser.from('admins').select('email').eq('email', newEmail);
  check('the row is gone from public.admins', data?.length === 0);
  const { error } = await fresh().auth.signInWithPassword({ email: newEmail, password: reset.body.temporary_password });
  check('the removed organiser can no longer sign in', !!error);
}
{
  const gone = await manage(organiser, { action: 'remove', user_id: added.body.user_id });
  check('removing them again is a clean 404', gone.status === 404, gone.body?.error);
}

console.log(failures === 0 ? '\nORGANISER SMOKE PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
