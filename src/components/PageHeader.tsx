import { useLayoutEffect, useRef, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { gsap } from "@/lib/gsap";

export interface Breadcrumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  breadcrumb?: Breadcrumb[];
  action?: ReactNode;
}

/**
 * Standard header used at the top of every major page: optional
 * breadcrumb, title + description, and an optional action (button,
 * badge, etc.) that sits to the right on wide screens and wraps
 * below on narrow ones.
 *
 * `title`/`description` accept ReactNode rather than string so a
 * page can mix English chrome with Urdu content (e.g. wrapping a
 * phrase in the shared `.urdu-text` class) without this component
 * needing to know about direction itself.
 */
export function PageHeader({
  title,
  description,
  breadcrumb,
  action,
}: PageHeaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Simple one-shot fade+slide-up entrance on mount. gsap.context() scopes
  // the tween to this instance and ctx.revert() on cleanup ensures React
  // StrictMode's dev double-invoke (mount -> cleanup -> mount) never leaves
  // a duplicate or orphaned tween behind.
  //
  // Reduced-motion check matches the plain window.matchMedia pattern used
  // by useHoverLift/useScrollFadeIn (and index.css) — skipping the tween
  // entirely leaves the header at its normal, fully-visible resting state.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="border-b border-border pb-8 pt-10 sm:pt-14">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-faint">
            {breadcrumb.map((crumb, index) => {
              const isLast = index === breadcrumb.length - 1;
              return (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <ChevronRight className="directional-icon" size={14} aria-hidden="true" />
                  )}
                  {crumb.to && !isLast ? (
                    <Link to={crumb.to} className="hover:text-ink hover:underline">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={isLast ? "page" : undefined}
                      className={isLast ? "text-ink-soft" : undefined}
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
