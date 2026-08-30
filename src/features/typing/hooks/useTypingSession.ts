import { useCallback, useEffect, useMemo, useState } from "react";
import { useTypingEngine } from "@/features/typing/hooks/useTypingEngine";
import { useKeyboardTapInput } from "@/features/typing/hooks/useKeyboardTapInput";
import { useTypingTimer, calculateCPM, calculateWPM } from "@/features/statistics";
import { getExpectedKey, usePressedKey } from "@/features/keyboard";
import { useSettings } from "@/features/settings";

export interface UseTypingSessionOptions {
  targetText: string;
  resetKey?: string | number;
  durationMs?: number;
  autoStart?: boolean;
  isLocked?: boolean;
  onExpire?: () => void;
}

export type UseTypingSessionResult = ReturnType<typeof useTypingSession>;

export function useTypingSession({
  targetText,
  resetKey = 0,
  durationMs,
  autoStart = false,
  isLocked = false,
  onExpire,
}: UseTypingSessionOptions) {
  const typing = useTypingEngine({ targetText });
  const { soundEnabled } = useSettings();
  const [captureActive, setCaptureActive] = useState(false);
  const [expired, setExpired] = useState(false);
  const [sessionVersion, setSessionVersion] = useState(0);

  useEffect(() => setExpired(false), [resetKey, targetText]);

  const timer = useTypingTimer({
    hasStarted: autoStart || typing.currentIndex > 0,
    isComplete: typing.isComplete || expired || isLocked,
    resetKey: `${resetKey}:${sessionVersion}`,
    durationMs,
    onExpire: () => {
      setExpired(true);
      onExpire?.();
    },
  });

  const ended = typing.isComplete || expired || isLocked;
  const canType = useCallback(() => !ended && timer.canAcceptInput(), [ended, timer.canAcceptInput]);
  const keyboardTap = useKeyboardTapInput(typing, soundEnabled, canType);
  const pressedKey = usePressedKey(captureActive && !ended, `${resetKey}:${sessionVersion}`);
  const currentChar = typing.characters.find((character) => character.status === "current")?.char;
  const expectedKey = ended ? undefined : getExpectedKey(currentChar);
  const elapsedMs = Number.isFinite(durationMs) && durationMs !== undefined
    ? Math.min(timer.elapsedMs, Math.max(0, durationMs))
    : timer.elapsedMs;
  const wpm = calculateWPM(typing.sessionKeystrokes, elapsedMs);
  const cpm = calculateCPM(typing.sessionKeystrokes, elapsedMs);
  const remainingMs = durationMs === undefined ? 0 : Math.max(durationMs - elapsedMs, 0);

  const reset = useCallback(() => {
    // The pressed-key hook receives the session version below, so changing
    // it clears any held-key highlight without stealing focus from the
    // hidden capture input.
    typing.reset();
    setExpired(false);
    setSessionVersion((value) => value + 1);
  }, [typing.reset]);

  return useMemo(() => ({
    typing,
    timer,
    captureActive,
    setCaptureActive,
    pressedKey,
    expectedKey,
    keyboardTap,
    ended,
    expired,
    elapsedMs,
    remainingMs,
    wpm,
    cpm,
    reset,
  }), [
    typing,
    timer,
    captureActive,
    pressedKey,
    expectedKey,
    keyboardTap,
    ended,
    expired,
    elapsedMs,
    remainingMs,
    wpm,
    cpm,
    reset,
  ]);
}
