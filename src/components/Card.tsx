import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  /** Raises the resting shadow, for content meant to stand apart
   *  from the page (e.g. a modal-adjacent surface). Rare — most
   *  cards should use the default resting elevation. */
  elevated?: boolean;
}

/**
 * Base surface used throughout the app: feature previews, lesson
 * cards, stat tiles, settings groups. `hover`/`elevated` cover the
 * two states every other card variant is built from — everything
 * else (padding, header/footer layout) composes from the
 * Card.Header / Card.Title / etc. helpers below, so callers aren't
 * forced through a single fixed layout.
 */
export function Card({ hover = false, elevated = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border p-4 sm:p-6",
        elevated ? "bg-surface-elevated shadow-raised" : "bg-surface shadow-card",
        hover &&
          "transition-shadow duration-150 hover:shadow-raised hover:border-border-strong",
        className,
      )}
      {...props}
    />
  );
}

/** Groups a card's title/description with the spacing the rest of
 *  the card body expects below it. Optional — plain children work
 *  fine for simple cards (most of the app still does this). */
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-card-heading", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-small", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-5 flex items-center gap-3 border-t border-border pt-4", className)}
      {...props}
    />
  );
}
