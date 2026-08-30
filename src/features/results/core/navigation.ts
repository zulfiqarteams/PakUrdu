import { getNextLesson } from "@/features/lessons/services/lessonCatalog";

/** Where the Results screen's "Try Again" / "Continue" actions should point. */
export interface ResultNavigationTargets {
  /** Restarts the same exercise: the lesson page, or `/practice` for a standalone session. */
  retryTo: string;
  /** Route to the next available lesson, or `null` when there's nothing meaningful to continue to (a standalone Practice session, or the final lesson in the course) — the Results screen hides the "Continue" action in that case rather than showing a dead-end link. */
  continueTo: string | null;
  /** Label for `continueTo`; `null` exactly when `continueTo` is `null`. */
  continueLabel: string | null;
}

/**
 * Pure derivation of the Results screen's "Try Again"/"Continue"
 * targets from just the completed session's lesson id — no React,
 * no progress-store reads, so it can't drift from what `getNextLesson`
 * (the Part 6 catalog's own ordering) already decides, and it's
 * trivially unit-testable.
 *
 * "Back to Learning" isn't derived here — it's always the static
 * `/learn` route, so the Results screen renders it directly rather
 * than routing a constant through this helper.
 */
export function getResultNavigationTargets(lessonId: string | null): ResultNavigationTargets {
  if (!lessonId) {
    return { retryTo: "/practice", continueTo: null, continueLabel: null };
  }

  const retryTo = `/lesson/${lessonId}`;
  const next = getNextLesson(lessonId);

  if (!next) {
    return { retryTo, continueTo: null, continueLabel: null };
  }

  return { retryTo, continueTo: `/lesson/${next.id}`, continueLabel: "Next Lesson" };
}
