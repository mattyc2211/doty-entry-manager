import type { ExhibitorInput, CateringInput } from '@/lib/entries';

/** A dog while it is still being filled in. `id` is local only, for React keys
 *  and for removing the right row; the database allocates the real ids. */
export interface DraftEvent {
  eventCode: string;
  qualifyingShow: string;
  qualifyingDate: string;
}

export interface DraftDog {
  id: string;
  pedigreeName: string;
  dogsNzRegistration: string;
  breed: string;
  photo?: File;
  photoPreview?: string;
  events: DraftEvent[];
}

export interface EntryDraft {
  exhibitor: ExhibitorInput;
  dogs: DraftDog[];
  catering: CateringInput;
}

export const emptyDraft = (): EntryDraft => ({
  exhibitor: { firstName: '', surname: '', email: '', phone: '' },
  dogs: [],
  catering: { dinnerTickets: 0, extraCatalogues: 0, dietaryRequirements: '' },
});

export const newDog = (): DraftDog => ({
  id: crypto.randomUUID(),
  pedigreeName: '',
  dogsNzRegistration: '',
  breed: '',
  events: [],
});

export const STEPS = [
  { key: 'exhibitor', label: 'Exhibitor' },
  { key: 'dogs', label: 'Dogs' },
  { key: 'extras', label: 'Dinner & catalogues' },
  { key: 'review', label: 'Review' },
] as const;

export type StepKey = (typeof STEPS)[number]['key'];
