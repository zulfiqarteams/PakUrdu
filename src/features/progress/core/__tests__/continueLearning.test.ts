/**
 * Tests for `getContinueLearningCta`. Same dependency-free harness as
 * the rest of the progress core tests — run with any TypeScript
 * runner, e.g.:
 *
 *   npx tsx src/features/progress/core/__tests__/continueLearning.test.ts
 */
import { getContinueLearningCta } from "../continueLearning";
import { getAllLessonsInOrder, getLessonPosition } from "@/features/lessons/services/lessonCatalog";

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

const [firstLesson] = getAllLessonsInOrder();

// --- getContinueLearningCta -------------------------------------------------

test("getContinueLearningCta — no current lesson means the course is complete", () => {
  const cta = getContinueLearningCta({ currentLesson: null, completedLessonCount: 20 });
  assertEqual(cta.isCourseComplete, true);
  assertEqual(cta.to, "/learn");
});

test("getContinueLearningCta — a brand-new profile (0 completions) gets a Start Learning CTA", () => {
  const cta = getContinueLearningCta({ currentLesson: firstLesson, completedLessonCount: 0 });
  assertEqual(cta.label, "Start Learning");
  assertEqual(cta.to, `/lesson/${firstLesson.id}`);
  assertEqual(cta.isCourseComplete, false);
});

test("getContinueLearningCta — a returning profile gets a numbered Continue label, never hard-coded", () => {
  const cta = getContinueLearningCta({ currentLesson: firstLesson, completedLessonCount: 1 });
  const expectedPosition = getLessonPosition(firstLesson.id);
  assertEqual(cta.label, `Continue Lesson ${expectedPosition}`);
  assertEqual(cta.to, `/lesson/${firstLesson.id}`);
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
  throw new Error(`${failures} continueLearning test(s) failed — see output above.`);
}
