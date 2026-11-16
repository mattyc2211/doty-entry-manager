import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { Field, TextInput } from '@/components/entry/Field';
import { AWARDS, type Award } from '@/lib/nominations';
import { fetchBallot, splitName, submitVotes, type Candidate, type VoteInput } from '@/lib/votes';
import { formatShowDate } from '@/lib/format';
import { cn } from '@/lib/utils';

/** The chosen candidate id for each award, empty if none. */
type Picks = Record<Award, string>;

/**
 * Voting for the two showmanship awards. While voting is open the site's
 * showmanship links point here instead of at the nomination form.
 */
export default function Vote() {
  const ballot = useQuery({ queryKey: ['ballot'], queryFn: fetchBallot });
  const [name, setName] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [picks, setPicks] = useState<Picks>({ north_island: '', south_island: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = useMutation({
    mutationFn: (votes: VoteInput[]) =>
      submitVotes({ name: name.trim(), memberNumber: memberNumber.trim() }, votes),
  });

  const candidates = ballot.data?.candidates ?? [];
  const byId = new Map(candidates.map((c) => [c.id, c]));
  const showDate = ballot.data?.showDate ? formatShowDate(ballot.data.showDate) : null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const votes = AWARDS.filter((a) => picks[a.code]).map((a) => ({
      award: a.code,
      candidateId: picks[a.code],
    }));

    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Add your name.';
    if (!memberNumber.trim()) next.memberNumber = 'Add your Dogs NZ member number.';
    if (votes.length === 0) next.awards = 'Choose someone for at least one of the awards.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    submit.mutate(votes);
  };

  useEffect(() => {
    if (submit.isSuccess) window.scrollTo(0, 0);
  }, [submit.isSuccess]);

  if (submit.isSuccess) {
    const member = memberNumber.replace(/\s/g, '').toUpperCase();
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
        <h1 className="display text-[clamp(2rem,6vw,3.5rem)] text-show-ink">
          Thank you, your vote is in.
        </h1>
        {showDate && (
          <p className="mx-auto mt-5 max-w-lg text-show-charcoal">
            The winners are announced at the dinner on {showDate}.
          </p>
        )}
        <div className="mx-auto mt-10 max-w-sm border-2 border-show-ink text-left">
          <div className="bg-show-ink px-4 py-2.5">
            <span className="display-md text-sm text-white">Showmanship vote</span>
          </div>
          <dl className="divide-y divide-show-rule px-4 py-1.5 text-sm">
            <ReceiptRow label="Member" value={<span className="code">{member}</span>} />
            {AWARDS.map((a) => (
              <ReceiptRow
                key={a.code}
                label={a.code === 'north_island' ? 'North Island' : 'South Island'}
                value={byId.get(picks[a.code])?.name ?? 'No vote'}
              />
            ))}
          </dl>
        </div>
        <Link
          to="/"
          className="mt-10 inline-block border-b border-show-ink pb-0.5 text-sm font-medium text-show-ink hover:border-show-red hover:text-show-red"
        >
          Back to the show
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <h1 className="display rule-red text-[clamp(2.25rem,6vw,4rem)] text-show-ink">
        Vote for the showmanship awards
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-show-charcoal">
        Nominations are in. Pick one person for the North Island award and one
        for the South Island award. Each Dogs NZ member gets one vote for each
        award.
        {showDate && <> The winners are announced at the dinner on {showDate}.</>}
      </p>

      {ballot.isLoading && <p className="mt-10 text-show-charcoal">Loading…</p>}
      {ballot.error && (
        <p className="mt-10 text-show-red">{(ballot.error as Error).message}</p>
      )}

      {ballot.data && !ballot.data.open && (
        <div className="mt-10 flex max-w-2xl items-start gap-4 border border-show-rule bg-wash p-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-show-red" />
          <div>
            <p className="display-md text-base text-show-ink">Voting is not open</p>
            <p className="mt-2 text-sm leading-relaxed text-show-charcoal">
              Check back soon, or watch the show's announcements.
            </p>
          </div>
        </div>
      )}

      {ballot.data?.open && (
        <form onSubmit={onSubmit} noValidate className="mt-12 max-w-3xl">
          <section>
            <h2 className="display-md text-xl text-show-ink">About you</h2>
            <p className="mt-2 max-w-xl text-sm text-show-charcoal">
              Your member number makes sure each member votes once. Only the
              organisers can see who voted.
            </p>
            <div className="mt-6 grid max-w-2xl gap-6 sm:grid-cols-2">
              <Field label="Your name" htmlFor="voter-name" error={errors.name}>
                <TextInput
                  id="voter-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  invalid={!!errors.name}
                  autoComplete="name"
                  maxLength={120}
                />
              </Field>
              <Field label="Dogs NZ member number" htmlFor="member-number" error={errors.memberNumber}>
                <TextInput
                  id="member-number"
                  value={memberNumber}
                  onChange={(e) => setMemberNumber(e.target.value)}
                  invalid={!!errors.memberNumber}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={20}
                  mono
                />
              </Field>
            </div>
          </section>

          {AWARDS.map((award) => (
            <AwardBallot
              key={award.code}
              award={award.code}
              title={award.title}
              candidates={candidates.filter((c) => c.award === award.code)}
              value={picks[award.code]}
              onChange={(v) => setPicks((p) => ({ ...p, [award.code]: v }))}
            />
          ))}

          <div className="mt-12 border-t border-show-rule pt-8">
            {errors.awards && <p className="mb-4 text-sm text-show-red">{errors.awards}</p>}
            {submit.error && <p className="mb-4 text-sm text-show-red">{submit.error.message}</p>}
            <button
              type="submit"
              disabled={submit.isPending}
              className="inline-flex items-center gap-2 bg-show-red px-7 py-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-show-red-deep disabled:opacity-60"
            >
              {submit.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Send my vote
            </button>
            <p className="mt-3 text-xs text-show-charcoal">
              You can't change your vote once it's sent.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

function AwardBallot({
  award,
  title,
  candidates,
  value,
  onChange,
}: {
  award: Award;
  title: string;
  candidates: Candidate[];
  value: string;
  onChange: (v: string) => void;
}) {
  const chosen = candidates.find((c) => c.id === value);
  return (
    <section className="mt-12 border-t border-show-rule pt-10">
      <fieldset>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <legend className="display-md text-xl text-show-ink">{title}</legend>
          <span className="code text-xs text-show-charcoal">{candidates.length} nominated</span>
        </div>
        <p className="mt-2 text-sm text-show-charcoal">Listed by surname. Choose one.</p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((c) => {
            const [first, surname] = splitName(c.name);
            return (
              <Option
                key={c.id}
                id={`${award}-${c.id}`}
                name={award}
                checked={value === c.id}
                onChange={() => onChange(c.id)}
              >
                {first} <span className="font-bold uppercase tracking-wide">{surname}</span>
              </Option>
            );
          })}
        </div>

        <p className="mt-3 min-h-[1.5em] text-sm text-show-charcoal" aria-live="polite">
          {chosen ? (
            <>
              Your vote: <strong className="text-show-ink">{chosen.name}</strong>
            </>
          ) : (
            'No one chosen yet.'
          )}
        </p>
      </fieldset>
    </section>
  );
}

function Option({
  id,
  name,
  checked,
  onChange,
  children,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer absolute opacity-0"
      />
      <label
        htmlFor={id}
        className={cn(
          'flex min-h-14 cursor-pointer items-center gap-3.5 border bg-white px-4 py-3 text-sm text-show-ink transition-colors hover:border-show-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-show-ink',
          checked && 'border-show-red bg-[#fdecee] shadow-[inset_4px_0_0_var(--red)]',
          !checked && 'border-show-rule',
        )}
      >
        <span
          className={cn(
            'grid h-5 w-5 shrink-0 place-items-center border-[1.5px]',
            checked ? 'border-show-red bg-show-red' : 'border-show-charcoal bg-white',
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        </span>
        <span className="min-w-0">{children}</span>
      </label>
    </div>
  );
}

function ReceiptRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 py-2.5">
      <dt className="text-show-charcoal">{label}</dt>
      <dd className="text-right font-semibold text-show-ink">{value}</dd>
    </div>
  );
}
