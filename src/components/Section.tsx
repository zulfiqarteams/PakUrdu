import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  align?: "left" | "center";
  children: ReactNode;
}

/**
 * Wraps a page section with consistent spacing and an optional
 * heading block, so pages don't hand-roll spacing/typography rules.
 */
export function Section({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  children,
  ...props
}: SectionProps) {
  const isCentered = align === "center";

  return (
    <section className={cn("py-16 sm:py-20", className)} {...props}>
      {(eyebrow || title || description) && (
        <div
          className={cn(
            "mb-10 max-w-2xl",
            isCentered && "mx-auto text-center",
          )}
        >
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-500">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          )}
          {description && (
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
