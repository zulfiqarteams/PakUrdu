/**
 * Tests for the pure timer core (`core/timer.ts`).
 *
 * Same dependency-free style as
 * `src/features/typing/core/__tests__/typingEngine.test.ts` — no test
 * framework is configured yet, so run directly with any
 * TypeScript-capable runner, e.g.:
 *
 *   npx tsx src/features/statistics/core/__tests__/timer.test.ts
 */
import {
  completeTimer,
  createTimer,
  getElapsedMs,
  pauseTimer,
  resetTimer,
  resumeTimer,
  startTimer,
} from "../timer";

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

test("createTimer — starts idle with zero elapsed", () => {
  const timer = createTimer();
  assertEqual(timer.status, "idle");
  assertEqual(getElapsedMs(timer, 1_000), 0);
});

test("getElapsedMs — idle never advances, regardless of `now`", () => {
  const timer = createTimer();
  assertEqual(getElapsedMs(timer, 999_999), 0);
});

test("startTimer — idle becomes running and elapsed grows with time", () => {
  const timer = startTimer(createTimer(), 1_000);
  assertEqual(timer.status, "running");
  assertEqual(getElapsedMs(timer, 1_000), 0);
  assertEqual(getElapsedMs(timer, 4_500), 3_500);
});

test("startTimer — is a no-op once already running (can't restart mid-session)", () => {
  const running = startTimer(createTimer(), 1_000);
  const startedAgain = startTimer(running, 5_000);
  assertEqual(getElapsedMs(startedAgain, 5_000), 4_000);
});

test("pauseTimer — banks elapsed time and stops advancing", () => {
  const running = startTimer(createTimer(), 0);
  const paused = pauseTimer(running, 2_000);
  assertEqual(paused.status, "paused");
  assertEqual(getElapsedMs(paused, 2_000), 2_000);
  assertEqual(getElapsedMs(paused, 10_000), 2_000, "elapsed must not grow while paused");
});

test("pauseTimer — no-op when not running", () => {
  const idle = createTimer();
  assertEqual(pauseTimer(idle, 1_000).status, "idle");
});

test("resumeTimer — continues accumulating from where it paused", () => {
  const running = startTimer(createTimer(), 0);
  const paused = pauseTimer(running, 2_000);
  const resumed = resumeTimer(paused, 5_000);
  assertEqual(resumed.status, "running");
  assertEqual(getElapsedMs(resumed, 5_000), 2_000);
  assertEqual(getElapsedMs(resumed, 7_000), 4_000);
});

test("resumeTimer — no-op when not paused", () => {
  const idle = createTimer();
  assertEqual(resumeTimer(idle, 1_000).status, "idle");
});

test("completeTimer — freezes elapsed time from running", () => {
  const running = startTimer(createTimer(), 0);
  const completed = completeTimer(running, 3_000);
  assertEqual(completed.status, "completed");
  assertEqual(getElapsedMs(completed, 3_000), 3_000);
  assertEqual(getElapsedMs(completed, 999_000), 3_000, "completed must never advance again");
});

test("completeTimer — freezes elapsed time from paused", () => {
  const running = startTimer(createTimer(), 0);
  const paused = pauseTimer(running, 1_500);
  const completed = completeTimer(paused, 9_999);
  assertEqual(getElapsedMs(completed, 9_999), 1_500);
});

test("completeTimer — an idle (never-started) timer completes at zero elapsed", () => {
  const completed = completeTimer(createTimer(), 5_000);
  assertEqual(completed.status, "completed");
  assertEqual(getElapsedMs(completed, 5_000), 0);
});

test("resetTimer — returns to a fresh idle state", () => {
  const running = startTimer(createTimer(), 0);
  const completed = completeTimer(running, 10_000);
  const reset = resetTimer();
  assertEqual(reset.status, "idle");
  assertEqual(getElapsedMs(reset, 10_000), 0);
  // sanity: the original completed timer is untouched (pure functions)
  assertEqual(getElapsedMs(completed, 10_000), 10_000);
});

test("getElapsedMs — never negative even if `now` is somehow earlier than the segment start", () => {
  const running = startTimer(createTimer(), 5_000);
  assertEqual(getElapsedMs(running, 1_000), 0);
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
  throw new Error(`${failures} timer test(s) failed — see output above.`);
}
