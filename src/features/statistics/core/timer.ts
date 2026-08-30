/**
 * A small, pure timer state machine.
 *
 * Deliberately does NOT increment a counter every second — every
 * function here takes the caller's own `now` (a `performance.now()`
 * timestamp) and derives elapsed time from timestamp arithmetic. That
 * keeps the timer immune to setInterval drift, background-tab
 * throttling, and rendering delays: as long as the caller passes a
 * real timestamp, `getElapsedMs` is always correct regardless of how
 * often (or irregularly) it's called.
 *
 * No React, no globals, no side effects — safe to unit test directly.
 */

export type TimerStatus = "idle" | "running" | "paused" | "completed";

export interface TimerState {
  status: TimerStatus;
  /** Elapsed ms banked from previously-finished running segments. Excludes the in-progress segment (if any) — see `getElapsedMs`. */
  accumulatedMs: number;
  /** `performance.now()` timestamp when the current running segment began, or `null` when not running. */
  segmentStartedAt: number | null;
}

/** A fresh, not-yet-started timer. */
export function createTimer(): TimerState {
  return { status: "idle", accumulatedMs: 0, segmentStartedAt: null };
}

/**
 * idle → running. No-op (returns the same state) if the timer has
 * already been started — a timer starts exactly once per session; use
 * `resetTimer` to run it again.
 */
export function startTimer(timer: TimerState, now: number): TimerState {
  if (timer.status !== "idle") return timer;
  return { status: "running", accumulatedMs: 0, segmentStartedAt: now };
}

/**
 * running → paused. Banks the elapsed time of the segment that was in
 * progress. No-op if the timer isn't currently running (e.g. already
 * paused, or never started).
 */
export function pauseTimer(timer: TimerState, now: number): TimerState {
  if (timer.status !== "running" || timer.segmentStartedAt === null) return timer;
  return {
    status: "paused",
    accumulatedMs: timer.accumulatedMs + Math.max(0, now - timer.segmentStartedAt),
    segmentStartedAt: null,
  };
}

/** paused → running, starting a new segment from `now`. No-op if not paused. */
export function resumeTimer(timer: TimerState, now: number): TimerState {
  if (timer.status !== "paused") return timer;
  return { status: "running", accumulatedMs: timer.accumulatedMs, segmentStartedAt: now };
}

/**
 * running/paused → completed. Banks whatever segment was in progress
 * and then freezes — `getElapsedMs` never advances again after this.
 * No-op if already completed.
 */
export function completeTimer(timer: TimerState, now: number): TimerState {
  if (timer.status === "completed") return timer;
  const accumulatedMs =
    timer.status === "running" && timer.segmentStartedAt !== null
      ? timer.accumulatedMs + Math.max(0, now - timer.segmentStartedAt)
      : timer.accumulatedMs;
  return { status: "completed", accumulatedMs, segmentStartedAt: null };
}

/** Any state → idle, as if the timer had just been created. */
export function resetTimer(): TimerState {
  return createTimer();
}

/**
 * The current elapsed time in ms, as of `now`. Never negative, never
 * NaN/Infinity: idle is always 0, and a clock that somehow moved
 * backwards contributes 0 for that segment rather than a negative
 * duration.
 */
export function getElapsedMs(timer: TimerState, now: number): number {
  if (timer.status === "running" && timer.segmentStartedAt !== null) {
    return timer.accumulatedMs + Math.max(0, now - timer.segmentStartedAt);
  }
  return timer.accumulatedMs;
}
