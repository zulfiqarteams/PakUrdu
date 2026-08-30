/**
 * Safe, comparison-only normalization for Urdu typing input.
 *
 * WHY THIS EXISTS
 * `graphemes.ts` deliberately never calls `String.prototype.normalize()`,
 * because canonical Unicode normalization (NFC/NFD) can rewrite a
 * meaningful sequence of Urdu code points into a different one. That
 * decision is correct and stays unchanged here. This module solves a
 * narrower, separate problem: a learner can type the letter they see as
 * "correct" and still have it marked wrong, because not every input
 * source (OS-level Urdu/Arabic keyboard layouts, mobile IMEs, software
 * keyboards) agrees on which exact code point represents that letter.
 *
 * Two concrete, well-documented cases cause this:
 *
 * 1. Invisible joining/formatting characters. Some IMEs insert a Zero
 *    Width Non-Joiner (U+200C) or Zero Width Joiner (U+200D) while
 *    composing Arabic-script text, and Arabic Tatweel/Kashida (U+0640)
 *    is sometimes emitted by input methods that use it for
 *    justification. All three are invisible and carry no phonetic
 *    meaning — but per Unicode's grapheme-cluster rules (UAX #29),
 *    `Intl.Segmenter` attaches a joiner to the *preceding* base letter
 *    as a single grapheme cluster. So a letter+joiner cluster the
 *    learner typed will never `===` the plain letter authored in
 *    lesson content, even though, to the learner, they typed the
 *    correct (and visually identical) letter.
 *
 * 2. Arabic-vs-Urdu code point variants. A handful of Arabic letters
 *    have a dedicated, differently-shaped Urdu counterpart at a
 *    different code point (e.g. Urdu's ک KEHEH, U+06A9, vs Arabic's ك
 *    KAF, U+0643; Urdu's ی YEH, U+06CC, vs Arabic's ي YEH, U+064A). A
 *    system keyboard/IME set to a generic Arabic layout can legitimately
 *    emit the Arabic code point for what the learner sees, correctly,
 *    as the matching Urdu letter. Only these well-established
 *    equivalents are mapped below.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 * It never touches ہ (choti he, U+06C1) vs ھ (do-chashmi he, U+06BE) —
 * those are phonemically distinct in Urdu (compare "کا" vs "کھا") and
 * collapsing them would mark genuinely wrong input as correct. It never
 * touches diacritics (zabar/zer/pesh/hamza marks) or any code point not
 * explicitly listed below. When in doubt, a code point is left
 * completely alone — this function is only ever allowed to get more
 * permissive by *narrowing*, never by adding more collapses later
 * without the same letter-by-letter justification.
 *
 * SCOPE: this is applied only to derive a correct/incorrect comparison
 * result. It never rewrites the `userInput` stored in typing state, and
 * it never rewrites target text as authored — both stay exactly as
 * typed/written everywhere else (see `getTypingState` /
 * `compareCharacters` in `core/typingEngine.ts`, the only callers).
 */

/** Zero Width Space, Zero Width Non-Joiner, Zero Width Joiner, Arabic Tatweel/Kashida. */
const INVISIBLE_OR_STYLISTIC = /[\u200B\u200C\u200D\u0640]/g;

/** Arabic code point -> the Urdu code point it is visually/phonetically equivalent to. */
const ARABIC_TO_URDU_VARIANT: Record<string, string> = {
  "\u0643": "\u06A9", // ARABIC LETTER KAF (ك) -> Urdu KEHEH (ک)
  "\u064A": "\u06CC", // ARABIC LETTER YEH (ي) -> Urdu FARSI YEH (ی)
  "\u0649": "\u06CC", // ARABIC LETTER ALEF MAKSURA (ى) -> Urdu FARSI YEH (ی)
};

/**
 * Normalizes one grapheme cluster (or short string) for comparison
 * purposes only. Safe to call on a single target character or a single
 * typed character — never changes string length in a way that would
 * misalign a positional (index-by-index) comparison, since it only
 * removes characters that shouldn't have occupied a position in the
 * first place and substitutes 1:1 for known variants.
 */
export function normalizeUrduForComparison(text: string): string {
  const withoutInvisibles = text.replace(INVISIBLE_OR_STYLISTIC, "");
  let result = "";
  for (const char of withoutInvisibles) {
    result += ARABIC_TO_URDU_VARIANT[char] ?? char;
  }
  return result;
}
