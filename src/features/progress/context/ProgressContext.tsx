import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useProfiles } from "@/features/profiles";
import { getAllLessonsInOrder } from "@/features/lessons/services/lessonCatalog";
import type { Lesson } from "@/features/lessons/types";
import * as progressService from "@/features/progress/services/progressService";
import { emptyProfileProgress } from "@/features/progress/services/progressStorage";
import {
  calculateCourseProgress,
  getCompletedLessonCount,
  getLessonDisplayStatus,
  getNextAvailableLesson,
  getOverallBestPerformance,
} from "@/features/progress/core/progressCalculations";
import type { CompleteLessonStats } from "@/features/progress/services/progressService";
import type { LessonProgressStatus, ProfileProgress } from "@/features/progress/types";

interface ProgressContextValue {
  /** The active profile's progress, or `null` when no profile is active. */
  progress: ProfileProgress | null;
  /** The active profile's current/next lesson to work on, or `null` (no profile, or the whole catalog is done). */
  currentLesson: Lesson | null;
  /** 0–100. `0` when there's no active profile or the catalog is empty. */
  coursePercentage: number;
  completedLessonCount: number;
  totalLessonCount: number;
  bestWpm: number | null;
  bestAccuracy: number | null;
  /** Reads status from the currently-loaded `progress` snapshot — does not hit storage. */
  getLessonStatus: (lesson: Lesson) => LessonProgressStatus;
  /** Marks a lesson as started. Safe to call on every render/keystroke transition — it's a no-op once already in-progress or completed. */
  startLessonAttempt: (lessonId: string) => void;
  /** Records a completed attempt and refreshes the active profile's progress. */
  completeLesson: (lessonId: string, stats?: CompleteLessonStats) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

/**
 * Owns progress state for whichever profile is currently active.
 * Wraps `progressService` (the only module that touches
 * localStorage) and re-reads whenever the active profile changes —
 * switching profiles drops the old profile's progress from the UI
 * immediately and loads the new one's (Part 9 §13).
 *
 * Must be mounted inside `ProfileProvider`.
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const { activeProfile } = useProfiles();
  const activeProfileId = activeProfile?.id ?? null;

  const [progress, setProgress] = useState<ProfileProgress | null>(() =>
    activeProfileId ? progressService.getProfileProgress(activeProfileId) : null,
  );

  // Active profile changed (switched, or logged out entirely) —
  // load that profile's own progress, never carry over the last one.
  useEffect(() => {
    setProgress(activeProfileId ? progressService.getProfileProgress(activeProfileId) : null);
  }, [activeProfileId]);

  const startLessonAttempt = useCallback(
    (lessonId: string) => {
      if (!activeProfileId) return;
      setProgress(progressService.startLessonAttempt(activeProfileId, lessonId));
    },
    [activeProfileId],
  );

  const completeLesson = useCallback(
    (lessonId: string, stats?: CompleteLessonStats) => {
      if (!activeProfileId) return;
      setProgress(progressService.completeLesson(activeProfileId, lessonId, stats));
    },
    [activeProfileId],
  );

  const allLessonsInOrder = useMemo(() => getAllLessonsInOrder(), []);

  const getLessonStatus = useCallback(
    (lesson: Lesson): LessonProgressStatus => {
      // Root cause of "every lesson shows locked": this used to return a
      // hard-coded "locked" whenever `progress` hadn't loaded yet (e.g.
      // briefly on first render, or for any caller invoked before the
      // active profile settles). That overrode `isLessonUnlocked`'s own
      // "the first lesson is always unlocked" rule for every lesson at
      // once. Falling back to a fresh empty progress record instead lets
      // the real position-based unlock rule run, exactly as it does once
      // `progress` has loaded — only lessons that are genuinely locked
      // (their predecessor isn't completed) report "locked".
      return getLessonDisplayStatus(lesson, progress ?? emptyProfileProgress(""), allLessonsInOrder);
    },
    [progress, allLessonsInOrder],
  );

  const currentLesson = useMemo(
    () => (progress ? getNextAvailableLesson(progress, allLessonsInOrder) : null),
    [progress, allLessonsInOrder],
  );

  const completedLessonCount = progress ? getCompletedLessonCount(progress) : 0;
  const totalLessonCount = allLessonsInOrder.length;
  const coursePercentage = calculateCourseProgress(completedLessonCount, totalLessonCount);
  const { bestWpm, bestAccuracy } = progress
    ? getOverallBestPerformance(progress)
    : { bestWpm: null, bestAccuracy: null };

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      currentLesson,
      coursePercentage,
      completedLessonCount,
      totalLessonCount,
      bestWpm,
      bestAccuracy,
      getLessonStatus,
      startLessonAttempt,
      completeLesson,
    }),
    [
      progress,
      currentLesson,
      coursePercentage,
      completedLessonCount,
      totalLessonCount,
      bestWpm,
      bestAccuracy,
      getLessonStatus,
      startLessonAttempt,
      completeLesson,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
