import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  appendCharacter,
  calculateAccuracy,
  createInitialState,
  getTypingState,
  mergeMistakes,
  removeLastCharacter,
} from "@/features/typing/core/typingEngine";
import type { TypingMistake, TypingState } from "@/features/typing/types";

interface UseTypingEngineOptions {
  targetText: string;
}

type TypingAction =
  | { type: "type"; char: string }
  | { type: "backspace" }
  | { type: "reset" }
  | { type: "setTarget"; targetText: string };

/**
 * `TypingState` plus session-level bookkeeping that must survive a
 * backspace-and-retry, which `TypingState`'s own counts deliberately
 * do not (see `TypingMistake`'s doc comment). Kept in this hook
 * rather than the pure core because it's a property of a *session*,
 * not of a single (targetText, userInput) snapshot.
 */
interface EngineState extends TypingState {
  /** Every wrong keystroke made this session, aggregated by position + what was typed. */
  mistakes: TypingMistake[];
  /** Every accepted keystroke this session, correct or not — unlike `currentIndex`, never shrinks on backspace. */
  sessionKeystrokes: number;
  /** The subset of `sessionKeystrokes` that were correct on first entry. */
  sessionCorrectKeystrokes: number;
  /**
   * 0–100, rounded — accuracy across the whole session, keystroke by
   * keystroke, including ones later corrected with backspace. This is
   * the honest "how clean was your typing" number; `accuracy` (from
   * `TypingState`) only reflects the *current* input and can read
   * 100% right after fixing a mistake, which is correct for what it
   * measures but not what a results screen should headline.
   */
  sessionAccuracy: number;
}

function createInitialEngineState(targetText: string): EngineState {
  return {
    ...createInitialState(targetText),
    mistakes: [],
    sessionKeystrokes: 0,
    sessionCorrectKeystrokes: 0,
    sessionAccuracy: 0,
  };
}

function reducer(state: EngineState, action: TypingAction): EngineState {
  switch (action.type) {
    case "type": {
      const nextInput = appendCharacter(state.targetText, state.userInput, action.char);
      // Rejected (already full, or an empty/falsy character) — no state change.
      if (nextInput === state.userInput) return state;

      const nextTyping = getTypingState(state.targetText, nextInput, action.char);

      // The position that was just filled — reuse the comparison
      // `getTypingState` already computed instead of re-deriving it.
      const typedCharacter = nextTyping.characters[state.currentIndex];
      const wasCorrect = typedCharacter?.status === "correct";

      const mistakes =
        typedCharacter && !wasCorrect
          ? mergeMistakes(state.mistakes, typedCharacter, action.char)
          : state.mistakes;

      const sessionKeystrokes = state.sessionKeystrokes + 1;
      const sessionCorrectKeystrokes = state.sessionCorrectKeystrokes + (wasCorrect ? 1 : 0);

      return {
        ...nextTyping,
        mistakes,
        sessionKeystrokes,
        sessionCorrectKeystrokes,
        sessionAccuracy: calculateAccuracy(sessionCorrectKeystrokes, sessionKeystrokes),
      };
    }
    case "backspace": {
      const nextInput = removeLastCharacter(state.userInput);
      if (nextInput === state.userInput) return state;
      // Backspace never counts as new typed input, so lastInput,
      // mistakes, and the session keystroke tally are all left
      // exactly as they were — a correction doesn't erase the fact
      // that the mistake happened.
      return {
        ...getTypingState(state.targetText, nextInput, state.lastInput),
        mistakes: state.mistakes,
        sessionKeystrokes: state.sessionKeystrokes,
        sessionCorrectKeystrokes: state.sessionCorrectKeystrokes,
        sessionAccuracy: state.sessionAccuracy,
      };
    }
    case "reset":
      return createInitialEngineState(state.targetText);
    case "setTarget":
      return createInitialEngineState(action.targetText);
    default:
      return state;
  }
}

export interface UseTypingEngineResult extends EngineState {
  /** Accepts one grapheme (already-composed text, not a raw KeyboardEvent). */
  typeCharacter: (char: string) => void;
  backspace: () => void;
  reset: () => void;
}

/**
 * React hook wrapping the pure typing engine (`core/typingEngine.ts`).
 * All comparison/completion logic lives in that pure module — this
 * hook only wires it to component state via `useReducer`, so a
 * keystroke recomputes one derived state object instead of touching
 * anything outside this hook's own state slice. Mistake tracking and
 * `sessionAccuracy` are the one piece of session-scoped bookkeeping
 * this hook owns on top of the core's per-snapshot `TypingState`.
 *
 * Deliberately unaware of lessons, profiles, persistence, or timing
 * — it only knows `targetText` in and a `TypingState` (plus session
 * bookkeeping) out.
 */
export function useTypingEngine({ targetText }: UseTypingEngineOptions): UseTypingEngineResult {
  const [state, dispatch] = useReducer(reducer, targetText, createInitialEngineState);

  // If the caller swaps in a new exercise, start a fresh session for
  // it rather than continuing to compare against the old text.
  useEffect(() => {
    dispatch({ type: "setTarget", targetText });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetText]);

  const typeCharacter = useCallback((char: string) => dispatch({ type: "type", char }), []);
  const backspace = useCallback(() => dispatch({ type: "backspace" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  return useMemo(
    () => ({ ...state, typeCharacter, backspace, reset }),
    [state, typeCharacter, backspace, reset],
  );
}
