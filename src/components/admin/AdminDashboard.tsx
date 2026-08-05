import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, Loader2, LogOut, Search } from 'lucide-react';
import {
  fetchEntries,
  setPaymentStatus,
  summarise,
  type AdminEntry,
  type PaymentStatus,
} from '@/lib/admin';
import { formatMoney, formatDateTime, formatShortDate } from '@/lib/format';
import { ShowMark } from '@/components/show/ShowMark';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'unpaid' | 'paid';

export function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>('unpaid');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: ['admin-entries'],
    queryFn: fetchEntries,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: PaymentStatus }) =>
      setPaymentStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-entries'] }),
  });

  const stats = useMemo(() => summarise(entries), [entries]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((entry) => {
      if (filter === 'unpaid' && entry.paymentStatus !== 'unpaid') return false;
      if (filter === 'paid' && entry.paymentStatus === 'unpaid') return false;
      if (!q) return true;
      return (
        entry.reference.toLowerCase().includes(q) ||
        entry.exhibitorName.toLowerCase().includes(q) ||
        entry.exhibitorEmail.toLowerCase().includes(q) ||
        entry.dogs.some(
          (d) =>
            d.pedigreeName.toLowerCase().includes(q) ||
            d.breed.toLowerCase().includes(q),
        )
      );
    });
  }, [entries, filter, search]);

  return (
    <div className="min-h-screen bg-wash">
      <header className="border-b border-show-rule bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 lg:px-8">
          <ShowMark size="sm" />
          <span className="label">Entries</span>
          <button
            type="button"
            onClick={onSignOut}
            className="ml-auto inline-flex items-center gap-2 text-sm text-show-charcoal hover:text-show-ink"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        {/* Money first. Reconciling bank transfers is the actual job here, so
            what is outstanding leads rather than a headline entry count. */}
        <div className="grid gap-px border border-show-rule bg-show-rule sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Outstanding"
            value={formatMoney(stats.outstanding)}
            detail={`${stats.unpaidCount} ${stats.unpaidCount === 1 ? 'entry' : 'entries'} unpaid`}
            emphasis={stats.outstanding > 0}
          />
          <Stat label="Received" value={formatMoney(stats.received)} />
          <Stat
            label="Entries"
            value={String(stats.entryCount)}
            detail={`${stats.dogCount} dogs, ${stats.eventCount} in titles`}
          />
          <Stat label="Dinner seats" value={String(stats.dinnerTickets)} />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex border border-show-rule bg-white">
            {(['unpaid', 'paid', 'all'] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2.5 text-sm capitalize transition-colors',
                  filter === f
                    ? 'bg-show-ink text-white'
                    : 'text-show-charcoal hover:text-show-ink',
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative min-w-[16rem] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-show-charcoal" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Reference, exhibitor, dog or breed"
              className="h-11 w-full border border-show-rule bg-white pl-9 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="mt-6 border border-show-rule bg-white">
          {isLoading && (
            <p className="p-8 text-sm text-show-charcoal">Loading entries…</p>
          )}

          {error && (
            <p className="p-8 text-sm text-show-red">
              {(error as Error).message}
            </p>
          )}

          {!isLoading && !error && visible.length === 0 && (
            <p className="p-8 text-sm text-show-charcoal">
              {entries.length === 0
                ? 'No entries yet. They appear here the moment one is lodged.'
                : 'Nothing matches that.'}
            </p>
          )}

          {visible.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              open={expanded === entry.id}
              busy={mutation.isPending && mutation.variables?.id === entry.id}
              onToggle={() =>
                setExpanded((cur) => (cur === entry.id ? null : entry.id))
              }
              onSetStatus={(status) => mutation.mutate({ id: entry.id, status })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  detail,
  emphasis,
}: {
  label: string;
  value: string;
  detail?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="bg-white p-5">
      <p className="label">{label}</p>
      <p
        className={cn(
          'code mt-2 text-2xl font-semibold',
          emphasis ? 'text-show-red' : 'text-show-ink',
        )}
      >
        {value}
      </p>
      {detail && <p className="mt-1 text-xs text-show-charcoal">{detail}</p>}
    </div>
  );
}

function EntryRow({
  entry,
  open,
  busy,
  onToggle,
  onSetStatus,
}: {
  entry: AdminEntry;
  open: boolean;
  busy: boolean;
  onToggle: () => void;
  onSetStatus: (status: PaymentStatus) => void;
}) {
  const paid = entry.paymentStatus !== 'unpaid';

  return (
    <div className="border-b border-show-rule last:border-b-0">
      <div className="flex flex-wrap items-center gap-4 p-5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-4 text-left"
        >
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-show-charcoal transition-transform',
              open && 'rotate-180',
            )}
          />
          <span className="code shrink-0 text-sm font-medium text-show-ink">
            {entry.reference}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm text-show-ink">
              {entry.exhibitorName}
            </span>
            <span className="block truncate text-xs text-show-charcoal">
              {entry.dogs.length > 0
                ? entry.dogs.map((d) => d.pedigreeName).join(', ')
                : 'Dinner and catalogues only'}
            </span>
          </span>
        </button>

        <span className="code text-sm text-show-ink">
          {formatMoney(entry.totalAmount)}
        </span>

        <span
          className={cn(
            'shrink-0 px-2.5 py-1 text-xs font-medium',
            paid
              ? 'bg-[var(--paid)]/10 text-show-paid'
              : 'bg-show-red/10 text-show-red',
          )}
        >
          {entry.paymentStatus}
        </span>

        <button
          type="button"
          disabled={busy}
          onClick={() => onSetStatus(paid ? 'unpaid' : 'paid')}
          className={cn(
            'inline-flex shrink-0 items-center gap-2 border px-3.5 py-2 text-xs font-medium transition-colors disabled:opacity-50',
            paid
              ? 'border-show-rule text-show-charcoal hover:text-show-ink'
              : 'border-show-ink text-show-ink hover:bg-show-ink hover:text-white',
          )}
        >
          {busy && <Loader2 className="h-3 w-3 animate-spin" />}
          {paid ? 'Mark unpaid' : 'Mark paid'}
        </button>
      </div>

      {open && (
        <div className="animate-rise grid gap-8 border-t border-show-rule bg-wash p-5 sm:grid-cols-2">
          <div>
            <p className="label">Exhibitor</p>
            <p className="mt-2 text-sm text-show-ink">{entry.exhibitorName}</p>
            <p className="text-sm text-show-charcoal">{entry.exhibitorEmail}</p>
            <p className="code text-sm text-show-charcoal">{entry.exhibitorPhone}</p>
            <p className="mt-3 text-xs text-show-charcoal">
              Lodged {formatDateTime(entry.createdAt)}
              {entry.paidAt && <> · Paid {formatDateTime(entry.paidAt)}</>}
            </p>
          </div>

          <div>
            <p className="label">Extras</p>
            <p className="mt-2 text-sm text-show-charcoal">
              {entry.dinnerTickets} dinner{' '}
              {entry.dinnerTickets === 1 ? 'ticket' : 'tickets'} ·{' '}
              {entry.extraCatalogues} extra{' '}
              {entry.extraCatalogues === 1 ? 'catalogue' : 'catalogues'}
            </p>
            {entry.dietaryRequirements && (
              <p className="mt-2 text-sm text-show-ink">
                Dietary: {entry.dietaryRequirements}
              </p>
            )}
          </div>

          {entry.dogs.length > 0 && (
            <div className="sm:col-span-2">
              <p className="label">Dogs</p>
              <ul className="mt-3 space-y-4">
                {entry.dogs.map((dog) => (
                  <li key={dog.id} className="flex gap-4">
                    {dog.photoUrl && (
                      <img
                        src={dog.photoUrl}
                        alt=""
                        className="h-16 w-16 shrink-0 border border-show-rule object-cover"
                      />
                    )}
                    <div>
                      <p className="pedigree text-sm text-show-ink">
                        {dog.pedigreeName}
                      </p>
                      <p className="text-sm text-show-charcoal">
                        {dog.breed} <span className="code">· {dog.dogsNzRegistration}</span>
                      </p>
                      <ul className="mt-1.5 space-y-0.5">
                        {dog.events.map((e, i) => (
                          <li key={i} className="text-xs text-show-charcoal">
                            {e.title} — {e.qualifyingShow},{' '}
                            <span className="code">
                              {formatShortDate(e.qualifyingDate)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
