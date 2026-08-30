import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * `brand`/`gold`/`neutral` are this app's original accent tones
 * (used for "coming soon" and category badges). `success`/`warning`/
 * `error`/`info`/`default` are the semantic status tones — for
 * things like lesson/test status (Completed, Locked, New) once
 * those exist. Both sets live on one component so there's a single
 * Badge everywhere rather than a status-specific variant.
 */
export type BadgeTone =
  | "brand"
  | "gold"
  | "neutral"
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const tones: Record<BadgeTone, string> = {
  brand: "bg-brand-50 text-brand-700",
  gold: "bg-gold-100 text-gold-600",
  neutral: "bg-paper text-ink-soft border border-border",
  default: "bg-paper text-ink-soft border border-border",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  error: "bg-error-50 text-error-600",
  info: "bg-info-50 text-info-600",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
