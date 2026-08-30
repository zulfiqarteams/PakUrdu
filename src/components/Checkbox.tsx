import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const descriptionId = description ? `${checkboxId}-description` : undefined;

  return (
    <div className="flex items-start gap-3">
      <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          aria-describedby={descriptionId}
          className={cn(
            "peer h-5 w-5 shrink-0 appearance-none rounded-sm border border-border-strong bg-surface",
            "transition-colors duration-150 checked:border-brand-500 checked:bg-brand-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        <Check
          size={13}
          strokeWidth={3}
          aria-hidden="true"
          className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100"
        />
      </div>
      <label htmlFor={checkboxId} className="text-sm">
        <span className="font-medium text-ink">{label}</span>
        {description && <p className="mt-0.5 text-xs text-ink-faint">{description}</p>}
      </label>
    </div>
  );
});
