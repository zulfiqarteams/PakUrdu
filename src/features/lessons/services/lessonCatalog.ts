import { course } from "@/features/lessons/data/course";
import { levels } from "@/features/lessons/data/levels";
import { modules } from "@/features/lessons/data/modules";
import { allLessons } from "@/features/lessons/data/lessons";
import type { Course, Level, Lesson, Module } from "@/features/lessons/types";

/**
 * All curriculum queries live here, kept deliberately separate from
 * React. Pages/components should go through this module instead of
 * importing the raw data arrays directly — that keeps ordering,
 * lookup, and navigation logic in one place as the catalog grows.
 */

function byOrder<T extends { order: number }>(a: T, b: T): number {
  return a.order - b.order;
}

/** The one course this app currently teaches. */
export function getCourse(): Course {
  return course;
}

/** All levels, in curriculum order. */
export function getLevels(): Level[] {
  return [...levels].sort(byOrder);
}

/** A single level by id, or `undefined` if it doesn't exist. */
export function getLevel(levelId: string): Level | undefined {
  return levels.find((level) => level.id === levelId);
}

/** All modules belonging to a level, in module order. */
export function getModulesForLevel(levelId: string): Module[] {
  return modules.filter((module) => module.levelId === levelId).sort(byOrder);
}

/** A single module by id, or `undefined` if it doesn't exist. */
export function getModule(moduleId: string): Module | undefined {
  return modules.find((module) => module.id === moduleId);
}

/** All lessons belonging to a module, in lesson order. */
export function getLessonsForModule(moduleId: string): Lesson[] {
  return allLessons.filter((lesson) => lesson.moduleId === moduleId).sort(byOrder);
}

/** All lessons belonging to a level (across its modules), in order. */
export function getLessonsForLevel(levelId: string): Lesson[] {
  const moduleOrder = new Map(getModulesForLevel(levelId).map((m) => [m.id, m.order]));
  return allLessons
    .filter((lesson) => lesson.levelId === levelId)
    .sort((a, b) => {
      const moduleDelta = (moduleOrder.get(a.moduleId) ?? 0) - (moduleOrder.get(b.moduleId) ?? 0);
      return moduleDelta !== 0 ? moduleDelta : a.order - b.order;
    });
}

/**
 * Every lesson across the whole course, in the order a learner would
 * progress through them: level order, then module order within the
 * level, then lesson order within the module. This is the ordering
 * `getNextLesson`/`getPreviousLesson` walk along.
 */
export function getAllLessonsInOrder(): Lesson[] {
  const levelOrder = new Map(levels.map((level) => [level.id, level.order]));
  const moduleOrder = new Map(modules.map((module) => [module.id, module.order]));

  return [...allLessons].sort((a, b) => {
    const levelDelta = (levelOrder.get(a.levelId) ?? 0) - (levelOrder.get(b.levelId) ?? 0);
    if (levelDelta !== 0) return levelDelta;

    const moduleDelta = (moduleOrder.get(a.moduleId) ?? 0) - (moduleOrder.get(b.moduleId) ?? 0);
    if (moduleDelta !== 0) return moduleDelta;

    return a.order - b.order;
  });
}

/** A single lesson by id, or `undefined` if it doesn't exist. */
export function getLessonById(lessonId: string): Lesson | undefined {
  return allLessons.find((lesson) => lesson.id === lessonId);
}

/** The lesson that comes after the given one, or `undefined` if it's the last. */
export function getNextLesson(lessonId: string): Lesson | undefined {
  const ordered = getAllLessonsInOrder();
  const index = ordered.findIndex((lesson) => lesson.id === lessonId);
  if (index === -1) return undefined;
  return ordered[index + 1];
}

/** The lesson that comes before the given one, or `undefined` if it's the first. */
export function getPreviousLesson(lessonId: string): Lesson | undefined {
  const ordered = getAllLessonsInOrder();
  const index = ordered.findIndex((lesson) => lesson.id === lessonId);
  if (index <= 0) return undefined;
  return ordered[index - 1];
}

/** This lesson's 1-based position among every lesson in the course. */
export function getLessonPosition(lessonId: string): number | undefined {
  const ordered = getAllLessonsInOrder();
  const index = ordered.findIndex((lesson) => lesson.id === lessonId);
  return index === -1 ? undefined : index + 1;
}

export interface LessonContext {
  lesson: Lesson;
  level: Level;
  module: Module;
  previous?: Lesson;
  next?: Lesson;
  position: number;
  total: number;
}

/**
 * Resolves everything a lesson page needs in one call, and reports
 * *why* it failed when it can't: an unknown lesson id, or a lesson
 * whose `levelId`/`moduleId` doesn't match any real level/module
 * (malformed data). Callers use this instead of stitching the
 * individual lookups together themselves.
 */
export type LessonContextResult =
  | { status: "ok"; context: LessonContext }
  | { status: "not-found" }
  | { status: "malformed"; reason: string };

export function getLessonContext(lessonId: string | undefined): LessonContextResult {
  if (!lessonId) return { status: "not-found" };

  const lesson = getLessonById(lessonId);
  if (!lesson) return { status: "not-found" };

  const level = getLevel(lesson.levelId);
  if (!level) {
    return { status: "malformed", reason: `Lesson "${lessonId}" references an unknown level.` };
  }

  const module = getModule(lesson.moduleId);
  if (!module) {
    return { status: "malformed", reason: `Lesson "${lessonId}" references an unknown module.` };
  }

  if (!lesson.content || !lesson.content.explanation) {
    return { status: "malformed", reason: `Lesson "${lessonId}" is missing its content.` };
  }

  const position = getLessonPosition(lessonId) ?? 0;
  const total = allLessons.length;

  return {
    status: "ok",
    context: {
      lesson,
      level,
      module,
      previous: getPreviousLesson(lessonId),
      next: getNextLesson(lessonId),
      position,
      total,
    },
  };
}
