/**
 * Tests for the pure statistics core (`core/statistics.ts`).
 *
 * Same dependency-free style as
 * `src/features/typing/core/__tests__/typingEngine.test.ts` — run
 * directly with any TypeScript-capable runner, e.g.:
 *
 *   npx tsx src/features/statistics/core/__tests__/statistics.test.ts
 */
import { calculateCPM, calculateStatistics, calculateWPM, formatTime } from "../statistics";

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

// --- calculateWPM --------------------------------------------------------

test("calculateWPM — 300 characters in exactly 1 minute is 60 WPM", () => {
  assertEqual(calculateWPM(300, 60_000), 60);
});

test("calculateWPM — 150 characters in 30 seconds is 60 WPM", () => {
  assertEqual(calculateWPM(150, 30_000), 60);
});

test("calculateWPM — zero elapsed time returns 0, never Infinity", () => {
  assertEqual(calculateWPM(300, 0), 0);
});

test("calculateWPM — zero typed characters returns 0", () => {
  assertEqual(calculateWPM(0, 60_000), 0);
});

test("calculateWPM — negative elapsed time returns 0, never negative WPM", () => {
  assertEqual(calculateWPM(300, -1_000), 0);
});

test("calculateWPM — does not round the underlying value", () => {
  // 301 chars / 5 = 60.2 "words" in 1 minute → 60.2 WPM exactly.
  assertEqual(calculateWPM(301, 60_000), 60.2);
});


test("calculateCPM — 300 characters in exactly 1 minute is 300 CPM", () => {
  assertEqual(calculateCPM(300, 60_000), 300);
});

// --- formatTime ------------------------------------------------------------

test("formatTime — zero elapsed formats as 00:00", () => {
  assertEqual(formatTime(0), "00:00");
});

test("formatTime — 90 seconds formats as 01:30", () => {
  assertEqual(formatTime(90_000), "01:30");
});

test("formatTime — under a minute pads seconds", () => {
  assertEqual(formatTime(7_000), "00:07");
});

test("formatTime — grows to H:MM:SS past one hour", () => {
  assertEqual(formatTime(3_661_000), "1:01:01");
});

test("formatTime — negative input clamps to 00:00, never negative", () => {
  assertEqual(formatTime(-5_000), "00:00");
});

test("formatTime — NaN input clamps to 00:00, never 'NaN:NaN'", () => {
  assertEqual(formatTime(NaN), "00:00");
});

// --- calculateStatistics ----------------------------------------------------

test("calculateStatistics — combines counts and elapsed time into one snapshot", () => {
  const stats = calculateStatistics({
    elapsedMs: 60_000,
    typedCharacters: 300,
    correctCharacters: 285,
    incorrectCharacters: 15,
  });
  assertEqual(stats.elapsedMs, 60_000);
  assertEqual(stats.typedCharacters, 300);
  assertEqual(stats.correctCharacters, 285);
  assertEqual(stats.incorrectCharacters, 15);
  assertEqual(stats.accuracy, 95);
  assertEqual(stats.cpm, 300);
  assertEqual(stats.wpm, 60);
});

test("calculateStatistics — zero characters and zero time never produce NaN/Infinity", () => {
  const stats = calculateStatistics({
    elapsedMs: 0,
    typedCharacters: 0,
    correctCharacters: 0,
    incorrectCharacters: 0,
  });
  assertEqual(stats.accuracy, 0);
  assertEqual(stats.wpm, 0);
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
  throw new Error(`${failures} statistics test(s) failed — see output above.`);
}
