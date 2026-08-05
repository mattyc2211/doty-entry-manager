import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// The 2025 build hardcoded the project URL and anon key here and never read
// the .env file it shipped alongside them. Reading from the environment means
// the dev and production projects can differ, and that pointing this at a new
// Supabase project is a config change rather than a code change.
//
// The anon key is not a secret. It is compiled into the bundle and is meant to
// be public: it identifies the project and nothing more. Everything that keeps
// data safe is in the RLS policies, which is why there is no public read on any
// entry table in the baseline schema.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase project details.',
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
