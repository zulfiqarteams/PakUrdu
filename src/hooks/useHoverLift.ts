import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A subtle transform-only hover/focus "lift" micro-interaction: translateY
 * + a hair of scale, driven imperatively by pointer/focus events rather
 * than a persistent timeline.
 *
 * Deliberately transform-only (no opacity/color/shadow) so it never
 * fights with an element's existing CSS transitions on other properties —
 * per the "don't mix GSAP and CSS on the *same* property" rule, this only
 * touches `transform`, leaving any existing transition-colors/
 * transition-shadow classes on the same element completely alone.
 *
 * Respects prefers-reduced-motion: reduce (no-ops entirely).
 */
export function useHoverLift<T extends HTMLElement>(): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const lift = () => {
      gsap.to(el, { y: -3, scale: 1.015, duration: 0.2, ease: "power2.out", overwrite: "auto" });
    };
    const rest = () => {
      gsap.to(el, { y: 0, scale: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" });
    };

    el.addEventListener("mouseenter", lift);
    el.addEventListener("mouseleave", rest);
    el.addEventListener("focus", lift);
    el.addEventListener("blur", rest);

    return () => {
      el.removeEventListener("mouseenter", lift);
      el.removeEventListener("mouseleave", rest);
      el.removeEventListener("focus", lift);
      el.removeEventListener("blur", rest);
      gsap.killTweensOf(el);
    };
  }, []);

  return ref;
}
