import { getAllLessonsInOrder, getLessonById } from "@/features/lessons/services/lessonCatalog";
import type { Lesson } from "@/features/lessons/types";
import {
  deleteProfileProgress,
  getProfileProgress as readProfileProgress,
  MAX_RECENT_ATTEMPTS,
  saveProfileProgress,
} from "@/features/progress/services/progressStorage";
import {
  calculateCourseProgress,
  calculateLevelProgress,
  getCompletedLessonCount,
  getLessonDisplayStatus,
  getNextAvailableLesson as calculateNextAvailableLesson,
  getOverallBestPerformance as calculateOverallBestPerformance,
} from "@/features/progress/core/progressCalculations";
import type { AttemptRecord, LessonProgress, LessonProgressStatus, ProfileProgress } from "@/features/progress/types";

/**
 * The Progress Service — the only module that talks to
 * `progressStorage` directly. Everything else (the `useProgress`
 * hook, and through it every page/component) goes through the
 * functions here, matching the same shape Part 4's `profileStorage`
 * established. This is also where lesson-catalog lookups and the
 * pure calculators (`core/progressCalculations`) get combined with
 * stored data — neither of those layers knows about the other.
 */

export { getProfileProgress } from "@/features/progress/services/progressStorage";
export { deleteProfileProgress };

/** This profile's status for one lesson — locked / available / inProgress / completed. */
export function getLessonStatus(profileId: string, lesson: Lesson): LessonProgressStatus {
  const progress = readProfileProgress(profileId);
  return getLessonDisplayStatus(lesson, progress, getAllLessonsInOrder());
}

/** This profile's stored progress for one lesson, or `undefined` if never started. */
export function getLessonProgressEntry(profileId: string, lessonId: string): LessonProgress | undefined {
  return readProfileProgress(profileId).lessonProgress[lessonId];
}

/**
 * Marks a lesson as started (idle/available → inProgress) the first
 * time a learner produces input in it. A no-op if the lesson is
 * already completed (completion never regresses to in-progress) or
 * already marked in-progress, so this is safe to call once per
 * session start without spamming localStorage writes.
 */
export function startLessonAttempt(profileId: string, lessonId: string): ProfileProgress {
  const progress = readProfileProgress(profileId);
  const existing = progress.lessonProgress[lessonId];
  if (existing?.status === "completed" || existing?.status === "inProgress") {
    return progress;
  }

  const now = new Date().toISOString();
  const entry: LessonProgress = existing ?? {
    lessonId,
    status: "inProgress",
    attempts: 0,
    bestAccuracy: null,
    bestWpm: null,
    lastAccuracy: null,
    lastWpm: null,
    completedAt: null,
    updatedAt: now,
  };

  const next: ProfileProgress = {
    ...progress,
    lessonProgress: { ...progress.lessonProgress, [lessonId]: { ...entry, status: "inProgress", updatedAt: now } },
    lastActivityAt: now,
  };
  saveProfileProgress(profileId, next);
  return next;
}

export interface CompleteLessonStats {
  /** Omit for a lesson with no typing metric (e.g. a reading-only introduction lesson) — the lesson still completes, but no fake accuracy/WPM is recorded. */
  accuracy?: number;
  wpm?: number;
}

/**
 * Records a successful completion: increments attempts, updates
 * last/best accuracy and WPM (a worse attempt never overwrites a
 * better personal best — Part 9 §7), appends a capped attempt
 * record, marks the lesson completed, and advances
 * `currentLessonId` to the next available lesson. This is the only
 * function that should be called when the Typing Engine reports
 * `isComplete`.
 */
export function completeLesson(
  profileId: string,
  lessonId: string,
  stats: CompleteLessonStats = {},
): ProfileProgress {
  const progress = readProfileProgress(profileId);
  const existing = progress.lessonProgress[lessonId];
  const now = new Date().toISOString();

  const hasStats = typeof stats.accuracy === "number" && typeof stats.wpm === "number";

  const nextRecentAttempts: AttemptRecord[] | undefined = hasStats
    ? [
        ...(existing?.recentAttempts ?? []),
        { accuracy: stats.accuracy as number, wpm: stats.wpm as number, completedAt: now },
      ].slice(-MAX_RECENT_ATTEMPTS)
    : existing?.recentAttempts;

  const entry: LessonProgress = {
    lessonId,
    status: "completed",
    attempts: (existing?.attempts ?? 0) + 1,
    bestAccuracy: hasStats
      ? Math.max(existing?.bestAccuracy ?? -Infinity, stats.accuracy as number)
      : (existing?.bestAccuracy ?? null),
    bestWpm: hasStats ? Math.max(existing?.bestWpm ?? -Infinity, stats.wpm as number) : (existing?.bestWpm ?? null),
    lastAccuracy: hasStats ? (stats.accuracy as number) : (existing?.lastAccuracy ?? null),
    lastWpm: hasStats ? (stats.wpm as number) : (existing?.lastWpm ?? null),
    completedAt: existing?.completedAt ?? now,
    updatedAt: now,
    ...(nextRecentAttempts ? { recentAttempts: nextRecentAttempts } : {}),
  };

  const completedLessonIds = progress.completedLessonIds.includes(lessonId)
    ? progress.completedLessonIds
    : [...progress.completedLessonIds, lessonId];

  const allLessonsInOrder = getAllLessonsInOrder();
  const nextProgress: ProfileProgress = {
    ...progress,
    completedLessonIds,
    lessonProgress: { ...progress.lessonProgress, [lessonId]: entry },
    lastActivityAt: now,
  };
  nextProgress.currentLessonId = calculateNextAvailableLesson(nextProgress, allLessonsInOrder)?.id ?? null;

  saveProfileProgress(profileId, nextProgress);
  return nextProgress;
}

/** Completed / total / percent across the whole course, computed from the real catalog (never hard-coded). */
export function getCourseProgressSummary(profileId: string): { completed: number; total: number; percent: number } {
  const progress = readProfileProgress(profileId);
  const total = getAllLessonsInOrder().length;
  const completed = getCompletedLessonCount(progress);
  return { completed, total, percent: calculateCourseProgress(completed, total) };
}

/** Completed / total / percent within one level. */
export function getLevelProgressSummary(
  profileId: string,
  levelLessons: Lesson[],
): { completed: number; total: number; percent: number } {
  const progress = readProfileProgress(profileId);
  const completedLessonIds = new Set(progress.completedLessonIds);
  const completed = levelLessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
  return { completed, total: levelLessons.length, percent: calculateLevelProgress(levelLessons, completedLessonIds) };
}

/**
 * The learner's current/next lesson. Resolves the stored pointer
 * against the live catalog rather than trusting it blindly, so a
 * lesson that was removed from the catalog after being stored can't
 * strand the learner — falls back to recalculating from scratch.
 */
export function getCurrentLesson(profileId: string): Lesson | null {
  const progress = readProfileProgress(profileId);
  const allLessonsInOrder = getAllLessonsInOrder();

  if (progress.currentLessonId) {
    const stored = getLessonById(progress.currentLessonId);
    if (stored && getLessonDisplayStatus(stored, progress, allLessonsInOrder) !== "completed") {
      return stored;
    }
  }
  return calculateNextAvailableLesson(progress, allLessonsInOrder);
}

/** Best WPM / accuracy this profile has ever recorded, across every lesson. `null` when nothing has been completed with a metric yet. */
export function getOverallBestPerformance(profileId: string): { bestWpm: number | null; bestAccuracy: number | null } {
  return calculateOverallBestPerformance(readProfileProgress(profileId));
}
