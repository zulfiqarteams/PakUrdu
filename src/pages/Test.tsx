import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, CheckCircle2, RotateCcw, Timer as TimerIcon } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/cn";
import { useTypingSession, TypingWorkspace } from "@/features/typing";
import { buildWordPassage } from "@/features/typing/data/commonUrduWords";
import { buildIslamicTypingPassage } from "@/features/typing/data/islamicTypingWords";

import { formatTime } from "@/features/statistics";
import { buildSessionResult, useSessionResult } from "@/features/results";
import { useSettings } from "@/features/settings";
import { playResultNeutral, playResultSuccess } from "@/features/keyboard/utils/keyboardSounds";

const durationOptions = [
  { id: "60", label: "1 minute", seconds: 60 },
  { id: "180", label: "3 minutes", seconds: 180 },
  { id: "300", label: "5 minutes", seconds: 300 },
  { id: "custom", label: "Custom", seconds: null },
] as const;

type Phase = "setup" | "running" | "complete";
type TestCorpus = "general" | "islamic";

export default function Test() {
  useSEO({
    title: "Online Urdu Typing Test — Check Your Speed & Accuracy Free",
    description:
      "Take a free online Urdu typing test. Choose 1, 3, or 5-minute timed tests, measure your words-per-minute (WPM) and accuracy, and track your Urdu typing speed over time.",
  });

  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedDuration, setSelectedDuration] = useState<string>("60");
  const [testCorpus, setTestCorpus] = useState<TestCorpus>("general");
  const [customMinutes, setCustomMinutes] = useState(2);
  const [testKey, setTestKey] = useState(0);

  const { recordSessionResult } = useSessionResult();
  const { showKeyboard, soundEnabled } = useSettings();
  const hasRecordedCompletionRef = useRef(false);

  const durationSeconds =
    selectedDuration === "custom"
      ? Math.min(Math.max(customMinutes, 1), 30) * 60
      : Number(selectedDuration);
  const durationMs = durationSeconds * 1000;

  // Only rebuilt when a test actually starts (testKey changes), so the
  // passage doesn't shuffle under the learner mid-test.
  const targetText = useMemo(
    () =>
      testCorpus === "islamic"
        ? buildIslamicTypingPassage(durationSeconds)
        : buildWordPassage(durationSeconds),
    [testKey],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  const session = useTypingSession({
    targetText,
    resetKey: testKey,
    durationMs,
    isLocked: phase !== "running",
  });
  const typing = session.typing;
  const timer = session.timer;
  const testHasEnded = session.ended;
  const wpm = session.wpm;
  const remainingMs = session.remainingMs;

  useEffect(() => {
    hasRecordedCompletionRef.current = false;
  }, [testKey]);

  // Record the session and move to the "complete" screen exactly once,
  // whichever condition (full passage typed, or time ran out) got
  // there first. A timed test that runs out of time is still a
  // normally-completed session — see SessionResultStatus's doc note.
  useEffect(() => {
    if (phase === "running" && testHasEnded && !hasRecordedCompletionRef.current) {
      hasRecordedCompletionRef.current = true;
      recordSessionResult(
        buildSessionResult({
          lessonId: null,
          lessonName: testCorpus === "islamic" ? "Islamic Names & Honorifics" : "Typing Test",
          targetText,
          accuracy: typing.sessionAccuracy,
          sessionAccuracy: typing.sessionAccuracy,
          wpm,
          elapsedMs: Math.min(timer.elapsedMs, durationMs),
          correctCharacters: typing.correctCharacters,
          incorrectCharacters: typing.incorrectCharacters,
          // The attempted amount, not the full (possibly longer than
          // needed) generated passage — matches correct+incorrect so
          // the Results screen's "Characters" stat reflects what was
          // actually typed during the test, not what was generated.
          totalCharacters: typing.sessionKeystrokes,
          mistakes: typing.mistakes,
          previousBestAccuracy: null,
          previousBestWpm: null,
          trackPersonalBest: false,
          retryPath: "/test",
        }),
      );
      if (soundEnabled) {
        if (typing.accuracy >= 90 || typing.sessionAccuracy >= 90) playResultSuccess();
        else playResultNeutral();
      }
      setPhase("complete");
    }
  }, [
    phase,
    testHasEnded,
    targetText,
    typing.accuracy,
    typing.sessionAccuracy,
    typing.correctCharacters,
    typing.incorrectCharacters,
    typing.currentIndex,
    typing.mistakes,
    wpm,
    timer.elapsedMs,
    durationMs,
    recordSessionResult,
    testCorpus,
    soundEnabled,
  ]);

  function handleStart() {
    setTestKey((key) => key + 1);
    setPhase("running");
  }

  function handleNewTest() {
    setPhase("setup");
  }


  const statusSummary = useMemo(() => {
    if (testHasEnded) return "Test complete.";
    if (typing.currentIndex === 0) return "Ready. Start typing to begin the test.";
    return `${typing.correctCharacters} correct, ${typing.incorrectCharacters} incorrect, out of ${typing.currentIndex} typed so far.`;
  }, [testHasEnded, typing.currentIndex, typing.correctCharacters, typing.incorrectCharacters]);

  if (phase === "setup") {
    return (
      <PageContainer>
        <PageHeader
          title="Typing Test"
          description="Measure your Urdu typing speed and accuracy under a timed test."
        />

        <div className="mx-auto max-w-xl py-10">
          <Card>
            <h2 className="text-base font-semibold">Choose your practice</h2>
            <p className="mt-1 text-sm text-ink-soft">
              General Urdu for everyday fluency, or a focused Islamic-name practice set for real-world religious writing.
            </p>

            <div
              role="radiogroup"
              aria-label="Typing test content"
              className="mt-5 grid gap-3 sm:grid-cols-2"
            >
              {[
                { id: "general" as const, title: "General Urdu", description: "Common words and everyday Urdu." },
                { id: "islamic" as const, title: "Islamic Names & Honorifics", description: "Prophets, Sahaba, Ahl al-Bayt, Awliya, scriptures and respectful forms." },
              ].map((option) => {
                const isSelected = testCorpus === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setTestCorpus(option.id)}
                    className={cn(
                      "rounded-sm border px-4 py-3 text-start transition-colors",
                      isSelected
                        ? "border-brand-500 bg-brand-50"
                        : "border-border hover:border-border-strong",
                    )}
                  >
                    <span className="block text-sm font-semibold text-ink">{option.title}</span>
                    <span className="mt-1 block text-xs text-ink-soft">{option.description}</span>
                  </button>
                );
              })}
            </div>

            <h2 className="mt-7 text-base font-semibold">Choose a duration</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Select how long you'd like your test to run.
            </p>

            <div
              role="radiogroup"
              aria-label="Test duration"
              className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {durationOptions.map((option) => {
                const isSelected = selectedDuration === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedDuration(option.id)}
                    className={cn(
                      "rounded-sm border px-3 py-2.5 text-sm font-medium transition-colors",
                      isSelected
                        ? "border-brand-500 bg-brand-50 font-semibold text-brand-700"
                        : "border-border text-ink-soft hover:border-border-strong hover:text-ink",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {selectedDuration === "custom" && (
              <label className="mt-4 flex items-center gap-3 text-sm text-ink-soft">
                Minutes
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={customMinutes}
                  onChange={(event) => setCustomMinutes(Number(event.target.value) || 1)}
                  className="w-20 rounded-sm border border-border px-2 py-1.5 text-sm text-ink"
                />
              </label>
            )}

            <div className="mt-6 flex items-center gap-3">
              <Button variant="primary" size="md" onClick={handleStart}>
                Start Test
              </Button>
              <span className="text-xs text-ink-faint">
                {durationSeconds / 60} minute{durationSeconds !== 60 ? "s" : ""}, unlimited text.
              </span>
            </div>
          </Card>
        </div>
      </PageContainer>
    );
  }

  if (phase === "complete") {
    return (
      <PageContainer>
        <PageHeader
          title="Typing Test"
          description="Your test is complete."
        />

        <div className="mx-auto max-w-xl py-10">
          <Card className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 size={28} className="text-success-600" aria-hidden="true" />
            <div>
              <p className="text-lg font-semibold text-ink">Test complete</p>
              <p className="mt-1 text-sm text-ink-soft">
                {Math.round(wpm)} WPM · {typing.accuracy}% accuracy
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="primary" size="md" to="/results">
                <BarChart3 size={14} aria-hidden="true" />
                View Full Results
              </Button>
              <Button variant="secondary" size="md" onClick={handleNewTest}>
                <RotateCcw size={14} aria-hidden="true" />
                New Test
              </Button>
            </div>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Typing Test"
        description="Type the passage below until the timer runs out."
        action={
          <div className="flex items-center gap-2 rounded-sm border border-border px-3 py-1.5 text-sm font-semibold text-ink">
            <TimerIcon size={14} aria-hidden="true" className="text-brand-500" />
            {formatTime(remainingMs)}
          </div>
        }
      />

      <div className="py-10">
        <TypingWorkspace
          session={session}
          showKeyboard={showKeyboard}
          keyboardTitle="On-screen keyboard"
          statusSummary={statusSummary}
          footer={testHasEnded ? (
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="secondary" onClick={handleNewTest}><RotateCcw size={14} /> New Test</Button>
              <Button variant="primary" to="/results"><BarChart3 size={14} /> View Full Results</Button>
            </div>
          ) : undefined}
        />
      </div>
    </PageContainer>
  );
}
