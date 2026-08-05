import { Minus, Plus } from 'lucide-react';
import { Field } from './Field';
import type { CateringInput } from '@/lib/entries';
import type { Show } from '@/lib/show';
import { formatMoney } from '@/lib/format';

export function ExtrasStep({
  show,
  value,
  onChange,
}: {
  show: Show;
  value: CateringInput;
  onChange: (next: CateringInput) => void;
}) {
  return (
    <div>
      <p className="eyebrow">Step three</p>
      <h2 className="display mt-3 text-3xl text-show-ink">Dinner & catalogues</h2>
      <p className="mt-4 max-w-lg text-show-charcoal">
        Every entry includes one catalogue. Add seats at the presentation dinner
        and extra copies here.
      </p>

      <div className="mt-10 max-w-xl space-y-px border border-show-rule">
        <Counter
          label="Dinner tickets"
          description="Seats at the presentation dinner."
          price={show.dinnerTicketFee}
          value={value.dinnerTickets}
          onChange={(dinnerTickets) => onChange({ ...value, dinnerTickets })}
        />
        <Counter
          label="Extra catalogues"
          description="On top of the one included with your entry."
          price={show.extraCatalogueFee}
          value={value.extraCatalogues}
          onChange={(extraCatalogues) => onChange({ ...value, extraCatalogues })}
        />
      </div>

      {value.dinnerTickets > 0 && (
        <div className="animate-rise mt-8 max-w-xl">
          <Field
            label="Dietary requirements"
            htmlFor="dietary"
            hint="Anything the caterer needs to know, for any of your seats."
          >
            <textarea
              id="dietary"
              rows={3}
              value={value.dietaryRequirements ?? ''}
              onChange={(e) =>
                onChange({ ...value, dietaryRequirements: e.target.value })
              }
              className="w-full border border-show-rule bg-white p-3 text-sm text-show-ink placeholder:text-show-charcoal/60"
              placeholder="One gluten free, one vegetarian"
            />
          </Field>
        </div>
      )}
    </div>
  );
}

function Counter({
  label,
  description,
  price,
  value,
  onChange,
}: {
  label: string;
  description: string;
  price: number;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-4 bg-white p-5">
      <div className="flex-1">
        <p className="text-sm font-medium text-show-ink">{label}</p>
        <p className="mt-1 text-xs text-show-charcoal">{description}</p>
        <p className="code mt-2 text-xs text-show-ink">{formatMoney(price)} each</p>
      </div>

      <div className="flex items-center border border-show-rule">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          aria-label={`One fewer ${label.toLowerCase()}`}
          className="flex h-10 w-10 items-center justify-center text-show-ink transition-colors hover:bg-wash disabled:opacity-30"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="code w-12 text-center text-sm text-show-ink" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label={`One more ${label.toLowerCase()}`}
          className="flex h-10 w-10 items-center justify-center text-show-ink transition-colors hover:bg-wash"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
