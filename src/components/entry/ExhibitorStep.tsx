import { Field, TextInput } from './Field';
import type { ExhibitorInput } from '@/lib/entries';

export function ExhibitorStep({
  value,
  errors,
  onChange,
}: {
  value: ExhibitorInput;
  errors: Partial<Record<keyof ExhibitorInput, string>>;
  onChange: (next: ExhibitorInput) => void;
}) {
  const set = (key: keyof ExhibitorInput) => (e: { target: { value: string } }) =>
    onChange({ ...value, [key]: e.target.value });

  return (
    <div>
      <h2 className="display text-3xl text-show-ink">Who is entering?</h2>
      <p className="mt-4 max-w-lg text-show-charcoal">
        The confirmation and your payment reference go to this email, so use one
        you check.
      </p>

      <div className="mt-10 grid max-w-xl gap-6 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName" error={errors.firstName}>
          <TextInput
            id="firstName"
            value={value.firstName}
            onChange={set('firstName')}
            invalid={!!errors.firstName}
            autoComplete="given-name"
          />
        </Field>

        <Field label="Surname" htmlFor="surname" error={errors.surname}>
          <TextInput
            id="surname"
            value={value.surname}
            onChange={set('surname')}
            invalid={!!errors.surname}
            autoComplete="family-name"
          />
        </Field>

        <Field
          label="Email"
          htmlFor="email"
          error={errors.email}
          className="sm:col-span-2"
        >
          <TextInput
            id="email"
            type="email"
            inputMode="email"
            value={value.email}
            onChange={set('email')}
            invalid={!!errors.email}
            autoComplete="email"
          />
        </Field>

        <Field
          label="Phone"
          htmlFor="phone"
          hint="In case the organisers need to reach you on the day."
          error={errors.phone}
          className="sm:col-span-2"
        >
          <TextInput
            id="phone"
            type="tel"
            inputMode="tel"
            value={value.phone}
            onChange={set('phone')}
            invalid={!!errors.phone}
            autoComplete="tel"
          />
        </Field>
      </div>
    </div>
  );
}
