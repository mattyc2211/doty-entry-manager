/**
 * The 2025 winners, as a record rather than a gallery.
 *
 * The photographs were removed on 5 Aug 2026: they were watermarked by Supa
 * Shots and Penny Brooks Photography, and licensing them was not worth the
 * trouble. The results themselves are the show's own published record and need
 * nobody's permission, so they stay.
 *
 * Names are verbatim, including the (AI) suffix and the full champion
 * prefixes. In a catalogue the titles are the record, and tidying
 * "SPR & GR NEUT CH & CH" into something neater is getting it wrong.
 *
 * Breed is deliberately absent: a wrong breed on a Dogs NZ page is the error
 * exhibitors notice first, so it stays out until the organisers confirm it.
 */
export interface Winner {
  year: number;
  title: string;
  pedigreeName: string;
  credits: string[];
}

export const WINNERS_2025: Winner[] = [
  {
    year: 2025,
    title: 'Show Dog of the Year',
    pedigreeName: 'NZ SPR CH Lanascol Was This The Answer (AI)',
    credits: ['Bred and owned by Carolyn Cederman'],
  },
  {
    year: 2025,
    title: 'Puppy of the Year',
    pedigreeName: 'CH Lyntree Star Chaser',
    credits: [
      'Bred by Penny Brooks & Murray Brooks',
      'Owned by P & M Brooks and Paige Judson',
    ],
  },
  {
    year: 2025,
    title: 'Neuter of the Year',
    pedigreeName: 'SPR & GR NEUT CH & CH Wybourne Choc Ginger Royal',
    credits: ['Bred and owned by Kelly Clement'],
  },
];
