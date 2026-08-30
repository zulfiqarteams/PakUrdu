import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={errorId}
          className={cn(
            "w-full appearance-none rounded-sm border bg-surface px-3.5 py-2.5 pr-9 text-sm text-ink",
            "transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-error-500 focus-visible:outline-error-500"
              : "border-border hover:border-border-strong",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
          aria-hidden="true"
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-error-600">
          {error}
        </p>
      )}
    </div>
  );
});
