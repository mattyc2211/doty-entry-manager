import { supabase } from '@/integrations/supabase/client';

export type Award = 'north_island' | 'south_island';

export const AWARDS: { code: Award; title: string }[] = [
  { code: 'north_island', title: 'North Island Sportsmanship Award' },
  { code: 'south_island', title: 'South Island Sportsmanship Award' },
];

export function awardTitle(code: Award): string {
  return AWARDS.find((a) => a.code === code)?.title ?? code;
}

export interface NominatorInput {
  name: string;
  memberNumber: string;
}

export interface NominationInput {
  award: Award;
  nomineeName: string;
  reason?: string;
}

/**
 * Sends one or both nominations in a single call. The server checks that
 * nominations are open, that each member nominates once per award, and the
 * field lengths, and its messages are written for the person filling in the
 * form, so they are passed through as they are.
 */
export async function submitNominations(
  nominator: NominatorInput,
  nominations: NominationInput[],
): Promise<number> {
  const { data, error } = await supabase.rpc('submit_nominations', {
    p_nominator: {
      name: nominator.name,
      member_number: nominator.memberNumber,
    },
    p_nominations: nominations.map((n) => ({
      award: n.award,
      nominee_name: n.nomineeName,
      reason: n.reason ?? null,
    })),
  });

  if (error) throw new Error(error.message);
  return Number((data as { count: number }).count);
}

export interface AdminNomination {
  id: string;
  award: Award;
  nomineeName: string;
  reason: string | null;
  nominatorName: string;
  nominatorMemberNumber: string;
  createdAt: string;
}

export async function fetchNominations(): Promise<AdminNomination[]> {
  const { data, error } = await supabase
    .from('nominations')
    .select(
      'id, award, nominee_name, reason, nominator_name, nominator_member_number, created_at',
    )
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    award: row.award as Award,
    nomineeName: row.nominee_name,
    reason: row.reason,
    nominatorName: row.nominator_name,
    nominatorMemberNumber: row.nominator_member_number,
    createdAt: row.created_at,
  }));
}

export async function deleteNomination(id: string): Promise<void> {
  const { error } = await supabase.from('nominations').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function setNominationsOpen(showId: string, open: boolean): Promise<void> {
  const { error } = await supabase
    .from('shows')
    .update({ nominations_open: open })
    .eq('id', showId);
  if (error) throw new Error(error.message);
}

/**
 * Groups nominations by nominee so the organisers can see who has the most
 * support. Names are typed freely, so they are compared ignoring case and
 * spacing; the most common spelling is the one shown.
 */
export function tally(nominations: AdminNomination[]): { name: string; count: number }[] {
  const groups = new Map<string, { spellings: Map<string, number>; count: number }>();

  for (const n of nominations) {
    const key = n.nomineeName.toLowerCase().replace(/\s+/g, ' ').trim();
    const group = groups.get(key) ?? { spellings: new Map(), count: 0 };
    group.count += 1;
    group.spellings.set(n.nomineeName, (group.spellings.get(n.nomineeName) ?? 0) + 1);
    groups.set(key, group);
  }

  return [...groups.values()]
    .map((g) => ({
      name: [...g.spellings.entries()].sort((a, b) => b[1] - a[1])[0][0],
      count: g.count,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
