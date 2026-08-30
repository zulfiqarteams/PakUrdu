import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/Card";
import { cn } from "@/lib/cn";
import type { StatTrend } from "@/types";

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  /** Optional trend, e.g. "+4 WPM this week". Direction sets the
   *  icon/color; the text itself is supplied by the caller. */
  trend?: { direction: StatTrend; text: string };
}

const trendConfig: Record<StatTrend, { icon: LucideIcon | null; classes: string }> = {
  up: { icon: TrendingUp, classes: "text-success-600" },
  down: { icon: TrendingDown, classes: "text-error-600" },
  neutral: { icon: null, classes: "text-ink-faint" },
};

/**
 * Displays one metric (Accuracy, WPM, Time, ...). Values are passed
 * in as strings so callers can show "--" / "--%" placeholders now
 * and real formatted numbers once the typing engine exists, without
 * this component changing.
 */
export function StatCard({ icon: Icon, label, value, hint, trend }: StatCardProps) {
  const TrendIcon = trend ? trendConfig[trend.direction].icon : null;

  return (
    <Card className="text-start">
      <div className="flex items-center gap-2 text-ink-faint">
        {Icon && <Icon size={15} aria-hidden="true" />}
        <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <p className="numeric mt-2 text-2xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
      {trend && (
        <p className={cn("mt-1 flex items-center gap-1 text-xs font-medium", trendConfig[trend.direction].classes)}>
          {TrendIcon && <TrendIcon size={12} aria-hidden="true" />}
          {trend.text}
        </p>
      )}
    </Card>
  );
}
