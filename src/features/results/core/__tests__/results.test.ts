/**
 * Tests for the pure results core (feedback / personalBest /
 * sessionResult / navigation / mistakeSummary / display). Same
 * dependency-free harness as `typing/core/__tests__/typingEngine.test.ts`
 * — no vitest/jest configured yet, so this stays runnable with any
 * TypeScript runner:
 *
 *   npx tsx src/features/results/core/__tests__/results.test.ts
 */
import { getFeedback } from "../feedback";
import { isNewPersonalBest } from "../personalBest";
import { buildSessionResult } from "../sessionResult";
import { getResultNavigationTargets } from "../navigation";
import { getMistakeSummaryMessage } from "../mistakeSummary";
import { formatAccuracy, formatWpm, formatPreviousBest } from "../display";
import { getAllLessonsInOrder } from "../../../lessons/services/lessonCatalog";
import type { TypingMistake } from "../../../typing/types";

function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new Error(message ?? `Expected ${String(expected)}, got ${String(actual)}`);
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

// --- getFeedback ---------------------------------------------------------
test("getFeedback — a personal best always wins, regardless of accuracy/wpm", () => {
  const feedback = getFeedback({ accuracy: 40, wpm: 5, isPersonalBest: true });
  assertEqual(feedback.tone, "success");
  assertEqual(feedback.message.includes("personal best"), true);
});

test("getFeedback — high accuracy uses the spec's exact wording", () => {
  const feedback = getFeedback({ accuracy: 97, wpm: 10, isPersonalBest: false });
  assertEqual(feedback.tone, "success");
  assertEqual(feedback.message.includes("Excellent accuracy!"), true);
});

test("getFeedback — strong WPM uses the spec's exact wording", () => {
  const feedback = getFeedback({ accuracy: 85, wpm: 35, isPersonalBest: false });
  assertEqual(feedback.tone, "success");
  assertEqual(feedback.message.includes("Great typing speed!"), true);
});

test("getFeedback — high accuracy AND strong wpm includes both praise lines", () => {
  const feedback = getFeedback({ accuracy: 97, wpm: 35, isPersonalBest: false });
  assertEqual(feedback.message.includes("Excellent accuracy!"), true);
  assertEqual(feedback.message.includes("Great typing speed!"), true);
});

test("getFeedback — mid accuracy, unremarkable wpm → neutral tone", () => {
  assertEqual(getFeedback({ accuracy: 85, wpm: 10, isPersonalBest: false }).tone, "neutral");
});

test("getFeedback — low accuracy → exact warning wording, even with a fast wpm", () => {
  const feedback = getFeedback({ accuracy: 50, wpm: 40, isPersonalBest: false });
  assertEqual(feedback.tone, "warning");
  assertEqual(feedback.message, "Focus on accuracy first, then gradually increase speed.");
});

test("getFeedback — NaN/Infinity accuracy or wpm is treated as the neutral/low case, not a crash", () => {
  const feedback = getFeedback({ accuracy: NaN, wpm: Infinity, isPersonalBest: false });
  assertEqual(feedback.tone, "warning");
  assertEqual(feedback.message.includes("NaN"), false);
  assertEqual(feedback.message.includes("Infinity"), false);
});

// --- isNewPersonalBest -----------------------------------------------------
test("isNewPersonalBest — no previous best, positive WPM → true", () => {
  assertEqual(
    isNewPersonalBest({ wpm: 20, accuracy: 90, previousBestWpm: null, previousBestAccuracy: null }),
    true,
  );
});

test("isNewPersonalBest — no previous best but 0 WPM → false (nothing meaningful happened)", () => {
  assertEqual(
    isNewPersonalBest({ wpm: 0, accuracy: 90, previousBestWpm: null, previousBestAccuracy: null }),
    false,
  );
});

test("isNewPersonalBest — strictly faster than previous best → true", () => {
  assertEqual(
    isNewPersonalBest({ wpm: 30, accuracy: 80, previousBestWpm: 25, previousBestAccuracy: 95 }),
    true,
  );
});

test("isNewPersonalBest — slower than previous best → false", () => {
  assertEqual(
    isNewPersonalBest({ wpm: 20, accuracy: 100, previousBestWpm: 25, previousBestAccuracy: 90 }),
    false,
  );
});

test("isNewPersonalBest — exact WPM tie, higher accuracy → true", () => {
  assertEqual(
    isNewPersonalBest({ wpm: 25, accuracy: 96, previousBestWpm: 25, previousBestAccuracy: 95 }),
    true,
  );
});

test("isNewPersonalBest — exact WPM tie, equal or lower accuracy → false", () => {
  assertEqual(
    isNewPersonalBest({ wpm: 25, accuracy: 95, previousBestWpm: 25, previousBestAccuracy: 95 }),
    false,
  );
});

test("isNewPersonalBest — NaN wpm never reports a best", () => {
  assertEqual(
    isNewPersonalBest({ wpm: NaN, accuracy: 100, previousBestWpm: null, previousBestAccuracy: null }),
    false,
  );
});

// --- buildSessionResult -----------------------------------------------------
test("buildSessionResult — assembles a complete, well-typed SessionResult", () => {
  const mistakes: TypingMistake[] = [{ index: 2, expected: "ب", typed: "پ", count: 1 }];
  const result = buildSessionResult({
    lessonId: "lesson-1",
    lessonName: "Lesson One",
    targetText: "ابب",
    accuracy: 100,
    sessionAccuracy: 90,
    wpm: 28.4,
    elapsedMs: 12_000,
    correctCharacters: 3,
    incorrectCharacters: 0,
    totalCharacters: 3,
    mistakes,
    previousBestAccuracy: 95,
    previousBestWpm: 20,
  });

  assertEqual(result.lessonId, "lesson-1");
  assertEqual(result.lessonName, "Lesson One");
  assertEqual(result.wpm, 28.4);
  assertEqual(result.isPersonalBest, true); // 28.4 > previous best of 20
  assertEqual(result.previousBestWpm, 20); // snapshot preserved, not overwritten
  assertEqual(result.mistakes.length, 1);
  assertEqual(result.feedback.tone, "success");
  assertEqual(result.status, "completed");
  assertEqual(typeof result.completedAt, "string");
});

test("buildSessionResult — trackPersonalBest defaults to true", () => {
  const result = buildSessionResult({
    lessonId: "lesson-1",
    lessonName: "Lesson One",
    targetText: "ابب",
    accuracy: 100,
    sessionAccuracy: 100,
    wpm: 40,
    elapsedMs: 5_000,
    correctCharacters: 3,
    incorrectCharacters: 0,
    totalCharacters: 3,
    mistakes: [],
    previousBestAccuracy: null,
    previousBestWpm: null,
  });
  assertEqual(result.isPersonalBest, true);
});

test("buildSessionResult — trackPersonalBest: false forces isPersonalBest false regardless of the numbers (Practice page fix)", () => {
  const result = buildSessionResult({
    lessonId: null,
    lessonName: null,
    targetText: "پاکستان",
    accuracy: 100,
    sessionAccuracy: 100,
    wpm: 40,
    elapsedMs: 5_000,
    correctCharacters: 7,
    incorrectCharacters: 0,
    totalCharacters: 7,
    mistakes: [],
    previousBestAccuracy: null,
    previousBestWpm: null,
    trackPersonalBest: false,
  });

  assertEqual(result.isPersonalBest, false);
  assertEqual(result.lessonId, null);
});

test("buildSessionResult — NaN/Infinity inputs are clamped, never leak into the result", () => {
  const result = buildSessionResult({
    lessonId: null,
    lessonName: null,
    targetText: "",
    accuracy: NaN,
    sessionAccuracy: Infinity,
    wpm: -5,
    elapsedMs: NaN,
    correctCharacters: 0,
    incorrectCharacters: 0,
    totalCharacters: 0,
    mistakes: [],
    previousBestAccuracy: null,
    previousBestWpm: null,
  });

  assertEqual(result.accuracy, 0);
  assertEqual(result.sessionAccuracy, 0);
  assertEqual(result.wpm, 0);
  assertEqual(result.elapsedMs, 0);
  assertEqual(Number.isNaN(result.accuracy), false);
  assertEqual(Number.isFinite(result.sessionAccuracy), true);
});

test("buildSessionResult — a worse attempt than the previous best is not a personal best", () => {
  const result = buildSessionResult({
    lessonId: "lesson-1",
    lessonName: "Lesson One",
    targetText: "ابب",
    accuracy: 100,
    sessionAccuracy: 100,
    wpm: 10,
    elapsedMs: 20_000,
    correctCharacters: 3,
    incorrectCharacters: 0,
    totalCharacters: 3,
    mistakes: [],
    previousBestAccuracy: 95,
    previousBestWpm: 20,
  });
  assertEqual(result.isPersonalBest, false);
  assertEqual(result.feedback.tone, "success"); // still 100% accuracy, just not a "best"
});

// --- getResultNavigationTargets ---------------------------------------------
test("getResultNavigationTargets — standalone session (no lessonId) points Retry at /practice, no Continue", () => {
  const targets = getResultNavigationTargets(null);
  assertEqual(targets.retryTo, "/practice");
  assertEqual(targets.continueTo, null);
  assertEqual(targets.continueLabel, null);
});

test("getResultNavigationTargets — a lesson with a next lesson gets a real Continue target", () => {
  const ordered = getAllLessonsInOrder();
  const first = ordered[0];
  const second = ordered[1];
  const targets = getResultNavigationTargets(first.id);
  assertEqual(targets.retryTo, `/lesson/${first.id}`);
  assertEqual(targets.continueTo, `/lesson/${second.id}`);
  assertEqual(targets.continueLabel, "Next Lesson");
});

test("getResultNavigationTargets — the final lesson in the course has no Continue target", () => {
  const ordered = getAllLessonsInOrder();
  const last = ordered[ordered.length - 1];
  const targets = getResultNavigationTargets(last.id);
  assertEqual(targets.retryTo, `/lesson/${last.id}`);
  assertEqual(targets.continueTo, null);
  assertEqual(targets.continueLabel, null);
});

// --- getMistakeSummaryMessage ------------------------------------------------
test("getMistakeSummaryMessage — no mistakes → the spec's exact perfect-run message", () => {
  assertEqual(getMistakeSummaryMessage([]), "Perfect — no typing mistakes.");
});

test("getMistakeSummaryMessage — a single mistake, singular wording", () => {
  const mistakes: TypingMistake[] = [{ index: 0, expected: "ک", typed: "گ", count: 1 }];
  assertEqual(getMistakeSummaryMessage(mistakes), "1 mistake to review.");
});

test("getMistakeSummaryMessage — several distinct mistakes, plural wording", () => {
  const mistakes: TypingMistake[] = [
    { index: 0, expected: "ک", typed: "گ", count: 1 },
    { index: 3, expected: "ب", typed: "پ", count: 1 },
  ];
  assertEqual(getMistakeSummaryMessage(mistakes), "2 mistakes to review.");
});

test("getMistakeSummaryMessage — repeated occurrences of the same mistake are called out", () => {
  const mistakes: TypingMistake[] = [{ index: 0, expected: "ک", typed: "گ", count: 3 }];
  assertEqual(getMistakeSummaryMessage(mistakes), "1 mistake to review (3 occurrences).");
});

// --- display formatting -------------------------------------------------------
test("formatAccuracy — rounds and suffixes", () => {
  assertEqual(formatAccuracy(95.6), "96%");
});

test("formatAccuracy — NaN/Infinity never leaks through", () => {
  assertEqual(formatAccuracy(NaN), "0%");
  assertEqual(formatAccuracy(Infinity), "0%");
});

test("formatWpm — rounds to a plain integer string", () => {
  assertEqual(formatWpm(28.4), "28");
});

test("formatPreviousBest — null when there's nothing to compare against", () => {
  assertEqual(formatPreviousBest({ previousBestWpm: null, previousBestAccuracy: null }), null);
});

test("formatPreviousBest — formats both values when present", () => {
  assertEqual(
    formatPreviousBest({ previousBestWpm: 24.6, previousBestAccuracy: 91.2 }),
    "25 WPM, 91% accuracy",
  );
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
  throw new Error(`${failures} results test(s) failed — see output above.`);
}
