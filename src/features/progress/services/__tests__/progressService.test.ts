/**
 * Tests for the Progress Service + storage layer
 * (`services/progressService.ts`, `services/progressStorage.ts`),
 * exercised together since the service is a thin, mostly pass-through
 * wrapper over storage plus the pure calculators.
 *
 * Provides a minimal in-memory `localStorage` polyfill since this
 * runs under plain Node via `tsx`, not a browser — every other
 * concern (corruption handling, quota errors) is exactly what these
 * tests are checking, so the polyfill itself stays deliberately dumb.
 *
 * Run directly:
 *   npx tsx src/features/progress/services/__tests__/progressService.test.ts
 */

class MemoryStorage {
  private store = new Map<string, string>();
  private throwOnWrite = false;

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    if (this.throwOnWrite) throw new Error("storage quota exceeded (simulated)");
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
  setRaw(key: string, value: string): void {
    this.store.set(key, value);
  }
  setThrowOnWrite(value: boolean): void {
    this.throwOnWrite = value;
  }
}

const memoryStorage = new MemoryStorage();
(globalThis as unknown as { window: { localStorage: MemoryStorage } }).window = {
  localStorage: memoryStorage,
};

// Imported after the window polyfill is installed, but before any
// call — these modules only touch `window.localStorage` inside
// function bodies, never at import time.
import { getAllLessonsInOrder } from "@/features/lessons/services/lessonCatalog";
import * as progressStorage from "../progressStorage";
import * as progressService from "../progressService";
import { calculateCourseProgress } from "../../core/progressCalculations";

function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new Error(message ?? `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}
function assertTrue(actual: boolean, message: string): void {
  if (!actual) throw new Error(message);
}

type TestFn = () => void;
const results: { name: string; passed: boolean; error?: unknown }[] = [];
function test(name: string, fn: TestFn): void {
  memoryStorage.clear();
  memoryStorage.setThrowOnWrite(false);
  try {
    fn();
    results.push({ name, passed: true });
  } catch (error) {
    results.push({ name, passed: false, error });
  }
}

const [firstLesson, secondLesson] = getAllLessonsInOrder();

// --- 1. New profile progress -------------------------------------------

test("new profile progress — starts at zero with an empty lesson map", () => {
  const progress = progressService.getProfileProgress("new-profile");
  assertEqual(progress.completedLessonIds.length, 0);
  assertEqual(Object.keys(progress.lessonProgress).length, 0);
  assertEqual(progress.currentLessonId, null);
});

// --- 2. Lesson completion -------------------------------------------------

test("lesson completion — marks the lesson completed and records stats", () => {
  const progress = progressService.completeLesson("p1", firstLesson.id, { accuracy: 95, wpm: 40 });
  assertEqual(progress.lessonProgress[firstLesson.id].status, "completed");
  assertEqual(progress.completedLessonIds.includes(firstLesson.id), true);
  assertEqual(progress.lessonProgress[firstLesson.id].lastAccuracy, 95);
  assertEqual(progress.lessonProgress[firstLesson.id].lastWpm, 40);
});

// --- 3. Next lesson unlocking ----------------------------------------------

test("next lesson unlocking — completing the first lesson advances currentLessonId", () => {
  const progress = progressService.completeLesson("p1", firstLesson.id, { accuracy: 95, wpm: 40 });
  assertEqual(progress.currentLessonId, secondLesson.id);
});

// --- 4. Course percentage ---------------------------------------------------

test("course percentage — reflects completed / total from the real catalog", () => {
  progressService.completeLesson("p1", firstLesson.id, { accuracy: 100, wpm: 30 });
  const summary = progressService.getCourseProgressSummary("p1");
  assertEqual(summary.completed, 1);
  assertEqual(summary.total, getAllLessonsInOrder().length);
  assertEqual(summary.percent, Math.round((1 / getAllLessonsInOrder().length) * 100));
});

// --- 5. Level percentage -----------------------------------------------------

test("level percentage — scoped to just that level's lessons", () => {
  progressService.completeLesson("p1", firstLesson.id, { accuracy: 100, wpm: 30 });
  const levelLessons = getAllLessonsInOrder().filter((l) => l.levelId === firstLesson.levelId);
  const summary = progressService.getLevelProgressSummary("p1", levelLessons);
  assertEqual(summary.completed, 1);
  assertEqual(summary.total, levelLessons.length);
});

// --- 6 & 7. Best WPM / Best Accuracy -----------------------------------------

test("best WPM and best accuracy — recorded from the first completion", () => {
  const progress = progressService.completeLesson("p1", firstLesson.id, { accuracy: 88, wpm: 25 });
  assertEqual(progress.lessonProgress[firstLesson.id].bestWpm, 25);
  assertEqual(progress.lessonProgress[firstLesson.id].bestAccuracy, 88);
});

// --- 8. Worse result does not overwrite best ---------------------------------

test("worse result does not overwrite personal best, but last* always updates", () => {
  progressService.completeLesson("p1", firstLesson.id, { accuracy: 95, wpm: 50 });
  const progress = progressService.completeLesson("p1", firstLesson.id, { accuracy: 70, wpm: 20 });
  const entry = progress.lessonProgress[firstLesson.id];
  assertEqual(entry.bestAccuracy, 95, "bestAccuracy must not regress");
  assertEqual(entry.bestWpm, 50, "bestWpm must not regress");
  assertEqual(entry.lastAccuracy, 70, "lastAccuracy always reflects the most recent attempt");
  assertEqual(entry.lastWpm, 20, "lastWpm always reflects the most recent attempt");
});

test("a better result does overwrite personal best", () => {
  progressService.completeLesson("p1", firstLesson.id, { accuracy: 70, wpm: 20 });
  const progress = progressService.completeLesson("p1", firstLesson.id, { accuracy: 95, wpm: 50 });
  const entry = progress.lessonProgress[firstLesson.id];
  assertEqual(entry.bestAccuracy, 95);
  assertEqual(entry.bestWpm, 50);
});

// --- 9. Attempt recording -----------------------------------------------------

test("attempt recording — increments attempts and appends to recent attempts, capped at 20", () => {
  for (let i = 0; i < 25; i++) {
    progressService.completeLesson("p1", firstLesson.id, { accuracy: 80, wpm: 10 + i });
  }
  const progress = progressService.getProfileProgress("p1");
  const entry = progress.lessonProgress[firstLesson.id];
  assertEqual(entry.attempts, 25);
  assertEqual(entry.recentAttempts?.length, 20, "recent attempts must be capped at 20");
  assertEqual(entry.recentAttempts?.[19].wpm, 34, "the most recent attempt is kept, not dropped");
});

// --- 10. Profile isolation -----------------------------------------------------

test("profile isolation — two profiles' progress never leak into each other", () => {
  progressService.completeLesson("ali", firstLesson.id, { accuracy: 90, wpm: 30 });
  const ahmedProgress = progressService.getProfileProgress("ahmed");
  assertEqual(ahmedProgress.completedLessonIds.length, 0, "ahmed must not see ali's completion");

  const aliProgress = progressService.getProfileProgress("ali");
  assertEqual(aliProgress.completedLessonIds.includes(firstLesson.id), true);
});

// --- 11. Missing progress -------------------------------------------------------

test("missing progress — a profile that was never written returns a safe empty state", () => {
  const progress = progressService.getProfileProgress("never-seen-before");
  assertEqual(progress.completedLessonIds.length, 0);
  assertEqual(progress.currentLessonId, null);
});

// --- 12. Corrupted progress -------------------------------------------------------

test("corrupted progress — malformed JSON falls back to empty rather than throwing", () => {
  memoryStorage.setRaw("urduTypingTutorial:progress", "{ not valid json");
  const progress = progressService.getProfileProgress("p1");
  assertEqual(progress.completedLessonIds.length, 0);
});

test("corrupted progress — wrong-shaped JSON (array instead of object) falls back to empty", () => {
  memoryStorage.setRaw("urduTypingTutorial:progress", JSON.stringify([1, 2, 3]));
  const progress = progressService.getProfileProgress("p1");
  assertEqual(progress.completedLessonIds.length, 0);
});

test("corrupted progress — one malformed lesson entry doesn't wipe out the profile's other valid entries", () => {
  progressService.completeLesson("p1", firstLesson.id, { accuracy: 90, wpm: 30 });
  const raw = memoryStorage.getItem("urduTypingTutorial:progress")!;
  const parsed = JSON.parse(raw);
  parsed.progress.p1.lessonProgress["some-other-lesson"] = { garbage: true };
  memoryStorage.setRaw("urduTypingTutorial:progress", JSON.stringify(parsed));

  const progress = progressService.getProfileProgress("p1");
  assertEqual(progress.lessonProgress[firstLesson.id]?.status, "completed", "the valid entry survives");
  assertTrue(!("some-other-lesson" in progress.lessonProgress), "the malformed entry is dropped");
});

test("corrupted progress — an unrecognized store version falls back to empty", () => {
  memoryStorage.setRaw("urduTypingTutorial:progress", JSON.stringify({ version: 999, progress: {} }));
  const progress = progressService.getProfileProgress("p1");
  assertEqual(progress.completedLessonIds.length, 0);
});

test("storage write failure (e.g. quota exceeded) does not throw", () => {
  memoryStorage.setThrowOnWrite(true);
  progressService.completeLesson("p1", firstLesson.id, { accuracy: 90, wpm: 30 });
  // Reaching this line means completeLesson did not throw.
  assertTrue(true, "completeLesson must not throw when storage write fails");
});

// --- 13. Profile deletion cleanup -------------------------------------------------

test("profile deletion cleanup — removes that profile's progress and no other's", () => {
  progressService.completeLesson("ali", firstLesson.id, { accuracy: 90, wpm: 30 });
  progressService.completeLesson("ahmed", firstLesson.id, { accuracy: 80, wpm: 25 });

  progressStorage.deleteProfileProgress("ali");

  assertEqual(progressService.getProfileProgress("ali").completedLessonIds.length, 0);
  assertEqual(progressService.getProfileProgress("ahmed").completedLessonIds.length, 1);
});

test("profile deletion cleanup — deleting a profile with no progress is a safe no-op", () => {
  progressStorage.deleteProfileProgress("never-existed");
  assertTrue(true, "must not throw");
});

// --- 14. Zero lessons ---------------------------------------------------------------

test("zero lessons — course progress against an empty catalog returns 0, never NaN", () => {
  const progress = progressService.getProfileProgress("p1");
  assertEqual(calculateCourseProgress(progress.completedLessonIds.length, 0), 0);
});

// --- startLessonAttempt behavior (supports manual test #2/#3) -----------------------

test("startLessonAttempt — marks a lesson inProgress, and is a no-op once completed", () => {
  const started = progressService.startLessonAttempt("p1", firstLesson.id);
  assertEqual(started.lessonProgress[firstLesson.id].status, "inProgress");

  progressService.completeLesson("p1", firstLesson.id, { accuracy: 90, wpm: 30 });
  const afterStartAgain = progressService.startLessonAttempt("p1", firstLesson.id);
  assertEqual(afterStartAgain.lessonProgress[firstLesson.id].status, "completed", "must not regress a completed lesson back to inProgress");
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
  throw new Error(`${failures} progress-service test(s) failed — see output above.`);
}
