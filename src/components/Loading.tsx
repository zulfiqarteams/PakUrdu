import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface SpinnerProps {
  /** Accessible label — spinners have no visible text, so this is
   *  what a screen reader announces. */
  label?: string;
  size?: number;
  className?: string;
}

export function Spinner({ label = "Loading", size = 20, className }: SpinnerProps) {
  return (
    <span role="status" className={cn("inline-flex items-center text-ink-faint", className)}>
      <Loader2 size={size} className="animate-spin" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

interface SkeletonProps {
  className?: string;
}

/**
 * A single placeholder block. Compose a few of these (varying width/
 * height via `className`) to sketch the shape of content that hasn't
 * loaded yet. No API-call shape to match here since the app is
 * client-side, so this stays a plain visual primitive.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-sm bg-border", className)}
    />
  );
}
