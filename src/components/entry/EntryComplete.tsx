import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy } from 'lucide-react';
import { RingCard } from '@/components/show/RingCard';
import type { Show } from '@/lib/show';
import type { EntryReceipt } from '@/lib/entries';
import { formatMoney } from '@/lib/format';

/**
 * The confirmation, built around the one thing the exhibitor has to carry away:
 * the reference. It is the ring card, and it is also what the bank transfer
 * must quote, so the memorable object and the useful object are the same one.
 */
export function EntryComplete({
  show,
  receipt,
}: {
  show: Show;
  receipt: EntryReceipt;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
      <h1 className="display text-[clamp(2rem,6vw,3.5rem)] text-show-ink">
        We have your entry.
      </h1>
      <p className="mx-auto mt-5 max-w-lg text-show-charcoal">
        It is not confirmed until payment reaches the organisers. Quote the
        reference below on your transfer so they can match it to this entry.
      </p>

      <div className="mt-12 flex justify-center">
        <RingCard
          animate
          reference={receipt.reference}
          showName={show.name}
          year={show.year}
        />
      </div>

      <CopyReference reference={receipt.reference} />

      <div className="mx-auto mt-14 max-w-md border border-show-rule text-left">
        <div className="border-b border-show-rule bg-wash px-6 py-4">
          <p className="label">Transfer</p>
        </div>
        <dl className="space-y-3 px-6 py-5 text-sm">
          <Row label="Amount" value={formatMoney(receipt.totalAmount)} mono />
          <Row label="Account name" value={show.bankAccountName} />
          <Row label="Account number" value={show.bankAccountNumber} mono />
          <Row label="Reference" value={receipt.reference} mono />
        </dl>
      </div>

      {/* Says only what actually happens. Nothing in this app sends mail: the
          organisers confirm by hand once the transfer lands, exactly as they did
          last year. Promising an automatic email here would be a lie the
          exhibitor discovers by waiting for it. */}
      <p className="mx-auto mt-10 max-w-md text-sm text-show-charcoal">
        Keep this reference somewhere you can find it. The organisers will email you
        once your payment has landed and your entry is confirmed.
      </p>

      <Link
        to="/"
        className="mt-10 inline-block border-b border-show-ink pb-0.5 text-sm font-medium text-show-ink hover:border-show-red hover:text-show-red"
      >
        Back to the show
      </Link>
    </div>
  );
}

function CopyReference({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(reference);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }}
      className="mt-6 inline-flex items-center gap-2 text-sm text-show-charcoal transition-colors hover:text-show-ink"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-show-paid" />
          Reference copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy reference
        </>
      )}
    </button>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <dt className="w-32 shrink-0 text-show-charcoal">{label}</dt>
      <dd className={mono ? 'code text-show-ink' : 'text-show-ink'}>{value}</dd>
    </div>
  );
}
