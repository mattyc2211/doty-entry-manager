/**
 * New Zealand conventions throughout: day before month, dollars with cents only
 * when there are cents. Exhibitors read these on a phone at a show, so the
 * formats stay short.
 */

const NZ_DATE = new Intl.DateTimeFormat('en-NZ', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const NZ_DATE_WITH_DAY = new Intl.DateTimeFormat('en-NZ', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const NZ_SHORT = new Intl.DateTimeFormat('en-NZ', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

/** Parses a plain `YYYY-MM-DD` as a local date, not as UTC midnight.
 *  `new Date('2026-11-28')` is UTC, which in New Zealand renders as the 29th. */
function localDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatShowDate(iso: string): string {
  return NZ_DATE_WITH_DAY.format(localDate(iso));
}

export function formatDate(iso: string): string {
  return NZ_DATE.format(localDate(iso));
}

export function formatShortDate(iso: string): string {
  return NZ_SHORT.format(localDate(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-NZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function formatMoney(amount: number): string {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** "3 days", "1 day", "today". Used for the closing countdown. */
export function daysUntil(iso: string): number {
  const target = new Date(iso);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}
