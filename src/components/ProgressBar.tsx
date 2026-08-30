import { cn } from "@/lib/cn";

interface ProgressBarProps {
  /** 0–100. Values outside that range are clamped. */
  value: number;
  /** Accessible label, e.g. "Lesson progress". Visually hidden
   *  unless `showLabel` is set — always present for screen readers. */
  label: string;
  /** Shows the label and percentage above the bar. */
  showLabel?: boolean;
  tone?: "brand" | "success" | "warning" | "error";
  className?: string;
}

const tones: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
  brand: "bg-brand-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  error: "bg-error-500",
};

/**
 * Purely presentational — displays a value it's given. No progress
 * calculation happens here; the future lesson/practice engine is
 * responsible for computing `value`.
 */
export function ProgressBar({
  value,
  label,
  showLabel = false,
  tone = "brand",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-ink-soft">
          <span>{label}</span>
          <span className="numeric">{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={showLabel ? undefined : label}
        className="h-2 w-full overflow-hidden rounded-full bg-paper"
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-300", tones[tone])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
