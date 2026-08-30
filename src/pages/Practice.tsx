import { useEffect, useRef, useState } from "react";
import { ArrowRight, BarChart3, CheckCircle2, RotateCcw } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { useSEO } from "@/hooks/useSEO";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/i18n/useLanguage";
import { useSettings } from "@/features/settings";
import { useTypingSession, TypingWorkspace } from "@/features/typing";
import { buildCategoryPassage, buildPracticePassage } from "@/features/typing/data/urduPracticeWords";
import { buildSessionResult, useSessionResult } from "@/features/results";
import { WordMarquee } from "@/components/WordMarquee";

const practiceExercises = [
  ...Array.from({ length: 5 }, (_, index) => ({
    id: `word-level-${index + 1}`,
    label: `Level ${index + 1}`,
    target: buildPracticePassage(32, index + 1, (index + 1) * 19),
  })),
  { id: "islamic-mix", label: "Islamic Words", target: buildCategoryPassage("islamic", 32, 11) },
];

export default function Practice() {
  const { t } = useLanguage();
  const { showKeyboard } = useSettings();
  const { recordSessionResult } = useSessionResult();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const exercise = practiceExercises[exerciseIndex];
  const completedRef = useRef(false);

  useSEO({ title: "Urdu Typing Practice — Free Online Practice Tool", description: "Practice Urdu typing online with live speed and accuracy feedback." });

  const session = useTypingSession({ targetText: exercise.target, resetKey: `${exercise.id}-${resetCount}` });

  useEffect(() => { completedRef.current = false; }, [exercise.id, resetCount]);

  useEffect(() => {
    if (!session.typing.isComplete || completedRef.current) return;
    completedRef.current = true;
    recordSessionResult(buildSessionResult({
      lessonId: null,
      lessonName: exercise.label,
      targetText: exercise.target,
      accuracy: session.typing.sessionAccuracy,
      sessionAccuracy: session.typing.sessionAccuracy,
      wpm: session.wpm,
      elapsedMs: session.elapsedMs,
      correctCharacters: session.typing.correctCharacters,
      incorrectCharacters: session.typing.incorrectCharacters,
      totalCharacters: session.typing.sessionKeystrokes,
      mistakes: session.typing.mistakes,
      previousBestAccuracy: null,
      previousBestWpm: null,
      trackPersonalBest: false,
    }));
  }, [session.typing.isComplete, session.typing.sessionAccuracy, session.typing.correctCharacters, session.typing.incorrectCharacters, session.typing.sessionKeystrokes, session.typing.mistakes, session.wpm, session.elapsedMs, exercise, recordSessionResult]);

  const next = () => { setExerciseIndex((i) => (i + 1) % practiceExercises.length); setResetCount((n) => n + 1); };
  const previous = () => { setExerciseIndex((i) => (i - 1 + practiceExercises.length) % practiceExercises.length); setResetCount((n) => n + 1); };
  const reset = () => { session.reset(); };

  const status = session.typing.isComplete
    ? t.practice.complete
    : session.typing.currentIndex === 0
      ? t.practice.ready
      : `${session.typing.correctCharacters} ${t.practice.correct}, ${session.typing.incorrectCharacters} ${t.practice.incorrect}`;

  return (
    <PageContainer>
      <PageHeader title={t.practice.title} description={t.practice.description} action={<Button variant="secondary" size="sm" onClick={reset}><RotateCcw size={14} />{t.practice.reset}</Button>} />
      <WordMarquee
        context="practice"
        label={t.practice.marqueeLabel}
        speed="fast"
        className="mb-6"
      />
      <div className="flex flex-wrap gap-2 pb-6" role="group" aria-label={t.practice.exerciseSelector}>
        {practiceExercises.map((item, index) => (
          <button key={item.id} type="button" aria-pressed={index === exerciseIndex} onClick={() => { setExerciseIndex(index); setResetCount((n) => n + 1); }} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", index === exerciseIndex ? "border-brand-500 bg-brand-50 text-brand-700" : "border-border text-ink-soft hover:border-border-strong")}>
            {item.label}
          </button>
        ))}
      </div>

      <TypingWorkspace
        session={session}
        showKeyboard={showKeyboard}
        statusSummary={status}
        showReset={false}
        keyboardTitle={t.practice.keyboard}
        footer={session.typing.isComplete ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={previous}>{t.practice.previous} <ArrowRight className="rotate-180" size={13} /></Button>
            <Button size="sm" onClick={next}>{t.practice.next} <ArrowRight size={13} /></Button>
            <Button variant="secondary" size="sm" to="/results"><BarChart3 size={13} />{t.practice.results}</Button>
          </div>
        ) : undefined}
      />
      {session.typing.isComplete && <p className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-success-600"><CheckCircle2 size={16} />{t.practice.complete}</p>}
    </PageContainer>
  );
}
