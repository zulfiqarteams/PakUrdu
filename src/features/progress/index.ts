/**
 * Public surface of the progress feature. Other modules (pages,
 * lesson components, and the profiles feature for deletion cleanup)
 * should import from here rather than reaching into services/ or
 * core/ directly.
 */

// Types
export type {
  AttemptRecord,
  LessonProgress,
  LessonProgressStatus,
  ProfileProgress,
} from "@/features/progress/types";

// Pure calculations (no React, no storage — safe to unit test directly)
export {
  calculateCourseProgress,
  calculateLessonProgress,
  calculateLevelProgress,
  getCompletedLessonCount,
  getLessonDisplayStatus,
  getNextAvailableLesson,
  getOverallBestPerformance,
  isLessonUnlocked,
} from "@/features/progress/core/progressCalculations";
export { getContinueLearningCta } from "@/features/progress/core/continueLearning";
export type { ContinueLearningCta } from "@/features/progress/core/continueLearning";

// Service (the only layer that touches localStorage)
export {
  completeLesson,
  deleteProfileProgress,
  getCourseProgressSummary,
  getCurrentLesson,
  getLessonProgressEntry,
  getLessonStatus,
  getLevelProgressSummary,
  getOverallBestPerformance as getProfileOverallBestPerformance,
  getProfileProgress,
  startLessonAttempt,
} from "@/features/progress/services/progressService";
export type { CompleteLessonStats } from "@/features/progress/services/progressService";

// React
export { ProgressProvider, useProgress } from "@/features/progress/context/ProgressContext";
