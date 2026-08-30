import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/Button";

interface EmptyStateAction {
  label: string;
  to: string;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
}

/**
 * Centered placeholder used wherever a page has no data yet
 * (progress, results, profile). Deliberately calm rather than
 * decorative — the message is the point, not the graphic.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
      <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink-faint">
        <Icon size={22} aria-hidden="true" />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
      {action && (
        <Button to={action.to} variant="secondary" size="md" className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
}
