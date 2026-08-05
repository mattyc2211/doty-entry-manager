import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShow } from '@/hooks/useShow';
import { formatDate, formatMoney } from '@/lib/format';
import { EntryStatusNotice } from '@/components/show/EntryStatusNotice';
import { ShowMark } from '@/components/show/ShowMark';

/**
 * The visitor here is an exhibitor deciding whether to enter, so the page
 * answers their four questions in order: is this the right show, when is it,
 * am I eligible, how do I enter.
 *
 * There is no slogan and no photography. The date is the display element,
 * because it is the fact an exhibitor came for and the show's own artwork sets
 * it the same way. Without imagery the page holds itself up on type and
 * structure, so the date runs large and nothing else competes with it.
 */
export default function Home() {
  const { show, window: entryWindow, isLoading } = useShow();

  const showDate = show ? new Date(show.showDate) : null;
  const fmt = (opts: Intl.DateTimeFormatOptions, fallback: string) =>
    showDate
      ? new Intl.DateTimeFormat('en-NZ', opts).format(showDate)
      : fallback;

  const day = fmt({ day: 'numeric' }, '28');
  const monthYear = fmt({ month: 'long', year: 'numeric' }, 'November 2026');
  const weekday = fmt({ weekday: 'long' }, 'Saturday');

  return (
    <>
      <section className="border-b border-show-rule">
        <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
          <h1>
            <ShowMark size="xl" />
          </h1>

          <p className="display mt-10 text-[clamp(3rem,11vw,6rem)] text-show-ink">
            {day} {monthYear}
          </p>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="max-w-xl text-lg leading-relaxed text-show-charcoal">
              {weekday}. New Zealand's premier final, open only to dogs that
              qualified
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

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                to="/enter"
                className="group inline-flex items-center gap-2 bg-show-red px-7 py-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-show-red-deep"
              >
                Start an entry
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/qualifying"
                className="border-b border-show-ink pb-0.5 text-sm font-medium text-show-ink transition-colors duration-200 hover:border-show-red hover:text-show-red"
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

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
        <h2 className="display rule-red text-3xl text-show-ink">
          Three titles
        </h2>
        <p className="mt-4 max-w-xl text-show-charcoal">
          A dog may be entered in more than one, provided it qualified for each.
        </p>

        <dl className="mt-10 max-w-4xl border-t border-show-rule">
          {(show?.events ?? []).map((event) => (
            <div
              key={event.id}
              className="grid gap-x-8 gap-y-2 border-b border-show-rule py-7 sm:grid-cols-[1fr_auto]"
            >
              <dt className="display-md text-xl text-show-ink">
                {event.title}
              </dt>
              <dd className="code order-3 text-sm text-show-ink sm:order-2 sm:text-right">
                {formatMoney(event.entryFee)}
              </dd>
              <dd className="order-2 max-w-2xl leading-relaxed text-show-charcoal sm:order-3 sm:col-span-2">
                {event.requirement}
              </dd>
            </div>
          ))}
        </dl>

        {isLoading && (
          <p className="py-8 text-show-charcoal">Loading the show…</p>
        )}
      </section>

      {/* The practical band closes the page on its own ground. Without it the
          titles list and the fees ran together over a long stretch of white
          with nothing to say one had ended and the other begun. */}
      {show && (
        <section className="border-t border-show-rule bg-wash">
          <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16">
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-3">
              <div>
                <dt className="display-md text-base text-show-ink">Dinner</dt>
                <dd className="code mt-2 text-2xl text-show-ink">
                  {formatMoney(show.dinnerTicketFee)}
                </dd>
                <dd className="mt-2 text-sm text-show-charcoal">
                  Per seat at the presentation dinner. Dietary requirements are
                  asked for with your entry.
                </dd>
              </div>
              <div>
                <dt className="display-md text-base text-show-ink">
                  Catalogue
                </dt>
                <dd className="code mt-2 text-2xl text-show-ink">
                  {formatMoney(show.extraCatalogueFee)}
                </dd>
                <dd className="mt-2 text-sm text-show-charcoal">
                  Extra copies, on top of the one included with every entry.
                </dd>
              </div>
              <div>
                <dt className="display-md text-base text-show-ink">Payment</dt>
                <dd className="mt-2 text-2xl text-show-ink">Bank transfer</dd>
                <dd className="mt-2 text-sm text-show-charcoal">
                  You get a reference the moment you submit. Quote it on the
                  transfer, and the entry is confirmed once payment lands.
                </dd>
              </div>
            </dl>
          </div>
        </section>
      )}
    </>
  );
}
