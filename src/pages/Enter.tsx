import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useShow } from '@/hooks/useShow';
import { submitEntry, uploadDogPhoto, type EntryReceipt } from '@/lib/entries';
import { isQualifyingDateValid } from '@/lib/show';
import { EntryStatusNotice } from '@/components/show/EntryStatusNotice';
import { EntryRail } from '@/components/entry/EntryRail';
import { ExhibitorStep } from '@/components/entry/ExhibitorStep';
import { DogsStep, type DogErrors } from '@/components/entry/DogsStep';
import { ExtrasStep } from '@/components/entry/ExtrasStep';
import { ReviewStep } from '@/components/entry/ReviewStep';
import { EntryComplete } from '@/components/entry/EntryComplete';
import { STEPS, emptyDraft, type EntryDraft, type StepKey } from '@/components/entry/types';
import type { ExhibitorInput } from '@/lib/entries';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Enter() {
  const { show, window: entryWindow, isLoading, error } = useShow();

  const [draft, setDraft] = useState<EntryDraft>(emptyDraft);
  const [step, setStep] = useState<StepKey>('exhibitor');
  const [furthest, setFurthest] = useState(0);
  const [exhibitorErrors, setExhibitorErrors] = useState<
    Partial<Record<keyof ExhibitorInput, string>>
  >({});
  const [dogErrors, setDogErrors] = useState<DogErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<EntryReceipt | null>(null);

  if (isLoading) {
    return <Centered>Loading the show…</Centered>;
  }

  if (error || !show) {
    return (
      <Centered>
        The show could not be loaded. Refresh, and tell the organisers if it keeps
        happening.
      </Centered>
    );
  }

  if (receipt) {
    return <EntryComplete show={show} receipt={receipt} />;
  }

  if (entryWindow !== 'open') {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 lg:px-8">
        <EntryStatusNotice show={show} window={entryWindow!} />
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-sm text-show-ink hover:text-show-red"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to the show
        </Link>
      </div>
    );
  }

  const index = STEPS.findIndex((s) => s.key === step);

  /** Validates only the step being left, so nobody is shown an error for a
   *  field they have not reached yet. */
  const validateStep = (): boolean => {
    if (step === 'exhibitor') {
      const e: Partial<Record<keyof ExhibitorInput, string>> = {};
      if (!draft.exhibitor.firstName.trim()) e.firstName = 'Add your first name.';
      if (!draft.exhibitor.surname.trim()) e.surname = 'Add your surname.';
      if (!EMAIL.test(draft.exhibitor.email.trim()))
        e.email = 'Add an email address the confirmation can reach.';
      if (!draft.exhibitor.phone.trim()) e.phone = 'Add a contact phone number.';
      setExhibitorErrors(e);
      return Object.keys(e).length === 0;
    }

    if (step === 'dogs') {
      const errs: DogErrors = {};
      for (const dog of draft.dogs) {
        const d: DogErrors[string] = { eventDetail: {} };
        if (!dog.pedigreeName.trim()) d.pedigreeName = 'Add the pedigree name.';
        if (!dog.dogsNzRegistration.trim())
          d.dogsNzRegistration = 'Add the Dogs NZ registration.';
        if (!dog.breed) d.breed = 'Choose a breed.';
        if (dog.events.length === 0) d.events = 'Choose at least one title to enter.';

        for (const ev of dog.events) {
          if (!ev.qualifyingShow.trim()) {
            d.eventDetail![ev.eventCode] = 'Name the show where this dog qualified.';
          } else if (!ev.qualifyingDate) {
            d.eventDetail![ev.eventCode] = 'Add the date of the win.';
          } else if (!isQualifyingDateValid(show, ev.qualifyingDate)) {
            // Caught here as well as in the database, so an exhibitor is told
            // before they finish rather than after they submit.
            d.eventDetail![ev.eventCode] = 'That date is outside the qualifying period.';
          }
        }

        if (Object.keys(d.eventDetail!).length === 0) delete d.eventDetail;
        if (Object.keys(d).length > 0) errs[dog.id] = d;
      }
      setDogErrors(errs);
      return Object.keys(errs).length === 0;
    }

    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    const target = STEPS[index + 1];
    if (!target) return;
    setStep(target.key);
    setFurthest((f) => Math.max(f, index + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    const target = STEPS[index - 1];
    if (!target) return;
    setStep(target.key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    if (draft.dogs.length === 0 && !draft.catering.dinnerTickets && !draft.catering.extraCatalogues) {
      setSubmitError('Add a dog, or a dinner ticket or catalogue, before submitting.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Photos upload first. If one fails the entry is not lodged at all, which
      // is better than a half-recorded entry the exhibitor thinks went through.
      const dogs = await Promise.all(
        draft.dogs.map(async (dog) => ({
          pedigreeName: dog.pedigreeName,
          dogsNzRegistration: dog.dogsNzRegistration,
          breed: dog.breed,
          photoUrl: dog.photo ? await uploadDogPhoto(dog.photo) : undefined,
          events: dog.events,
        })),
      );

      setReceipt(await submitEntry(draft.exhibitor, dogs, draft.catering));
      window.scrollTo({ top: 0 });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'The entry could not be lodged.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-16">
        <aside>
          <EntryRail
            show={show}
            draft={draft}
            current={step}
            furthest={furthest}
            onJump={setStep}
          />
        </aside>

        <div>
          {step === 'exhibitor' && (
            <ExhibitorStep
              value={draft.exhibitor}
              errors={exhibitorErrors}
              onChange={(exhibitor) => setDraft((d) => ({ ...d, exhibitor }))}
            />
          )}
          {step === 'dogs' && (
            <DogsStep
              show={show}
              dogs={draft.dogs}
              errors={dogErrors}
              onChange={(dogs) => setDraft((d) => ({ ...d, dogs }))}
            />
          )}
          {step === 'extras' && (
            <ExtrasStep
              show={show}
              value={draft.catering}
              onChange={(catering) => setDraft((d) => ({ ...d, catering }))}
            />
          )}
          {step === 'review' && <ReviewStep show={show} draft={draft} />}

          {submitError && (
            <p className="mt-8 border-l-2 border-show-red bg-wash p-4 text-sm text-show-ink">
              {submitError}
            </p>
          )}

          <div className="mt-12 flex items-center justify-between border-t border-show-rule pt-6">
            {index > 0 ? (
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-2 text-sm text-show-charcoal transition-colors hover:text-show-ink"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-show-charcoal transition-colors hover:text-show-ink"
              >
                <ArrowLeft className="h-4 w-4" />
                Leave
              </Link>
            )}

            {step === 'review' ? (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-show-red px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-show-red-deep disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Lodging your entry' : 'Submit entry'}
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                className="group inline-flex items-center gap-2 bg-show-ink px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-show-red"
              >
                Continue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center text-show-charcoal">
      {children}
    </div>
  );
}
