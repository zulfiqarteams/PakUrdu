import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central GSAP entry point.
 *
 * Only the free core + ScrollTrigger plugin are registered here — no paid
 * club plugins (SplitText, MorphSVG, etc.) without an explicit ask.
 *
 * Registration is guarded so repeated imports (React StrictMode double
 * invoke, HMR) never register the plugin twice.
 */
let registered = false;

export function ensureGsapRegistered(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

ensureGsapRegistered();

export { gsap, ScrollTrigger };
