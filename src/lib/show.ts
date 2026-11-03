import { supabase } from '@/integrations/supabase/client';

/**
 * The show, loaded from the database rather than compiled into the app.
 *
 * In the 2025 build the year, entry window, qualifying period, all three fees
 * and the bank account were constants spread across five source files, so
 * running the next show meant a code change and a redeploy. The commit log for
 * 2025 is mostly exactly that: "Update registration deadline date", "Update
 * bank account name".
 */
export interface ShowEvent {
  id: string;
  code: string;
  title: string;
  requirement: string;
  entryFee: number;
  sortOrder: number;
}

export interface Show {
  id: string;
  year: number;
  name: string;
  showDate: string;
  venue: string | null;
  entriesOpenAt: string;
  entriesCloseAt: string;
  qualificationStart: string;
  qualificationEnd: string;
  dinnerTicketFee: number;
  extraCatalogueFee: number;
  bankAccountName: string;
  bankAccountNumber: string;
  nominationsOpen: boolean;
  dinnerBookingsOpen: boolean;
  events: ShowEvent[];
}

export type EntryWindow = 'not-yet-open' | 'open' | 'closed';

/**
 * Derived from the dates, never stored as a flag.
 *
 * The 2025 build had `ENTRY_STATUS.isOpen` hardcoded to `true` with a
 * `closeDate` that nothing read, so the form kept accepting entries and
 * quoting bank transfer details for months after the show had closed.
 */
export function entryWindow(show: Show, now: Date = new Date()): EntryWindow {
  if (now < new Date(show.entriesOpenAt)) return 'not-yet-open';
  if (now > new Date(show.entriesCloseAt)) return 'closed';
  return 'open';
}

export function isQualifyingDateValid(show: Show, date: string): boolean {
  return date >= show.qualificationStart && date <= show.qualificationEnd;
}

export async function fetchActiveShow(): Promise<Show> {
  const { data, error } = await supabase
    .from('shows')
    .select(
      `id, year, name, show_date, venue,
       entries_open_at, entries_close_at,
       qualification_start, qualification_end,
       dinner_ticket_fee, extra_catalogue_fee,
       bank_account_name, bank_account_number, nominations_open, dinner_bookings_open,
       show_events ( id, code, title, requirement, entry_fee, sort_order )`,
    )
    .eq('is_active', true)
    .single();

  if (error) throw new Error(`Could not load the show: ${error.message}`);

  return {
    id: data.id,
    year: data.year,
    name: data.name,
    showDate: data.show_date,
    venue: data.venue,
    entriesOpenAt: data.entries_open_at,
    entriesCloseAt: data.entries_close_at,
    qualificationStart: data.qualification_start,
    qualificationEnd: data.qualification_end,
    dinnerTicketFee: Number(data.dinner_ticket_fee),
    extraCatalogueFee: Number(data.extra_catalogue_fee),
    bankAccountName: data.bank_account_name,
    bankAccountNumber: data.bank_account_number,
    nominationsOpen: data.nominations_open,
    dinnerBookingsOpen: data.dinner_bookings_open,
    events: (data.show_events ?? [])
      .map((e) => ({
        id: e.id,
        code: e.code,
        title: e.title,
        requirement: e.requirement,
        entryFee: Number(e.entry_fee),
        sortOrder: e.sort_order,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

/**
 * Where the site's main call to action should send people. While entries are
 * open that is the entry form; once they close and dinner bookings are open it
 * is the booking page; otherwise there is nothing to sign up for.
 */
export function primaryAction(
  show: Show | undefined,
  window: EntryWindow | undefined,
): { to: string; label: string; short: string } | null {
  if (!show || !window) return null;
  if (window === 'open') return { to: '/enter', label: 'Start an entry', short: 'Enter' };
  if (window === 'closed' && show.dinnerBookingsOpen)
    return { to: '/dinner', label: 'Book the dinner', short: 'Book dinner' };
  return null;
}
