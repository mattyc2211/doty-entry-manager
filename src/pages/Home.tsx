import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShow } from '@/hooks/useShow';
import { formatShowDate, formatDate, formatMoney } from '@/lib/format';
import { EntryStatusNotice } from '@/components/show/EntryStatusNotice';
import { ShowMark } from '@/components/show/ShowMark';

/**
 * The thesis of this show, and so of this page: you cannot buy your way in.
 * Every dog here won Best in Show somewhere, inside a fixed window. The hero
 * leads with that, because it is the most characteristic fact about the event
 * and it is the thing an exhibitor is actually checking when they arrive.
 */
export default function Home() {
  const { show, window: entryWindow, isLoading } = useShow();

  return (
    <>
      <section className="border-b border-show-rule">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16">
            <div>
              <p className="eyebrow">
                {show ? formatShowDate(show.showDate) : 'Saturday 28 November 2026'}
              </p>

              <h1 className="display mt-6 text-[clamp(2.5rem,7vw,5rem)] text-show-ink">
                You don't enter
                <br />
                this show.
                <br />
                <span className="text-show-red">You qualify for it.</span>
              </h1>
            </div>

            {/* The show's own artwork, given room. It is the identity people
                recognise from the schedule and the catalogue. */}
            <ShowMark size="xl" className="lg:mt-2" />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="max-w-xl text-lg leading-relaxed text-show-charcoal">
              New Zealand's premier final brings together the dogs that took Best in
              Show across the season. Entry is open only to dogs that qualified
              {show ? (
                <>
                  {' '}
                  between{' '}
                  <span className="whitespace-nowrap font-medium text-show-ink">
                    {formatDate(show.qualificationStart)}
                  </span>{' '}
                  and{' '}
                  <span className="whitespace-nowrap font-medium text-show-ink">
                    {formatDate(show.qualificationEnd)}
                  </span>
                </>
              ) : (
                ' within the qualifying period'
              )}
              .
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/enter"
                className="group inline-flex items-center gap-2 bg-show-red px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-show-red-deep"
              >
                Start an entry
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/qualifying"
                className="border-b border-show-ink pb-0.5 text-sm font-medium text-show-ink hover:border-show-red hover:text-show-red"
              >
                Check what qualifies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {!isLoading && show && entryWindow && entryWindow !== 'open' && (
        <div className="mx-auto max-w-6xl px-5 pt-10 lg:px-8">
          <EntryStatusNotice show={show} window={entryWindow} />
        </div>
      )}

      {/* The numbering here is real: it is the order the titles are judged and
          listed in, not decoration bolted onto a list. */}
      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
        <h2 className="display rule-red text-3xl text-show-ink">Three titles</h2>
        <p className="mt-4 max-w-xl text-show-charcoal">
          A dog may be entered in more than one, provided it qualified for each.
        </p>

        <ol className="mt-12 border-t border-show-rule">
          {(show?.events ?? []).map((event, i) => (
            <li
              key={event.id}
              className="grid gap-4 border-b border-show-rule py-8 sm:grid-cols-[3rem_1fr_auto] sm:gap-8"
            >
              <span className="code text-sm text-show-charcoal">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="display-md text-xl text-show-ink">{event.title}</h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-show-charcoal">
                  {event.requirement}
                </p>
              </div>
              <span className="code self-start text-sm text-show-ink sm:text-right">
                {formatMoney(event.entryFee)}
                <span className="block text-xs text-show-charcoal">per entry</span>
              </span>
            </li>
          ))}
        </ol>

        {isLoading && <p className="py-8 text-sm text-show-charcoal">Loading the show…</p>}
      </section>

      {show && (
        <section className="border-y border-show-rule bg-wash">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-3 lg:px-8">
            <div>
              <p className="eyebrow">Dinner</p>
              <p className="code mt-3 text-2xl text-show-ink">
                {formatMoney(show.dinnerTicketFee)}
              </p>
              <p className="mt-2 text-sm text-show-charcoal">
                Per seat at the presentation dinner. Dietary requirements are asked
                for with your entry.
              </p>
            </div>
            <div>
              <p className="eyebrow">Catalogue</p>
              <p className="code mt-3 text-2xl text-show-ink">
                {formatMoney(show.extraCatalogueFee)}
              </p>
              <p className="mt-2 text-sm text-show-charcoal">
                Extra copies, on top of the one included with every entry.
              </p>
            </div>
            <div>
              <p className="eyebrow">Payment</p>
              <p className="display-md mt-3 text-xl text-show-ink">Bank transfer</p>
              <p className="mt-2 text-sm text-show-charcoal">
                You get a reference the moment you submit. Quote it on the transfer,
                and the entry is confirmed once payment lands.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
