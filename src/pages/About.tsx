import { Link } from 'react-router-dom';
import { useShow } from '@/hooks/useShow';
import { formatShowDate, formatDate, formatMoney } from '@/lib/format';

export default function About() {
  const { show } = useShow();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
      <h1 className="display rule-red text-[clamp(2.25rem,6vw,4rem)] text-show-ink">
        One night,
        <br />
        three titles
      </h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <div className="max-w-xl space-y-5 text-lg leading-relaxed text-show-charcoal">
          <p>
            The Premier Show Dog of the Year is the end of the New Zealand show
            season. Across the year, dogs win Best in Show at championship shows
            around the country. Those wins are what earn a place here.
          </p>
          <p>
            The evening runs three titles, judged by an international panel, and
            finishes with the presentation dinner. Every entry includes a
            catalogue; seats at the dinner are booked with your entry.
          </p>
          <p>
            Entries are lodged online and paid by bank transfer. You get a
            reference as soon as you submit, and the organisers confirm your entry
            once the payment lands.
          </p>
        </div>

        {show && (
          <aside className="h-fit border border-show-rule">
            <div className="h-[6px] bg-show-red" />
            <dl className="space-y-4 p-6 text-sm">
              <Detail label="Date" value={formatShowDate(show.showDate)} />
              {show.venue && <Detail label="Venue" value={show.venue} />}
              <Detail
                label="Qualifying"
                value={`${formatDate(show.qualificationStart)} to ${formatDate(show.qualificationEnd)}`}
              />
              <Detail
                label="Entry"
                value={`${formatMoney(show.events[0]?.entryFee ?? 0)} per title`}
              />
              <Detail label="Dinner" value={`${formatMoney(show.dinnerTicketFee)} per seat`} />
            </dl>
            <div className="border-t border-show-rule p-6">
              <Link
                to="/enter"
                className="block bg-show-red px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-show-red-deep"
              >
                Start an entry
              </Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="mt-1 text-show-ink">{value}</dd>
    </div>
  );
}
