import type { Lesson } from "@/features/lessons/types";
import { getLessonPosition } from "@/features/lessons/services/lessonCatalog";

/** What the Home dashboard's primary CTA should say and where it should go. */
export interface ContinueLearningCta {
  to: string;
  label: string;
  /** True once there is no unlocked-but-incomplete lesson left — the whole available curriculum is done. */
  isCourseComplete: boolean;
}

/**
 * Derives the Home dashboard's "Continue Learning" button from data
 * the Progress Service already computed (`currentLesson`,
 * `completedLessonCount`) — this never recalculates unlocking or
 * completion itself; that stays owned by `progressCalculations.ts`
 * (Part 9). Pure and React-free so it's directly unit-testable.
 *
 * `currentLesson` is `null` in exactly one situation:
 * `getNextAvailableLesson` found no unlocked-and-incomplete lesson,
 * which — because unlocking is sequential — only happens once every
 * available lesson is completed. A brand-new profile still resolves
 * to the first lesson, not `null`, so there's no separate "no
 * profile" case to disambiguate here.
 *
 * Never hard-codes a lesson id or number: the "Continue Lesson N"
 * label reads its position from the same catalog ordering
 * `getNextAvailableLesson` walked to find the lesson in the first
 * place (`getLessonPosition`).
 */
export function getContinueLearningCta(params: {
  currentLesson: Lesson | null;
  completedLessonCount: number;
}): ContinueLearningCta {
  const { currentLesson, completedLessonCount } = params;

  if (!currentLesson) {
    return { to: "/learn", label: "View Learning Path", isCourseComplete: true };
  }

  if (completedLessonCount === 0) {
    return { to: `/lesson/${currentLesson.id}`, label: "Start Learning", isCourseComplete: false };
  }

  const position = getLessonPosition(currentLesson.id);
  const label = position ? `Continue Lesson ${position}` : `Continue: ${currentLesson.title}`;
  return { to: `/lesson/${currentLesson.id}`, label, isCourseComplete: false };
}
