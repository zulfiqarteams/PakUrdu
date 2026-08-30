import { cn } from "@/lib/cn";

const HOME_ROW_KEYS = ["a", "s", "d", "f", "j", "k", "l"];

interface HomeRowProgressProps {
  currentIndex: number;
  totalCharacters: number;
  expectedKey?: string;
  className?: string;
}

/**
 * Compact real-time typing-position marker. The green underline is the
 * brand's crescent accent translated into a UI affordance; when the expected
 * physical key is on the home row, that key receives the active marker.
 */
export function HomeRowProgress({ currentIndex, totalCharacters, expectedKey, className }: HomeRowProgressProps) {
  const safeTotal = Math.max(totalCharacters, 0);
  const percent = safeTotal === 0 ? 0 : Math.min(100, Math.round((currentIndex / safeTotal) * 100));
  const normalizedExpected = expectedKey?.toLowerCase();

  return (
    <div className={cn("rounded-xl border border-border bg-surface px-3 py-2.5 sm:px-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">Home Row</p>
          <p className="mt-0.5 truncate text-xs text-ink-soft">Keep your fingers centered</p>
        </div>
        <span className="numeric shrink-0 text-xs font-semibold text-brand-600">{percent}%</span>
      </div>

      <div className="mt-2.5 flex items-end justify-center gap-1.5" aria-label={`Home row position ${percent}%`}>
        {HOME_ROW_KEYS.map((key) => {
          const active = normalizedExpected === key;
          return (
            <span
              key={key}
              className={cn(
                "relative flex h-7 min-w-7 items-center justify-center rounded-md border px-1 font-mono text-[10px] font-semibold uppercase transition-all",
                active
                  ? "border-brand-500 bg-brand-50 text-brand-700 shadow-[0_0_0_2px_color-mix(in_srgb,var(--color-brand-500)_10%,transparent)]"
                  : "border-border bg-paper text-ink-faint",
              )}
            >
              {key}
              {active && <span aria-hidden="true" className="absolute -bottom-1.5 left-1/2 h-1.5 w-5 -translate-x-1/2 rounded-[100%] border-b-2 border-brand-500" />}
            </span>
          );
        })}
      </div>

      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-border" aria-hidden="true">
        <div
          className="h-full rounded-full bg-brand-500 transition-[width] duration-200 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
