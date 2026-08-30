import { segmentText } from "@/features/typing/utils/graphemes";
import type { TargetCharacter } from "@/features/typing/types";

/** Word-chunk boundaries measured in grapheme indices, matching TargetCharacter.index. */
export function getWordChunkBoundaries(text: string, wordsPerChunk: number): number[] {
  const graphemes = segmentText(text);
  const boundaries = [0];
  let wordsInChunk = 0;
  if (wordsPerChunk <= 0) return boundaries;

  for (let i = 0; i < graphemes.length; i++) {
    if (graphemes[i] === " ") {
      wordsInChunk++;
      if (wordsInChunk >= wordsPerChunk) {
        boundaries.push(i + 1);
        wordsInChunk = 0;
      }
    }
  }
  return boundaries;
}

/** The [start, end) grapheme range containing currentIndex. */
export function getChunkRange(
  boundaries: number[],
  currentIndex: number,
  textLength: number,
): [number, number] {
  for (let i = boundaries.length - 1; i >= 0; i--) {
    if (currentIndex >= boundaries[i]) {
      const end = i + 1 < boundaries.length ? boundaries[i + 1] : textLength;
      return [boundaries[i], end];
    }
  }
  return [0, textLength];
}

/**
 * Returns only the active word chunk. Boundary math is grapheme-based so
 * Urdu/Arabic combining sequences cannot cause the visible words to break
 * at the wrong position.
 */
export function getVisibleWordWindow(
  characters: TargetCharacter[],
  targetText: string,
  currentIndex: number,
  wordsPerChunk: number,
): TargetCharacter[] {
  if (characters.length === 0) return characters;
  const graphemeLength = segmentText(targetText).length;
  const boundaries = getWordChunkBoundaries(targetText, wordsPerChunk);
  const [start, end] = getChunkRange(boundaries, currentIndex, graphemeLength);
  return characters.slice(start, end);
}
