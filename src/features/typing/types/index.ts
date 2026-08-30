/** The comparison state of one grapheme in the target text. */
export type CharacterStatus = "pending" | "current" | "correct" | "incorrect";

/** One position in the target text, with its live comparison state. */
export interface TargetCharacter {
  /** Index into the grapheme-segmented target, not a raw string index. */
  index: number;
  /** The grapheme cluster itself (one Urdu letter, a space, punctuation, ...). */
  char: string;
  status: CharacterStatus;
}

/** Lifecycle of a single typing session. */
export type TypingStatus = "idle" | "typing" | "completed";

/**
 * The full, derived state of a typing session. Everything here is
 * computed from `targetText` + `userInput` — nothing is stored that
 * could drift out of sync with those two values.
 */
export interface TypingState {
  targetText: string;
  userInput: string;
  /** How many graphemes the learner has typed so far. */
  currentIndex: number;
  status: TypingStatus;
  correctCharacters: number;
  incorrectCharacters: number;
  /** Graphemes left to type, measured against target length. */
  remainingCharacters: number;
  /** Total graphemes in the target. */
  totalCharacters: number;
  /** 0–100, rounded. See `calculateAccuracy` for the exact formula. */
  accuracy: number;
  isComplete: boolean;
  /** The most recently accepted input grapheme, or `null` before any
   *  input / immediately after a reset. Backspace does not set this
   *  — it is not "new typed input". */
  lastInput: string | null;
  /** Per-character breakdown of the target, for rendering `TypingText`. */
  characters: TargetCharacter[];
}

/**
 * One recorded typing mistake — a specific wrong keystroke made
 * against a specific target position, aggregated by (index, typed)
 * pair. Deliberately NOT part of `TypingState`: mistakes are a
 * cumulative session concept (they must survive a backspace-and-retry,
 * unlike `incorrectCharacters`, which only reflects the *current*
 * comparison and clears the moment a wrong character is deleted), so
 * they're tracked one layer up, in `useTypingEngine`.
 */
export interface TypingMistake {
  /** Index into the grapheme-segmented target text where the mistake occurred. */
  index: number;
  /** The grapheme that was expected at this position. */
  expected: string;
  /** The grapheme the learner actually typed instead. */
  typed: string;
  /** How many times this exact (index, typed) mistake has occurred this session. */
  count: number;
}
