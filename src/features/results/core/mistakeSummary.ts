import type { TypingMistake } from "@/features/typing/types";

/**
 * One deterministic, no-color-required sentence summarizing a
 * completed session's mistakes — the lead line for the Results
 * screen's Mistake Review section (spec §4/§12: mistakes must be
 * understandable without relying on color alone).
 *
 * `mistakes.length` is the count of distinct (index, typed) pairs;
 * `count` on each entry is how many times that exact mistake
 * recurred. When they diverge, the message surfaces both so a
 * learner who made the same mistake five times sees that, not just
 * "1 mistake".
 */
export function getMistakeSummaryMessage(mistakes: TypingMistake[]): string {
  if (mistakes.length === 0) {
    return "Perfect — no typing mistakes.";
  }

  const totalOccurrences = mistakes.reduce((sum, mistake) => sum + mistake.count, 0);
  const mistakeWord = mistakes.length === 1 ? "mistake" : "mistakes";

  if (totalOccurrences > mistakes.length) {
    return `${mistakes.length} ${mistakeWord} to review (${totalOccurrences} occurrences).`;
  }
  return `${mistakes.length} ${mistakeWord} to review.`;
}
