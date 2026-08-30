import { getFeedback } from "@/features/results/core/feedback";
import { isNewPersonalBest } from "@/features/results/core/personalBest";
import type { SessionResult } from "@/features/results/types";
import type { TypingMistake } from "@/features/typing/types";

/** Clamps a metric to a finite, non-negative number — never lets a NaN/Infinity input reach the result object. */
function safeNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

/**
 * Assembles a `SessionResult` from the raw pieces the Typing engine,
 * Statistics engine, and Progress Service each already produce.
 * Formatting-agnostic — every numeric field is a plain number (no
 * rounding beyond what its source already did, no unit strings), so
 * the Results screen decides how to display it, not this function.
 *
 * Deliberately takes `previousBestAccuracy`/`previousBestWpm` as
 * inputs rather than reading them itself — the caller must snapshot
 * those BEFORE recording the new attempt (e.g. before calling
 * `completeLesson`), or a personal best would always compare against
 * itself and never register as new.
 *
 * `trackPersonalBest` (default `true`) lets a caller opt a session
 * out of personal-best detection entirely — a standalone Practice
 * session has no lesson record to compare against, so
 * `isNewPersonalBest`'s "no previous best yet" rule would otherwise
 * always read as a best the moment `wpm > 0`, which is misleading
 * outside a real lesson (see Practice.tsx).
 */
export function buildSessionResult(params: {
  lessonId: string | null;
  lessonName: string | null;
  targetText: string;
  accuracy: number;
  sessionAccuracy: number;
  wpm: number;
  elapsedMs: number;
  correctCharacters: number;
  incorrectCharacters: number;
  totalCharacters: number;
  mistakes: TypingMistake[];
  previousBestAccuracy: number | null;
  previousBestWpm: number | null;
  trackPersonalBest?: boolean;
  /** See `SessionResult.retryPath`. Omitted for lesson sessions, which already get a real `retryTo` from `getResultNavigationTargets`. */
  retryPath?: string;
}): SessionResult {
  const accuracy = safeNumber(params.accuracy);
  const sessionAccuracy = safeNumber(params.sessionAccuracy);
  const wpm = safeNumber(params.wpm);
  const trackPersonalBest = params.trackPersonalBest ?? true;

  const isPersonalBest =
    trackPersonalBest &&
    isNewPersonalBest({
      wpm,
      accuracy,
      previousBestWpm: params.previousBestWpm,
      previousBestAccuracy: params.previousBestAccuracy,
    });

  return {
    lessonId: params.lessonId,
    lessonName: params.lessonName,
    targetText: params.targetText,
    retryPath: params.retryPath,
    accuracy,
    sessionAccuracy,
    wpm,
    elapsedMs: safeNumber(params.elapsedMs),
    correctCharacters: safeNumber(params.correctCharacters),
    incorrectCharacters: safeNumber(params.incorrectCharacters),
    totalCharacters: safeNumber(params.totalCharacters),
    mistakes: params.mistakes,
    isPersonalBest,
    previousBestAccuracy: params.previousBestAccuracy,
    previousBestWpm: params.previousBestWpm,
    feedback: getFeedback({ accuracy, wpm, isPersonalBest }),
    status: "completed",
    completedAt: new Date().toISOString(),
  };
}
