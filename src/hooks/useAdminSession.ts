import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * The admin session.
 *
 * The 2025 build called someone an admin if `localStorage.admin_session` held a
 * timestamp under 24 hours old, checked in the browser. Anyone could type that
 * into devtools, and it worked, because the tables granted SELECT to everyone
 * anyway. Here the session is a real Supabase JWT and the database decides what
 * it can reach: `isAdmin` is the result of a query the server answers, not a
 * claim the client makes about itself.
 */
export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const check = async (next: Session | null) => {
      if (!active) return;
      setSession(next);

      if (!next) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('is_admin');
      if (!active) return;
      setIsAdmin(!error && data === true);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => check(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      // A refreshed token or a changed password is the same person with the
      // same access. Re-running the admin check here would flip `loading` and
      // unmount whatever page they are on, mid-form.
      if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setSession(next);
        return;
      }

      setLoading(true);
      // Deferred rather than awaited. Supabase holds its auth lock while it
      // notifies subscribers, and a Supabase call made inside this callback
      // waits for that same lock: the two deadlock and the page hangs on
      // "Checking your access". Letting the callback return first releases it.
      setTimeout(() => check(next), 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    isAdmin,
    loading,
    signOut: () => supabase.auth.signOut(),
  };
}
