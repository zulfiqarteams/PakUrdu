import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Circle, Keyboard, RotateCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { cn } from "@/lib/cn";
import { useTypingSession, TypingWorkspace } from "@/features/typing";
import { VirtualKeyboard, HandFingerGuide, getExpectedKey, fingerForKey } from "@/features/keyboard";

import { useProgress } from "@/features/progress";
import { buildSessionResult, useSessionResult } from "@/features/results";
import { useSettings } from "@/features/settings";
import { playResultNeutral, playResultSuccess, playStepComplete, playLessonComplete } from "@/features/keyboard/utils/keyboardSounds";
import type { Lesson, LessonStep } from "@/features/lessons/types";
import type { TypingMistake } from "@/features/typing/types";
import { segmentText } from "@/features/typing/utils/graphemes";
import { useLanguage } from "@/i18n/useLanguage";

interface LessonPracticeProps {
  lesson: Lesson;
  nextLessonId?: string;
}

interface StepStat {
  target: string;
  elapsedMs: number;
  correct: number;
  incorrect: number;
  total: number;
  sessionKeystrokes: number;
  sessionCorrectKeystrokes: number;
  mistakes: TypingMistake[];
}

function displayStepKind(kind: LessonStep["kind"]): string {
  switch (kind) {
    case "learn": return "Learn";
    case "observe": return "See";
    case "practice": return "Practice";
    case "review": return "Review";
    case "master": return "Master";
  }
}

export function LessonPractice({ lesson, nextLessonId }: LessonPracticeProps) {
  const { progress, startLessonAttempt, completeLesson } = useProgress();
  const { text } = useLanguage();
  const { recordSessionResult } = useSessionResult();
  const { showKeyboard, saveLearningProgress, soundEnabled } = useSettings();
  const steps = lesson.steps ?? [];
  const [stepIndex, setStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepStats, setStepStats] = useState<StepStat[]>([]);
  const [resetCount, setResetCount] = useState(0);
  const [lessonComplete, setLessonComplete] = useState(false);
  const hasRecordedLessonRef = useRef(false);
  const activeStep = steps[stepIndex];
  const targetText = activeStep?.target ?? "";
  const session = useTypingSession({ targetText, resetKey: `${lesson.id}-${stepIndex}-${resetCount}` });
  const typing = session.typing;
  const timer = session.timer;
  const expectedKey = activeStep?.expectedKey ?? session.expectedKey ?? getExpectedKey(typing.characters.find((character) => character.status === "current")?.char);
  const activeFinger = expectedKey ? fingerForKey(expectedKey.key) : null;
  const minimumAccuracy = activeStep?.minimumAccuracy ?? lesson.requiredAccuracy ?? 80;
  const stepCanComplete = Boolean(activeStep?.target)
    && typing.currentIndex === typing.totalCharacters
    && (activeStep.kind === "learn"
      ? typing.lastInput === activeStep.target
      : typing.accuracy >= minimumAccuracy);
  const completedCount = completedSteps.size;
  const progressPercent = steps.length === 0 ? 0 : Math.round((completedCount / steps.length) * 100);
  const existingProgress = progress?.lessonProgress[lesson.id];
  const isPersistedCompleted = existingProgress?.status === "completed";

  const fullTarget = useMemo(
    () => steps.filter((step) => step.target).map((step) => step.target).join(" "),
    [steps],
  );

  useEffect(() => {
    if (isPersistedCompleted) {
      hasRecordedLessonRef.current = true;
      setCompletedSteps(new Set(steps.map((_, index) => index)));
      setLessonComplete(true);
      return;
    }
    setStepIndex(0);
    setCompletedSteps(new Set());
    setStepStats([]);
    setLessonComplete(false);
    hasRecordedLessonRef.current = false;
  }, [lesson.id]);

  useEffect(() => {
    if (typing.currentIndex > 0 && saveLearningProgress) startLessonAttempt(lesson.id);
  }, [typing.currentIndex, lesson.id, saveLearningProgress, startLessonAttempt]);

  useEffect(() => {
    if (!activeStep?.target || !stepCanComplete || completedSteps.has(stepIndex)) return;
    const stat: StepStat = {
      target: activeStep.target,
      elapsedMs: timer.elapsedMs,
      correct: typing.correctCharacters,
      incorrect: typing.incorrectCharacters,
      total: typing.totalCharacters,
      sessionKeystrokes: typing.sessionKeystrokes,
      sessionCorrectKeystrokes: typing.sessionCorrectKeystrokes,
      mistakes: typing.mistakes.map((mistake) => ({ ...mistake, index: mistake.index + stepStats.reduce((offset, previous) => offset + segmentText(previous.target).length, 0) })),
    };
    setStepStats((current) => [...current, stat]);
    setCompletedSteps((current) => new Set(current).add(stepIndex));
    if (soundEnabled) playStepComplete();
  }, [activeStep?.target, stepCanComplete, completedSteps, stepIndex, timer.elapsedMs, typing.correctCharacters, typing.incorrectCharacters, typing.totalCharacters, typing.sessionKeystrokes, typing.sessionCorrectKeystrokes, typing.mistakes, soundEnabled, stepStats]);

  useEffect(() => {
    if (!lessonComplete || hasRecordedLessonRef.current) return;
    hasRecordedLessonRef.current = true;

    const totals = stepStats.reduce(
      (acc, stat) => ({
        correct: acc.correct + stat.correct,
        incorrect: acc.incorrect + stat.incorrect,
        total: acc.total + stat.total,
        elapsedMs: acc.elapsedMs + stat.elapsedMs,
        keystrokes: acc.keystrokes + stat.sessionKeystrokes,
        sessionCorrect: acc.sessionCorrect + stat.sessionCorrectKeystrokes,
        mistakes: [...acc.mistakes, ...stat.mistakes],
      }),
      { correct: 0, incorrect: 0, total: 0, elapsedMs: 0, keystrokes: 0, sessionCorrect: 0, mistakes: [] as TypingMistake[] },
    );
    const accuracy = totals.total > 0 ? Math.round((totals.correct / totals.total) * 100) : 100;
    const sessionAccuracy = totals.keystrokes > 0 ? Math.round((totals.sessionCorrect / totals.keystrokes) * 100) : accuracy;
    const minutes = Math.max(totals.elapsedMs / 60000, 1 / 60);
    const wpmOverall = Math.round((totals.keystrokes / 5) / minutes);
    const previous = progress?.lessonProgress[lesson.id];

    if (saveLearningProgress) {
      completeLesson(lesson.id, { accuracy, wpm: wpmOverall });
    }
    recordSessionResult(buildSessionResult({
      lessonId: lesson.id,
      lessonName: lesson.title,
      targetText: fullTarget,
      accuracy,
      sessionAccuracy,
      wpm: wpmOverall,
      elapsedMs: totals.elapsedMs,
      correctCharacters: totals.correct,
      incorrectCharacters: totals.incorrect,
      totalCharacters: totals.total,
      mistakes: totals.mistakes,
      previousBestAccuracy: previous?.bestAccuracy ?? null,
      previousBestWpm: previous?.bestWpm ?? null,
      trackPersonalBest: saveLearningProgress,
    }));

    if (soundEnabled) {
      if (accuracy >= 90) playResultSuccess();
      else playResultNeutral();
      playLessonComplete();
    }
  }, [lessonComplete, saveLearningProgress, stepStats, progress, lesson.id, lesson.title, fullTarget, completeLesson, recordSessionResult, soundEnabled]);

  const advanceStep = useCallback(() => {
    if (!activeStep) return;

    // Read/observe steps become complete at the same moment they advance.
    // Typing steps can advance only after their normal completion rule is met.
    const canAdvance = activeStep.target
      ? stepCanComplete || completedSteps.has(stepIndex)
      : true;
    if (!canAdvance) return;

    setCompletedSteps((current) => new Set(current).add(stepIndex));
    if (soundEnabled && !completedSteps.has(stepIndex)) playStepComplete();

    if (stepIndex === steps.length - 1) {
      setLessonComplete(true);
      return;
    }

    setStepIndex((current) => current + 1);
    setResetCount((current) => current + 1);
  }, [activeStep, completedSteps, stepCanComplete, stepIndex, steps.length, soundEnabled]);

  // Enter is an additional shortcut for the same progression function used
  // by the visible button. It is scoped to this mounted lesson practice
  // component and never advances an incomplete typing step.
  useEffect(() => {
    function handleLearnEnter(event: KeyboardEvent) {
      if (event.key !== "Enter" || event.isComposing) return;
      const target = event.target;
      // If a real button/link has focus, let the browser perform its native
      // Enter activation. The same handler is already wired to that control,
      // so listening here too would cause a double advance.
      if (target instanceof HTMLButtonElement || target instanceof HTMLAnchorElement) return;
      if (target instanceof HTMLTextAreaElement || (target instanceof HTMLElement && target.isContentEditable)) return;

      const canAdvance = activeStep
        ? (activeStep.target ? stepCanComplete || completedSteps.has(stepIndex) : true)
        : false;
      if (!canAdvance) return;

      event.preventDefault();
      advanceStep();
    }

    window.addEventListener("keydown", handleLearnEnter);
    return () => window.removeEventListener("keydown", handleLearnEnter);
  }, [activeStep, advanceStep, completedSteps, stepCanComplete, stepIndex]);

  function resetStep() {
    session.reset();
    setResetCount((current) => current + 1);
  }

  if (steps.length === 0) {
    const reviewed = existingProgress?.status === "completed";
    return (
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">Review</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{lesson.content.instructions ?? "Read this lesson, then mark it reviewed when you are ready."}</p>
          </div>
          {reviewed && <Badge tone="success">Completed</Badge>}
        </div>
        <Button
          variant={reviewed ? "secondary" : "primary"}
          className="mt-5"
          onClick={() => {
            if (saveLearningProgress) completeLesson(lesson.id);
          }}
        >
          {reviewed ? <><CheckCircle2 size={15} aria-hidden="true" /> Reviewed</> : "Mark as reviewed"}
        </Button>
      </Card>
    );
  }

  if (!activeStep) {
    return (
      <Card>
        <p className="text-sm text-ink-soft">This lesson has no learning steps yet.</p>
      </Card>
    );
  }

  if (lessonComplete) {
    const totals = stepStats.reduce((acc, stat) => ({
      correct: acc.correct + stat.correct,
      incorrect: acc.incorrect + stat.incorrect,
      total: acc.total + stat.total,
      elapsedMs: acc.elapsedMs + stat.elapsedMs,
      mistakes: [...acc.mistakes, ...stat.mistakes],
    }), { correct: 0, incorrect: 0, total: 0, elapsedMs: 0, mistakes: [] as TypingMistake[] });
    const accuracy = totals.total ? Math.round((totals.correct / totals.total) * 100) : 100;
    const overallWpm = totals.elapsedMs ? Math.round((totals.correct / 5) / Math.max(totals.elapsedMs / 60000, 1 / 60)) : 0;

    return (
      <Card className="overflow-hidden border-success-500/40">
        <div className="bg-brand-50 p-6 text-center sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-500 text-white shadow-sm">
            <Sparkles size={26} aria-hidden="true" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Lesson complete</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">You finished {lesson.title}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">The lesson is saved to your profile. You can repeat it any time or continue to the next lesson.</p>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-4 sm:p-6">
          <Metric label="Accuracy" value={`${accuracy}%`} />
          <Metric label="Mistakes" value={String(totals.mistakes.reduce((sum, mistake) => sum + mistake.count, 0))} />
          <Metric label="Characters" value={String(totals.total)} />
          <Metric label="WPM" value={String(overallWpm)} />
        </div>
        <div className="flex flex-wrap justify-center gap-3 border-t border-border p-5">
          <Button variant="secondary" onClick={() => { setLessonComplete(false); setStepIndex(0); setCompletedSteps(new Set()); setStepStats([]); setResetCount((current) => current + 1); hasRecordedLessonRef.current = false; }}>
            <RotateCcw size={15} aria-hidden="true" />
            Practice Again
          </Button>
          {nextLessonId ? (
            <Button to={`/lesson/${nextLessonId}`}>
              Next Lesson <ArrowRight className="directional-icon" size={15} aria-hidden="true" />
            </Button>
          ) : (
            <Button to="/test">Go to Tests <ArrowRight className="directional-icon" size={15} aria-hidden="true" /></Button>
          )}
        </div>
      </Card>
    );
  }

  const stepDone = completedSteps.has(stepIndex);
  const isCurrentTyping = Boolean(activeStep.target);
  const statusSummary = stepCanComplete ? "Step complete." : typing.currentIndex === 0 ? `${typing.totalCharacters} characters` : `${typing.correctCharacters} correct · ${typing.incorrectCharacters} incorrect`;

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">{text("Lesson path")}</p>
            <p className="mt-1 text-sm font-semibold text-ink">{text(`Step ${stepIndex + 1} of ${steps.length} · ${progressPercent}%`)}</p>
          </div>
          <Badge tone={stepDone ? "success" : "brand"}>{text(displayStepKind(activeStep.kind))}</Badge>
        </div>
        {/*
         * A single progress readout, not two: the segmented bar below
         * already encodes "which steps are done, which is current, how
         * many total" at a glance, and the percentage now lives in the
         * line above instead of in a second full-width bar underneath
         * saying the same thing — one less thing to scroll past.
         */}
        <div className="mt-3 flex gap-1.5" aria-label={text(`Lesson progress: ${completedCount} of ${steps.length} steps complete`)}>
          {steps.map((step, index) => (
            <div key={step.id} className={cn("h-1.5 flex-1 rounded-full", completedSteps.has(index) ? "bg-success-500" : index === stepIndex ? "bg-brand-500" : "bg-border")} />
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-border bg-surface px-5 py-4 sm:px-6">
          {lesson.type === "character" && stepIndex === 0 ? (
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">{text(`Learn ${activeStep.character ? activeStep.title.replace(/^Learn\s+/, "") : lesson.title.split(" — ")[0]}`)}</p>
              <div className="mt-2 flex min-h-[13.5rem] items-center justify-center overflow-visible sm:min-h-[16rem]">
                <span
                  className="learn-target-glyph urdu-text text-7xl leading-[1.8] text-brand-700 sm:text-8xl"
                  dir="rtl"
                  lang="ur"
                >
                  {activeStep.character}
                </span>
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">{text(`Say: ${activeStep.title.replace(/^Learn\s+/, "")}`)}</p>
              <p className="mt-1 text-sm text-ink-soft">{text("Press")} <kbd className="rounded border border-border bg-paper px-2 py-0.5 font-semibold text-ink">{activeStep.expectedKey?.alt ? `${activeStep.expectedKey.shift ? "Shift + " : ""}AltGr + ${activeStep.expectedKey.key.toUpperCase()}` : activeStep.expectedKey?.shift ? `Shift + ${activeStep.expectedKey.key.toUpperCase()}` : activeStep.expectedKey?.key.toUpperCase() ?? activeStep.phonetic}</kbd></p>
            </div>
          ) : (
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">{text("Step")} {stepIndex + 1}</p>
                <h2 className="mt-1 text-xl font-bold sm:text-2xl">{activeStep.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{activeStep.instruction}</p>
              </div>
            </div>
          )}
        </div>

        {activeStep.examples && activeStep.examples.length > 0 && (
          <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-2 lg:grid-cols-4">
            {activeStep.examples.map((example, index) => (
              <div key={`${example.urdu}-${index}`} className="rounded-lg border border-border bg-paper p-3 text-center">
                <p className="urdu-text text-2xl">{example.urdu}</p>
                {example.meaning && <p className="mt-1 text-xs text-ink-faint">{example.meaning}</p>}
              </div>
            ))}
          </div>
        )}

        {activeStep.note && (
          <div className="border-b border-border bg-paper px-4 py-3 text-sm leading-relaxed text-ink-soft sm:px-6">
            {activeStep.note}
          </div>
        )}

        {isCurrentTyping ? (
          <div className="min-w-0 p-4 sm:p-5">
            <TypingWorkspace
              session={session}
              showKeyboard={showKeyboard}
              statusSummary={statusSummary}
              keyboardTitle={text("Keyboard")}
              showReset={false}
              sizeVariant="compact"
              layout="scroll"
            />
          </div>        ) : (
          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-paper p-4 sm:p-5">
                {activeStep.character ? (
                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">{text("Target character")}</p>
                    <p className="urdu-text mt-3 text-6xl text-brand-700 sm:text-7xl">{activeStep.character}</p>
                    <p className="mt-3 text-sm font-semibold text-ink">{activeStep.phonetic}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Circle className="mx-auto text-brand-500" size={44} aria-hidden="true" />
                    <p className="mt-4 text-base font-semibold">{text("Get ready for the next typing step")}</p>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{activeStep.instruction}</p>
                  </div>
                )}
              </div>
              {showKeyboard && (
                <div className="rounded-xl border border-border bg-paper p-3 sm:p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold"><Keyboard size={16} aria-hidden="true" /> {text("Keyboard position")}</div>
                    <span className="text-xs text-ink-faint">{expectedKey?.alt ? text("Hold AltGr") : expectedKey?.shift ? text("Hold Shift") : text("Base key")}</span>
                  </div>
                  <VirtualKeyboard pressedKey={null} expectedKey={expectedKey} />
                </div>
              )}
            </div>
            <HandFingerGuide activeGuide={activeFinger} />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-paper px-5 py-4 sm:px-7">
          <Button variant="ghost" size="sm" onClick={resetStep} disabled={!isCurrentTyping}>
            <RotateCcw size={14} aria-hidden="true" />
            {text("Reset Step")}
          </Button>
          <div className="flex items-center gap-3">
            {((isCurrentTyping && stepDone) || (!isCurrentTyping && !stepDone)) && (
              <span className="hidden text-xs text-ink-faint sm:inline">{text("Enter → Next")}</span>
            )}
            {isCurrentTyping && stepDone && <span className="flex items-center gap-1 text-xs font-medium text-success-600"><CheckCircle2 size={14} />{text("Step complete")}</span>}
            {!isCurrentTyping && !stepDone && <Button size="sm" onClick={advanceStep}>{text("I understand")} <CheckCircle2 size={14} aria-hidden="true" /></Button>}
            {stepDone && <Button size="sm" onClick={advanceStep}>{text(stepIndex === steps.length - 1 ? "Complete Lesson" : "Next Step")} <ArrowRight className="directional-icon" size={14} aria-hidden="true" /></Button>}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-paper p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="numeric mt-1 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}
