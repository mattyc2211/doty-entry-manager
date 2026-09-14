import { FunctionsFetchError, FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Organiser accounts.
 *
 * Reading the list is a plain query: public.admins is visible to organisers
 * under RLS and to nobody else. Adding, resetting and removing go through the
 * manage-admins Edge Function, because creating an Auth user needs the
 * service_role key and that key can never be in this bundle. The function
 * checks is_admin() itself before doing anything, so this file is a thin
 * client for it, not the gate.
 */

export interface Organiser {
  userId: string;
  email: string;
  createdAt: string;
}

export async function fetchOrganisers(): Promise<Organiser[]> {
  const { data, error } = await supabase
    .from('admins')
    .select('user_id, email, created_at')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    userId: row.user_id,
    email: row.email,
    createdAt: row.created_at,
  }));
}

export interface TemporaryPassword {
  email: string;
  temporaryPassword: string;
}

export async function addOrganiser(email: string): Promise<TemporaryPassword> {
  const result = await call<{ email: string; temporary_password: string }>({
    action: 'add',
    email,
  });
  return { email: result.email, temporaryPassword: result.temporary_password };
}

export async function resetOrganiserPassword(userId: string): Promise<TemporaryPassword> {
  const result = await call<{ email: string; temporary_password: string }>({
    action: 'reset',
    user_id: userId,
  });
  return { email: result.email, temporaryPassword: result.temporary_password };
}

export async function removeOrganiser(userId: string): Promise<void> {
  await call<{ email: string }>({ action: 'remove', user_id: userId });
}

/** The signed-in organiser's own password. Plain Auth, no function needed. */
export async function changeOwnPassword(password: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(error.message);
}

async function call<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>('manage-admins', { body });

  if (error) {
    // A non-2xx response arrives as FunctionsHttpError. The message the
    // function wrote is in the response body; error.message only says that
    // the status was not 2xx.
    if (error instanceof FunctionsHttpError) {
      const detail = (await error.context.json().catch(() => null)) as { error?: string } | null;
      throw new Error(detail?.error ?? 'The organiser service refused the request.');
    }
    if (error instanceof FunctionsFetchError) {
      throw new Error('Could not reach the organiser service. Check your connection and try again.');
    }
    throw new Error(error.message);
  }

  if (!data) throw new Error('The organiser service returned nothing.');
  return data;
}
