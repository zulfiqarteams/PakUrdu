import { useMemo } from "react";
import { getLessonContext, type LessonContextResult } from "@/features/lessons/services/lessonCatalog";

/**
 * Resolves a lesson id to everything the lesson page needs (or a
 * typed failure reason). Kept as a thin hook over `getLessonContext`
 * so the page component doesn't need to think about memoization.
 */
export function useLesson(lessonId: string | undefined): LessonContextResult {
  return useMemo(() => getLessonContext(lessonId), [lessonId]);
}
