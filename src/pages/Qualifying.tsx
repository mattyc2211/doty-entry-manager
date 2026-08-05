import { Link } from 'react-router-dom';
import { useShow } from '@/hooks/useShow';
import { formatDate, formatMoney } from '@/lib/format';

/**
 * The page an exhibitor actually arrives to check.
 *
 * The requirement wording is rendered from the database verbatim, because it is
 * the text that decides whether an entry is eligible and a paraphrase of it
 * would be wrong in a way nobody notices until someone is turned away.
 */
export default function Qualifying() {
  const { show, isLoading } = useShow();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <h1 className="display rule-red text-[clamp(2.25rem,6vw,4rem)] text-show-ink">
        What qualifies
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-show-charcoal">
        A dog must have won one of the results below, at a show held inside the
        qualifying period. You will be asked which show, and on what date, for
        each title you enter.
      </p>

      {show && (
        <div className="mt-8 inline-block border-t-2 border-show-red pt-4">
          <p className="label">Qualifying period</p>
          <p className="code mt-1 text-lg text-show-ink">
            {formatDate(show.qualificationStart)} — {formatDate(show.qualificationEnd)}
          </p>
        </div>
      )}

      <dl className="mt-14 max-w-4xl border-t border-show-rule">
        {(show?.events ?? []).map((event) => (
          <div
            key={event.id}
            className="grid gap-x-8 gap-y-2 border-b border-show-rule py-7 sm:grid-cols-[1fr_auto]"
          >
            <dt className="display-md text-xl text-show-ink">{event.title}</dt>
            <dd className="code order-3 text-sm text-show-ink sm:order-2 sm:text-right">
              {formatMoney(event.entryFee)}
            </dd>
            <dd className="order-2 max-w-2xl leading-relaxed text-show-charcoal sm:order-3 sm:col-span-2">
              {event.requirement}
            </dd>
          </div>
        ))}
      </dl>

      {isLoading && <p className="py-8 text-show-charcoal">Loading…</p>}

      <div className="mt-12">
        <Link
          to="/enter"
          className="inline-block bg-show-red px-7 py-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-show-red-deep"
        >
          Start an entry
        </Link>
      </div>
    </div>
  );
}
