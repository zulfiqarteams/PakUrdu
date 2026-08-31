import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

interface ScrollFadeInOptions {
  /** Starting vertical offset in px that animates to 0. Defaults to 24. */
  y?: number;
  /** Tween duration in seconds. Defaults to 0.6. */
  duration?: number;
  /** ScrollTrigger `start` position. Defaults to "top 85%". */
  start?: string;
}

/**
 * Attaches a one-shot, ScrollTrigger-driven fade+slide-up entrance to the
 * returned ref's element: it starts hidden/offset and animates in once when
 * scrolled into view, then never re-fires.
 *
 * Intended for below-the-fold sections on ordinary content pages (landing
 * page sections, etc.) — NOT for the typing/practice screens, and not for
 * anything already visible in the initial viewport (a ScrollTrigger on an
 * already-visible element just adds a jankier version of a mount fade).
 *
 * The ScrollTrigger instance is created inside gsap.context() and killed by
 * ctx.revert() on cleanup, so route changes (this is a React Router SPA)
 * never leave an orphaned ScrollTrigger behind.
 *
 * Respects prefers-reduced-motion: reduce (the same plain window.matchMedia
 * check used across every GSAP addition in this app) by skipping the tween
 * entirely — the section just renders at its normal, fully-visible state.
 */
export function useScrollFadeIn<T extends HTMLElement>(
  options: ScrollFadeInOptions = {},
): RefObject<T> {
  const ref = useRef<T>(null);
  const { y = 24, duration = 0.6, start = "top 85%" } = options;

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start,
            once: true,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
