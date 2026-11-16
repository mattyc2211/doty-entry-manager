import { supabase } from '@/integrations/supabase/client';
import type { Award } from '@/lib/nominations';

export interface Candidate {
  id: string;
  award: Award;
  name: string;
}

export interface Ballot {
  open: boolean;
  showDate: string | null;
  candidates: Candidate[];
}

export async function fetchBallot(): Promise<Ballot> {
  const { data, error } = await supabase.rpc('get_ballot');
  if (error) throw new Error(`Could not load the ballot: ${error.message}`);
  const b = (data ?? {}) as { open?: boolean; show_date?: string; candidates?: Candidate[] };
  return {
    open: !!b.open,
    showDate: b.show_date ?? null,
    candidates: b.candidates ?? [],
  };
}

export interface VoteInput {
  award: Award;
  candidateId: string;
}

/**
 * Sends one or both votes in a single call. The server checks that voting is
 * open, that the person is on the ballot for that award, and that the member
 * has not voted for it already. Its messages are written for the voter.
 */
export async function submitVotes(
  voter: { name: string; memberNumber: string },
  votes: VoteInput[],
): Promise<number> {
  const { data, error } = await supabase.rpc('submit_votes', {
    p_voter: { name: voter.name, member_number: voter.memberNumber },
    p_votes: votes.map((v) => ({ award: v.award, candidate_id: v.candidateId })),
  });
  if (error) throw new Error(error.message);
  return Number((data as { count: number }).count);
}

export interface AdminVote {
  id: string;
  award: Award;
  candidateId: string;
  voterName: string;
  voterMemberNumber: string;
  createdAt: string;
}

export async function fetchCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from('ballot_candidates')
    .select('id, award, name, sort_order')
    .order('sort_order');
  if (error) throw new Error(error.message);
  return (data ?? []).map((c) => ({ id: c.id, award: c.award as Award, name: c.name }));
}

export async function fetchVotes(): Promise<AdminVote[]> {
  const { data, error } = await supabase
    .from('votes')
    .select('id, award, candidate_id, voter_name, voter_member_number, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((v) => ({
    id: v.id,
    award: v.award as Award,
    candidateId: v.candidate_id,
    voterName: v.voter_name,
    voterMemberNumber: v.voter_member_number,
    createdAt: v.created_at,
  }));
}

export async function deleteVote(id: string): Promise<void> {
  const { error } = await supabase.from('votes').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function setVotingOpen(showId: string, open: boolean): Promise<void> {
  const { error } = await supabase.from('shows').update({ voting_open: open }).eq('id', showId);
  if (error) throw new Error(error.message);
}

/** Splits "Janet Jenkins-Piggott" into first names and surname for display. */
export function splitName(name: string): [string, string] {
  const i = name.trim().lastIndexOf(' ');
  return i < 0 ? ['', name] : [name.slice(0, i), name.slice(i + 1)];
}
