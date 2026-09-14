/**
 * Runs the manage-admins Edge Function's decisions under Node with fakes in
 * place of Supabase, so the gate can be checked without a running stack.
 *
 *   node scripts/test-manage-admins.mjs
 *
 * What is tested is who may call it and what it refuses: no session, a session
 * that is not an organiser, removing yourself, a bad email, an email that is
 * already an organiser. The real Supabase calls behind the fakes are exercised
 * by `supabase functions serve` against the local stack (see README).
 */
import { handle, generatePassword } from '../supabase/functions/manage-admins/handler.ts';

const ME = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';
const GHOST = '33333333-3333-3333-3333-333333333333';

let failures = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  ${detail}` : ''}`);
  if (!ok) failures++;
};

/** A fresh fake Supabase for each scenario, recording what was called. */
function fakeDeps(overrides = {}) {
  const calls = [];
  const admins = [
    { user_id: ME, email: 'me@example.com', created_at: '2026-08-05T00:00:00Z' },
    { user_id: OTHER, email: 'other@example.com', created_at: '2026-08-06T00:00:00Z' },
  ];
  const users = new Map([
    [ME, 'me@example.com'],
    [OTHER, 'other@example.com'],
    ['44444444-4444-4444-4444-444444444444', 'orphan@example.com'],
  ]);

  const deps = {
    async authenticate(token) {
      calls.push(['authenticate', token]);
      if (token === 'me') return { id: ME, email: 'me@example.com' };
      if (token === 'stranger') return { id: GHOST, email: 'stranger@example.com' };
      return null;
    },
    async isAdmin(authHeader) {
      calls.push(['isAdmin', authHeader]);
      return authHeader === 'Bearer me';
    },
    async listAdmins() {
      calls.push(['listAdmins']);
      return admins;
    },
    async findUserByEmail(email) {
      calls.push(['findUserByEmail', email]);
      for (const [id, e] of users) if (e === email) return { id };
      return null;
    },
    async createUser(email, password) {
      calls.push(['createUser', email, password]);
      return { id: '55555555-5555-5555-5555-555555555555' };
    },
    async setPassword(userId, password) {
      calls.push(['setPassword', userId, password]);
    },
    async insertAdmin(userId, email) {
      calls.push(['insertAdmin', userId, email]);
    },
    async deleteUser(userId) {
      calls.push(['deleteUser', userId]);
    },
    generatePassword: () => 'fixed-temp-password',
    ...overrides,
  };
  return { deps, calls };
}

const post = (body, token = 'me') =>
  new Request('http://localhost/manage-admins', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token === null ? {} : { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });

const run = async (req, overrides) => {
  const { deps, calls } = fakeDeps(overrides);
  const res = await handle(req, deps);
  const body = res.status === 204 ? null : await res.json();
  return { res, body, calls };
};

// --- the gate --------------------------------------------------------------
{
  const { res } = await run(new Request('http://localhost/x', { method: 'OPTIONS' }));
  check('preflight is answered with CORS headers', res.status === 204 && !!res.headers.get('Access-Control-Allow-Origin'));
}
{
  const { res, body } = await run(new Request('http://localhost/x', { method: 'GET', headers: { Authorization: 'Bearer me' } }));
  check('GET is refused', res.status === 405, body?.error);
}
{
  const { res, calls } = await run(post({ action: 'add', email: 'x@example.com' }, null));
  check('no session: 401 before anything is looked up', res.status === 401 && calls.length === 0);
}
{
  const { res, calls } = await run(post({ action: 'add', email: 'x@example.com' }, 'expired'));
  check('dead token: 401, nothing touched', res.status === 401 && !calls.some((c) => c[0] !== 'authenticate'));
}
{
  const { res, body, calls } = await run(post({ action: 'add', email: 'x@example.com' }, 'stranger'));
  check(
    'signed in but not an organiser: 403, nothing touched',
    res.status === 403 && !calls.some((c) => !['authenticate', 'isAdmin'].includes(c[0])),
    body?.error,
  );
}
{
  const { res, body } = await run(post({ action: 'promote' }));
  check('unknown action is refused', res.status === 400, body?.error);
}
{
  const { res, body } = await run(
    new Request('http://localhost/x', { method: 'POST', headers: { Authorization: 'Bearer me' }, body: 'not json' }),
  );
  check('non-JSON body is refused', res.status === 400, body?.error);
}

// --- add -------------------------------------------------------------------
{
  const { res, body } = await run(post({ action: 'add', email: 'not an email' }));
  check('add: bad email refused', res.status === 400, body?.error);
}
{
  const { res, body, calls } = await run(post({ action: 'add', email: '  New.Person@Example.com ' }));
  const created = calls.find((c) => c[0] === 'createUser');
  const inserted = calls.find((c) => c[0] === 'insertAdmin');
  check('add: new person gets an account and the admins row', res.status === 200 && !!created && !!inserted);
  check('add: email is trimmed and lowercased', created?.[1] === 'new.person@example.com' && inserted?.[2] === 'new.person@example.com');
  check('add: temporary password is returned once', body?.temporary_password === 'fixed-temp-password' && body?.existed === false);
  check('add: the admins row is for the created user', inserted?.[1] === '55555555-5555-5555-5555-555555555555');
}
{
  const { res, body, calls } = await run(post({ action: 'add', email: 'Other@example.com' }));
  check('add: existing organiser refused', res.status === 409 && !calls.some((c) => c[0] === 'createUser'), body?.error);
}
{
  const { res, body, calls } = await run(post({ action: 'add', email: 'orphan@example.com' }));
  check(
    'add: existing Auth user without the row gets a new password, not a duplicate account',
    res.status === 200 && body?.existed === true && calls.some((c) => c[0] === 'setPassword') && !calls.some((c) => c[0] === 'createUser'),
  );
}

// --- reset -----------------------------------------------------------------
{
  const { res, body, calls } = await run(post({ action: 'reset', user_id: ME }));
  check('reset: cannot reset yourself', res.status === 400 && !calls.some((c) => c[0] === 'setPassword'), body?.error);
}
{
  const { res, body, calls } = await run(post({ action: 'reset', user_id: OTHER }));
  const set = calls.find((c) => c[0] === 'setPassword');
  check('reset: another organiser gets a new temporary password', res.status === 200 && set?.[1] === OTHER && body?.temporary_password === 'fixed-temp-password');
  check('reset: response names who it is for', body?.email === 'other@example.com');
}
{
  const { res, calls } = await run(post({ action: 'reset', user_id: GHOST }));
  check('reset: unknown organiser is 404, nothing changed', res.status === 404 && !calls.some((c) => c[0] === 'setPassword'));
}
{
  const { res, calls } = await run(post({ action: 'reset', user_id: 'drop table admins' }));
  check('reset: malformed id refused before any lookup', res.status === 400 && !calls.some((c) => c[0] === 'listAdmins'));
}

// --- remove ----------------------------------------------------------------
{
  const { res, body, calls } = await run(post({ action: 'remove', user_id: ME }));
  check('remove: cannot remove yourself', res.status === 400 && !calls.some((c) => c[0] === 'deleteUser'), body?.error);
}
{
  const { res, body, calls } = await run(post({ action: 'remove', user_id: OTHER }));
  const del = calls.find((c) => c[0] === 'deleteUser');
  check('remove: another organiser is deleted', res.status === 200 && del?.[1] === OTHER && body?.email === 'other@example.com');
}
{
  const { res, calls } = await run(post({ action: 'remove', user_id: GHOST }));
  check('remove: unknown organiser is 404, nothing deleted', res.status === 404 && !calls.some((c) => c[0] === 'deleteUser'));
}

// --- failures downstream ---------------------------------------------------
{
  const { res, body } = await run(post({ action: 'add', email: 'x@example.com' }), {
    createUser: async () => {
      throw new Error('Database error creating new user');
    },
  });
  check('a Supabase failure comes back as 500 with its message', res.status === 500 && /Database error/.test(body?.error));
}

// --- the generator ---------------------------------------------------------
{
  const samples = Array.from({ length: 200 }, generatePassword);
  check('password: four groups of five, hyphenated', samples.every((p) => /^[A-Za-z2-9]{5}(-[A-Za-z2-9]{5}){3}$/.test(p)));
  check('password: no 0, O, 1, l or I', samples.every((p) => !/[0O1lI]/.test(p)));
  check('password: no repeats in 200 draws', new Set(samples).size === 200);
}

console.log(failures === 0 ? '\nMANAGE-ADMINS CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
