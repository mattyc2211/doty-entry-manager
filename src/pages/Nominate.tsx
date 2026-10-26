import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useShow } from '@/hooks/useShow';
import { Field, TextInput } from '@/components/entry/Field';
import {
  AWARDS,
  submitNominations,
  type Award,
  type NominationInput,
} from '@/lib/nominations';

const REASON_LIMIT = 500;

type Draft = Record<Award, { nomineeName: string; reason: string }>;

const EMPTY: Draft = {
  north_island: { nomineeName: '', reason: '' },
  south_island: { nomineeName: '', reason: '' },
};

/**
 * Nominations for the two sportsmanship awards. One short page rather than a
 * wizard: a name, a member number, and one or both nominees. Either award can
 * be left blank, so someone who only knows exhibitors on one island is not
 * pushed into guessing for the other.
 */
export default function Nominate() {
  const { show, isLoading } = useShow();
  const [name, setName] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = useMutation({
    mutationFn: (nominations: NominationInput[]) =>
      submitNominations({ name: name.trim(), memberNumber: memberNumber.trim() }, nominations),
  });

  const setAward = (award: Award, key: 'nomineeName' | 'reason', value: string) =>
    setDraft((d) => ({ ...d, [award]: { ...d[award], [key]: value } }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nominations = AWARDS.filter((a) => draft[a.code].nomineeName.trim()).map((a) => ({
      award: a.code,
      nomineeName: draft[a.code].nomineeName.trim(),
      reason: draft[a.code].reason.trim() || undefined,
    }));

    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Add your name.';
    if (!memberNumber.trim()) next.memberNumber = 'Add your Dogs NZ member number.';
    if (nominations.length === 0) next.awards = 'Nominate someone for at least one of the awards.';
    for (const a of AWARDS) {
      if (!draft[a.code].nomineeName.trim() && draft[a.code].reason.trim()) {
        next[a.code] = 'Add the name of the person you are nominating, or clear the reason.';
      }
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    submit.mutate(nominations);
  };

  if (submit.isSuccess) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
        <h1 className="display text-[clamp(2rem,6vw,3.5rem)] text-show-ink">
          Thank you, we have your {submit.data === 1 ? 'nomination' : 'nominations'}.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-show-charcoal">
          Once nominations close, voting opens for the people nominated. Keep
          an eye on this site and the show's announcements.
        </p>
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
        Sportsmanship awards
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-show-charcoal">
        Two awards, one for the North Island and one for the South Island,
        recognising someone in the dog world who shows what good
        sportsmanship looks like. They don't need to be an exhibitor.
        Nominate someone for either award, or both. Once nominations close,
        voting opens.
      </p>

      {isLoading && <p className="mt-10 text-show-charcoal">Loading…</p>}

      {show && !show.nominationsOpen && (
        <div className="mt-10 flex max-w-2xl items-start gap-4 border border-show-rule bg-wash p-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-show-red" />
          <div>
            <p className="display-md text-base text-show-ink">Nominations are not open</p>
            <p className="mt-2 text-sm leading-relaxed text-show-charcoal">
              Check back soon, or watch the show's announcements for when they open.
            </p>
          </div>
        </div>
      )}

      {show?.nominationsOpen && (
        <form onSubmit={onSubmit} noValidate className="mt-12 max-w-2xl">
          <section>
            <h2 className="display-md text-xl text-show-ink">About you</h2>
            <p className="mt-2 text-sm text-show-charcoal">
              Nominations are open to Dogs NZ members. Each member can nominate
              once for each award.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Field label="Your name" htmlFor="nominator-name" error={errors.name}>
                <TextInput
                  id="nominator-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  invalid={!!errors.name}
                  autoComplete="name"
                  maxLength={120}
                />
              </Field>
              <Field
                label="Dogs NZ member number"
                htmlFor="member-number"
                error={errors.memberNumber}
              >
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
            <section key={award.code} className="mt-12 border-t border-show-rule pt-10">
              <h2 className="display-md text-xl text-show-ink">{award.title}</h2>
              <div className="mt-6 grid gap-6">
                <Field
                  label="Who are you nominating?"
                  htmlFor={`${award.code}-nominee`}
                  hint="Leave blank if you are not nominating for this award."
                  error={errors[award.code]}
                >
                  <TextInput
                    id={`${award.code}-nominee`}
                    value={draft[award.code].nomineeName}
                    onChange={(e) => setAward(award.code, 'nomineeName', e.target.value)}
                    invalid={!!errors[award.code]}
                    autoComplete="off"
                    maxLength={120}
                  />
                </Field>
                <Field
                  label="Why? (optional)"
                  htmlFor={`${award.code}-reason`}
                  hint="A sentence or two is plenty."
                >
                  <textarea
                    id={`${award.code}-reason`}
                    rows={3}
                    maxLength={REASON_LIMIT}
                    value={draft[award.code].reason}
                    onChange={(e) => setAward(award.code, 'reason', e.target.value)}
                    className="w-full border border-show-rule bg-white p-3 text-sm text-show-ink placeholder:text-show-charcoal"
                  />
                  <p className="mt-1 text-right text-xs text-show-charcoal">
                    {draft[award.code].reason.length}/{REASON_LIMIT}
                  </p>
                </Field>
              </div>
            </section>
          ))}

          <div className="mt-12 border-t border-show-rule pt-8">
            {errors.awards && <p className="mb-4 text-sm text-show-red">{errors.awards}</p>}
            {submit.error && (
              <p className="mb-4 text-sm text-show-red">{submit.error.message}</p>
            )}
            <button
              type="submit"
              disabled={submit.isPending}
              className="inline-flex items-center gap-2 bg-show-red px-7 py-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-show-red-deep disabled:opacity-60"
            >
              {submit.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Send nomination
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
