import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { Check, Copy, Loader2 } from 'lucide-react';
import {
  addOrganiser,
  changeOwnPassword,
  fetchOrganisers,
  removeOrganiser,
  resetOrganiserPassword,
  type Organiser,
  type TemporaryPassword,
} from '@/lib/admins';
import { Field, TextInput } from '@/components/entry/Field';
import { formatShortTimestamp } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { AdminContext } from '@/pages/Admin';

/**
 * Who can sign in. Adding someone creates their account on the spot and shows
 * a temporary password once, here, for the organiser to pass on by phone or in
 * person. There is no invitation email: Supabase's built-in mailer only
 * delivers to members of the Supabase project, so an emailed invite would
 * quietly reach nobody. A password read out always arrives.
 */
export function AdminOrganisers() {
  const { userId } = useOutletContext<AdminContext>();
  const queryClient = useQueryClient();
  const [revealed, setRevealed] = useState<TemporaryPassword | null>(null);

  const { data: organisers = [], isLoading, error } = useQuery({
    queryKey: ['organisers'],
    queryFn: fetchOrganisers,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['organisers'] });

  const add = useMutation({
    mutationFn: addOrganiser,
    onSuccess: (result) => {
      setRevealed(result);
      refresh();
    },
  });

  const reset = useMutation({
    mutationFn: resetOrganiserPassword,
    onSuccess: (result) => setRevealed(result),
  });

  const remove = useMutation({
    mutationFn: removeOrganiser,
    onSuccess: refresh,
  });

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
      <h1 className="display text-3xl text-show-ink">Organisers</h1>
      <p className="mt-3 max-w-prose text-sm text-show-charcoal">
        Anyone listed here can sign in, see every entry and record payments.
        They can also add and remove organisers, including you.
      </p>

      <AddOrganiserForm
        busy={add.isPending}
        error={add.error?.message}
        onSubmit={(email) => add.mutate(email)}
      />

      {revealed && (
        <TemporaryPasswordPanel
          result={revealed}
          onDismiss={() => setRevealed(null)}
        />
      )}

      <section className="mt-8 border border-show-rule bg-white">
        {isLoading && (
          <p className="p-6 text-sm text-show-charcoal">Loading organisers…</p>
        )}
        {error && (
          <p className="p-6 text-sm text-show-red">{(error as Error).message}</p>
        )}
        {organisers.map((organiser) => (
          <OrganiserRow
            key={organiser.userId}
            organiser={organiser}
            isYou={organiser.userId === userId}
            busy={
              (reset.isPending && reset.variables === organiser.userId) ||
              (remove.isPending && remove.variables === organiser.userId)
            }
            onReset={() => reset.mutate(organiser.userId)}
            onRemove={() => remove.mutate(organiser.userId)}
          />
        ))}
        {(reset.error || remove.error) && (
          <p className="border-t border-show-rule p-5 text-sm text-show-red">
            {(reset.error ?? remove.error)?.message}
          </p>
        )}
      </section>

      <YourPasswordForm />
    </div>
  );
}

function AddOrganiserForm({
  busy,
  error,
  onSubmit,
}: {
  busy: boolean;
  error?: string;
  onSubmit: (email: string) => void;
}) {
  const [email, setEmail] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(email.trim());
        setEmail('');
      }}
      className="mt-8 border border-show-rule bg-white p-6"
    >
      <h2 className="text-base font-medium text-show-ink">Add an organiser</h2>
      <p className="mt-1 text-sm text-show-charcoal">
        Their account is created straight away with a temporary password, shown
        once on this page. Pass it on by phone or in person, not by email.
      </p>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <Field label="Email" htmlFor="organiser-email" className="min-w-[16rem] flex-1">
          <TextInput
            id="organiser-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />
        </Field>
        <button
          type="submit"
          disabled={busy || !email.trim()}
          className="inline-flex h-11 items-center gap-2 bg-show-red px-5 text-sm font-semibold text-white transition-colors hover:bg-show-red-deep disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-show-red">{error}</p>}
    </form>
  );
}

function TemporaryPasswordPanel({
  result,
  onDismiss,
}: {
  result: TemporaryPassword;
  onDismiss: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the password is still on screen.
    }
  };

  return (
    <div className="animate-rise mt-6 border border-show-rule bg-white">
      {/* The one place on this page that earns the red: a credential that is
          shown once and never again. */}
      <div className="h-[6px] bg-show-red" />
      <div className="p-6">
        <p className="label">Temporary password for</p>
        <p className="mt-1 text-sm text-show-ink">{result.email}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="code select-all text-xl font-semibold text-show-ink">
            {result.temporaryPassword}
          </p>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 border border-show-ink px-3 py-1.5 text-xs font-medium text-show-ink transition-colors hover:bg-show-ink hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <p className="mt-4 max-w-prose text-sm text-show-charcoal">
          This is shown once. Give it to them directly, then ask them to sign in
          at <span className="code">{signInAddress()}</span> and set their own
          password under Organisers. If it is lost, reset it from the list below.
        </p>

        <button
          type="button"
          onClick={onDismiss}
          className="mt-5 text-sm text-show-charcoal underline-offset-4 hover:text-show-ink hover:underline"
        >
          Done, hide this
        </button>
      </div>
    </div>
  );
}

/** The address to read out, as the show's own domain rather than a path. */
function signInAddress(): string {
  return `${window.location.host}/admin`;
}

function OrganiserRow({
  organiser,
  isYou,
  busy,
  onReset,
  onRemove,
}: {
  organiser: Organiser;
  isYou: boolean;
  busy: boolean;
  onReset: () => void;
  onRemove: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="border-b border-show-rule last:border-b-0">
      <div className="flex flex-wrap items-center gap-4 p-5">
        {/* Full width on a phone so the email is never cut short by the
            buttons; they drop to the next line instead. */}
        <div className="min-w-0 grow basis-full sm:basis-0">
          <p className="truncate text-sm text-show-ink">
            {organiser.email}
            {isYou && (
              <span className="ml-2 bg-wash px-2 py-0.5 text-xs text-show-charcoal">
                you
              </span>
            )}
          </p>
          <p className="mt-0.5 text-xs text-show-charcoal">
            Added{' '}
            <span className="code">{formatShortTimestamp(organiser.createdAt)}</span>
          </p>
        </div>

        {!isYou && !confirming && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={onReset}
              className="inline-flex items-center gap-2 border border-show-rule px-3.5 py-2 text-xs font-medium text-show-charcoal transition-colors hover:text-show-ink disabled:opacity-50"
            >
              {busy && <Loader2 className="h-3 w-3 animate-spin" />}
              Reset password
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setConfirming(true)}
              className="border border-show-ink px-3.5 py-2 text-xs font-medium text-show-ink transition-colors hover:bg-show-ink hover:text-white disabled:opacity-50"
            >
              Remove
            </button>
          </>
        )}
      </div>

      {confirming && (
        <div className="animate-rise flex flex-wrap items-center gap-4 border-t border-show-rule bg-wash px-5 py-4">
          <p className="flex-1 text-sm text-show-ink">
            Remove {organiser.email}? They lose access straight away.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setConfirming(false);
              onRemove();
            }}
            className={cn(
              'inline-flex items-center gap-2 bg-show-red px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-show-red-deep disabled:opacity-60',
            )}
          >
            Remove
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="text-sm text-show-charcoal hover:text-show-ink"
          >
            Keep
          </button>
        </div>
      )}
    </div>
  );
}

function YourPasswordForm() {
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const change = useMutation({
    mutationFn: changeOwnPassword,
    onSuccess: () => {
      setPassword('');
      setAgain('');
      setDone(true);
    },
    onError: (err: Error) => setError(err.message),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDone(false);
    if (password.length < 12) {
      setError('Use at least 12 characters. This account can read every exhibitor’s contact details.');
      return;
    }
    if (password !== again) {
      setError('The two passwords do not match.');
      return;
    }
    change.mutate(password);
  };

  return (
    <form onSubmit={submit} className="mt-8 border border-show-rule bg-white p-6">
      <h2 className="text-base font-medium text-show-ink">Your password</h2>
      <p className="mt-1 text-sm text-show-charcoal">
        Change it here, especially if you were given a temporary one.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="New password" htmlFor="new-password" hint="At least 12 characters.">
          <TextInput
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </Field>
        <Field label="Again, to check" htmlFor="new-password-again">
          <TextInput
            id="new-password-again"
            type="password"
            value={again}
            onChange={(e) => setAgain(e.target.value)}
            autoComplete="new-password"
            required
          />
        </Field>
      </div>

      {error && <p className="mt-3 text-sm text-show-red">{error}</p>}
      {done && (
        <p className="mt-3 text-sm text-show-paid">
          Password changed. Use it next time you sign in.
        </p>
      )}

      <button
        type="submit"
        disabled={change.isPending}
        className="mt-5 inline-flex h-11 items-center gap-2 border border-show-ink px-5 text-sm font-medium text-show-ink transition-colors hover:bg-show-ink hover:text-white disabled:opacity-60"
      >
        {change.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Change password
      </button>
    </form>
  );
}
