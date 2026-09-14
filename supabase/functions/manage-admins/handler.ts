/**
 * manage-admins: how an organiser adds, resets or removes another organiser
 * from inside the app.
 *
 * An organiser account is two things: an Auth user, and a row in
 * public.admins. Creating an Auth user needs the service_role key, which can
 * never ship in the browser bundle, so this runs as an Edge Function instead.
 * Before it touches anything it does what the database does for every other
 * admin action: asks Auth who the caller is, then asks public.is_admin()
 * whether that user is an organiser. Everyone else gets a 401 or 403 and no
 * further.
 *
 * New accounts get a temporary password, returned once to the organiser who
 * created them, rather than an invitation email. Supabase's built-in mailer
 * only delivers to members of the Supabase project itself and is capped at a
 * couple of messages an hour, so an emailed invite would silently go nowhere
 * for almost everyone. A password read out over the phone always arrives.
 *
 * Everything that talks to Supabase is behind `Deps`, so the decisions in here
 * (who may call, what is refused, what comes back) can be run under Node with
 * fakes. index.ts wires the real clients in.
 */

export interface CallerIdentity {
  id: string;
  email: string | null;
}

export interface AdminRow {
  user_id: string;
  email: string;
  created_at: string;
}

export interface Deps {
  /** Resolves the bearer token to a user, or null if it is not a live session. */
  authenticate(token: string): Promise<CallerIdentity | null>;
  /** public.is_admin(), evaluated as the caller. */
  isAdmin(authHeader: string): Promise<boolean>;
  listAdmins(): Promise<AdminRow[]>;
  findUserByEmail(email: string): Promise<{ id: string } | null>;
  createUser(email: string, password: string): Promise<{ id: string }>;
  setPassword(userId: string, password: string): Promise<void>;
  insertAdmin(userId: string, email: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  generatePassword(): string;
}

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Four groups of five, no characters that read as each other (0/O, 1/l/I).
 * Meant to be read out over the phone and typed once, so it is long rather
 * than clever: 20 characters from an alphabet of 57 is about 116 bits.
 */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

export function generatePassword(): string {
  const groups: string[] = [];
  // Rejection sampling keeps every character equally likely. 256 is not a
  // multiple of 57, so a plain modulo would favour the start of the alphabet.
  const limit = 256 - (256 % ALPHABET.length);
  const bytes = new Uint8Array(64);
  let group = '';
  while (groups.length < 4) {
    crypto.getRandomValues(bytes);
    for (const b of bytes) {
      if (b >= limit) continue;
      group += ALPHABET[b % ALPHABET.length];
      if (group.length === 5) {
        groups.push(group);
        group = '';
        if (groups.length === 4) break;
      }
    }
  }
  return groups.join('-');
}

type Body = { action?: unknown; email?: unknown; user_id?: unknown };

export async function handle(req: Request, deps: Deps): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token || token === authHeader) {
    return json({ error: 'Sign in first' }, 401);
  }

  try {
    const caller = await deps.authenticate(token);
    if (!caller) {
      return json({ error: 'Your session has expired. Sign in again.' }, 401);
    }
    if (!(await deps.isAdmin(authHeader))) {
      return json({ error: 'Only organisers can manage organisers' }, 403);
    }

    let body: Body;
    try {
      body = (await req.json()) as Body;
    } catch {
      return json({ error: 'Expected a JSON body' }, 400);
    }

    switch (body.action) {
      case 'add':
        return await add(deps, body);
      case 'reset':
        return await reset(deps, caller, body);
      case 'remove':
        return await remove(deps, caller, body);
      default:
        return json({ error: 'Unknown action' }, 400);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: message }, 500);
  }
}

async function add(deps: Deps, body: Body): Promise<Response> {
  const email = String(body.email ?? '').trim().toLowerCase();
  if (!EMAIL.test(email)) {
    return json({ error: 'Enter a valid email address' }, 400);
  }

  const admins = await deps.listAdmins();
  if (admins.some((a) => a.email.toLowerCase() === email)) {
    return json({ error: `${email} is already an organiser` }, 409);
  }

  const password = deps.generatePassword();

  // The Auth user may already exist without the admins row: an organiser who
  // was removed keeps no account (removal deletes the user), but an account
  // made by hand in the dashboard would. Either way the outcome is the same:
  // a fresh temporary password and the row that actually grants access.
  const existing = await deps.findUserByEmail(email);
  let userId: string;
  if (existing) {
    await deps.setPassword(existing.id, password);
    userId = existing.id;
  } else {
    userId = (await deps.createUser(email, password)).id;
  }

  await deps.insertAdmin(userId, email);

  return json(
    { ok: true, email, user_id: userId, temporary_password: password, existed: !!existing },
    200,
  );
}

async function reset(deps: Deps, caller: CallerIdentity, body: Body): Promise<Response> {
  const userId = String(body.user_id ?? '');
  if (!UUID.test(userId)) {
    return json({ error: 'Choose an organiser to reset' }, 400);
  }
  if (userId === caller.id) {
    return json({ error: 'Change your own password from the "Your password" form' }, 400);
  }

  const target = (await deps.listAdmins()).find((a) => a.user_id === userId);
  if (!target) {
    return json({ error: 'That organiser no longer exists' }, 404);
  }

  const password = deps.generatePassword();
  await deps.setPassword(userId, password);

  return json({ ok: true, email: target.email, temporary_password: password }, 200);
}

async function remove(deps: Deps, caller: CallerIdentity, body: Body): Promise<Response> {
  const userId = String(body.user_id ?? '');
  if (!UUID.test(userId)) {
    return json({ error: 'Choose an organiser to remove' }, 400);
  }
  // The last organiser cannot lock everyone out by removing themselves, and
  // nobody removes their own access by mistake. Another organiser does it.
  if (userId === caller.id) {
    return json({ error: 'You cannot remove yourself. Ask another organiser to do it.' }, 400);
  }

  const target = (await deps.listAdmins()).find((a) => a.user_id === userId);
  if (!target) {
    return json({ error: 'That organiser no longer exists' }, 404);
  }

  // Deleting the Auth user cascades to public.admins. Leaving the user behind
  // would keep a sign-in that reaches nothing, which looks like a broken
  // account rather than a removed one.
  await deps.deleteUser(userId);

  return json({ ok: true, email: target.email }, 200);
}
