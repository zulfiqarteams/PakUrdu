/**
 * Local, per-profile learning progress.
 *
 * Nothing here is ever sent to a server — progress is persisted
 * entirely through `progressStorage` into this browser's
 * localStorage, namespaced by profile id (see Part 4's `Profile`).
 * There is no account system, no sync, no analytics.
 */

/** Visual/logical state of a single lesson for a given profile. */
export type LessonProgressStatus = "locked" | "available" | "inProgress" | "completed";

/** One completed-or-attempted session, kept for the lightweight "recent attempts" list. */
export interface AttemptRecord {
  accuracy: number;
  wpm: number;
  completedAt: string;
}

/**
 * A single lesson's progress for one profile. Only created the
 * first time a learner starts or completes that lesson — there is
 * no entry for lessons never touched, so storage grows with actual
 * usage rather than with the size of the whole catalog.
 */
export interface LessonProgress {
  lessonId: string;
  status: LessonProgressStatus;
  /** Number of times the exercise has been completed. Starting (without finishing) does not increment this. */
  attempts: number;
  /** Best accuracy ever recorded for this lesson, or `null` if the lesson has no typing metric (e.g. a reading-only lesson) or hasn't been completed yet. Higher is better; a worse attempt never overwrites this. */
  bestAccuracy: number | null;
  /** Best WPM ever recorded for this lesson, or `null` for the same reasons as `bestAccuracy`. Higher is better. */
  bestWpm: number | null;
  /** Accuracy from the most recent completed attempt. Always overwritten, regardless of whether it beat the best. */
  lastAccuracy: number | null;
  /** WPM from the most recent completed attempt. Always overwritten. */
  lastWpm: number | null;
  /** ISO 8601 timestamp of first completion, or `null` if not yet completed. */
  completedAt: string | null;
  /** ISO 8601 timestamp of the last write to this record (start or completion). */
  updatedAt: string;
  /** Most recent attempts, newest last, capped at 20 — see `MAX_RECENT_ATTEMPTS`. Omitted entirely for lessons with no attempts yet. */
  recentAttempts?: AttemptRecord[];
}

/** One profile's full progress through the course. */
export interface ProfileProgress {
  profileId: string;
  /** Lesson ids that have been completed at least once, in no particular order — use the catalog for display order. */
  completedLessonIds: string[];
  /** Keyed by lesson id. Only contains entries for lessons that have been started or completed. */
  lessonProgress: Record<string, LessonProgress>;
  /** The learner's current/next lesson to work on, or `null` if the whole catalog is completed (or empty). */
  currentLessonId: string | null;
  /** ISO 8601 timestamp of the most recent progress write, or `null` for a brand-new profile. */
  lastActivityAt: string | null;
}

/**
 * On-disk shape written to localStorage. Versioned so a future part
 * can migrate the data model without losing progress that already
 * exists in someone's browser — mirrors `ProfileStoreV1` from Part 4.
 */
export interface ProgressStoreV1 {
  version: 1;
  /** Keyed by profile id. */
  progress: Record<string, ProfileProgress>;
}
