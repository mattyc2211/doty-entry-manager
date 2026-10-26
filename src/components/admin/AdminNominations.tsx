import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2 } from 'lucide-react';
import { useShow } from '@/hooks/useShow';
import {
  AWARDS,
  deleteNomination,
  fetchNominations,
  setNominationsOpen,
  tally,
  type AdminNomination,
} from '@/lib/nominations';
import { formatShortTimestamp } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * Sportsmanship nominations. The switch opens and closes the public form (the
 * server enforces it too). The tally groups by nominee so the voting shortlist
 * can be read straight off the page; the list underneath is every nomination
 * as it was sent, with the reason and who sent it.
 */
export function AdminNominations() {
  const queryClient = useQueryClient();
  const { show } = useShow();

  const { data: nominations = [], isLoading, error } = useQuery({
    queryKey: ['nominations'],
    queryFn: fetchNominations,
  });

  const toggle = useMutation({
    mutationFn: (open: boolean) => setNominationsOpen(show!.id, open),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['active-show'] }),
  });

  const remove = useMutation({
    mutationFn: deleteNomination,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nominations'] }),
  });

  const open = show?.nominationsOpen ?? false;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <h1 className="display text-3xl text-show-ink">Sportsmanship nominations</h1>

      <section className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border border-show-rule bg-white p-6">
        <div className="mr-auto">
          <p className="text-base font-medium text-show-ink">
            Nominations are {open ? 'open' : 'closed'}
          </p>
          <p className="mt-1 text-sm text-show-charcoal">
            {open
              ? 'The form at /nominate is accepting nominations.'
              : 'The form at /nominate says nominations are not open.'}
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
          {open ? 'Close nominations' : 'Open nominations'}
        </button>
        {toggle.error && (
          <p className="w-full text-sm text-show-red">{toggle.error.message}</p>
        )}
      </section>

      {isLoading && <p className="mt-8 text-sm text-show-charcoal">Loading nominations…</p>}
      {error && <p className="mt-8 text-sm text-show-red">{(error as Error).message}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {AWARDS.map((award) => {
          const forAward = nominations.filter((n) => n.award === award.code);
          const counts = tally(forAward);
          return (
            <section key={award.code} className="border border-show-rule bg-white">
              <div className="flex items-baseline justify-between border-b border-show-rule px-6 py-4">
                <h2 className="text-base font-medium text-show-ink">{award.title}</h2>
                <p className="text-sm text-show-charcoal">
                  {forAward.length} {forAward.length === 1 ? 'nomination' : 'nominations'}
                </p>
              </div>
              {counts.length === 0 ? (
                <p className="px-6 py-5 text-sm text-show-charcoal">None yet.</p>
              ) : (
                <ol className="divide-y divide-show-rule">
                  {counts.map((c) => (
                    <li key={c.name} className="flex items-center justify-between px-6 py-3 text-sm">
                      <span className="text-show-ink">{c.name}</span>
                      <span className="code text-show-charcoal">{c.count}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          );
        })}
      </div>

      <section className="mt-8 border border-show-rule bg-white">
        <h2 className="border-b border-show-rule px-6 py-4 text-base font-medium text-show-ink">
          Every nomination
        </h2>
        {nominations.length === 0 && !isLoading && (
          <p className="px-6 py-5 text-sm text-show-charcoal">None yet.</p>
        )}
        <ul className="divide-y divide-show-rule">
          {nominations.map((n) => (
            <NominationRow
              key={n.id}
              nomination={n}
              busy={remove.isPending && remove.variables === n.id}
              onDelete={() => {
                if (window.confirm(`Delete ${n.nominatorName}'s nomination of ${n.nomineeName}?`)) {
                  remove.mutate(n.id);
                }
              }}
            />
          ))}
        </ul>
        {remove.error && (
          <p className="border-t border-show-rule px-6 py-4 text-sm text-show-red">
            {remove.error.message}
          </p>
        )}
      </section>
    </div>
  );
}

function NominationRow({
  nomination: n,
  busy,
  onDelete,
}: {
  nomination: AdminNomination;
  busy: boolean;
  onDelete: () => void;
}) {
  return (
    <li className="flex gap-4 px-6 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-show-ink">
          <span className="font-medium">{n.nomineeName}</span>
          <span className="text-show-charcoal">
            {' '}
            · {n.award === 'north_island' ? 'North Island' : 'South Island'}
          </span>
        </p>
        {n.reason && <p className="mt-1 text-sm text-show-charcoal">“{n.reason}”</p>}
        <p className="mt-1 text-xs text-show-charcoal">
          From {n.nominatorName} (member <span className="code">{n.nominatorMemberNumber}</span>),{' '}
          {formatShortTimestamp(n.createdAt)}
        </p>
      </div>
      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        aria-label="Delete nomination"
        className="self-start p-1 text-show-charcoal hover:text-show-red disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    </li>
  );
}
