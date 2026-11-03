import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AlertCircle, Loader2, Minus, Plus } from 'lucide-react';
import { useShow } from '@/hooks/useShow';
import { Field, TextInput } from '@/components/entry/Field';
import { EntryComplete } from '@/components/entry/EntryComplete';
import { bookDinner, type ExhibitorInput } from '@/lib/entries';
import { formatMoney } from '@/lib/format';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Dinner seats on their own, once dog entries have closed. One short page:
 * who you are, how many seats, anything the caterer needs to know. Payment is
 * the same bank transfer and reference as an entry.
 */
export default function Dinner() {
  const { show, isLoading } = useShow();
  const [booker, setBooker] = useState<ExhibitorInput>({
    firstName: '',
    surname: '',
    email: '',
    phone: '',
  });
  const [tickets, setTickets] = useState(1);
  const [dietary, setDietary] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ExhibitorInput, string>>>({});

  const submit = useMutation({
    mutationFn: () => bookDinner(booker, tickets, dietary),
    onSuccess: () => window.scrollTo({ top: 0 }),
  });

  if (show && submit.data) {
    return <EntryComplete show={show} receipt={submit.data} kind="dinner" />;
  }

  const set = (key: keyof ExhibitorInput, value: string) =>
    setBooker((b) => ({ ...b, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof ExhibitorInput, string>> = {};
    if (!booker.firstName.trim()) next.firstName = 'Add your first name.';
    if (!booker.surname.trim()) next.surname = 'Add your surname.';
    if (!EMAIL.test(booker.email.trim())) next.email = 'Add an email address we can reach.';
    if (!booker.phone.trim()) next.phone = 'Add a contact phone number.';
    setErrors(next);
    if (Object.keys(next).length === 0) submit.mutate();
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <h1 className="display rule-red text-[clamp(2.25rem,6vw,4rem)] text-show-ink">
        Presentation dinner
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-show-charcoal">
        Dog entries have closed, but seats at the presentation dinner are still
        available. Book them here and pay by bank transfer.
      </p>

      {isLoading && <p className="mt-10 text-show-charcoal">Loading…</p>}

      {show && !show.dinnerBookingsOpen && (
        <div className="mt-10 flex max-w-2xl items-start gap-4 border border-show-rule bg-wash p-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-show-red" />
          <div>
            <p className="display-md text-base text-show-ink">Dinner bookings are not open</p>
            <p className="mt-2 text-sm leading-relaxed text-show-charcoal">
              Contact the organisers if you would like a seat.
            </p>
          </div>
        </div>
      )}

      {show?.dinnerBookingsOpen && (
        <form onSubmit={onSubmit} noValidate className="mt-12 max-w-2xl">
          <section>
            <h2 className="display-md text-xl text-show-ink">Your details</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Field label="First name" htmlFor="first-name" error={errors.firstName}>
                <TextInput
                  id="first-name"
                  value={booker.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                  invalid={!!errors.firstName}
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Surname" htmlFor="surname" error={errors.surname}>
                <TextInput
                  id="surname"
                  value={booker.surname}
                  onChange={(e) => set('surname', e.target.value)}
                  invalid={!!errors.surname}
                  autoComplete="family-name"
                />
              </Field>
              <Field label="Email" htmlFor="email" error={errors.email}>
                <TextInput
                  id="email"
                  type="email"
                  value={booker.email}
                  onChange={(e) => set('email', e.target.value)}
                  invalid={!!errors.email}
                  autoComplete="email"
                />
              </Field>
              <Field label="Phone" htmlFor="phone" error={errors.phone}>
                <TextInput
                  id="phone"
                  type="tel"
                  value={booker.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  invalid={!!errors.phone}
                  autoComplete="tel"
                />
              </Field>
            </div>
          </section>

          <section className="mt-12 border-t border-show-rule pt-10">
            <h2 className="display-md text-xl text-show-ink">Seats</h2>
            <div className="mt-6 flex items-center gap-4 border border-show-rule bg-white p-5">
              <div className="flex-1">
                <p className="text-sm font-medium text-show-ink">Dinner tickets</p>
                <p className="code mt-2 text-xs text-show-ink">
                  {formatMoney(show.dinnerTicketFee)} each
                </p>
              </div>
              <div className="flex items-center border border-show-rule">
                <button
                  type="button"
                  onClick={() => setTickets((n) => Math.max(1, n - 1))}
                  disabled={tickets === 1}
                  aria-label="One fewer seat"
                  className="flex h-10 w-10 items-center justify-center text-show-ink transition-colors hover:bg-wash disabled:opacity-30"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="code w-12 text-center text-sm text-show-ink" aria-live="polite">
                  {tickets}
                </span>
                <button
                  type="button"
                  onClick={() => setTickets((n) => Math.min(20, n + 1))}
                  disabled={tickets === 20}
                  aria-label="One more seat"
                  className="flex h-10 w-10 items-center justify-center text-show-ink transition-colors hover:bg-wash disabled:opacity-30"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Field
              label="Dietary requirements"
              htmlFor="dietary"
              hint="Anything the caterer needs to know, for any of your seats."
              className="mt-8"
            >
              <textarea
                id="dietary"
                rows={3}
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="w-full border border-show-rule bg-white p-3 text-sm text-show-ink placeholder:text-show-charcoal"
                placeholder="One gluten free, one vegetarian"
              />
            </Field>
          </section>

          <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-show-rule pt-8">
            <button
              type="submit"
              disabled={submit.isPending}
              className="inline-flex items-center gap-2 bg-show-red px-7 py-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-show-red-deep disabled:opacity-60"
            >
              {submit.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Book {tickets} {tickets === 1 ? 'seat' : 'seats'} ·{' '}
              {formatMoney(tickets * show.dinnerTicketFee)}
            </button>
            <Link to="/" className="text-sm text-show-charcoal hover:text-show-ink">
              Back to the show
            </Link>
            {submit.error && (
              <p role="alert" className="w-full text-sm text-show-red">
                {submit.error.message}
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
