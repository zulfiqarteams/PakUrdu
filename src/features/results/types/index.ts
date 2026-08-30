import type { TypingMistake } from "@/features/typing/types";

/** Tone the Results screen can style a feedback message with. */
export type FeedbackTone = "success" | "neutral" | "warning";

/**
 * Completion status of a built `SessionResult`. Only `"completed"`
 * exists today — `buildSessionResult` is only ever called once the
 * Typing Engine reports `isComplete`, so there's no partial/aborted
 * state to represent yet. Kept as its own type (rather than a bare
 * boolean or literal inline) so a future in-progress/abandoned state
 * can be added without changing every call site's shape.
 */
export type SessionResultStatus = "completed";

/** A short, coaching-style message plus how it should be styled. */
export interface Feedback {
  tone: FeedbackTone;
  message: string;
}

/**
 * The full snapshot of one finished typing session — everything the
 * Results screen needs, already computed, so that screen can stay a
 * pure "read fields, render them" component instead of re-deriving
 * anything from the Typing/Statistics engines itself.
 *
 * Built once, at the moment a session completes (see
 * `buildSessionResult`), and handed off through the in-memory
 * `SessionResultContext` — never persisted, never reconstructed from
 * storage.
 */
export interface SessionResult {
  /** `null` for a standalone (non-lesson) Practice-page or Test-page session. */
  lessonId: string | null;
  /** `null` for a standalone Practice-page or Test-page session. */
  lessonName: string | null;
  targetText: string;

  /**
   * Overrides the Results screen's "Try Again" destination for a
   * standalone (non-lesson) session. `null`/`undefined` falls back to
   * `/practice` (`getResultNavigationTargets`'s existing default) —
   * so an omitted value keeps every current Practice-page caller
   * working exactly as before. The Test page sets this to `/test` so
   * "Try Again" restarts a new timed test instead of landing on
   * Practice.
   */
  retryPath?: string;

  /** Final `TypingState.accuracy` — reflects the completed input, always 100 for a graded completion. */
  accuracy: number;
  /** Cumulative keystroke accuracy across the whole session, including corrected mistakes — see `UseTypingEngineResult.sessionAccuracy`. */
  sessionAccuracy: number;
  /** Unrounded, as produced by `calculateWPM` — round only at display time. */
  wpm: number;
  elapsedMs: number;

  correctCharacters: number;
  incorrectCharacters: number;
  totalCharacters: number;

  /** Every wrong keystroke made this session, aggregated. Empty when the session was typed perfectly. */
  mistakes: TypingMistake[];

  /** Whether this attempt beat the learner's previous best `wpm` (or set the first-ever best) for this lesson. Always `false` for a standalone Practice session — there is no lesson record to compare against. */
  isPersonalBest: boolean;
  /** Snapshot taken BEFORE this attempt was recorded, so it never reads as "beaten by itself". `null` if there was no prior completion (or this isn't a lesson session). */
  previousBestAccuracy: number | null;
  previousBestWpm: number | null;

  feedback: Feedback;

  /** Completion status of this session. Always `"completed"` today — see `SessionResultStatus`. */
  status: SessionResultStatus;

  /** ISO 8601 timestamp of when this result was built. */
  completedAt: string;
}
