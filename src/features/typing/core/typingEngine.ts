import { segmentText } from "@/features/typing/utils/graphemes";
import { normalizeUrduForComparison } from "@/features/typing/utils/normalizeUrduText";
import type {
  CharacterStatus,
  TargetCharacter,
  TypingMistake,
  TypingState,
  TypingStatus,
  TypingStrictness,
} from "@/features/typing/types";

/**
 * Builds the per-character breakdown of the target against what's
 * been typed so far. Every entry in `targetChars` gets exactly one
 * status — this is the single source of truth `TypingText` renders
 * from, so comparison never happens twice in two different places.
 *
 * The equality check itself goes through `normalizeUrduForComparison`
 * on both sides — see that module's doc comment for exactly what it
 * does and does not touch. `char` in the returned `TargetCharacter` is
 * always the original, un-normalized target character, so display is
 * completely unaffected; only the correct/incorrect *decision* uses
 * the normalized form.
 */
export function compareCharacters(
  targetChars: string[],
  inputChars: string[],
): TargetCharacter[] {
  return targetChars.map((char, index) => {
    let status: CharacterStatus;
    if (index < inputChars.length) {
      status =
        normalizeUrduForComparison(inputChars[index]) === normalizeUrduForComparison(char)
          ? "correct"
          : "incorrect";
    } else if (index === inputChars.length) {
      status = "current";
    } else {
      status = "pending";
    }
    return { index, char, status };
  });
}

/**
 * accuracy = correctCharacters / totalTypedCharacters * 100
 * Returns 0 when nothing has been typed yet (avoids division by
 * zero). Rounded to the nearest whole percent for display.
 */
export function calculateAccuracy(correctCharacters: number, totalTypedCharacters: number): number {
  if (totalTypedCharacters <= 0) return 0;
  return Math.round((correctCharacters / totalTypedCharacters) * 100);
}

/**
 * Derives the complete `TypingState` from just `targetText` and
 * `userInput`. This is the one place that decides what "correct",
 * "current", "complete", and "accuracy" mean — everything else
 * (the hook, the UI) reads from this instead of recomputing it.
 *
 * `userInput` longer than the target is defensively clamped rather
 * than trusted, so this function stays safe to call directly (e.g.
 * from tests) without going through `appendCharacter`.
 */
export function getTypingState(
  targetText: string,
  userInput: string,
  lastInput: string | null = null,
): TypingState {
  const targetChars = segmentText(targetText);
  const inputChars = segmentText(userInput).slice(0, targetChars.length);

  const characters = compareCharacters(targetChars, inputChars);

  let correctCharacters = 0;
  let incorrectCharacters = 0;
  for (const character of characters) {
    if (character.status === "correct") correctCharacters++;
    else if (character.status === "incorrect") incorrectCharacters++;
  }

  const totalCharacters = targetChars.length;
  const currentIndex = inputChars.length;
  const remainingCharacters = Math.max(totalCharacters - currentIndex, 0);
  const accuracy = calculateAccuracy(correctCharacters, currentIndex);

  // An empty target has nothing left to type — treat it as
  // vacuously complete rather than a session that can never finish.
  // Otherwise: complete only when every target character has been
  // typed AND every one of them is correct. Reaching
  // userInput.length === targetText.length alone is NOT enough —
  // unresolved incorrect characters must block completion.
  const isComplete =
    totalCharacters === 0 ||
    (currentIndex === totalCharacters &&
      incorrectCharacters === 0 &&
      correctCharacters === totalCharacters);

  let status: TypingStatus = "idle";
  if (isComplete) status = "completed";
  else if (currentIndex > 0) status = "typing";

  return {
    targetText,
    userInput,
    currentIndex,
    status,
    correctCharacters,
    incorrectCharacters,
    remainingCharacters,
    totalCharacters,
    accuracy,
    isComplete,
    lastInput,
    characters,
  };
}

/**
 * Folds one wrong keystroke into a session's mistake list. Takes the
 * already-computed `TargetCharacter` at the position that was just
 * typed (from `getTypingState(...).characters`) rather than
 * re-deriving expected-vs-typed itself — comparison happens in
 * exactly one place (`compareCharacters`), this just aggregates.
 *
 * Callers should only invoke this when `character.status ===
 * "incorrect"`; a correct keystroke has nothing to merge.
 *
 * Same (index, typed) pair seen again just increments `count`
 * in place; a new pair is appended. Order of first occurrence is
 * preserved, so a results screen can show "first mistake first"
 * without an extra sort.
 */
export function mergeMistakes(
  mistakes: TypingMistake[],
  character: TargetCharacter,
  typed: string,
): TypingMistake[] {
  const existingIndex = mistakes.findIndex(
    (mistake) => mistake.index === character.index && mistake.typed === typed,
  );

  if (existingIndex === -1) {
    return [...mistakes, { index: character.index, expected: character.char, typed, count: 1 }];
  }

  return mistakes.map((mistake, i) =>
    i === existingIndex ? { ...mistake, count: mistake.count + 1 } : mistake,
  );
}

/** The state a fresh session starts in — equivalent to `getTypingState(targetText, "")`. */
export function createInitialState(targetText: string): TypingState {
  return getTypingState(targetText, "", null);
}

/**
 * Appends one grapheme to `userInput`. Refuses silently (returns the
 * unchanged input) once the target's length has been reached, and
 * refuses an empty/falsy `char` — callers can always trust that a
 * changed return value means the character was accepted.
 *
 * `strictness` (master-spec §3.4):
 * - "lenient" (default, matches this app's behavior since before this
 *   option existed): a wrong keystroke is still appended, marked
 *   `incorrect`, and the cursor advances past it — the learner keeps
 *   typing and can go back to fix it later.
 * - "strict": a wrong keystroke is rejected outright (userInput is
 *   returned unchanged, exactly like hitting the length cap) — the
 *   cursor does not advance and the learner must retype the correct
 *   character before moving on.
 *
 * Left as "lenient" everywhere by default: none of this app's screens
 * asked for blocking behavior, and switching the default would change
 * the feel of every existing typing surface at once. A screen that
 * wants "strict" passes it explicitly to `useTypingEngine`.
 */
export function appendCharacter(
  targetText: string,
  userInput: string,
  char: string,
  strictness: TypingStrictness = "lenient",
): string {
  if (!char) return userInput;

  const targetGraphemes = segmentText(targetText);
  const currentLength = segmentText(userInput).length;
  if (currentLength >= targetGraphemes.length) return userInput;

  if (strictness === "strict") {
    const expected = targetGraphemes[currentLength];
    if (normalizeUrduForComparison(char) !== normalizeUrduForComparison(expected)) {
      return userInput;
    }
  }

  return userInput + char;
}

/**
 * Removes the most recently typed grapheme. Grapheme-aware (goes
 * through `segmentText`) so backspace can never strand half of a
 * combined character. A backspace on empty input is a no-op, not an
 * error — callers can compare the return value to detect that.
 *
 * Backspace does not count as "typed input": callers should NOT pass
 * the removed character as `lastInput` when deriving the next state.
 */
export function removeLastCharacter(userInput: string): string {
  const chars = segmentText(userInput);
  if (chars.length === 0) return userInput;
  return chars.slice(0, -1).join("");
}
