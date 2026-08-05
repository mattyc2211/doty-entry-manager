/**
 * Creates an organiser account: an auth user, plus the row in public.admins
 * that actually grants access.
 *
 * Both halves are required. Being signed in is not the same as being an
 * organiser: every RLS policy on the entry tables gates on membership of
 * public.admins, so a user without that row signs in successfully and sees
 * nothing. That is deliberate, and it is why this script does both steps.
 *
 * Needs the service_role key, which bypasses RLS. Pass it on the command line
 * rather than putting it in .env, so it cannot end up in the browser bundle:
 *
 *   node scripts/create-organiser.mjs \
 *     --url https://kbfktirsmwgxrwjgxqgy.supabase.co \
 *     --key <service_role key> \
 *     --email someone@example.com \
 *     --password '<a long one>'
 *
 * Get the key from Project Settings -> API -> service_role. Treat it like a
 * password: it can read and write every table regardless of policy.
 */
import { createClient } from '@supabase/supabase-js';

// Parsed by walking argv rather than by splitting the joined string on '--'.
// The earlier version did the latter, which corrupts any value containing a
// double hyphen. Supabase keys are base64url and may legitimately contain '--',
// so that version could silently mangle the key and report a confusing failure.
const args = {};
for (let i = 2; i < process.argv.length; i += 1) {
  const token = process.argv[i];
  if (token.startsWith('--')) {
    const name = token.slice(2);
    const next = process.argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[name] = true;
    } else {
      args[name] = next;
      i += 1;
    }
  }
}

const { url, key, email, password } = args;

if (!url || !key || !email || !password) {
  console.error('Usage: node scripts/create-organiser.mjs --url <url> --key <service_role> --email <email> --password <password>');
  process.exit(1);
}

if (password.length < 12) {
  console.error('Use a password of at least 12 characters. This account can read every exhibitor’s contact details.');
  process.exit(1);
}

const admin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let userId;

const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error && !/already/i.test(error.message)) {
  console.error(`Could not create the user: ${error.message}`);
  process.exit(1);
}

if (data?.user) {
  userId = data.user.id;
  console.log(`Created auth user ${email}`);
} else {
  // Already existed. Find it, and reset the password to the one given, so this
  // script is also the way to recover a locked-out organiser.
  const { data: list, error: listError } = await admin.auth.admin.listUsers();
  if (listError) {
    console.error(`Could not look up existing users: ${listError.message}`);
    process.exit(1);
  }
  const existing = list.users.find((u) => u.email === email);
  if (!existing) {
    console.error(`${email} exists but could not be found. Check it in the dashboard.`);
    process.exit(1);
  }
  userId = existing.id;
  await admin.auth.admin.updateUserById(userId, { password });
  console.log(`${email} already existed. Password reset.`);
}

const { error: adminError } = await admin
  .from('admins')
  .upsert({ user_id: userId, email }, { onConflict: 'user_id' });

if (adminError) {
  console.error(`User exists but could not be made an organiser: ${adminError.message}`);
  process.exit(1);
}

console.log(`${email} is an organiser. Sign in at /admin.`);
console.log('Now turn off public signups: Authentication -> Sign In / Up -> disable "Allow new users to sign up".');
console.log('Leave email sign-in enabled. Disabling the email provider locks this account out.');
