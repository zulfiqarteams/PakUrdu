// Types
export type {
  Course,
  Level,
  Module,
  Lesson,
  LessonContent,
  LessonExample,
  LessonStep,
  LessonStepKind,
  LessonType,
  Exercise,
  ExerciseType,
} from "@/features/lessons/types";

// Catalog (data lookups)
export {
  getCourse,
  getLevels,
  getLevel,
  getModulesForLevel,
  getModule,
  getLessonsForModule,
  getLessonsForLevel,
  getAllLessonsInOrder,
  getLessonById,
  getNextLesson,
  getPreviousLesson,
  getLessonPosition,
  getLessonContext,
} from "@/features/lessons/services/lessonCatalog";
export type { LessonContext, LessonContextResult } from "@/features/lessons/services/lessonCatalog";

// Hooks
export { useLesson } from "@/features/lessons/hooks/useLesson";

// Components
export { LessonPageHeader } from "@/features/lessons/components/LessonPageHeader";
export { LessonObjectives } from "@/features/lessons/components/LessonObjectives";
export { LessonExplanation } from "@/features/lessons/components/LessonExplanation";
export { LessonExamples } from "@/features/lessons/components/LessonExamples";
export { LessonPractice } from "@/features/lessons/components/LessonPractice";
export { LessonNavigation } from "@/features/lessons/components/LessonNavigation";
export { LessonNotFound } from "@/features/lessons/components/LessonNotFound";
