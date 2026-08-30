/**
 * Tests for `commonUrduWords` and its batching helpers, which feed
 * the homepage hero typing widget (`HeroTypingWidget`, Requirement 1
 * of the mobile/homepage redesign work).
 *
 * No test framework (vitest/jest) is configured in this project (see
 * `typingEngine.test.ts`'s doc comment) — this file follows that same
 * dependency-free convention. Run it directly with:
 *
 *   npx tsx src/features/typing/core/__tests__/commonUrduWords.test.ts
 */
import { commonUrduWords, getWordBatch, buildWordBatchText } from "../../data/commonUrduWords";
import { getExpectedKey } from "@/features/keyboard/data/phoneticMap";
import { segmentText } from "../../utils/graphemes";

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
  try {
    fn();
    results.push({ name, passed: true });
  } catch (error) {
    results.push({ name, passed: false, error });
  }
}

// --- Word list shape -----------------------------------------------------
test("Test 1 — exactly 500 curated practice words", () => {
  assertTrue(
    commonUrduWords.length === 500,
    `Expected exactly 500 words, got ${commonUrduWords.length}`,
  );
});

test("Test 2 — no duplicate / malformed practice words", () => {
  assertTrue(
    commonUrduWords.every((word) => !word.includes(" ")),
    `Expected every practice entry to be one atomic word`,
  );
});

test("Test 3 — every word is non-empty and trimmed (no stray whitespace)", () => {
  for (const word of commonUrduWords) {
    assertTrue(word.length > 0, "found an empty entry");
    assertEqual(word, word.trim(), `"${word}" has leading/trailing whitespace`);
  }
});

test("Test 4 — every word is unique (no accidental duplicates)", () => {
  const seen = new Set<string>();
  for (const word of commonUrduWords) {
    assertTrue(!seen.has(word), `duplicate word: "${word}"`);
    seen.add(word);
  }
});

test("Test 5 — every vocabulary grapheme is supported by the verified phonetic keyboard", () => {
  for (const word of commonUrduWords) {
    for (const grapheme of segmentText(word)) {
      assertTrue(Boolean(getExpectedKey(grapheme)), `No phonetic mapping for \"${grapheme}\" in \"${word}\"`);
    }
  }
});

test("Test 5 — every word is Urdu-script text (Arabic block, optional inner space)", () => {
  // Includes Arabic Presentation Forms (\u0750-\u077F, \uFB50-\uFDFF,
  // \uFE70-\uFEFF) alongside the main Arabic block: legitimate Urdu
  // religious/honorific text uses ligatures from these ranges (e.g. "ﷺ",
  // U+FDFA), which the original main-block-only regex incorrectly flagged
  // as "non-Urdu".
  const urduOrSpace = /^[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/;
  for (const word of commonUrduWords) {
    assertTrue(urduOrSpace.test(word), `"${word}" contains non-Urdu characters`);
  }
});

// --- getWordBatch ----------------------------------------------------------
test("Test 6 — getWordBatch returns words in order from startIndex", () => {
  const batch = getWordBatch(0, 5);
  assertEqual(batch.length, 5);
  for (let i = 0; i < 5; i++) assertEqual(batch[i], commonUrduWords[i]);
});

test("Test 7 — getWordBatch wraps around to the start of the list", () => {
  const total = commonUrduWords.length;
  const batch = getWordBatch(total - 2, 5);
  assertEqual(batch[0], commonUrduWords[total - 2]);
  assertEqual(batch[1], commonUrduWords[total - 1]);
  assertEqual(batch[2], commonUrduWords[0]);
  assertEqual(batch[3], commonUrduWords[1]);
  assertEqual(batch[4], commonUrduWords[2]);
});

test("Test 8 — getWordBatch returns [] for a non-positive count", () => {
  assertEqual(getWordBatch(0, 0).length, 0);
  assertEqual(getWordBatch(0, -3).length, 0);
});

// --- buildWordBatchText ------------------------------------------------------
test("Test 9 — buildWordBatchText joins with single spaces, no leading/trailing whitespace", () => {
  const text = buildWordBatchText(0, 4);
  assertEqual(text, commonUrduWords.slice(0, 4).join(" "));
  assertTrue(!text.startsWith(" "), "text starts with a space");
  assertTrue(!text.endsWith(" "), "text ends with a space");
  assertTrue(!/\s{2,}/.test(text), "text contains a double space");
});

test("Test 10 — buildWordBatchText wraps consistently with getWordBatch", () => {
  const total = commonUrduWords.length;
  const text = buildWordBatchText(total - 1, 3);
  assertEqual(text, `${commonUrduWords[total - 1]} ${commonUrduWords[0]} ${commonUrduWords[1]}`);
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
  throw new Error(`${failures} common Urdu words test(s) failed — see output above.`);
}
