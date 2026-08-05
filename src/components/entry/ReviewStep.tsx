import type { EntryDraft } from './types';
import type { Show } from '@/lib/show';
import { priceEntry } from '@/lib/entries';
import { formatMoney, formatShortDate } from '@/lib/format';

/**
 * The entry, set as a show catalogue sets one: pedigree name in caps, breed and
 * registration beneath, then the titles claimed and the win behind each. An
 * exhibitor recognises this shape, which makes it quick to check.
 */
export function ReviewStep({ show, draft }: { show: Show; draft: EntryDraft }) {
  const total = priceEntry(show, draft.dogs, draft.catering);
  const eventFor = (code: string) => show.events.find((e) => e.code === code);

  return (
    <div>
      <p className="eyebrow">Step four</p>
      <h2 className="display mt-3 text-3xl text-show-ink">Check and submit</h2>
      <p className="mt-4 max-w-lg text-show-charcoal">
        Nothing is lodged until you submit, and nothing is confirmed until payment
        reaches the organisers.
      </p>

      <section className="mt-10">
        <p className="eyebrow">Exhibitor</p>
        <p className="mt-2 text-show-ink">
          {draft.exhibitor.firstName} {draft.exhibitor.surname}
        </p>
        <p className="text-sm text-show-charcoal">{draft.exhibitor.email}</p>
        <p className="code text-sm text-show-charcoal">{draft.exhibitor.phone}</p>
      </section>

      {draft.dogs.length > 0 && (
        <section className="mt-10">
          <p className="eyebrow">Entries</p>
          <ol className="mt-4 border-t border-show-rule">
            {draft.dogs.map((dog) => (
              <li key={dog.id} className="border-b border-show-rule py-5">
                <div className="flex items-start gap-4">
                  {dog.photoPreview && (
                    <img
                      src={dog.photoPreview}
                      alt=""
                      className="h-14 w-14 shrink-0 border border-show-rule object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="pedigree text-sm text-show-ink">{dog.pedigreeName}</p>
                    <p className="mt-1 text-sm text-show-charcoal">
                      {dog.breed}
                      <span className="code"> · {dog.dogsNzRegistration}</span>
                    </p>

                    <ul className="mt-3 space-y-1.5">
                      {dog.events.map((e) => {
                        const event = eventFor(e.eventCode);
                        return (
                          <li
                            key={e.eventCode}
                            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm"
                          >
                            <span className="text-show-ink">
                              {event?.title}
                              <span className="text-show-charcoal">
                                {' '}
                                — qualified at {e.qualifyingShow},{' '}
                                <span className="code">
                                  {e.qualifyingDate
                                    ? formatShortDate(e.qualifyingDate)
                                    : ''}
                                </span>
                              </span>
                            </span>
                            <span className="code text-show-ink">
                              {formatMoney(event?.entryFee ?? 0)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {(draft.catering.dinnerTickets > 0 || draft.catering.extraCatalogues > 0) && (
        <section className="mt-10">
          <p className="eyebrow">Dinner & catalogues</p>
          <ul className="mt-4 border-t border-show-rule">
            {draft.catering.dinnerTickets > 0 && (
              <li className="flex items-baseline justify-between border-b border-show-rule py-3 text-sm">
                <span className="text-show-ink">
                  Dinner tickets{' '}
                  <span className="code text-show-charcoal">
                    × {draft.catering.dinnerTickets}
                  </span>
                </span>
                <span className="code text-show-ink">
                  {formatMoney(draft.catering.dinnerTickets * show.dinnerTicketFee)}
                </span>
              </li>
            )}
            {draft.catering.extraCatalogues > 0 && (
              <li className="flex items-baseline justify-between border-b border-show-rule py-3 text-sm">
                <span className="text-show-ink">
                  Extra catalogues{' '}
                  <span className="code text-show-charcoal">
                    × {draft.catering.extraCatalogues}
                  </span>
                </span>
                <span className="code text-show-ink">
                  {formatMoney(
                    draft.catering.extraCatalogues * show.extraCatalogueFee,
                  )}
                </span>
              </li>
            )}
          </ul>
          {draft.catering.dietaryRequirements && (
            <p className="mt-3 text-sm text-show-charcoal">
              Dietary requirements: {draft.catering.dietaryRequirements}
            </p>
          )}
        </section>
      )}

      <div className="mt-10 flex items-baseline justify-between border-t-2 border-show-ink pt-5">
        <span className="display-md text-lg text-show-ink">Total</span>
        <span className="code text-2xl font-semibold text-show-ink">
          {formatMoney(total)}
        </span>
      </div>

      <div className="mt-10 border border-show-rule bg-wash p-6">
        <p className="eyebrow">Paying</p>
        <p className="mt-3 text-sm leading-relaxed text-show-charcoal">
          Once you submit, you will get an entry reference. Transfer{' '}
          <span className="font-medium text-show-ink">{formatMoney(total)}</span> to
          the account below and quote that reference, so the organisers can match
          your payment to this entry.
        </p>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 text-show-charcoal">Account name</dt>
            <dd className="text-show-ink">{show.bankAccountName}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 text-show-charcoal">Account number</dt>
            <dd className="code text-show-ink">{show.bankAccountNumber}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
