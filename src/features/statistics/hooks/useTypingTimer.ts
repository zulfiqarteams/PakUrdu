import { useCallback, useEffect, useRef, useState } from "react";
import {
  completeTimer,
  createTimer,
  getElapsedMs,
  pauseTimer,
  resetTimer,
  resumeTimer,
  startTimer,
} from "@/features/statistics/core/timer";
import type { TimerState, TimerStatus } from "@/features/statistics/core/timer";

interface UseTypingTimerOptions {
  /** True once the learner has produced their first valid character and the session isn't finished yet. */
  hasStarted: boolean;
  /** True once the typing engine reports the exercise complete. */
  isComplete: boolean;
  /** Changing this value starts a brand-new session. */
  resetKey: string | number;
  /** Optional hard duration. When reached, the timer completes itself and input can no longer be accepted. */
  durationMs?: number;
  /** Called exactly once when the hard duration expires. */
  onExpire?: () => void;
  /** Display refresh cadence. The timer itself remains timestamp based. */
  updateIntervalMs?: number;
}

export interface UseTypingTimerResult {
  status: TimerStatus;
  elapsedMs: number;
  /** Synchronous guard for physical/on-screen input. It also finalizes an expired timer immediately. */
  canAcceptInput: () => boolean;
}

const DEFAULT_UPDATE_INTERVAL_MS = 100;

/**
 * React adapter for the pure timer state machine.
 *
 * Important: TimerState lives in a ref so timestamp arithmetic remains cheap,
 * but the current status is mirrored in React state. A mutable ref is not a
 * reactive dependency, so using `timerRef.current.status` directly in an
 * effect dependency can leave the display interval stuck in the idle state.
 */
export function useTypingTimer({
  hasStarted,
  isComplete,
  resetKey,
  durationMs,
  onExpire,
  updateIntervalMs = DEFAULT_UPDATE_INTERVAL_MS,
}: UseTypingTimerOptions): UseTypingTimerResult {
  const timerRef = useRef<TimerState>(createTimer());
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [, forceRender] = useState(0);
  const durationRef = useRef<number | undefined>(durationMs);
  const onExpireRef = useRef(onExpire);

  durationRef.current = durationMs;
  onExpireRef.current = onExpire;

  const canAcceptInput = useCallback(() => {
    const timer = timerRef.current;
    if (timer.status === "completed") return false;

    const limit = durationRef.current;
    if (timer.status === "running" && Number.isFinite(limit) && limit !== undefined) {
      const now = performance.now();
      const elapsed = getElapsedMs(timer, now);
      if (elapsed >= Math.max(0, limit)) {
        timerRef.current = completeTimer(timer, now);
        setStatus("completed");
        forceRender((value) => value + 1);
        onExpireRef.current?.();
        return false;
      }
    }

    return true;
  }, []);

  useEffect(() => {
    const timer = resetTimer();
    timerRef.current = timer;
    setStatus(timer.status);
    forceRender((value) => value + 1);
  }, [resetKey]);

  useEffect(() => {
    if (!hasStarted || timerRef.current.status !== "idle") return;
    const timer = startTimer(timerRef.current, performance.now());
    timerRef.current = timer;
    setStatus(timer.status);
    forceRender((value) => value + 1);
  }, [hasStarted]);

  useEffect(() => {
    if (!isComplete || timerRef.current.status === "idle" || timerRef.current.status === "completed") return;
    const timer = completeTimer(timerRef.current, performance.now());
    timerRef.current = timer;
    setStatus(timer.status);
    forceRender((value) => value + 1);
  }, [isComplete]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden" && timerRef.current.status === "running") {
        const timer = pauseTimer(timerRef.current, performance.now());
        timerRef.current = timer;
        setStatus(timer.status);
        forceRender((value) => value + 1);
      } else if (document.visibilityState === "visible" && timerRef.current.status === "paused") {
        const timer = resumeTimer(timerRef.current, performance.now());
        timerRef.current = timer;
        setStatus(timer.status);
        forceRender((value) => value + 1);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (status !== "running") return;
    const intervalId = window.setInterval(() => {
      if (!canAcceptInput()) {
        window.clearInterval(intervalId);
        return;
      }
      forceRender((value) => value + 1);
    }, updateIntervalMs);
    return () => window.clearInterval(intervalId);
  }, [status, updateIntervalMs, canAcceptInput]);

  const now = performance.now();
  const elapsedMs = getElapsedMs(timerRef.current, now);
  const boundedElapsedMs = Number.isFinite(durationMs) && durationMs !== undefined
    ? Math.min(elapsedMs, Math.max(0, durationMs))
    : elapsedMs;

  return {
    status,
    elapsedMs: boundedElapsedMs,
    canAcceptInput,
  };
}
