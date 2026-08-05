import { AlertCircle, Clock } from 'lucide-react';
import type { Show, EntryWindow } from '@/lib/show';
import { formatDate } from '@/lib/format';

/**
 * Says plainly when entries are not open, and when they will be.
 *
 * The 2025 build could not do this. `isOpen` was hardcoded `true`, so the form
 * went on accepting entries and quoting bank details for a show that had closed
 * months earlier. Here the state is derived from the show's dates, and the same
 * dates are what the server enforces, so the page and the database cannot
 * disagree about whether you are allowed to enter.
 */
export function EntryStatusNotice({
  show,
  window,
}: {
  show: Show;
  window: EntryWindow;
}) {
  if (window === 'open') return null;

  const notYetOpen = window === 'not-yet-open';
  const Icon = notYetOpen ? Clock : AlertCircle;

  return (
    <div className="flex items-start gap-4 border border-show-rule bg-wash p-6">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-show-red" />
      <div>
        <p className="display-md text-base text-show-ink">
          {notYetOpen ? 'Entries are not open yet' : 'Entries have closed'}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-show-charcoal">
          {notYetOpen ? (
            <>
              Entries for {show.name} open on{' '}
              <span className="font-medium text-show-ink">
                {formatDate(show.entriesOpenAt.slice(0, 10))}
              </span>
              .
            </>
          ) : (
            <>
              Entries closed on{' '}
              <span className="font-medium text-show-ink">
                {formatDate(show.entriesCloseAt.slice(0, 10))}
              </span>
              . Contact the organisers if you believe this is wrong.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
