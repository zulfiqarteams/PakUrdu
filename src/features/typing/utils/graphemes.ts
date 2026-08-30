/**
 * Unicode-aware text segmentation.
 *
 * WHY THIS EXISTS
 * Urdu text is written with the Arabic script, which relies on
 * combining marks (e.g. zabar/zer/pesh, hamza) that can attach to a
 * base letter as separate Unicode code points. Naive `text[index]`
 * or `text.split("")` indexing operates on UTF-16 code units, which
 * can split a base letter from its combining mark and silently
 * corrupt what the learner sees as "one character". It can also
 * split characters outside the Basic Multilingual Plane (surrogate
 * pairs) in half.
 *
 * `Intl.Segmenter` with `granularity: "grapheme"` groups code points
 * into the same user-perceived "characters" a learner would count by
 * eye, so `segmentText("پاکستان")` returns one entry per Urdu letter
 * exactly as it prints, even if a future exercise adds a diacritic.
 *
 * NO NORMALIZATION IS PERFORMED. We deliberately do not call
 * `String.prototype.normalize()` anywhere in this module. Unicode
 * normalization (NFC/NFD/etc.) can rewrite a sequence of code points
 * into a different, canonically-equivalent sequence — which is
 * exactly the kind of silent rewriting Part 7 prohibits ("do not
 * normalize characters in a way that unexpectedly changes the
 * learner's target"). Target text is compared exactly as authored.
 */

/**
 * True when the runtime supports `Intl.Segmenter`. All evergreen
 * browsers and Node 16+ do; this only guards very old environments.
 */
function hasSegmenterSupport(): boolean {
  return typeof Intl !== "undefined" && typeof Intl.Segmenter === "function";
}

let cachedSegmenter: Intl.Segmenter | null | undefined;

function getSegmenter(): Intl.Segmenter | null {
  if (cachedSegmenter !== undefined) return cachedSegmenter;
  cachedSegmenter = hasSegmenterSupport()
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;
  return cachedSegmenter;
}

/**
 * Splits text into an array of grapheme clusters — the same units a
 * learner perceives as individual characters, including Urdu letters
 * with attached combining marks.
 *
 * Falls back to `Array.from(text)` (code-point-aware, but not
 * grapheme-cluster-aware) on runtimes without `Intl.Segmenter`. That
 * fallback is still strictly safer than raw string indexing since it
 * never splits a surrogate pair, even though it could separate a
 * base letter from a combining mark in the rare environment where
 * it's used.
 */
export function segmentText(text: string): string[] {
  const segmenter = getSegmenter();
  if (!segmenter) return Array.from(text);

  const segments: string[] = [];
  for (const { segment } of segmenter.segment(text)) {
    segments.push(segment);
  }
  return segments;
}
