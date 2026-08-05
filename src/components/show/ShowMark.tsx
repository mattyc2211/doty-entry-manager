import logo from '@/assets/premier-showdog-logo.png';
import { cn } from '@/lib/utils';

/**
 * The show's real logo: the dog-head arch, the Royal Canin lockup, PREMIER set
 * heavy, and "Show Dog of the Year" in script.
 *
 * Two bitmaps that shipped in the 2025 repo were AI-generated and unusable:
 * `nz-premier-logo.png` read "SHOW DOG SHOW TIE YEAS 202:5" and
 * `photo-guidance.png` read "Dog Phottochirts". Both are deleted. This is the
 * genuine artwork.
 *
 * At `sm` the script line stops being legible, so that size falls back to a
 * typographic lockup rather than showing a mark nobody can read.
 */
export function ShowMark({
  className,
  size = 'md',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  if (size === 'sm') {
    return (
      <span className={cn('flex items-stretch gap-2.5', className)}>
        <span aria-hidden className="w-1 shrink-0 bg-show-red" />
        <span className="display-md text-[0.6875rem] leading-tight">
          <span className="block text-show-ink">NZ Premier</span>
          <span className="block text-show-charcoal">Show Dog of the Year</span>
        </span>
      </span>
    );
  }

  const height = { md: 'h-11', lg: 'h-20', xl: 'h-32 sm:h-44' }[size];

  return (
    <img
      src={logo}
      alt="Royal Canin New Zealand Premier Show Dog of the Year"
      className={cn('w-auto', height, className)}
    />
  );
}
