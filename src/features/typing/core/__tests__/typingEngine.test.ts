/**
 * Tests for the pure typing engine core.
 *
 * No test framework (vitest/jest) is configured in this project yet,
 * so this file is dependency-free on purpose — no `node:assert`, no
 * Node globals — so it type-checks cleanly under this app's
 * browser-only `tsconfig.app.json` (no `@types/node`) and doesn't
 * break `npm run build`, which runs `tsc -b` over all of `src/`.
 * Run it directly with any TypeScript-capable runner, e.g.:
 *
 *   npx tsx src/features/typing/core/__tests__/typingEngine.test.ts
 *
 * If vitest/jest is added to the project later, these `test(...)`
 * cases translate almost 1:1 into `it(...)` blocks, and `assertEqual`
 * into `expect(...).toBe(...)` — the assertions themselves don't
 * need to change.
 */
import {
  appendCharacter,
  calculateAccuracy,
  compareCharacters,
  createInitialState,
  getTypingState,
  mergeMistakes,
  removeLastCharacter,
} from "../typingEngine";
import { segmentText } from "../../utils/graphemes";
import type { TypingMistake } from "../../types";

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

// --- Test 1: one correct character ------------------------------------
test("Test 1 — target 'abc', input 'a' → 1 correct character", () => {
  const state = getTypingState("abc", "a");
  assertEqual(state.correctCharacters, 1);
  assertEqual(state.incorrectCharacters, 0);
  assertEqual(state.currentIndex, 1);
});

// --- Test 2: one correct, one incorrect ---------------------------------
test("Test 2 — target 'abc', input 'ax' → 1 correct, 1 incorrect", () => {
  const state = getTypingState("abc", "ax");
  assertEqual(state.correctCharacters, 1);
  assertEqual(state.incorrectCharacters, 1);
  assertEqual(state.characters[0].status, "correct");
  assertEqual(state.characters[1].status, "incorrect");
  assertEqual(state.characters[2].status, "current");
});

// --- Test 3: backspace ---------------------------------------------------
test("Test 3 — backspace removes the last typed character", () => {
  const afterTyping = "abc";
  const afterBackspace = removeLastCharacter(afterTyping);
  assertEqual(afterBackspace, "ab");

  // Backspace on empty input is a safe no-op.
  assertEqual(removeLastCharacter(""), "");
});

// --- Test 4: space -------------------------------------------------------
test("Test 4 — target 'a b', space is a real target character", () => {
  const state = getTypingState("a b", "a ");
  assertEqual(state.characters[1].char, " ");
  assertEqual(state.characters[1].status, "correct");
  assertEqual(state.currentIndex, 2);

  const wrongSpace = getTypingState("a b", "ax");
  assertEqual(wrongSpace.characters[1].status, "incorrect");
});

// --- Test 5: Urdu ----------------------------------------------------------
test("Test 5 — Urdu target 'پاکستان' segments and compares per-letter", () => {
  const target = "پاکستان";
  const targetChars = segmentText(target);
  assertEqual(targetChars.length, 7);

  const state = getTypingState(target, "پاک");
  assertEqual(state.currentIndex, 3);
  assertEqual(state.correctCharacters, 3);
  assertEqual(state.remainingCharacters, 4);
  assertEqual(state.characters[3].status, "current");
  assertEqual(state.characters[3].char, "س");
});

// --- Test 6: punctuation ----------------------------------------------------
test("Test 6 — punctuation 'سلام۔' is treated as a normal target character", () => {
  const target = "سلام۔";
  const targetChars = segmentText(target);
  assertEqual(targetChars[targetChars.length - 1], "۔");

  const correct = getTypingState(target, target);
  assertEqual(correct.isComplete, true);

  const missingFullStop = getTypingState(target, "سلام");
  assertEqual(missingFullStop.isComplete, false);
  assertEqual(missingFullStop.characters[4].status, "current");
});

// --- Test 7: full correct completion ----------------------------------------
test("Test 7 — fully correct target sets isComplete = true", () => {
  const state = getTypingState("abc", "abc");
  assertEqual(state.isComplete, true);
  assertEqual(state.status, "completed");
});

// --- Test 8: same length but wrong characters must NOT complete ------------
test("Test 8 — matching length with a wrong character is not falsely complete", () => {
  const state = getTypingState("abc", "abx");
  assertEqual(state.userInput.length, "abc".length);
  assertEqual(state.isComplete, false);
  assertEqual(state.status, "typing");
  assertEqual(state.incorrectCharacters, 1);
});

// --- Test 9: reset -----------------------------------------------------------
test("Test 9 — createInitialState restores a clean starting state", () => {
  const fresh = createInitialState("abc");
  assertEqual(fresh.userInput, "");
  assertEqual(fresh.currentIndex, 0);
  assertEqual(fresh.correctCharacters, 0);
  assertEqual(fresh.incorrectCharacters, 0);
  assertEqual(fresh.isComplete, false);
  assertEqual(fresh.status, "idle");
  assertEqual(fresh.lastInput, null);
});

// --- Test 10: empty target -----------------------------------------------
test("Test 10 — empty target is handled gracefully (no crash, no NaN)", () => {
  const state = getTypingState("", "");
  assertEqual(state.totalCharacters, 0);
  assertEqual(state.remainingCharacters, 0);
  assertEqual(state.accuracy, 0);
  assertEqual(Number.isNaN(state.accuracy), false);
  assertEqual(state.isComplete, true); // nothing left to type

  // Typing against an empty target must not be accepted.
  const unchanged = appendCharacter("", "", "a");
  assertEqual(unchanged, "");
});

// --- Additional coverage for calculateAccuracy / compareCharacters ---------
test("calculateAccuracy — zero typed characters returns 0, not NaN", () => {
  assertEqual(calculateAccuracy(0, 0), 0);
});

test("calculateAccuracy — rounds to nearest whole percent", () => {
  assertEqual(calculateAccuracy(2, 3), 67); // 66.67% → 67
});

test("compareCharacters — current marker sits exactly at input length", () => {
  const result = compareCharacters(["a", "b", "c"], ["a"]);
  assertEqual(result[0].status, "correct");
  assertEqual(result[1].status, "current");
  assertEqual(result[2].status, "pending");
});

test("appendCharacter — refuses to grow past target length", () => {
  const full = appendCharacter("ab", "ab", "c");
  assertEqual(full, "ab");
});

test("appendCharacter — accepts a character when there's room", () => {
  const grown = appendCharacter("ab", "a", "b");
  assertEqual(grown, "ab");
});

// --- mergeMistakes -----------------------------------------------------------
test("mergeMistakes — a brand-new mistake is appended with count 1", () => {
  const character = compareCharacters(["a", "b"], ["a"])[1]; // index 1, char 'b', status 'current'
  const result = mergeMistakes([], character, "x");
  assertEqual(result.length, 1);
  assertEqual(result[0].index, 1);
  assertEqual(result[0].expected, "b");
  assertEqual(result[0].typed, "x");
  assertEqual(result[0].count, 1);
});

test("mergeMistakes — the same (index, typed) pair increments count instead of duplicating", () => {
  const character = compareCharacters(["a", "b"], ["a"])[1];
  const once = mergeMistakes([], character, "x");
  const twice = mergeMistakes(once, character, "x");
  assertEqual(twice.length, 1);
  assertEqual(twice[0].count, 2);
});

test("mergeMistakes — a different `typed` at the same index is a separate entry", () => {
  const character = compareCharacters(["a", "b"], ["a"])[1];
  const withX = mergeMistakes([], character, "x");
  const withXAndY = mergeMistakes(withX, character, "y");
  assertEqual(withXAndY.length, 2);
  assertEqual(withXAndY[0].typed, "x");
  assertEqual(withXAndY[1].typed, "y");
});

test("mergeMistakes — same `typed` character at a different index is a separate entry", () => {
  const chars = compareCharacters(["a", "b", "c"], ["a", "b"]); // 'current' is index 2
  const first = mergeMistakes([], chars[1], "x"); // pretend index 1 was once wrong too
  const second = mergeMistakes(first, chars[2], "x");
  assertEqual(second.length, 2);
  assertEqual(second[0].index, 1);
  assertEqual(second[1].index, 2);
});

test("mergeMistakes — existing mistakes are left untouched (not mutated) by a new merge", () => {
  const character = compareCharacters(["a", "b"], ["a"])[1];
  const original: TypingMistake[] = [{ index: 0, expected: "a", typed: "z", count: 1 }];
  const result = mergeMistakes(original, character, "x");
  assertEqual(original.length, 1); // untouched
  assertEqual(result.length, 2);
});

// --- sessionAccuracy formula reuse --------------------------------------------
test("session keystroke accuracy reuses calculateAccuracy — 3 keystrokes, 2 correct → 67%", () => {
  assertEqual(calculateAccuracy(2, 3), 67);
});

test("session keystroke accuracy — a backspace-and-retry keeps the mistake counted (not 100%)", () => {
  // Simulates: type 'x' (wrong) at index 0, backspace, type 'a' (correct).
  // sessionKeystrokes counts BOTH attempts; sessionCorrectKeystrokes only the second.
  const sessionKeystrokes = 2;
  const sessionCorrectKeystrokes = 1;
  assertEqual(calculateAccuracy(sessionCorrectKeystrokes, sessionKeystrokes), 50);
  // Whereas the current-input accuracy (Part 7) reads 100% right after the fix —
  // both numbers are correct for what they measure; this just proves they differ.
  const currentAccuracy = getTypingState("a", "a").accuracy;
  assertEqual(currentAccuracy, 100);
});

// --- Test 11: Arabic/Urdu Unicode variant equivalence (bug fix) ------------
test("Test 11 — Arabic KAF (ك) typed for Urdu KEHEH (ک) target is accepted", () => {
  // ARABIC LETTER KAF U+0643 vs Urdu KEHEH U+06A9 — some system
  // keyboards/IMEs emit the Arabic code point for what looks, to the
  // learner, like the same Urdu letter.
  const state = getTypingState("\u06A9", "\u0643");
  assertEqual(state.characters[0].status, "correct");
  // The displayed character must stay exactly what the lesson authored.
  assertEqual(state.characters[0].char, "\u06A9");
});

test("Test 12 — Arabic YEH (ي) typed for Urdu YEH (ی) target is accepted", () => {
  const state = getTypingState("\u06CC", "\u064A");
  assertEqual(state.characters[0].status, "correct");
});

test("Test 13 — a Zero Width Non-Joiner riding along with a typed letter does not break the match", () => {
  // Simulates an IME inserting U+200C right after the base letter —
  // Intl.Segmenter groups them into one grapheme cluster, so this is
  // exactly the shape real browser input takes in that scenario.
  const state = getTypingState("\u06CC", "\u06CC\u200C");
  assertEqual(state.characters[0].status, "correct");
});

test("Test 14 — a Zero Width Joiner riding along with a typed letter does not break the match", () => {
  const state = getTypingState("\u0628", "\u0628\u200D");
  assertEqual(state.characters[0].status, "correct");
});

test("Test 15 — Kashida/Tatweel riding along with a typed letter does not break the match", () => {
  const state = getTypingState("\u062F", "\u062F\u0640");
  assertEqual(state.characters[0].status, "correct");
});

test("Test 16 — normalization never collapses ہ (choti he) and ھ (do-chashmi he) — genuinely different letters", () => {
  const wrongLetter = getTypingState("\u06C1", "\u06BE"); // target ہ, typed ھ
  assertEqual(wrongLetter.characters[0].status, "incorrect");

  const otherWay = getTypingState("\u06BE", "\u06C1"); // target ھ, typed ہ
  assertEqual(otherWay.characters[0].status, "incorrect");
});

test("Test 17 — normalization never touches diacritics — a genuinely wrong letter still fails", () => {
  const state = getTypingState("\u0627", "\u0628"); // target ا (alef), typed ب (bay)
  assertEqual(state.characters[0].status, "incorrect");
});

test("Test 18 — full Urdu word typed via Arabic-variant code points completes correctly", () => {
  // "کی" typed as Arabic KAF + Arabic YEH — both variants at once,
  // across a real (if short) word, not just isolated letters.
  const state = getTypingState("\u06A9\u06CC", "\u0643\u064A");
  assertEqual(state.isComplete, true);
  assertEqual(state.incorrectCharacters, 0);
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
  throw new Error(`${failures} typing engine test(s) failed — see output above.`);
}
