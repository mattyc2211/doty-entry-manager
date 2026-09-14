/**
 * Edge Function entry point. The decisions live in handler.ts; this file only
 * connects them to Supabase.
 *
 * Deploy with:
 *   supabase functions deploy manage-admins --project-ref kbfktirsmwgxrwjgxqgy
 *
 * The three environment variables are injected by the Edge runtime on every
 * project, hosted and local. Nothing needs to be set by hand.
 */
import { createClient } from 'npm:@supabase/supabase-js@2';
import { generatePassword, handle, type Deps } from './handler.ts';

const url = Deno.env.get('SUPABASE_URL') ?? '';
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const noSession = { auth: { autoRefreshToken: false, persistSession: false } };

// service_role: bypasses RLS and can create and delete Auth users. It exists
// only inside this function and is never returned to the browser.
const service = createClient(url, serviceKey, noSession);

// The caller's own identity, so is_admin() is answered for them and not for us.
const asCaller = (authHeader: string) =>
  createClient(url, anonKey, {
    ...noSession,
    global: { headers: { Authorization: authHeader } },
  });

const deps: Deps = {
  async authenticate(token) {
    const { data, error } = await service.auth.getUser(token);
    if (error || !data.user) return null;
    return { id: data.user.id, email: data.user.email ?? null };
  },

  async isAdmin(authHeader) {
    const { data, error } = await asCaller(authHeader).rpc('is_admin');
    return !error && data === true;
  },

  async listAdmins() {
    const { data, error } = await service
      .from('admins')
      .select('user_id, email, created_at');
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async findUserByEmail(email) {
    // The admin API has no lookup by email. The user list here is the
    // organisers plus whoever was made by hand, so one page covers it.
    const { data, error } = await service.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) throw new Error(error.message);
    const user = data.users.find((u) => u.email?.toLowerCase() === email);
    return user ? { id: user.id } : null;
  },

  async createUser(email, password) {
    // email_confirm: the account is usable straight away. Nobody is sent a
    // confirmation email, which would not be delivered anyway (see handler.ts).
    const { data, error } = await service.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error || !data.user) throw new Error(error?.message ?? 'The account was not created');
    return { id: data.user.id };
  },

  async setPassword(userId, password) {
    const { error } = await service.auth.admin.updateUserById(userId, { password });
    if (error) throw new Error(error.message);
  },

  async insertAdmin(userId, email) {
    const { error } = await service
      .from('admins')
      .upsert({ user_id: userId, email }, { onConflict: 'user_id' });
    if (error) throw new Error(error.message);
  },

  async deleteUser(userId) {
    const { error } = await service.auth.admin.deleteUser(userId);
    if (error) throw new Error(error.message);
  },

  generatePassword,
};

Deno.serve((req) => handle(req, deps));
