import { ArrowRight, BarChart3, BookOpen, Keyboard, LineChart } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { HeroTypingWidget } from "@/components/home/HeroTypingWidget";
import { useSEO } from "@/hooks/useSEO";
import { useProfiles } from "@/features/profiles/context/ProfileContext";
import { useProgress, getContinueLearningCta } from "@/features/progress";
import { useLanguage } from "@/i18n/useLanguage";

export default function Home() {
  useSEO({
    title: "Online Urdu Typing Test & Tutorial — Learn Urdu Typing Free",
    description: "Free online Urdu typing test and tutorial. Start typing immediately with a phonetic Urdu keyboard, live WPM and accuracy, guided lessons, and a timed Urdu typing test — all free on PAKURDU.",
  });

  const { activeProfile } = useProfiles();
  const { t, direction, isUrdu } = useLanguage();
  const copy = t.home;
  const progress = useProgress();
  const cta = getContinueLearningCta({
    currentLesson: progress.currentLesson,
    completedLessonCount: progress.completedLessonCount,
  });

  return (
    <main dir={direction} className={isUrdu ? "urdu-body" : undefined}>
      {/* Primary action: the homepage opens directly on a live typing test. */}
      <HeroTypingWidget />

      <PageContainer className="py-8 sm:py-12">
        <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge tone="brand" className="mb-4">
            <Keyboard size={13} aria-hidden="true" />
            {activeProfile ? copy.returningBadge : copy.badge}
          </Badge>

          <h1 className="text-display max-w-3xl">
            {activeProfile
              ? copy.returningHeading.replace("{name}", activeProfile.name)
              : copy.title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">
            {activeProfile
              ? (cta.isCourseComplete ? copy.completeDescription : copy.returningDescription.replace("{lesson}", progress.currentLesson?.title ?? "your next lesson"))
              : copy.description}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button to={activeProfile ? cta.to : "/test"} size="lg">
              {activeProfile ? cta.label : copy.primary}
              <ArrowRight size={15} aria-hidden="true" />
            </Button>
            <Button to="/learn" variant="ghost" size="lg">
              <BookOpen size={15} aria-hidden="true" />
              {copy.secondary}
            </Button>
          </div>
        </section>

        {/* Secondary information is deliberately compact and below the primary action. */}
        <section className="mx-auto mt-10 max-w-3xl border-t border-border/60 pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <LineChart size={17} className="mx-auto text-brand-500" aria-hidden="true" />
              <p className="mt-2 text-xs text-ink-faint">{copy.progressTitle}</p>
              <p className="mt-1 font-mono text-sm font-semibold text-ink">{progress.coursePercentage}%</p>
            </div>
            <div>
              <Keyboard size={17} className="mx-auto text-brand-500" aria-hidden="true" />
              <p className="mt-2 text-xs text-ink-faint">{copy.completedLessons}</p>
              <p className="mt-1 font-mono text-sm font-semibold text-ink">{progress.completedLessonCount}/{progress.totalLessonCount}</p>
            </div>
            <div>
              <BarChart3 size={17} className="mx-auto text-brand-500" aria-hidden="true" />
              <p className="mt-2 text-xs text-ink-faint">{copy.bestWpm}</p>
              <p className="mt-1 font-mono text-sm font-semibold text-ink">{progress.bestWpm ?? "—"}</p>
            </div>
          </div>
        </section>
      </PageContainer>
    </main>
  );
}
