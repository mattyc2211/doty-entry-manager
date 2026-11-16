import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2 } from 'lucide-react';
import { useShow } from '@/hooks/useShow';
import { AWARDS } from '@/lib/nominations';
import { deleteVote, fetchCandidates, fetchVotes, setVotingOpen } from '@/lib/votes';
import { formatShortTimestamp } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * Showmanship voting. The switch opens and closes the ballot at /vote (the
 * server enforces it too). While it is open, the site's showmanship links
 * point at /vote. Counts per candidate, then every vote with who
 * cast it, so a vote under a made-up member number can be removed.
 */
export function AdminVotes() {
  const queryClient = useQueryClient();
  const { show } = useShow();

  const candidates = useQuery({ queryKey: ['ballot-candidates'], queryFn: fetchCandidates });
  const votes = useQuery({ queryKey: ['votes'], queryFn: fetchVotes });

  const toggle = useMutation({
    mutationFn: (open: boolean) => setVotingOpen(show!.id, open),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['active-show'] }),
  });

  const remove = useMutation({
    mutationFn: deleteVote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['votes'] }),
  });

  const open = show?.votingOpen ?? false;
  const all = votes.data ?? [];
  const names = new Map((candidates.data ?? []).map((c) => [c.id, c.name]));
  const voters = new Set(all.map((v) => v.voterMemberNumber)).size;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <h1 className="display text-3xl text-show-ink">Showmanship votes</h1>

      <section className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border border-show-rule bg-white p-6">
        <div className="mr-auto">
          <p className="text-base font-medium text-show-ink">Voting is {open ? 'open' : 'closed'}</p>
          <p className="mt-1 text-sm text-show-charcoal">
            {open
              ? 'The site links to the ballot at /vote.'
              : 'The site links to the nomination form, and /vote says voting is not open.'}{' '}
            {all.length} {all.length === 1 ? 'vote' : 'votes'} from {voters}{' '}
            {voters === 1 ? 'member' : 'members'}.
          </p>
        </div>
        <button
          type="button"
          disabled={!show || toggle.isPending}
          onClick={() => toggle.mutate(!open)}
          className={cn(
            'inline-flex h-11 items-center gap-2 px-5 text-sm font-semibold transition-colors disabled:opacity-60',
            open
              ? 'border border-show-ink text-show-ink hover:bg-show-ink hover:text-white'
              : 'bg-show-red text-white hover:bg-show-red-deep',
          )}
        >
          {toggle.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {open ? 'Close voting' : 'Open voting'}
        </button>
        {toggle.error && <p className="w-full text-sm text-show-red">{toggle.error.message}</p>}
      </section>

      {(votes.isLoading || candidates.isLoading) && (
        <p className="mt-8 text-sm text-show-charcoal">Loading votes…</p>
      )}
      {(votes.error || candidates.error) && (
        <p className="mt-8 text-sm text-show-red">
          {((votes.error || candidates.error) as Error).message}
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {AWARDS.map((award) => {
          const forAward = all.filter((v) => v.award === award.code);
          const counts = (candidates.data ?? [])
            .filter((c) => c.award === award.code)
            .map((c) => ({ name: c.name, count: forAward.filter((v) => v.candidateId === c.id).length }))
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
          return (
            <section key={award.code} className="border border-show-rule bg-white">
              <div className="flex items-baseline justify-between border-b border-show-rule px-6 py-4">
                <h2 className="text-base font-medium text-show-ink">{award.title}</h2>
                <p className="text-sm text-show-charcoal">
                  {forAward.length} {forAward.length === 1 ? 'vote' : 'votes'}
                </p>
              </div>
              <ol className="divide-y divide-show-rule">
                {counts.map((c) => (
                  <li key={c.name} className="flex items-center justify-between px-6 py-3 text-sm">
                    <span className="text-show-ink">{c.name}</span>
                    <span className="code text-show-charcoal">{c.count}</span>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>

      <section className="mt-8 border border-show-rule bg-white">
        <h2 className="border-b border-show-rule px-6 py-4 text-base font-medium text-show-ink">
          Every vote
        </h2>
        {all.length === 0 && !votes.isLoading && (
          <p className="px-6 py-5 text-sm text-show-charcoal">None yet.</p>
        )}
        <ul className="divide-y divide-show-rule">
          {all.map((v) => {
            const busy = remove.isPending && remove.variables === v.id;
            const who = names.get(v.candidateId) ?? 'Unknown';
            return (
              <li key={v.id} className="flex gap-4 px-6 py-3">
                <div className="min-w-0 flex-1 text-sm">
                  <p className="text-show-ink">
                    <span className="font-medium">{who}</span>
                    <span className="text-show-charcoal">
                      {' '}
                      · {v.award === 'north_island' ? 'North Island' : 'South Island'}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-show-charcoal">
                    From {v.voterName} (member <span className="code">{v.voterMemberNumber}</span>),{' '}
                    {formatShortTimestamp(v.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  aria-label="Delete vote"
                  onClick={() => {
                    if (window.confirm(`Delete ${v.voterName}'s vote for ${who}?`)) remove.mutate(v.id);
                  }}
                  className="self-start p-1 text-show-charcoal hover:text-show-red disabled:opacity-60"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </li>
            );
          })}
        </ul>
        {remove.error && (
          <p className="border-t border-show-rule px-6 py-4 text-sm text-show-red">{remove.error.message}</p>
        )}
      </section>
    </div>
  );
}
