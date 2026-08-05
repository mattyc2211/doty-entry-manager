import { supabase } from '@/integrations/supabase/client';

export type PaymentStatus = 'unpaid' | 'paid' | 'waived';

export interface AdminEventEntry {
  title: string;
  qualifyingShow: string;
  qualifyingDate: string;
  feeCharged: number;
}

export interface AdminDog {
  id: string;
  pedigreeName: string;
  dogsNzRegistration: string;
  breed: string;
  photoUrl: string | null;
  events: AdminEventEntry[];
}

export interface AdminEntry {
  id: string;
  reference: string;
  createdAt: string;
  exhibitorName: string;
  exhibitorEmail: string;
  exhibitorPhone: string;
  dinnerTickets: number;
  extraCatalogues: number;
  dietaryRequirements: string | null;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
  paymentNote: string | null;
  dogs: AdminDog[];
}

export async function fetchEntries(): Promise<AdminEntry[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select(
      `id, reference, created_at,
       exhibitor_first_name, exhibitor_surname, exhibitor_email, exhibitor_phone,
       dinner_tickets, extra_catalogues, dietary_requirements,
       total_amount, payment_status, paid_at, payment_note,
       dog_entries (
         id, pedigree_name, dogs_nz_registration, breed, photo_url,
         event_entries (
           qualifying_show, qualifying_date, fee_charged,
           show_events ( title, sort_order )
         )
       )`,
    )
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    reference: row.reference,
    createdAt: row.created_at,
    exhibitorName: `${row.exhibitor_first_name} ${row.exhibitor_surname}`,
    exhibitorEmail: row.exhibitor_email,
    exhibitorPhone: row.exhibitor_phone,
    dinnerTickets: row.dinner_tickets,
    extraCatalogues: row.extra_catalogues,
    dietaryRequirements: row.dietary_requirements,
    totalAmount: Number(row.total_amount),
    paymentStatus: row.payment_status as PaymentStatus,
    paidAt: row.paid_at,
    paymentNote: row.payment_note,
    dogs: (row.dog_entries ?? []).map((dog) => ({
      id: dog.id,
      pedigreeName: dog.pedigree_name,
      dogsNzRegistration: dog.dogs_nz_registration,
      breed: dog.breed,
      photoUrl: dog.photo_url,
      events: (dog.event_entries ?? [])
        .map((e) => ({
          title: e.show_events?.title ?? '',
          sortOrder: e.show_events?.sort_order ?? 0,
          qualifyingShow: e.qualifying_show,
          qualifyingDate: e.qualifying_date,
          feeCharged: Number(e.fee_charged),
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    })),
  }));
}

export async function setPaymentStatus(
  id: string,
  status: PaymentStatus,
): Promise<void> {
  const { error } = await supabase
    .from('submissions')
    .update({
      payment_status: status,
      // paid_at is cleared when an entry goes back to unpaid, so the two can
      // never disagree about whether money arrived.
      paid_at: status === 'unpaid' ? null : new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

/** Totals for the dashboard. Derived here rather than in the database because
 *  the admin already holds every row it needs. */
export function summarise(entries: AdminEntry[]) {
  const paid = entries.filter((e) => e.paymentStatus === 'paid');
  const unpaid = entries.filter((e) => e.paymentStatus === 'unpaid');

  return {
    entryCount: entries.length,
    dogCount: entries.reduce((n, e) => n + e.dogs.length, 0),
    eventCount: entries.reduce(
      (n, e) => n + e.dogs.reduce((m, d) => m + d.events.length, 0),
      0,
    ),
    dinnerTickets: entries.reduce((n, e) => n + e.dinnerTickets, 0),
    received: paid.reduce((n, e) => n + e.totalAmount, 0),
    outstanding: unpaid.reduce((n, e) => n + e.totalAmount, 0),
    unpaidCount: unpaid.length,
  };
}
