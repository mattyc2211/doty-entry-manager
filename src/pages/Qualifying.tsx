import { Link } from 'react-router-dom';
import { useShow } from '@/hooks/useShow';
import { formatDate, formatMoney } from '@/lib/format';

/**
 * The rules page, and the one an exhibitor actually arrives to check. The
 * requirement wording is rendered from the database verbatim, because it is the
 * text that decides whether an entry is eligible and a paraphrase of it would
 * be wrong in a way nobody notices until someone is turned away.
 */
export default function Qualifying() {
  const { show, isLoading } = useShow();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="eyebrow">Eligibility</p>
      <h1 className="display rule-red mt-4 text-[clamp(2.25rem,6vw,4rem)] text-show-ink">
        What qualifies
      </h1>

      {show && (
        <div className="mt-8 inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 border border-show-rule bg-wash px-5 py-4">
          <span className="eyebrow">Qualifying period</span>
          <span className="code text-show-ink">
            {formatDate(show.qualificationStart)} — {formatDate(show.qualificationEnd)}
          </span>
        </div>
      )}

      <p className="mt-8 max-w-xl text-lg leading-relaxed text-show-charcoal">
        A dog must have won one of the results below, at a show held inside the
        qualifying period. You will be asked which show, and on what date, for
        each title you enter.
      </p>

      <ol className="mt-14 border-t border-show-rule">
        {(show?.events ?? []).map((event, i) => (
          <li
            key={event.id}
            className="grid gap-4 border-b border-show-rule py-8 sm:grid-cols-[3rem_1fr] sm:gap-8"
          >
            <span className="code text-sm text-show-charcoal">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="display-md text-xl text-show-ink">{event.title}</h2>
                <span className="code text-sm text-show-ink">
                  {formatMoney(event.entryFee)}
                </span>
              </div>
              <p className="mt-3 max-w-2xl leading-relaxed text-show-charcoal">
                {event.requirement}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {isLoading && <p className="py-8 text-sm text-show-charcoal">Loading…</p>}

      <div className="mt-12">
        <Link
          to="/enter"
          className="inline-block bg-show-red px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-show-red-deep"
        >
          Start an entry
        </Link>
      </div>
    </div>
  );
}
