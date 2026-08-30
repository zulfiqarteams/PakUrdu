import { urduPracticeWords } from "./urduPracticeWords";

/**
 * The shared word source for Home, Practice and the timed typing test.
 * Every entry is one complete Urdu word, so the UI can keep words atomic
 * while the typing engine still compares Unicode graphemes internally.
 */
export const commonUrduWords: string[] = urduPracticeWords.map((item) => item.word);

export function getWordBatch(startIndex: number, count: number): string[] {
  const total = commonUrduWords.length;
  if (total === 0 || count <= 0) return [];

  const batch: string[] = [];
  for (let i = 0; i < count; i++) {
    batch.push(commonUrduWords[(startIndex + i) % total]);
  }
  return batch;
}

export function buildWordBatchText(startIndex: number, count: number): string {
  return getWordBatch(startIndex, count).join(" ");
}

/**
 * Builds a long, word-only passage for a timed test. The pool is intentionally
 * much larger than the visible window so the learner gets variety instead of
 * seeing the same handful of words repeated constantly.
 */
export function buildWordPassage(durationSeconds: number, seed = 0): string {
  const minCharBudget = Math.max(durationSeconds * 3, 80);
  const words: string[] = [];
  let length = 0;
  let cursor = Math.abs(seed) % commonUrduWords.length;

  while (length < minCharBudget) {
    const word = commonUrduWords[cursor];
    words.push(word);
    length += word.length + 1;
    cursor = (cursor + 17 + words.length * 3) % commonUrduWords.length;
  }

  return words.join(" ");
}
