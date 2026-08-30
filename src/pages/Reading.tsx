import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Lightbulb, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ContentSidebar } from "@/components/ContentSidebar";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/i18n/useLanguage";
import { useSEO } from "@/hooks/useSEO";
import { readingSections } from "@/features/reading/data/content";
import { useReadingProgress } from "@/features/reading/hooks/useReadingProgress";

function readIndexFromHash(): number {
  if (typeof window === "undefined") return 0;
  const id = window.location.hash.replace("#", "");
  const index = readingSections.findIndex((section) => section.id === id);
  return index === -1 ? 0 : index;
}

/**
 * "Learn About Phonetic Keyboard", rebuilt around a W3Schools-style tutorial flow:
 * one topic fills the screen at a time (not one long scrolling page),
 * with Previous/Next chapter navigation and a slim progress bar
 * tracking how much of the course has been opened. The URL hash is
 * still the source of truth for which topic is showing — the sidebar
 * already links to `#topic-id` — so a shared link, browser back/
 * forward, and page refresh all land on the right chapter.
 */
export default function Reading() {
  useSEO({
    title: "Learn About Phonetic Keyboard — Step-by-Step Guide",
    description:
      "A chapter-by-chapter reading guide to Urdu typing: how the phonetic keyboard works, character rules, and typing tips, written for complete beginners.",
  });

  const { language, t, isUrdu, direction } = useLanguage();

  const [activeIndex, setActiveIndex] = useState<number>(readIndexFromHash);
  const { visited, markVisited } = useReadingProgress();

  // The hash is the single source of truth for "which topic" — sync
  // whenever it changes, whether from the sidebar, a shared link, or
  // the browser's own back/forward buttons.
  useEffect(() => {
    const updateFromHash = () => setActiveIndex(readIndexFromHash());
    window.addEventListener("hashchange", updateFromHash);
    return () => window.removeEventListener("hashchange", updateFromHash);
  }, []);

  const activeSection = readingSections[activeIndex];

  // Mark the topic read and scroll to the top of the chapter each
  // time it changes — the learner is looking at a new "page", so
  // wherever they'd scrolled to on the previous topic shouldn't carry
  // over.
  useEffect(() => {
    if (!activeSection) return;
    markVisited(activeSection.id);
    window.scrollTo(0, 0);
  }, [activeSection, markVisited]);

  const progressPercent = useMemo(
    () => Math.round((visited.size / readingSections.length) * 100),
    [visited],
  );

  function goTo(index: number) {
    const target = readingSections[index];
    if (!target) return;
    window.location.hash = target.id;
    setActiveIndex(index);
  }

  if (!activeSection) return null;

  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex < readingSections.length - 1;

  return (
    <PageContainer>
      <div className="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
          <ContentSidebar activeReadingId={activeSection.id} />

          <div className="min-w-0">
            <PageHeader
              title={t.reading.title}
              description={t.reading.description}
            />

            {/* Tutorial progress — the same "how much have I read"
                signal W3Schools shows at the top of every chapter,
                driven by `useReadingProgress` rather than scroll
                position now that only one topic is ever on screen. */}
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-ink-soft">
              <span>
                {t.reading.chapter.replace("{current}", String(activeIndex + 1)).replace("{total}", String(readingSections.length))}
              </span>
              <span>{t.reading.read.replace("{percent}", String(progressPercent))}</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Reading course progress"
              className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-border"
            >
              <div
                className="h-full rounded-full bg-brand-500 transition-[width] duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <main
              className={cn(isUrdu && "urdu-body")}
              dir={direction}
              lang={language === "ur" ? "ur" : "en"}
            >
              <Card>
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-brand-50 text-sm font-bold text-brand-600">
                    {activeIndex + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold text-ink sm:text-2xl">
                      {activeSection.title[language]}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-ink">
                      {activeSection.explanation[language]}
                    </p>

                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {activeSection.points[language].map((point) => (
                        <li
                          key={point}
                          className="flex gap-2 rounded-md border border-border bg-paper p-3 text-sm leading-7 text-ink-soft"
                        >
                          <CheckCircle2
                            size={16}
                            className="mt-1 shrink-0 text-brand-500"
                            aria-hidden="true"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {activeSection.example && (
                      <div className="mt-5 rounded-md border border-gold-300 bg-gold-100 p-5 text-center">
                        <p className="urdu-text text-3xl text-ink">{activeSection.example.urdu}</p>
                        <p className="mt-2 text-sm text-ink-soft">
                          {language === "ur"
                            ? activeSection.example.urdu
                            : language === "roman"
                              ? activeSection.example.roman
                              : activeSection.example.en}
                        </p>
                      </div>
                    )}

                    {/* W3Schools-style "Tip:" callout — one extra,
                        skimmable nugget that doesn't belong in the
                        checklist above. */}
                    <div className="mt-5 flex gap-3 rounded-md border border-brand-100 bg-brand-50 p-4">
                      <Lightbulb size={18} className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">{t.reading.tip}</p>
                        <p className="mt-1 text-sm leading-7 text-ink">{activeSection.tip[language]}</p>
                      </div>
                    </div>

                    {/* "Did you know?" — trivia/context, purely to add
                        texture so the chapter doesn't read like a bare
                        checklist. */}
                    <div className="mt-3 flex gap-3 rounded-md border border-gold-300 bg-gold-100 p-4">
                      <Sparkles size={18} className="mt-0.5 shrink-0 text-gold-600" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
                          {t.reading.didYouKnow}
                        </p>
                        <p className="mt-1 text-sm leading-7 text-ink">{activeSection.didYouKnow[language]}</p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-border pt-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
                        {t.reading.practice}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-ink">
                        {activeSection.practice[language]}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* W3Schools-style chapter navigation. */}
              <div className="mt-6 flex items-center justify-between gap-3" dir="ltr">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => goTo(activeIndex - 1)}
                  disabled={!hasPrevious}
                  className="min-w-0"
                >
                  <ChevronLeft className="directional-icon" size={16} aria-hidden="true" />
                  <span className="truncate">
                    {hasPrevious ? readingSections[activeIndex - 1].title[language] : t.reading.previous}
                  </span>
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => goTo(activeIndex + 1)}
                  disabled={!hasNext}
                  className="min-w-0"
                >
                  <span className="truncate">
                    {hasNext ? readingSections[activeIndex + 1].title[language] : t.reading.next}
                  </span>
                  <ChevronRight className="directional-icon" size={16} aria-hidden="true" />
                </Button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
