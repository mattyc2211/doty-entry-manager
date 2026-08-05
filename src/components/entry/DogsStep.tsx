import { ChevronDown, Plus, Trash2, ImagePlus } from 'lucide-react';
import { Field, TextInput } from './Field';
import { BreedSelect } from './BreedSelect';
import { newDog, type DraftDog } from './types';
import type { Show } from '@/lib/show';
import { formatDate, formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface DogErrors {
  [dogId: string]: {
    pedigreeName?: string;
    dogsNzRegistration?: string;
    breed?: string;
    events?: string;
    eventDetail?: Record<string, string>;
  };
}

export function DogsStep({
  show,
  dogs,
  errors,
  onChange,
}: {
  show: Show;
  dogs: DraftDog[];
  errors: DogErrors;
  onChange: (dogs: DraftDog[]) => void;
}) {
  const update = (id: string, patch: Partial<DraftDog>) =>
    onChange(dogs.map((d) => (d.id === id ? { ...d, ...patch } : d)));

  return (
    <div>
      <h2 className="display text-3xl text-show-ink">The dogs</h2>
      <p className="mt-4 max-w-lg text-show-charcoal">
        For each dog, tell us the title it is entering and the win that qualified
        it. Qualifying wins must fall between{' '}
        <span className="font-medium text-show-ink">
          {formatDate(show.qualificationStart)}
        </span>{' '}
        and{' '}
        <span className="font-medium text-show-ink">
          {formatDate(show.qualificationEnd)}
        </span>
        .
      </p>

      <div className="mt-10 space-y-6">
        {dogs.map((dog, index) => (
          <DogCard
            key={dog.id}
            show={show}
            dog={dog}
            index={index}
            errors={errors[dog.id] ?? {}}
            onUpdate={(patch) => update(dog.id, patch)}
            onRemove={() => onChange(dogs.filter((d) => d.id !== dog.id))}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...dogs, newDog()])}
        className="mt-6 inline-flex items-center gap-2 border border-show-ink px-5 py-3 text-sm font-medium text-show-ink transition-colors hover:bg-show-ink hover:text-white"
      >
        <Plus className="h-4 w-4" />
        {dogs.length === 0 ? 'Add a dog' : 'Add another dog'}
      </button>

      <p className="mt-6 max-w-lg text-sm text-show-charcoal">
        Only coming to the dinner? Continue without filling this in and choose your
        tickets on the next step.
      </p>
    </div>
  );
}

function DogCard({
  show,
  dog,
  index,
  errors,
  onUpdate,
  onRemove,
}: {
  show: Show;
  dog: DraftDog;
  index: number;
  errors: DogErrors[string];
  onUpdate: (patch: Partial<DraftDog>) => void;
  onRemove: () => void;
}) {
  const toggleEvent = (code: string) => {
    const has = dog.events.some((e) => e.eventCode === code);
    onUpdate({
      events: has
        ? dog.events.filter((e) => e.eventCode !== code)
        : [...dog.events, { eventCode: code, qualifyingShow: '', qualifyingDate: '' }],
    });
  };

  const updateEvent = (code: string, patch: Partial<(typeof dog.events)[number]>) =>
    onUpdate({
      events: dog.events.map((e) => (e.eventCode === code ? { ...e, ...patch } : e)),
    });

  const onPhoto = (file?: File) => {
    if (!file) return;
    if (dog.photoPreview) URL.revokeObjectURL(dog.photoPreview);
    onUpdate({ photo: file, photoPreview: URL.createObjectURL(file) });
  };

  return (
    <article className="border border-show-rule bg-white">
      <header className="flex items-center justify-between border-b border-show-rule bg-wash px-5 py-3">
        <span className="label">Dog {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 text-xs text-show-charcoal transition-colors hover:text-show-red"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </header>

      <div className="grid gap-6 p-5 sm:grid-cols-2">
        <Field
          label="Pedigree name"
          htmlFor={`name-${dog.id}`}
          error={errors.pedigreeName}
          className="sm:col-span-2"
        >
          <TextInput
            id={`name-${dog.id}`}
            value={dog.pedigreeName}
            onChange={(e) => onUpdate({ pedigreeName: e.target.value })}
            invalid={!!errors.pedigreeName}
            placeholder="Ch Silverwood Northern Light"
          />
        </Field>

        <Field
          label="Dogs NZ registration"
          htmlFor={`reg-${dog.id}`}
          error={errors.dogsNzRegistration}
        >
          <TextInput
            id={`reg-${dog.id}`}
            mono
            value={dog.dogsNzRegistration}
            onChange={(e) => onUpdate({ dogsNzRegistration: e.target.value })}
            invalid={!!errors.dogsNzRegistration}
            placeholder="01234-2024"
          />
        </Field>

        <Field label="Breed" htmlFor={`breed-${dog.id}`} error={errors.breed}>
          <BreedSelect
            id={`breed-${dog.id}`}
            value={dog.breed}
            onChange={(breed) => onUpdate({ breed })}
          />
        </Field>

        {/* --- the qualification claim ---------------------------------- */}
        <div className="sm:col-span-2">
          <p className="text-sm font-medium text-show-ink">Entering for</p>
          {errors.events && (
            <p className="mt-1.5 text-xs text-show-red">{errors.events}</p>
          )}

          <div className="mt-3 space-y-3">
            {show.events.map((event) => {
              const entered = dog.events.find((e) => e.eventCode === event.code);
              const detailError = errors.eventDetail?.[event.code];

              return (
                <div
                  key={event.id}
                  className={cn(
                    'border',
                    entered ? 'border-show-ink' : 'border-show-rule',
                  )}
                >
                  <label className="flex cursor-pointer items-start gap-3 p-4">
                    <input
                      type="checkbox"
                      checked={!!entered}
                      onChange={() => toggleEvent(event.code)}
                      className="mt-1 h-4 w-4 accent-[var(--red)]"
                    />
                    <span className="flex-1">
                      <span className="display-md block text-sm text-show-ink">
                        {event.title}
                      </span>
                    </span>
                    <span className="code text-xs text-show-charcoal">
                      {formatMoney(event.entryFee)}
                    </span>
                  </label>

                  <details className="group border-t border-show-rule px-4 py-2.5">
                    <summary className="cursor-pointer list-none text-xs text-show-charcoal transition-colors hover:text-show-ink">
                      What qualifies a dog for this
                      <ChevronDown className="ml-1 inline h-3 w-3 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 max-w-prose text-xs leading-relaxed text-show-charcoal">
                      {event.requirement}
                    </p>
                  </details>

                  {entered && (
                    <div className="animate-rise grid gap-4 border-t border-show-rule bg-wash p-4 sm:grid-cols-2">
                      <Field
                        label="Qualifying show"
                        htmlFor={`qs-${dog.id}-${event.code}`}
                      >
                        <TextInput
                          id={`qs-${dog.id}-${event.code}`}
                          value={entered.qualifyingShow}
                          onChange={(e) =>
                            updateEvent(event.code, { qualifyingShow: e.target.value })
                          }
                          placeholder="Auckland All Breeds"
                          invalid={!!detailError}
                        />
                      </Field>
                      <Field
                        label="Date of win"
                        htmlFor={`qd-${dog.id}-${event.code}`}
                        error={detailError}
                      >
                        <TextInput
                          id={`qd-${dog.id}-${event.code}`}
                          type="date"
                          mono
                          min={show.qualificationStart}
                          max={show.qualificationEnd}
                          value={entered.qualifyingDate}
                          onChange={(e) =>
                            updateEvent(event.code, { qualifyingDate: e.target.value })
                          }
                          invalid={!!detailError}
                        />
                      </Field>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- photo ------------------------------------------------------ */}
        <Field
          label="Photo"
          hint="Optional. Used in the catalogue and on the night, so a clear standing shot of the whole dog works best."
          className="sm:col-span-2"
        >
          <div className="flex items-center gap-4">
            {dog.photoPreview ? (
              <img
                src={dog.photoPreview}
                alt=""
                className="h-20 w-20 border border-show-rule object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center border border-dashed border-show-rule text-show-charcoal">
                <ImagePlus className="h-5 w-5" />
              </div>
            )}
            <label className="cursor-pointer border border-show-rule px-4 py-2.5 text-sm text-show-ink transition-colors hover:bg-wash">
              {dog.photo ? 'Change photo' : 'Choose photo'}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onPhoto(e.target.files?.[0])}
              />
            </label>
          </div>
        </Field>
      </div>
    </article>
  );
}
