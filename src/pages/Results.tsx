import { AlertCircle, CheckCircle2, Clock, Gauge, RotateCcw, Sparkles, Target, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { useSEO } from "@/hooks/useSEO";
import { formatTime } from "@/features/statistics";
import { AchievementModal } from "@/components/AchievementModal";
import {
  useSessionResult,
  getResultNavigationTargets,
  getMistakeSummaryMessage,
  formatAccuracy,
  formatWpm,
  formatPreviousBest,
} from "@/features/results";

const feedbackToneBorder: Record<string, string> = {
  success: "border-l-success-500",
  warning: "border-l-warning-500",
  neutral: "border-l-border-strong",
};

export default function Results() {
  useSEO({ title: "Your Typing Results", noIndex: true });
  const { sessionResult } = useSessionResult();
  const [achievementOpen, setAchievementOpen] = useState(false);

  useEffect(() => {
    if (!sessionResult) return;
    const lessonName = sessionResult.lessonName?.toLowerCase() ?? "";
    const flawlessHomeRow = lessonName.includes("home row") && sessionResult.accuracy === 100 && sessionResult.mistakes.length === 0;
    if (sessionResult.isPersonalBest || flawlessHomeRow) setAchievementOpen(true);
  }, [sessionResult]);

  if (!sessionResult) {
    return (
      <PageContainer>
        <PageHeader
          title="Results"
          description="Your previous typing session is no longer available."
        />

        <div className="py-10">
          <p className="text-sm text-ink-faint">
            Session results live only for the current visit, so a page refresh clears them.
            Complete a lesson or a Practice exercise to see a fresh summary here.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="primary" size="md" to="/learn">
              Back to Learning
            </Button>
            <Button variant="secondary" size="md" to="/practice">
              Start Practicing
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const {
    lessonId,
    lessonName,
    accuracy,
    sessionAccuracy,
    wpm,
    elapsedMs,
    totalCharacters,
    correctCharacters,
    incorrectCharacters,
    mistakes,
    isPersonalBest,
    previousBestAccuracy,
    previousBestWpm,
    feedback,
    status,
  } = sessionResult;

  const { retryTo: defaultRetryTo, continueTo, continueLabel } = getResultNavigationTargets(lessonId);
  const retryTo = sessionResult.retryPath ?? defaultRetryTo;
  const mistakeSummary = getMistakeSummaryMessage(mistakes);
  const previousBestLine = formatPreviousBest({ previousBestWpm, previousBestAccuracy });
  const lessonNameLower = lessonName?.toLowerCase() ?? "";
  const achievementKind = lessonNameLower.includes("home row") && accuracy === 100 && mistakes.length === 0
    ? "home-row-master"
    : "personal-best";

  return (
    <>
      <AchievementModal
        open={achievementOpen}
        onClose={() => setAchievementOpen(false)}
        kind={achievementKind}
        wpm={wpm}
      />
      <PageContainer>
      <PageHeader
        title="Results"
        description={lessonName ?? "Practice session"}
        action={isPersonalBest ? <Badge tone="gold">New Personal Best</Badge> : undefined}
      />

      <div className="py-10">
        <Card className={`mb-6 border-l-4 ${feedbackToneBorder[feedback.tone]}`}>
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-ink-faint" aria-hidden="true" />
            <p className="text-sm text-ink">{feedback.message}</p>
          </div>
        </Card>

        <section aria-labelledby="performance-summary-heading">
          <h2
            id="performance-summary-heading"
            className="text-sm font-semibold uppercase tracking-wide text-ink-faint"
          >
            Performance Summary
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard
              icon={Gauge}
              label="WPM"
              value={formatWpm(wpm)}
              hint={previousBestWpm !== null ? `Best: ${Math.round(previousBestWpm)}` : undefined}
            />
            <StatCard
              icon={Target}
              label="Accuracy"
              value={formatAccuracy(accuracy)}
              hint={`${formatAccuracy(sessionAccuracy)} incl. corrections`}
            />
            <StatCard icon={Clock} label="Time" value={formatTime(elapsedMs)} />
          </div>
        </section>

        <section aria-labelledby="detailed-statistics-heading" className="mt-6">
          <h2
            id="detailed-statistics-heading"
            className="text-sm font-semibold uppercase tracking-wide text-ink-faint"
          >
            Detailed Statistics
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard icon={Type} label="Characters" value={String(totalCharacters)} />
            <StatCard icon={CheckCircle2} label="Correct Characters" value={String(correctCharacters)} />
            <StatCard icon={AlertCircle} label="Errors" value={String(incorrectCharacters)} />
          </div>
        </section>

        <section aria-labelledby="lesson-heading" className="mt-6">
          <h2
            id="lesson-heading"
            className="text-sm font-semibold uppercase tracking-wide text-ink-faint"
          >
            Lesson
          </h2>
          <Card className="mt-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">{lessonName ?? "Practice session"}</p>
                <p className="mt-1 text-xs text-ink-faint">
                  {status === "completed" ? "Completed" : status}
                  {previousBestLine ? ` · Previous best: ${previousBestLine}` : ""}
                </p>
              </div>
              {isPersonalBest && <Badge tone="gold">New Personal Best</Badge>}
            </div>
          </Card>
        </section>

        <section aria-labelledby="mistake-review-heading" className="mt-6">
          <h2
            id="mistake-review-heading"
            className="text-sm font-semibold uppercase tracking-wide text-ink-faint"
          >
            Mistake Review
          </h2>
          <Card className="mt-3">
            <p className="flex items-center gap-1.5 text-sm text-ink-soft">
              {mistakes.length === 0 && (
                <CheckCircle2 size={14} className="text-success-600" aria-hidden="true" />
              )}
              {mistakeSummary}
            </p>

            {mistakes.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {mistakes.map((mistake) => (
                  <li
                    key={`${mistake.index}-${mistake.typed}`}
                    className="rounded-md border border-border px-2.5 py-1.5 text-xs text-ink-soft"
                  >
                    <span className="text-ink-faint">Expected</span>{" "}
                    <span className="numeric font-semibold text-ink">{mistake.expected}</span>
                    <span className="text-ink-faint">, typed</span>{" "}
                    <span className="numeric font-semibold text-ink">{mistake.typed}</span>
                    {mistake.count > 1 ? ` (×${mistake.count})` : ""}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="secondary" size="md" to={retryTo}>
            <RotateCcw size={14} aria-hidden="true" />
            Try Again
          </Button>
          {continueTo && continueLabel && (
            <Button variant="primary" size="md" to={continueTo}>
              {continueLabel}
            </Button>
          )}
          <Button variant="ghost" size="md" to="/learn">
            Back to Learning
          </Button>
        </div>
      </div>
      </PageContainer>
    </>
  );
}
