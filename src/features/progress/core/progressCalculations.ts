import type { Lesson } from "@/features/lessons/types";
import type { LessonProgress, LessonProgressStatus, ProfileProgress } from "@/features/progress/types";

/**
 * All functions here are pure: lesson list / progress data in, a
 * plain value out. No React, no storage — safe to unit test
 * directly, and the single place each of these numbers is computed
 * (pages must not recompute them inline).
 */

/**
 * 0–100 completion percentage for one lesson. Since this app only
 * records a lightweight attempt on completion (not per-keystroke
 * progress), a lesson is either fully done or not — this exists
 * mainly so callers have one pure function to ask rather than
 * inlining `status === "completed" ? 100 : 0` themselves.
 */
export function calculateLessonProgress(lessonProgress: LessonProgress | undefined): number {
  return lessonProgress?.status === "completed" ? 100 : 0;
}

/**
 * completedLessons / totalLessons * 100, rounded. Returns exactly
 * `0` (never `NaN`/`Infinity`) when the catalog is empty — matches
 * the Part 8 convention of never displaying an invalid number.
 */
export function calculateCourseProgress(completedLessons: number, totalLessons: number): number {
  if (totalLessons <= 0) return 0;
  const percent = (completedLessons / totalLessons) * 100;
  return Number.isFinite(percent) ? Math.round(percent) : 0;
}

/** Same formula as `calculateCourseProgress`, scoped to one level's lessons. */
export function calculateLevelProgress(levelLessons: Lesson[], completedLessonIds: ReadonlySet<string>): number {
  if (levelLessons.length === 0) return 0;
  const completedInLevel = levelLessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
  return calculateCourseProgress(completedInLevel, levelLessons.length);
}

/** Count of lessons this profile has completed. Reads straight off `completedLessonIds` — the single source of truth for "is this lesson done". */
export function getCompletedLessonCount(progress: ProfileProgress): number {
  return progress.completedLessonIds.length;
}

/**
 * Whether a lesson is unlocked, purely from its position in the
 * catalog and what's been completed so far — the sequential
 * unlocking rule from Part 9 §5: the first lesson in the whole
 * course is always unlocked, and every other lesson unlocks once the
 * lesson immediately before it (in course order) is completed.
 */
export function isLessonUnlocked(
  lesson: Lesson,
  allLessonsInOrder: readonly Lesson[],
  completedLessonIds: ReadonlySet<string>,
): boolean {
  const index = allLessonsInOrder.findIndex((entry) => entry.id === lesson.id);
  if (index <= 0) return true; // first lesson, or not found (fail open rather than soft-locking unknown content)
  const previous = allLessonsInOrder[index - 1];
  return completedLessonIds.has(previous.id);
}

/**
 * The display status a `LessonCard` should show for one lesson:
 * completed > in-progress (started, not finished) > available
 * (unlocked, never started) > locked (previous lesson not done yet).
 */
export function getLessonDisplayStatus(
  lesson: Lesson,
  progress: ProfileProgress,
  allLessonsInOrder: readonly Lesson[],
): LessonProgressStatus {
  const entry = progress.lessonProgress[lesson.id];
  if (entry?.status === "completed") return "completed";
  if (entry?.status === "inProgress") return "inProgress";

  const completedLessonIds = new Set(progress.completedLessonIds);
  return isLessonUnlocked(lesson, allLessonsInOrder, completedLessonIds) ? "available" : "locked";
}

/**
 * The learner's current/next lesson: the first lesson in course
 * order that isn't completed yet (and is actually unlocked). `null`
 * when every lesson is completed, or the catalog is empty.
 */
export function getNextAvailableLesson(
  progress: ProfileProgress,
  allLessonsInOrder: readonly Lesson[],
): Lesson | null {
  const completedLessonIds = new Set(progress.completedLessonIds);
  for (const lesson of allLessonsInOrder) {
    if (completedLessonIds.has(lesson.id)) continue;
    if (isLessonUnlocked(lesson, allLessonsInOrder, completedLessonIds)) return lesson;
    break; // catalog order means nothing later can be unlocked either
  }
  return null;
}

/**
 * The best WPM / accuracy across every lesson this profile has
 * attempted, for the Progress page's "Performance" section.
 * `null` for either value when nothing has been recorded yet —
 * never a fabricated placeholder number.
 */
export function getOverallBestPerformance(progress: ProfileProgress): {
  bestWpm: number | null;
  bestAccuracy: number | null;
} {
  let bestWpm: number | null = null;
  let bestAccuracy: number | null = null;

  for (const entry of Object.values(progress.lessonProgress)) {
    if (entry.bestWpm !== null && (bestWpm === null || entry.bestWpm > bestWpm)) {
      bestWpm = entry.bestWpm;
    }
    if (entry.bestAccuracy !== null && (bestAccuracy === null || entry.bestAccuracy > bestAccuracy)) {
      bestAccuracy = entry.bestAccuracy;
    }
  }

  return { bestWpm, bestAccuracy };
}
