import { LineChart, Trophy, UserCircle } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Card } from "@/components/Card";
import { ProgressBar } from "@/components/ProgressBar";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/Button";
import { useSEO } from "@/hooks/useSEO";
import { useProfiles } from "@/features/profiles";
import { useProgress } from "@/features/progress";

export default function Progress() {
  useSEO({ title: "Your Learning Progress", noIndex: true });
  const { activeProfile } = useProfiles();
  const { completedLessonCount, totalLessonCount, coursePercentage, currentLesson, bestWpm, bestAccuracy } =
    useProgress();

  if (!activeProfile) {
    return (
      <PageContainer>
        <PageHeader
          title="Progress"
          description="A look at how your speed and accuracy improve over time."
        />
        <div className="py-10">
          <EmptyState
            icon={UserCircle}
            title="Choose a profile to see your progress"
            description="Progress is tracked per local profile, stored only in this browser."
            action={{ label: "Go to Profile", to: "/profile" }}
          />
        </div>
      </PageContainer>
    );
  }

  const hasStarted = completedLessonCount > 0;

  return (
    <PageContainer>
      <PageHeader
        title="Progress"
        description="Your progress is stored only in this browser."
      />

      <div className="space-y-10 py-10">
        {!hasStarted && (
          <EmptyState
            icon={LineChart}
            title="Your progress will appear here"
            description="Complete your first lesson to start tracking speed and accuracy."
            action={{ label: "Start Learning", to: currentLesson ? `/lesson/${currentLesson.id}` : "/learn" }}
          />
        )}

        <section aria-labelledby="overall-progress-heading">
          <h2 id="overall-progress-heading" className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-faint">
            Overall Course Progress
          </h2>
          <Card>
            <div className="flex items-end justify-between gap-4">
              <span className="numeric text-4xl font-bold text-ink">{coursePercentage}%</span>
              <span className="text-sm text-ink-soft">
                {completedLessonCount} / {totalLessonCount} lessons completed
              </span>
            </div>
            <ProgressBar value={coursePercentage} label="Course progress" className="mt-4" />
          </Card>
        </section>

        <section aria-labelledby="current-lesson-heading">
          <h2 id="current-lesson-heading" className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-faint">
            Current Lesson
          </h2>
          <Card>
            {currentLesson ? (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{currentLesson.title}</p>
                  <p className="mt-1 text-sm text-ink-soft">{currentLesson.description}</p>
                </div>
                <Button to={`/lesson/${currentLesson.id}`} size="md">
                  Continue
                </Button>
              </div>
            ) : (
              <p className="text-sm text-ink-soft">
                You've completed every lesson in the course. Nicely done.
              </p>
            )}
          </Card>
        </section>

        <section aria-labelledby="best-performance-heading">
          <h2 id="best-performance-heading" className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-faint">
            Performance
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              icon={Trophy}
              label="Best WPM"
              value={bestWpm !== null ? String(bestWpm) : "--"}
            />
            <StatCard
              icon={Trophy}
              label="Best Accuracy"
              value={bestAccuracy !== null ? `${bestAccuracy}%` : "--"}
            />
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
