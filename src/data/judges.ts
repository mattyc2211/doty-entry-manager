/**
 * The 2026 judging panel, from the show's own announcement.
 *
 * Judges are per-show data and by the principle the rest of this rebuild
 * follows they would live in the database. They are here instead because a
 * judges table would need its own admin screens to be worth anything, and the
 * panel changes once a year in one file. If that ever becomes annoying, the
 * table is a small addition and the shape below is already the row.
 */
export interface Judge {
  name: string;
  country: string;
  /** Optional: which title this judge presides over, when announced. */
  judging?: string;
}

export const JUDGES_2026: Judge[] = [
  { name: 'Preetham Thukaram', country: 'India' },
  { name: 'Kim Tosi', country: 'Australia' },
  { name: 'John Bryson', country: 'Australia' },
];
