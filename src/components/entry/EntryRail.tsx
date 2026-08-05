import { Check } from 'lucide-react';
import { STEPS, type StepKey, type EntryDraft } from './types';
import type { Show } from '@/lib/show';
import { formatMoney } from '@/lib/format';
import { priceEntry } from '@/lib/entries';
import { cn } from '@/lib/utils';

/**
 * The rail does two jobs a progress bar cannot.
 *
 * It shows where you are, and it shows the claim you are building: each dog and
 * the titles it is being entered for, with the money adding up underneath. The
 * 2025 build had a percentage bar and a total that only appeared at the end, so
 * you could not see what you were committing to until you got there.
 */
export function EntryRail({
  show,
  draft,
  current,
  furthest,
  onJump,
}: {
  show: Show;
  draft: EntryDraft;
  current: StepKey;
  furthest: number;
  onJump: (step: StepKey) => void;
}) {
  const total = priceEntry(show, draft.dogs, draft.catering);
  const currentIndex = STEPS.findIndex((s) => s.key === current);
  const titleFor = (code: string) =>
    show.events.find((e) => e.code === code)?.title ?? code;

  return (
    <div className="lg:sticky lg:top-24">
      <ol className="border-t border-show-rule">
        {STEPS.map((step, i) => {
          const done = i < furthest;
          const active = step.key === current;
          const reachable = i <= furthest;

          return (
            <li key={step.key} className="border-b border-show-rule">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump(step.key)}
                className={cn(
                  'flex w-full items-center gap-3 py-3.5 text-left text-sm transition-colors',
                  active ? 'text-show-ink' : 'text-show-charcoal',
                  reachable ? 'hover:text-show-ink' : 'cursor-default opacity-45',
                )}
              >
                <span
                  className={cn(
                    'code flex h-5 w-5 shrink-0 items-center justify-center text-[0.625rem]',
                    active && 'bg-show-red text-white',
                    done && !active && 'bg-show-ink text-white',
                    !done && !active && 'border border-show-rule',
                  )}
                >
                  {done && !active ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    String(i + 1).padStart(2, '0')
                  )}
                </span>
                <span className={cn(active && 'font-medium')}>{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* The claim so far. Only appears once there is something to show, so an
          empty box never sits there looking broken. */}
      {(draft.dogs.length > 0 || total > 0) && (
        <div className="mt-8">
          <p className="eyebrow">This entry</p>

          <ul className="mt-4 space-y-4">
            {draft.dogs.map((dog) => (
              <li key={dog.id} className="border-l-2 border-show-rule pl-3">
                <p className="pedigree text-xs leading-snug text-show-ink">
                  {dog.pedigreeName || 'Unnamed dog'}
                </p>
                {dog.breed && (
                  <p className="mt-0.5 text-xs text-show-charcoal">{dog.breed}</p>
                )}
                {dog.events.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {dog.events.map((e, i) => (
                      <li key={i} className="text-xs text-show-charcoal">
                        {titleFor(e.eventCode)}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            {draft.catering.dinnerTickets > 0 && (
              <li className="border-l-2 border-show-rule pl-3 text-xs text-show-charcoal">
                {draft.catering.dinnerTickets} dinner{' '}
                {draft.catering.dinnerTickets === 1 ? 'ticket' : 'tickets'}
              </li>
            )}
            {draft.catering.extraCatalogues > 0 && (
              <li className="border-l-2 border-show-rule pl-3 text-xs text-show-charcoal">
                {draft.catering.extraCatalogues} extra{' '}
                {draft.catering.extraCatalogues === 1 ? 'catalogue' : 'catalogues'}
              </li>
            )}
          </ul>

          <div className="mt-5 flex items-baseline justify-between border-t border-show-rule pt-4">
            <span className="text-sm text-show-charcoal">Total</span>
            <span className="code text-lg font-semibold text-show-ink">
              {formatMoney(total)}
            </span>
          </div>
          {currentIndex < STEPS.length - 1 && (
            <p className="mt-2 text-xs text-show-charcoal">Confirmed when you submit.</p>
          )}
        </div>
      )}
    </div>
  );
}
