import { cn } from '@/lib/utils';

/**
 * The ring card.
 *
 * Every exhibitor knows this object: the numbered card you pin on at a show.
 * Here it carries the entry reference, which is also the reference the bank
 * transfer must quote. That is the whole point of the device. The one thing an
 * exhibitor must copy down is the one thing rendered as something worth
 * copying down, rather than as a line of grey text in a paragraph.
 *
 * The 2025 build showed a reference like NZ481203, derived from the clock and
 * capable of colliding. This one is sequential per show.
 */
export function RingCard({
  reference,
  showName,
  year,
  className,
  animate = false,
}: {
  reference: string;
  showName: string;
  year: number;
  className?: string;
  animate?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative inline-block bg-white border border-show-rule px-8 pb-7 pt-0 text-center shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_40px_-24px_rgba(0,0,0,0.35)]',
        animate && 'animate-stamp',
        className,
      )}
    >
      {/* The heavy red bar, as it runs along the foot of the show's artwork. */}
      <div className="h-[6px] -mx-8 bg-show-red" />

      <p className="eyebrow mt-6">Entry reference</p>

      <p className="code mt-3 text-[2.75rem] leading-none font-semibold text-show-ink sm:text-[3.25rem]">
        {reference}
      </p>

      <div className="mt-6 border-t border-show-rule pt-4">
        <p className="display-md text-[0.8125rem] text-show-charcoal">{showName}</p>
        <p className="code mt-1 text-xs text-show-charcoal">{year}</p>
      </div>
    </div>
  );
}
