import { useMemo } from "react";
import { segmentText } from "@/features/typing/utils/graphemes";
import type { UseTypingEngineResult } from "@/features/typing/hooks/useTypingEngine";
import { playBackspaceClick, playErrorClick, playKeyClick } from "@/features/keyboard/utils/keyboardSounds";

/**
 * Turns a `VirtualKeyboard`'s taps into real input on the given typing
 * engine, with the same correct/incorrect sound feedback a physical
 * keystroke gets in `TypingCaptureArea`.
 *
 * This exists separately from `TypingCaptureArea` because on a touch
 * device there is no physical keystroke for that component's
 * `keydown`/`beforeinput` handlers to ever see — `VirtualKeyboard`'s
 * tap targets are the only source of input there, so they need to
 * feed the typing engine directly rather than through the hidden
 * `<input>`.
 */
export function useKeyboardTapInput(
  typing: UseTypingEngineResult,
  soundEnabled: boolean,
  canType?: () => boolean,
) {
  return useMemo(
    () => ({
      onKeyPress: (char: string) => {
        if (canType && !canType()) return;
        const expected = segmentText(typing.targetText)[typing.currentIndex];
        if (soundEnabled) {
          if (char === expected) playKeyClick();
          else playErrorClick();
        }
        for (const grapheme of segmentText(char)) {
          typing.typeCharacter(grapheme);
        }
      },
      onBackspace: () => {
        if (canType && !canType()) return;
        if (soundEnabled) playBackspaceClick();
        typing.backspace();
      },
    }),
    // `typing` is a fresh object each render (it's a hook result, not a
    // ref), so depending on its stable methods instead avoids recreating
    // these callbacks — and re-subscribing VirtualKeyboard — every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [typing.typeCharacter, typing.backspace, typing.targetText, typing.currentIndex, soundEnabled, canType],
  );
}
