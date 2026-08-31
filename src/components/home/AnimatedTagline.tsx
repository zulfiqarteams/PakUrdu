import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/useLanguage";

const ROTATION_MS = 2300;

export function AnimatedTagline() {
  const { t, direction } = useLanguage();
  const words = t.home.heroWords;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || words.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [words]);

  return (
    <section
      dir={direction}
      aria-label={`${t.home.heroWord}`}
      className="home-tagline-strip flex h-12 items-center justify-center px-4 text-center"
    >
      <p className="text-sm font-semibold tracking-wide text-ink-soft sm:text-base">
        <span className="text-ink">PAKURDU — </span>
        <span key={`${index}-${words[index]}`} className="home-tagline-word inline-block min-w-[5.5rem] text-brand-600">
          {words[index]}
        </span>
      </p>
    </section>
  );
}
