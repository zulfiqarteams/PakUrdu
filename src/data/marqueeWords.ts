/**
 * Curated word streams used by the glassmorphic marquee.
 * Keep this dataset learner-focused: the marquee is part of the typing UI,
 * not a generic marketing ticker.
 */

export const HOME_MARQUEE_WORDS = [
  "پاکستان",
  "خوبصورتی",
  "کامیابی",
  "رفتار",
  "مشق",
  "سیکھنا",
  "ہنر",
  "مستقبل",
  "کی بورڈ",
  "تعلیم",
  "محنت",
  "اعتماد",
  "ترقی",
  "درستگی",
  "لکھنا",
  "اردو",
] as const;

export const PRACTICE_MARQUEE_WORDS = [
  "مشق",
  "رفتار",
  "درستگی",
  "کامیابی",
  "لکھنا",
  "پڑھنا",
  "تعلیم",
  "محنت",
  "اعتماد",
  "ہنر",
  "کی بورڈ",
  "پاکستان",
  "کتاب",
  "قلم",
  "وقت",
  "آسان",
  "ضروری",
  "بہتر",
] as const;

export function uniqueWords(words: Iterable<string>, limit = 24): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const rawWord of words) {
    const word = rawWord.trim();
    if (!word || seen.has(word)) continue;
    seen.add(word);
    result.push(word);
    if (result.length >= limit) break;
  }

  return result;
}

/**
 * Turns a lesson's learned characters into useful drill cards. The generated
 * combinations are deliberately short so they remain readable while moving.
 */
export function buildCharacterMarqueeWords(characters: Iterable<string>, limit = 20): string[] {
  const chars = uniqueWords(characters, 12).filter((character) => character.length > 0);
  if (chars.length === 0) return [];

  const combinations: string[] = [...chars];

  for (let index = 0; index < chars.length && combinations.length < limit; index += 1) {
    const current = chars[index];
    const previous = chars[(index + 1) % chars.length];
    combinations.push(`${current}${previous}`);
  }

  for (let index = 0; index + 2 < chars.length && combinations.length < limit; index += 1) {
    combinations.push(`${chars[index]}${chars[index + 1]}${chars[index + 2]}`);
  }

  return uniqueWords(combinations, limit);
}

/**
 * Extracts words from a lesson target/examples while preserving Urdu words as
 * complete grapheme sequences. This is used as the first choice for lesson
 * contextual streams, with character drills as a fallback.
 */
export function wordsFromText(text: string | undefined, limit = 20): string[] {
  if (!text) return [];
  return uniqueWords(text.split(/\s+/), limit);
}
