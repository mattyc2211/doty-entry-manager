import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Field, TextInput } from '@/components/entry/Field';
import { ShowMark } from '@/components/show/ShowMark';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    // Deliberately does not say which of the two was wrong. The old build's
    // login sat on a public page over publicly readable tables, so it did not
    // matter much what it leaked; this one is worth not leaking from.
    if (authError) setError('That email and password do not match an organiser account.');
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-wash px-5">
      <div className="w-full max-w-sm border border-show-rule bg-white">
        <div className="h-[6px] bg-show-red" />
        <div className="px-8 py-10">
          <ShowMark size="md" />
          <h1 className="display mt-6 text-2xl text-show-ink">Organisers</h1>
          <p className="mt-2 text-sm text-show-charcoal">
            Sign in to see entries and record payments.
          </p>

          <form onSubmit={signIn} className="mt-8 space-y-5">
            <Field label="Email" htmlFor="admin-email">
              <TextInput
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </Field>

            <Field label="Password" htmlFor="admin-password">
              <TextInput
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>

            {error && <p className="text-sm text-show-red">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 bg-show-red py-3.5 text-sm font-semibold text-white transition-colors hover:bg-show-red-deep disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
