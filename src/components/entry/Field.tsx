import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-show-ink"
      >
        {label}
      </label>
      {hint && <p className="mt-1 text-xs text-show-charcoal">{hint}</p>}
      <div className="mt-2">{children}</div>
      {/* Errors say what to do, not that something is invalid. */}
      {error && <p className="mt-1.5 text-xs text-show-red">{error}</p>}
    </div>
  );
}

export const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; mono?: boolean }
>(function TextInput({ className, invalid, mono, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full border bg-white px-3 text-sm text-show-ink placeholder:text-show-charcoal',
        mono && 'code',
        invalid ? 'border-show-red' : 'border-show-rule',
        className,
      )}
      {...props}
    />
  );
});
