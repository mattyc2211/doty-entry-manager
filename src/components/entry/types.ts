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

export const newDog = (): DraftDog => ({
  id: crypto.randomUUID(),
  pedigreeName: '',
  dogsNzRegistration: '',
  breed: '',
  events: [],
});

export const emptyDraft = (): EntryDraft => ({
  exhibitor: { firstName: '', surname: '', email: '', phone: '' },
  // Step two opens with a card already there rather than an empty state and an
  // "Add a dog" button. Nearly every entry has at least one dog, so the button
  // was a click and a decision that bought nothing.
  dogs: [newDog()],
  catering: { dinnerTickets: 0, extraCatalogues: 0, dietaryRequirements: '' },
});

/** A card the exhibitor has not touched. Treated as absent rather than as an
 *  error, so someone here only for the dinner can walk past step two without
 *  having to delete a row first. */
export const isBlankDog = (dog: DraftDog): boolean =>
  !dog.pedigreeName.trim() &&
  !dog.dogsNzRegistration.trim() &&
  !dog.breed &&
  !dog.photo &&
  dog.events.length === 0;

export const STEPS = [
  { key: 'exhibitor', label: 'Exhibitor' },
  { key: 'dogs', label: 'Dogs' },
  { key: 'extras', label: 'Dinner & catalogues' },
  { key: 'review', label: 'Review' },
] as const;

export type StepKey = (typeof STEPS)[number]['key'];
