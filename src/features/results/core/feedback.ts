import type { Feedback } from "@/features/results/types";

/** Below this, accuracy problems override every other message — see spec §3 ("Do not over-praise poor performance"). */
const ACCURACY_LOW_THRESHOLD = 80;
/** At or above this, accuracy earns its own praise line. */
const ACCURACY_EXCELLENT_THRESHOLD = 95;
/** At or above this, speed earns its own praise line. Chosen as a realistic "comfortable" pace for a learner past the basics — not a competitive-typist bar. */
const WPM_STRONG_THRESHOLD = 30;

/**
 * Picks a short, deterministic, coaching-style message for a
 * finished session — never model-generated (spec §3: "Avoid fake
 * AI-generated feedback"), just threshold logic over the two metrics
 * that matter.
 *
 * A personal best always wins, regardless of the raw numbers — it's
 * the most motivating framing available, and it's already relative
 * to the learner's own history rather than an arbitrary threshold.
 *
 * Otherwise, low accuracy overrides everything else, even a strong
 * WPM: praising speed on a sloppy run would undercut the "accuracy
 * first" guidance the spec asks for. Above that floor, accuracy and
 * speed each contribute their own praise line when they clear their
 * threshold, so a run that's fast AND accurate gets both.
 *
 * Defensive against NaN/Infinity input (e.g. a zero-length target) —
 * treated as the neutral/low case rather than crashing a threshold
 * comparison or rendering "NaN" inside a sentence.
 */
export function getFeedback(params: { accuracy: number; wpm: number; isPersonalBest: boolean }): Feedback {
  const { isPersonalBest } = params;
  const accuracy = Number.isFinite(params.accuracy) ? params.accuracy : 0;
  const wpm = Number.isFinite(params.wpm) ? params.wpm : 0;

  if (isPersonalBest) {
    return { tone: "success", message: "New personal best! Keep this up." };
  }

  if (accuracy < ACCURACY_LOW_THRESHOLD) {
    return {
      tone: "warning",
      message: "Focus on accuracy first, then gradually increase speed.",
    };
  }

  const praise: string[] = [];
  if (accuracy >= ACCURACY_EXCELLENT_THRESHOLD) {
    praise.push("Excellent accuracy!");
  }
  if (wpm >= WPM_STRONG_THRESHOLD) {
    praise.push("Great typing speed!");
  }

  if (praise.length > 0) {
    return { tone: "success", message: praise.join(" ") };
  }

  return {
    tone: "neutral",
    message: "Solid run — keep practicing to sharpen both speed and accuracy.",
  };
}
