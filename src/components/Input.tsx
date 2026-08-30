import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  containerClassName?: string;
}

/**
 * Labeled text input with built-in error/description slots. `id` is
 * generated when not provided so `label`/`aria-describedby` always
 * line up correctly without callers wiring it up by hand.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, description, id, className, containerClassName, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={cn(descriptionId, errorId) || undefined}
        className={cn(
          "w-full rounded-sm border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint",
          "transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-error-500 focus-visible:outline-error-500"
            : "border-border hover:border-border-strong",
          className,
        )}
        {...props}
      />
      {description && !error && (
        <p id={descriptionId} className="mt-1.5 text-xs text-ink-faint">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-error-600">
          {error}
        </p>
      )}
    </div>
  );
});
