/**
 * Decides whether this attempt is a new personal best, mirroring the
 * Progress Service's own "higher WPM wins, accuracy breaks a tie"
 * rule (Part 9 §7) — WPM is the primary metric since it's what
 * `LessonProgress.bestWpm` tracks; accuracy only decides a WPM tie so
 * an attempt that's merely equal-speed-but-sloppier never reads as a
 * "best".
 *
 * `previousBestWpm === null` means there's no completed attempt to
 * beat yet (first-ever completion, or a standalone Practice session
 * with nothing to compare against) — that's a best by definition as
 * long as this attempt itself produced a real result.
 *
 * Defensive against NaN/Infinity `wpm` — never reports a best for a
 * result that isn't actually a finite number.
 */
export function isNewPersonalBest(params: {
  wpm: number;
  accuracy: number;
  previousBestWpm: number | null;
  previousBestAccuracy: number | null;
}): boolean {
  const { wpm, accuracy, previousBestWpm, previousBestAccuracy } = params;
  if (!Number.isFinite(wpm) || !Number.isFinite(accuracy)) return false;

  if (previousBestWpm === null) return wpm > 0;
  if (wpm > previousBestWpm) return true;
  if (wpm < previousBestWpm) return false;

  // Exact WPM tie — fall back to accuracy.
  const priorAccuracy = previousBestAccuracy ?? 0;
  return accuracy > priorAccuracy;
}
