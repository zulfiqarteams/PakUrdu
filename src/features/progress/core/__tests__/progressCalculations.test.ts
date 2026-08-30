/**
 * Tests for the pure progress core (`core/progressCalculations.ts`).
 *
 * Same dependency-free style as
 * `src/features/statistics/core/__tests__/statistics.test.ts` — run
 * directly with any TypeScript-capable runner, e.g.:
 *
 *   npx tsx src/features/progress/core/__tests__/progressCalculations.test.ts
 */
import {
  calculateCourseProgress,
  calculateLevelProgress,
  getCompletedLessonCount,
  getLessonDisplayStatus,
  getNextAvailableLesson,
  getOverallBestPerformance,
  isLessonUnlocked,
} from "../progressCalculations";
import type { Lesson } from "@/features/lessons/types";
import type { ProfileProgress } from "@/features/progress/types";

function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new Error(message ?? `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

type TestFn = () => void;
const results: { name: string; passed: boolean; error?: unknown }[] = [];

function test(name: string, fn: TestFn): void {
  try {
    fn();
    results.push({ name, passed: true });
  } catch (error) {
    results.push({ name, passed: false, error });
  }
}

// --- fixtures ----------------------------------------------------------

function makeLesson(id: string, order: number): Lesson {
  return {
    id,
    levelId: "level-x",
    moduleId: "module-x",
    order,
    title: id,
    description: "",
    difficulty: "Beginner",
    objectives: [],
    type: "character",
    content: { explanation: "x" },
  };
}

const lessonA = makeLesson("a", 1);
const lessonB = makeLesson("b", 2);
const lessonC = makeLesson("c", 3);
const allLessons = [lessonA, lessonB, lessonC];

function emptyProgress(profileId = "p1"): ProfileProgress {
  return { profileId, completedLessonIds: [], lessonProgress: {}, currentLessonId: null, lastActivityAt: null };
}

// --- calculateCourseProgress --------------------------------------------

test("calculateCourseProgress — 3 of 10 completed is 30%", () => {
  assertEqual(calculateCourseProgress(3, 10), 30);
});

test("calculateCourseProgress — zero total lessons returns 0, never NaN/Infinity", () => {
  assertEqual(calculateCourseProgress(0, 0), 0);
});

test("calculateCourseProgress — zero completed returns 0", () => {
  assertEqual(calculateCourseProgress(0, 10), 0);
});

test("calculateCourseProgress — all completed returns 100", () => {
  assertEqual(calculateCourseProgress(10, 10), 100);
});

test("calculateCourseProgress — rounds to the nearest whole percent", () => {
  assertEqual(calculateCourseProgress(1, 3), 33);
});

// --- calculateLevelProgress ----------------------------------------------

test("calculateLevelProgress — half the level's lessons completed is 50%", () => {
  assertEqual(calculateLevelProgress([lessonA, lessonB], new Set(["a"])), 50);
});

test("calculateLevelProgress — empty level returns 0", () => {
  assertEqual(calculateLevelProgress([], new Set()), 0);
});

// --- getCompletedLessonCount ----------------------------------------------

test("getCompletedLessonCount — reads straight off completedLessonIds", () => {
  const progress = { ...emptyProgress(), completedLessonIds: ["a", "b"] };
  assertEqual(getCompletedLessonCount(progress), 2);
});

test("getCompletedLessonCount — zero for a brand-new profile", () => {
  assertEqual(getCompletedLessonCount(emptyProgress()), 0);
});

// --- isLessonUnlocked ------------------------------------------------------

test("isLessonUnlocked — the first lesson in the course is always unlocked", () => {
  assertEqual(isLessonUnlocked(lessonA, allLessons, new Set()), true);
});

test("isLessonUnlocked — a later lesson is locked until the previous one is completed", () => {
  assertEqual(isLessonUnlocked(lessonB, allLessons, new Set()), false);
  assertEqual(isLessonUnlocked(lessonB, allLessons, new Set(["a"])), true);
});

test("isLessonUnlocked — unlocking only depends on the immediately preceding lesson", () => {
  // Sequential unlocking (Part 9 §5) only requires the lesson right
  // before it — completing B (regardless of A) unlocks C.
  assertEqual(isLessonUnlocked(lessonC, allLessons, new Set(["b"])), true);
  assertEqual(isLessonUnlocked(lessonC, allLessons, new Set()), false);
});

// --- getLessonDisplayStatus -------------------------------------------------

test("getLessonDisplayStatus — completed lesson reports completed", () => {
  const progress: ProfileProgress = {
    ...emptyProgress(),
    completedLessonIds: ["a"],
    lessonProgress: {
      a: {
        lessonId: "a",
        status: "completed",
        attempts: 1,
        bestAccuracy: 90,
        bestWpm: 30,
        lastAccuracy: 90,
        lastWpm: 30,
        completedAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    },
  };
  assertEqual(getLessonDisplayStatus(lessonA, progress, allLessons), "completed");
});

test("getLessonDisplayStatus — started-but-not-finished lesson reports inProgress", () => {
  const progress: ProfileProgress = {
    ...emptyProgress(),
    lessonProgress: {
      a: {
        lessonId: "a",
        status: "inProgress",
        attempts: 0,
        bestAccuracy: null,
        bestWpm: null,
        lastAccuracy: null,
        lastWpm: null,
        completedAt: null,
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    },
  };
  assertEqual(getLessonDisplayStatus(lessonA, progress, allLessons), "inProgress");
});

test("getLessonDisplayStatus — never-touched first lesson reports available", () => {
  assertEqual(getLessonDisplayStatus(lessonA, emptyProgress(), allLessons), "available");
});

test("getLessonDisplayStatus — never-touched later lesson reports locked", () => {
  assertEqual(getLessonDisplayStatus(lessonB, emptyProgress(), allLessons), "locked");
});

// --- getNextAvailableLesson -------------------------------------------------

test("getNextAvailableLesson — a brand-new profile's next lesson is the first lesson", () => {
  assertEqual(getNextAvailableLesson(emptyProgress(), allLessons)?.id, "a");
});

test("getNextAvailableLesson — after completing the first, the next is the second", () => {
  const progress = { ...emptyProgress(), completedLessonIds: ["a"] };
  assertEqual(getNextAvailableLesson(progress, allLessons)?.id, "b");
});

test("getNextAvailableLesson — every lesson completed returns null", () => {
  const progress = { ...emptyProgress(), completedLessonIds: ["a", "b", "c"] };
  assertEqual(getNextAvailableLesson(progress, allLessons), null);
});

test("getNextAvailableLesson — an empty catalog returns null", () => {
  assertEqual(getNextAvailableLesson(emptyProgress(), []), null);
});

// --- getOverallBestPerformance ----------------------------------------------

test("getOverallBestPerformance — takes the max across all lessons", () => {
  const progress: ProfileProgress = {
    ...emptyProgress(),
    lessonProgress: {
      a: {
        lessonId: "a",
        status: "completed",
        attempts: 1,
        bestAccuracy: 90,
        bestWpm: 20,
        lastAccuracy: 90,
        lastWpm: 20,
        completedAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      b: {
        lessonId: "b",
        status: "completed",
        attempts: 1,
        bestAccuracy: 85,
        bestWpm: 40,
        lastAccuracy: 85,
        lastWpm: 40,
        completedAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    },
  };
  const result = getOverallBestPerformance(progress);
  assertEqual(result.bestWpm, 40);
  assertEqual(result.bestAccuracy, 90);
});

test("getOverallBestPerformance — no attempts yet returns null for both, never fake zeros", () => {
  const result = getOverallBestPerformance(emptyProgress());
  assertEqual(result.bestWpm, null);
  assertEqual(result.bestAccuracy, null);
});

// --- Report ------------------------------------------------------------------
let failures = 0;
for (const result of results) {
  if (result.passed) {
    console.log(`✓ ${result.name}`);
  } else {
    failures++;
    console.error(`✗ ${result.name}`);
    console.error(result.error);
  }
}
console.log(`\n${results.length - failures}/${results.length} tests passed.`);
if (failures > 0) {
  throw new Error(`${failures} progress-calculations test(s) failed — see output above.`);
}
