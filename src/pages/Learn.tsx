import { BookOpenText, UserCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { LessonCard } from "@/components/LessonCard";
import { ContentSidebar } from "@/components/ContentSidebar";
import { useSEO } from "@/hooks/useSEO";
import { useLanguage } from "@/i18n/useLanguage";
import { getCourse, getLevels, getModulesForLevel, getLessonsForModule, getLessonPosition } from "@/features/lessons";
import { getTrackById, getTrackForLevel } from "@/features/lessons/data/tracks";
import { useProfiles } from "@/features/profiles";
import { useProgress } from "@/features/progress";
import type { LessonStatus } from "@/types";
import type { LessonProgressStatus } from "@/features/progress";

/** The progress feature's four-state model maps directly onto `LessonCard`'s visual states — "inProgress" reads as "current" in the UI. */
function toCardStatus(status: LessonProgressStatus): LessonStatus {
  return status === "inProgress" ? "current" : status;
}

export default function Learn() {
  const { t, text } = useLanguage();
  useSEO({
    title: "Learn Urdu Typing — Phonetic Keyboard Lessons",
    description:
      "A full Urdu typing curriculum: alphabet, character combinations, words, sentences, and paragraphs, taught with a phonetic keyboard map so you learn the correct finger position from lesson one.",
  });
  const { activeProfile } = useProfiles();
  const { getLessonStatus } = useProgress();
  const [searchParams] = useSearchParams();

  const course = getCourse();
  const allLevels = getLevels();

  // The sidebar's Basic / Intermediate / Expert links pass ?track=,
  // which narrows the level list below to just that track. No track
  // (or an unrecognized one) shows the full path, same as before.
  const selectedTrackId = searchParams.get("track");
  const selectedTrack = selectedTrackId ? getTrackById(selectedTrackId) : undefined;
  const levels = selectedTrack
    ? allLevels.filter((level) => getTrackForLevel(level.order) === selectedTrack.id)
    : allLevels;

  if (!activeProfile) {
    return (
      <PageContainer>
        <PageHeader title={text(course.title)} description={text(course.description)} />
        <div className="py-10">
          <EmptyState
            icon={UserCircle}
            title="Choose a profile to start learning"
            description="Your lesson progress is tracked per local profile, stored only in this browser."
            action={{ label: "Go to Profile", to: "/profile" }}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
          <ContentSidebar />

          <div className="min-w-0">
            <PageHeader
              title={selectedTrack ? `${text(course.title)} · ${text(selectedTrack.label)}` : text(course.title)}
              description={text(course.description)}
            />

            <div className="flex justify-end pb-6">
              <Button to="/learn/phonetic-keyboard" variant="outline" size="sm">
                <BookOpenText size={16} aria-hidden="true" />
                {text("Learn About Phonetic Keyboard")}
              </Button>
            </div>

            {levels.length === 0 ? (
              <EmptyState
                icon={BookOpenText}
                title={text("No lessons in this track yet")}
                description={text("Choose another track from the sidebar.")}
              />
            ) : (
              <div className="divide-y divide-border">
                {levels.map((level) => {
                  const levelModules = getModulesForLevel(level.id);

                  return (
                    <section key={level.id} aria-labelledby={`level-${level.id}`} className="py-10">
                      <div className="mb-1 flex flex-wrap items-center gap-3">
                        <h2 id={`level-${level.id}`} className="text-lg font-semibold">
                          {text(level.title)}
                        </h2>
                        {level.locked && <Badge tone="neutral">{t.common.start}</Badge>}
                      </div>
                      <p className="mb-6 max-w-2xl text-sm text-ink-soft">{text(level.description)}</p>

                      <div className="space-y-8">
                        {levelModules.map((module) => {
                          const moduleLessons = getLessonsForModule(module.id);
                          if (moduleLessons.length === 0) return null;

                          return (
                            <div key={module.id}>
                              <h3 className="mb-3 text-sm font-semibold text-ink-soft">
                                {text(module.title)}
                              </h3>
                              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {moduleLessons.map((lesson) => {
                                  const status: LessonStatus = level.locked
                                    ? "locked"
                                    : toCardStatus(getLessonStatus(lesson));
                                  return (
                                    <LessonCard
                                      key={lesson.id}
                                      index={getLessonPosition(lesson.id) ?? lesson.order}
                                      title={text(lesson.title)}
                                      description={text(lesson.description)}
                                      difficulty={lesson.difficulty}
                                      status={status}
                                      to={status === "locked" ? undefined : `/lesson/${lesson.id}`}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
