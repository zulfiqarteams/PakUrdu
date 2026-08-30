import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, ReactNode } from "react";
import { segmentText } from "@/features/typing/utils/graphemes";
import type { UseTypingEngineResult } from "@/features/typing/hooks/useTypingEngine";
import { getUrduForPhysicalKey } from "@/features/keyboard";
import { playBackspaceClick, playErrorClick, playKeyClick } from "@/features/keyboard/utils/keyboardSounds";
import { useSettings } from "@/features/settings";

interface TypingCaptureAreaProps {
  typing: UseTypingEngineResult;
  /** Reported whenever the hidden input gains/loses focus — used to
   *  drive the virtual keyboard's pressed-key tracking. */
  onActiveChange?: (active: boolean) => void;
  autoFocus?: boolean;
  /**
   * Suppresses the device's own software keyboard on touch devices
   * (via `inputMode="none"`) so tapping the capture area focuses the
   * hidden input — clearing the "click here" hint, keeping a caret —
   * without a second, OS-drawn keyboard popping up and covering (or
   * fighting with) the app's own on-screen `VirtualKeyboard`. Pass
   * this only when a tappable `VirtualKeyboard` is actually being
   * rendered alongside this component; otherwise a touch-device
   * learner would have no way to type at all.
   */
  suppressNativeKeyboardOnTouch?: boolean;
  /** Synchronous guard used by timed sessions to reject input at/after the deadline. */
  canType?: () => boolean;
  /** Visual/read-only lock state for completed or timed-out sessions. */
  isLocked?: boolean;
  /** Optional activity callback used by higher-level UI (e.g. test focus mode). */
  onTypingActivity?: () => void;
  children: ReactNode;
}

function prefersTouchInput(): boolean {
  return typeof window !== "undefined" && Boolean(window.matchMedia?.("(pointer: coarse)").matches);
}

/**
 * Wraps the visible typing display with a real, focusable text input
 * that's visually hidden (`sr-only`), rather than a visible textbox
 * that would make the exercise feel like filling out a form (Part 7
 * requirement 25) or a raw `keydown` listener.
 *
 * A real `<input>` is used deliberately: for a learner who already
 * has a native Urdu/Arabic OS keyboard layout (or a real Urdu IME)
 * active, the browser composes correctly-formed Urdu graphemes for
 * us — including full IME composition on mobile — so those arrive
 * pre-formed instead of being reconstructed from individual physical
 * key codes, which is not reliable across platforms.
 *
 * That is NOT the primary way this app is meant to be typed on,
 * though: the course teaches a *phonetic* keyboard — every ordinary
 * Latin key on the learner's existing keyboard produces a specific
 * Urdu letter (see `features/keyboard/data/phoneticMap.ts`), with no
 * OS-level Urdu layout required. `handleKeyDown` below is what
 * actually applies that mapping: it intercepts a plain keystroke
 * before the browser writes the raw Latin character into the input,
 * translates it through the physical-key phonetic mapping, and feeds the translated
 * Urdu character into the engine instead. Composition-in-progress
 * input (`inputType` other than `"insertText"` — real IMEs and
 * native Urdu keyboards) is deliberately left untouched and falls
 * through to the diffing below, so both typing styles work at once
 * without two competing input systems.
 *
 * The input's value is diffed against the typing engine's own
 * `userInput` on every change (by longest common grapheme prefix)
 * and translated into `typeCharacter`/`backspace` calls. The DOM
 * input never becomes a second source of truth — the typing engine
 * state always is, and the input is kept controlled back to it.
 */
export function TypingCaptureArea({
  typing,
  onActiveChange,
  autoFocus = true,
  suppressNativeKeyboardOnTouch = false,
  canType,
  isLocked = false,
  onTypingActivity,
  children,
}: TypingCaptureAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isActive, setIsActive] = useState(false);
  const { soundEnabled } = useSettings();

  // Computed once: whether to render the input with `inputMode="none"`.
  // Only takes effect on an actual touch device, so a mouse/keyboard
  // user is never affected even when a caller opts in.
  const [blockNativeKeyboard] = useState(
    () => suppressNativeKeyboardOnTouch && prefersTouchInput(),
  );

  useEffect(() => {
    onActiveChange?.(isActive);
  }, [isActive, onActiveChange]);

  useEffect(() => {
    if (!autoFocus || prefersTouchInput()) return;
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function playTypingSoundForCharacter(char: string) {
    if (!soundEnabled) return;
    const expected = segmentText(typing.targetText)[typing.currentIndex];
    if (expected === char) playKeyClick();
    else playErrorClick();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (canType && !canType()) return;
    const previous = segmentText(typing.userInput);
    const next = segmentText(event.target.value);

    let commonPrefixLength = 0;
    const maxCommon = Math.min(previous.length, next.length);
    while (
      commonPrefixLength < maxCommon &&
      previous[commonPrefixLength] === next[commonPrefixLength]
    ) {
      commonPrefixLength++;
    }

    if (previous.length !== next.length || commonPrefixLength !== previous.length) {
      onTypingActivity?.();
    }

    const backspaceCount = previous.length - commonPrefixLength;
    for (let i = 0; i < backspaceCount; i++) {
      if (soundEnabled) playBackspaceClick();
      typing.backspace();
    }
    for (let i = commonPrefixLength; i < next.length; i++) {
      playTypingSoundForCharacter(next[i]);
      typing.typeCharacter(next[i]);
    }
  }

  type TypingKeyboardEvent = Pick<
    globalThis.KeyboardEvent,
    | "key"
    | "code"
    | "shiftKey"
    | "ctrlKey"
    | "altKey"
    | "metaKey"
    | "repeat"
    | "preventDefault"
    | "getModifierState"
  > & {
    /** React 18 keyboard events do not expose this DOM property on the event type. */
    isComposing?: boolean;
  };

  function handlePhysicalKeyDown(event: TypingKeyboardEvent) {
    if (canType && !canType()) {
      event.preventDefault();
      return true;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      return true;
    }

    if (event.metaKey || event.isComposing) return false;

    if (event.ctrlKey || event.altKey) return false;

    if (event.key === "Backspace") {
      if (!typing.userInput) return false;
      onTypingActivity?.();
      event.preventDefault();
      if (soundEnabled) playBackspaceClick();
      typing.backspace();
      return true;
    }

    if (event.code === "Space" || event.key === " ") {
      onTypingActivity?.();
      event.preventDefault();
      playTypingSoundForCharacter(" ");
      typing.typeCharacter(" ");
      return true;
    }

    const urdu = getUrduForPhysicalKey(event.code, event.shiftKey);
    if (!urdu) return false;

    onTypingActivity?.();
    event.preventDefault();
    playTypingSoundForCharacter(urdu);
    typing.typeCharacter(urdu);
    return true;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    handlePhysicalKeyDown(event);
  }

  useEffect(() => {
    function handleWindowKeyDown(event: globalThis.KeyboardEvent) {
      const target = event.target;
      // The hidden capture input already has its own React keydown handler;
      // do not process the same physical key a second time during bubbling.
      if (target === inputRef.current) return;

      // Do not hijack unrelated form fields or contenteditable controls.
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      handlePhysicalKeyDown(event);
    }

    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [typing, soundEnabled, canType]);


  return (
    <div
      className="relative cursor-text"
      onClick={() => inputRef.current?.focus()}
      onPointerDown={() => inputRef.current?.focus()}
    >
      {children}

      <input
        ref={inputRef}
        type="text"
        value={typing.userInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        inputMode={blockNativeKeyboard ? "none" : "text"}
        readOnly={isLocked}
        dir="rtl"
        lang="ur"
        aria-label="Urdu typing practice input. Type using your physical or on-screen keyboard."
        className="sr-only"
      />
    </div>
  );
}
