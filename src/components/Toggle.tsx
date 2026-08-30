import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label: string;
  /** Hides the visible label text but keeps it for screen readers —
   *  for rows where the label is already shown elsewhere (e.g. next
   *  to the switch in a settings list). */
  labelHidden?: boolean;
}

/**
 * An on/off switch, built on a real checkbox input so it's keyboard-
 * operable and announced correctly by screen readers — unlike a
 * decorative `<span>` styled to look like a switch.
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, labelHidden = false, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const toggleId = id ?? generatedId;

  return (
    <label htmlFor={toggleId} className="inline-flex cursor-pointer items-center gap-3">
      {!labelHidden && <span className="text-sm font-medium text-ink">{label}</span>}
      <span className="relative inline-flex h-5 w-9 shrink-0 items-center">
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={toggleId}
          aria-label={labelHidden ? label : undefined}
          className={cn("peer sr-only", className)}
          {...props}
        />
        <span
          aria-hidden="true"
          className="h-5 w-9 rounded-full bg-border transition-colors duration-150 peer-checked:bg-brand-500 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500 peer-disabled:opacity-50"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0.5 h-4 w-4 rounded-full bg-surface shadow-sm transition-transform duration-150 peer-checked:translate-x-4"
        />
      </span>
    </label>
  );
});
