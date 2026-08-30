/**
 * Regression tests for the PRIORITY 1 typing bug: a learner pressing
 * the physical key the app's own phonetic keyboard maps to a given
 * Urdu letter was still marked incorrect.
 *
 * Root cause (see `TypingCaptureArea`'s doc comment and
 * `features/keyboard/README.md` for the full writeup): the capture
 * layer only ever read the hidden `<input>`'s native `value`. For a
 * learner without a native Urdu/Arabic OS keyboard layout — which is
 * the entire point of a *phonetic* keyboard course — a physical key
 * like `k` reached the DOM, and therefore the typing engine, as the
 * literal Latin letter `"k"`, which can never compare equal to the
 * lesson's Urdu target `"ک"` no matter what `normalizeUrduForComparison`
 * does. `compareCharacters`/`normalizeUrduForComparison` themselves
 * were never the bug (see `typingEngine.test.ts`, all 30 cases pass
 * unmodified) — nothing upstream of them was ever translating the
 * physical key into the Urdu character it's taught to produce.
 *
 * This file does not (and cannot, dependency-free) drive a real
 * `beforeinput` DOM event through `TypingCaptureArea` — see that
 * component for the actual fix. What it *does* verify, without any
 * DOM or React dependency, is the translation table the fix relies
 * on (`getUrduForKey`) combined end-to-end with the real typing
 * engine: typing the physical keys the course teaches for a real
 * lesson word must be marked fully correct, and — kept here as a
 * documented negative case, not a thing the app should ever do
 * again — the untranslated raw Latin keys must NOT be marked correct,
 * which is exactly the bug this fix removes.
 *
 * Run with:
 *   TSX_TSCONFIG_PATH=./tsconfig.app.json npx tsx src/features/typing/core/__tests__/phoneticCapture.test.ts
 */
import { getTypingState } from "../typingEngine";
import { getUrduForAltGrKey, getUrduForKey, getUrduForPhysicalKey, phoneticMap } from "@/features/keyboard/data/phoneticMap";
import { segmentText } from "../../utils/graphemes";

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

/** What `TypingCaptureArea`'s physical `keydown` handler does to one physical keystroke. */
function translatePhysicalKey(key: string): string {
  return getUrduForKey(key) ?? key;
}

/** Simulates a learner typing a sequence of physical keys through the (fixed) capture pipeline. */
function typePhysicalKeys(targetText: string, physicalKeys: string): ReturnType<typeof getTypingState> {
  const translated = segmentText(physicalKeys)
    .map(translatePhysicalKey)
    .join("");
  return getTypingState(targetText, translated);
}

test("DEBUG REPRO — real lesson word 'کتاب' (kitaab/book), physical keys 'ktab'", () => {
  const target = "کتاب"; // ک(k) ت(t) ا(a) ب(b) — one physical key per letter
  const physicalKeys = "ktab";

  const targetChars = segmentText(target);
  const translatedChars = segmentText(physicalKeys).map(translatePhysicalKey);

  // Debug report values (see task's required DEBUG REPORT format),
  // reproduced here as assertions so they can never silently drift:
  assertEqual(targetChars.join(","), ["ک", "ت", "ا", "ب"].join(","), "expected grapheme sequence");
  assertEqual(
    translatedChars.join(","),
    ["ک", "ت", "ا", "ب"].join(","),
    "physical keys 'k','t','a','b' -> phonetic translation must equal the target letters",
  );

  const state = typePhysicalKeys(target, physicalKeys);
  assertEqual(state.isComplete, true, "typing the taught physical keys must complete the word");
  assertEqual(state.incorrectCharacters, 0);
  assertEqual(state.correctCharacters, 4);
});

test("BUG (must stay broken without translation) — raw untranslated Latin keys are NOT correct", () => {
  // This is the exact bug: before the fix, this is what the engine
  // actually received. It documents why the fix is necessary — this
  // assertion is expected to hold both before and after the fix,
  // since `compareCharacters` correctly treats Latin 'k' as not
  // equal to Urdu 'ک'. The fix lives upstream, in translation, not
  // in loosening this comparison.
  const target = "کتاب";
  const rawLatinInput = "ktab"; // what the DOM gave the engine pre-fix
  const state = getTypingState(target, rawLatinInput);
  assertEqual(state.isComplete, false, "raw Latin input must not be accepted as the Urdu target");
  assertEqual(state.correctCharacters, 0, "no positional match between Latin and Urdu code points");
});

test("every letter in phoneticMap round-trips: physical key -> translated char -> marked correct", () => {
  for (const [key, urdu] of Object.entries(phoneticMap)) {
    const state = typePhysicalKeys(urdu, key);
    assertEqual(
      state.characters[0]?.status,
      "correct",
      `key '${key}' must translate to '${urdu}' and be marked correct`,
    );
  }
});

test("space is untranslated by phoneticMap and still matches a literal space target", () => {
  const target = "ا ب"; // alef, space, bay
  const state = typePhysicalKeys(target, "a b");
  assertEqual(state.isComplete, true);
  assertEqual(state.incorrectCharacters, 0);
});

test("second real lesson word 'پانی' (paani/water), physical keys 'pani' per the taught mapping", () => {
  // پ=p, ا=a, ن=n, ی=i (choti ye is on "i" in the real CRULP-standard
  // layout this app now follows; "y" is bari ye, ے, a different letter)
  const target = "پانی";
  const state = typePhysicalKeys(target, "pani");
  assertEqual(state.isComplete, true);
  assertEqual(state.correctCharacters, 4);
});


test("physical key-code mapping handles Shift-layer characters without browser symbol ambiguity", () => {
  assertEqual(getUrduForPhysicalKey("KeyA", true), "آ");
  assertEqual(getUrduForPhysicalKey("KeyQ", true), "ْ");
  assertEqual(getUrduForPhysicalKey("Digit1", true), "1");
  assertEqual(getUrduForPhysicalKey("Comma", true), "؟");
  assertEqual(getUrduForPhysicalKey("BracketLeft", true), "{");
  assertEqual(getUrduForPhysicalKey("KeyA", false), "ا");
  assertEqual(getUrduForPhysicalKey("KeyQ", false), "ق");
});

test("extended AltGr layer maps Urdu diacritics and honorific signs", () => {
  assertEqual(getUrduForAltGrKey("e"), "ٰ");
  assertEqual(getUrduForAltGrKey("p"), "ُ");
  assertEqual(getUrduForAltGrKey("d"), "ﷺ");
  assertEqual(getUrduForAltGrKey("r"), "ؓ");
  assertEqual(getUrduForAltGrKey("h"), "ؒ");
  assertEqual(getUrduForAltGrKey("j"), "ﷻ");
  assertEqual(getUrduForAltGrKey("b"), "﷽");
});

test("extended AltGr phrase shortcuts emit the complete respectful phrase", () => {
  assertEqual(getUrduForAltGrKey("R"), "رضی اللہ عنہ");
  assertEqual(getUrduForAltGrKey("T"), "رضی اللہ تعالیٰ عنہ");
  assertEqual(getUrduForAltGrKey("H"), "رحمۃ اللہ علیہ");
  assertEqual(getUrduForAltGrKey("A"), "رحمۃ اللہ علیہا");
  assertEqual(getUrduForAltGrKey("L"), "علیہ السلام");
});

test("a genuinely wrong physical key is still marked incorrect after translation", () => {
  const target = "ب"; // bay, taught key 'b'
  const state = typePhysicalKeys(target, "s"); // seen, taught key 's' — wrong letter entirely
  assertEqual(state.characters[0]?.status, "incorrect");
});

let failures = 0;
for (const result of results) {
  if (result.passed) {
    console.log(`✓ ${result.name}`);
  } else {
    failures++;
    console.log(`✗ ${result.name}`);
    console.log(`  ${String(result.error)}`);
  }
}
console.log(`\n${results.length - failures}/${results.length} tests passed.`);
if (failures > 0) process.exit(1);
