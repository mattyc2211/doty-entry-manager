import { supabase } from '@/integrations/supabase/client';
import type { Show } from './show';

export interface ExhibitorInput {
  firstName: string;
  surname: string;
  email: string;
  phone: string;
}

export interface EventInput {
  eventCode: string;
  qualifyingShow: string;
  qualifyingDate: string;
}

export interface DogInput {
  pedigreeName: string;
  dogsNzRegistration: string;
  breed: string;
  photoUrl?: string;
  events: EventInput[];
}

export interface CateringInput {
  dinnerTickets: number;
  extraCatalogues: number;
  dietaryRequirements?: string;
}

export interface EntryReceipt {
  reference: string;
  totalAmount: number;
}

/**
 * Prices an entry for display only. The server prices it again inside
 * create_entry() and that result is what gets stored and owed.
 *
 * This deliberately reads the fees off the show rather than using literals.
 * The 2025 build repeated `* 30`, `* 45` and `* 10` in three files, so a fee
 * change in one place left the other two quoting the old total.
 */
export function priceEntry(
  show: Show,
  dogs: DogInput[],
  catering: CateringInput,
): number {
  const feeFor = (code: string) =>
    show.events.find((e) => e.code === code)?.entryFee ?? 0;

  const entryFees = dogs.reduce(
    (sum, dog) => sum + dog.events.reduce((s, e) => s + feeFor(e.eventCode), 0),
    0,
  );

  return (
    entryFees +
    catering.dinnerTickets * show.dinnerTicketFee +
    catering.extraCatalogues * show.extraCatalogueFee
  );
}

export async function uploadDogPhoto(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from('dog-photos')
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error(`Could not upload the photo: ${error.message}`);

  const { data } = supabase.storage.from('dog-photos').getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Submits an entry.
 *
 * One call, one transaction. The 2025 build did this as a chain of client-side
 * inserts (submission, then each dog, then each event), which meant a failure
 * partway through left an orphaned submission behind and showed the exhibitor
 * an error after they had filled in everything.
 *
 * Note what is not sent: the total. The server computes it from the show's own
 * fees. Previously the browser calculated the amount owing and inserted it,
 * so an entry could be recorded as owing nothing.
 */
export async function submitEntry(
  exhibitor: ExhibitorInput,
  dogs: DogInput[],
  catering: CateringInput,
): Promise<EntryReceipt> {
  const { data, error } = await supabase.rpc('create_entry', {
    p_exhibitor: {
      first_name: exhibitor.firstName,
      surname: exhibitor.surname,
      email: exhibitor.email,
      phone: exhibitor.phone,
    },
    p_dogs: dogs.map((dog) => ({
      pedigree_name: dog.pedigreeName,
      dogs_nz_registration: dog.dogsNzRegistration,
      breed: dog.breed,
      photo_url: dog.photoUrl ?? null,
      events: dog.events.map((e) => ({
        event_code: e.eventCode,
        qualifying_show: e.qualifyingShow,
        qualifying_date: e.qualifyingDate,
      })),
    })),
    p_catering: {
      dinner_tickets: catering.dinnerTickets,
      extra_catalogues: catering.extraCatalogues,
      dietary_requirements: catering.dietaryRequirements ?? null,
    },
  });

  if (error) {
    // create_entry raises P0001 for anything the exhibitor can act on: entries
    // closed, a qualifying date outside the period, a missing field. Those
    // messages are written to be read by a person, so pass them through rather
    // than replacing them with something generic.
    throw new Error(error.message);
  }

  const receipt = data as { reference: string; total_amount: number | string };
  return {
    reference: receipt.reference,
    totalAmount: Number(receipt.total_amount),
  };
}
