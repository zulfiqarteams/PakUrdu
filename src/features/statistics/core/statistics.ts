// Imported from the typing engine's core module directly (not the
// `@/features/typing` barrel) — that barrel also re-exports
// `TypingStats`, which imports from this feature's own barrel, and
// going through both barrels here would form a module import cycle.
import { calculateAccuracy } from "@/features/typing/core/typingEngine";

/**
 * WPM = (typedCharacters / 5) / elapsedMinutes
 *
 * The standard typing-test convention: every 5 typed characters counts
 * as one "word", regardless of the actual word boundaries. `typedCharacters`
 * is every character typed so far (correct + incorrect) — matching the
 * Part 7 `currentIndex` count, not just the correct subset — because the
 * WPM metric measures typing throughput, not accuracy; accuracy is its
 * own separate metric (see `calculateAccuracy`).
 *
 * Returns exactly `0` (never `Infinity`/`NaN`) whenever `elapsedMs` or
 * `typedCharacters` is zero or negative, so callers can display the
 * result directly without a guard.
 *
 * The return value is NOT rounded — round only at the point of display
 * (see Practice page / `TypingStats`), so intermediate consumers keep
 * full precision.
 */
/**
 * CPM = typed characters per minute. It uses the same elapsed time and
 * character throughput as WPM, so homepage and full-test metrics remain
 * consistent with the shared statistics engine.
 */
export function calculateCPM(typedCharacters: number, elapsedMs: number): number {
  if (typedCharacters <= 0 || elapsedMs <= 0) return 0;

  const elapsedMinutes = elapsedMs / 60_000;
  const cpm = typedCharacters / elapsedMinutes;

  return Number.isFinite(cpm) ? cpm : 0;
}

export function calculateWPM(typedCharacters: number, elapsedMs: number): number {
  if (typedCharacters <= 0 || elapsedMs <= 0) return 0;

  const elapsedMinutes = elapsedMs / 60_000;
  const wpm = typedCharacters / 5 / elapsedMinutes;

  return Number.isFinite(wpm) ? wpm : 0;
}

/**
 * Formats elapsed time as `MM:SS`, growing to `H:MM:SS` only once an
 * hour has passed (typing sessions are rarely that long, but this
 * keeps the format correct rather than capping at 59:59). Negative or
 * non-finite input is clamped to 0 rather than ever rendering as
 * `NaN:NaN` or a negative time.
 */
export function formatTime(elapsedMs: number): string {
  const safeMs = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0;
  const totalSeconds = Math.floor(safeMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");

  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * The reusable typed statistics model for a session (Part 8 §10).
 * Nothing here is stored redundantly: every field is either a direct
 * input (character counts, elapsed time) or derived by a pure function
 * (`accuracy`, `wpm`) — there's exactly one place each is computed.
 */
export interface TypingStatistics {
  elapsedMs: number;
  typedCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
  /** 0–100, rounded. Formula unchanged from Part 7 — see `calculateAccuracy`. */
  accuracy: number;
  /** Unrounded — see `calculateCPM`. */
  cpm: number;
  /** Unrounded — see `calculateWPM`. */
  wpm: number;
}

/**
 * Combines the typing engine's character counts with the timer's
 * elapsed time into one `TypingStatistics` snapshot. Pure and
 * independently testable — no React, no timer/engine instances, just
 * plain numbers in and a plain object out.
 */
export function calculateStatistics(params: {
  elapsedMs: number;
  typedCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
}): TypingStatistics {
  const { elapsedMs, typedCharacters, correctCharacters, incorrectCharacters } = params;
  const safeElapsedMs = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0;

  return {
    elapsedMs: safeElapsedMs,
    typedCharacters,
    correctCharacters,
    incorrectCharacters,
    accuracy: calculateAccuracy(correctCharacters, typedCharacters),
    cpm: calculateCPM(typedCharacters, safeElapsedMs),
    wpm: calculateWPM(typedCharacters, safeElapsedMs),
  };
}
