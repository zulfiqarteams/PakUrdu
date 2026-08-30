/**
 * Display-only formatting for `SessionResult` fields. Deliberately
 * separate from `sessionResult.ts` (which stays formatting-agnostic
 * — plain numbers in, plain numbers out) so the Results screen has
 * one place to get presentation strings from, and so those strings
 * are unit-testable without rendering anything.
 *
 * Every function here is defensive against NaN/Infinity on its own
 * — `SessionResult` fields are already clamped by `buildSessionResult`,
 * but these are cheap to make safe independently rather than relying
 * on that invariant holding forever.
 */

/** Rounds and suffixes a 0–100 accuracy value, e.g. `96` → `"96%"`. */
export function formatAccuracy(accuracy: number): string {
  const safe = Number.isFinite(accuracy) ? accuracy : 0;
  return `${Math.round(safe)}%`;
}

/** Rounds a WPM value to a plain integer string, e.g. `28.4` → `"28"`. */
export function formatWpm(wpm: number): string {
  const safe = Number.isFinite(wpm) ? wpm : 0;
  return String(Math.round(safe));
}

/**
 * "42 WPM, 96% accuracy" style line describing a lesson's prior best,
 * or `null` when there's nothing to compare against yet (first-ever
 * completion, or a standalone Practice session).
 */
export function formatPreviousBest(params: {
  previousBestWpm: number | null;
  previousBestAccuracy: number | null;
}): string | null {
  const { previousBestWpm, previousBestAccuracy } = params;
  if (previousBestWpm === null && previousBestAccuracy === null) return null;

  const wpmPart = previousBestWpm !== null ? `${Math.round(previousBestWpm)} WPM` : "--";
  const accuracyPart = previousBestAccuracy !== null ? `${Math.round(previousBestAccuracy)}% accuracy` : "--";
  return `${wpmPart}, ${accuracyPart}`;
}
