/**
 * Short, natural Urdu sentences for the homepage's instant typing test.
 *
 * This is intentionally additive: the existing lesson/practice word banks
 * remain the source of truth for their existing screens. The homepage can
 * therefore feel like real Urdu writing without changing any lesson data.
 */
export const instantUrduPassages = [
  "آج موسم بہت اچھا ہے اور ہوا بھی خوشگوار ہے۔",
  "میں روز تھوڑی دیر اردو لکھنے کی مشق کرتا ہوں۔",
  "اچھی رفتار سے پہلے درست لکھنا سیکھنا ضروری ہے۔",
  "یہ کتاب اردو سیکھنے کے لیے بہت مفید ہے۔",
  "ہم ہر دن نئی بات سیکھ سکتے ہیں اور اپنی مہارت بہتر بنا سکتے ہیں۔",
  "پاکستان میں اردو ہماری روزمرہ زندگی کا ایک اہم حصہ ہے۔",
  "صبح کا وقت پڑھنے اور لکھنے کے لیے بہت اچھا ہوتا ہے۔",
  "اگر آپ باقاعدگی سے مشق کریں تو ٹائپنگ آسان محسوس ہونے لگتی ہے۔",
  "مجھے امید ہے کہ آج کی مشق آپ کے لیے فائدہ مند ہوگی۔",
  "تعلیم انسان کو بہتر سوچنے اور آگے بڑھنے کا موقع دیتی ہے۔",
  "وقت کی قدر کریں اور ہر کام توجہ کے ساتھ مکمل کریں۔",
  "اردو کے الفاظ کو سمجھ کر لکھنے سے اعتماد میں اضافہ ہوتا ہے۔",
  "ایک اچھی عادت روزانہ کی چھوٹی سی مشق سے بنتی ہے۔",
  "آپ اپنی غلطیوں کو دیکھ کر انہیں آہستہ آہستہ درست کر سکتے ہیں۔",
  "کامیابی کے لیے صبر، مستقل مزاجی اور درست سمت ضروری ہے۔",
  "گھر میں سب لوگ مل کر کھانا کھاتے ہیں اور باتیں کرتے ہیں۔",
  "کتاب، قلم اور علم انسان کے بہترین ساتھی ہیں۔",
  "درست اردو لکھنے کے لیے الفاظ کی شکل اور آواز دونوں سمجھیں۔",
  "آج کی محنت کل آپ کی رفتار اور اعتماد میں نظر آئے گی۔",
  "سیکھنے کا بہترین طریقہ یہ ہے کہ سمجھیں، مشق کریں اور دوبارہ کوشش کریں۔",
] as const;

/** Build enough natural text to cover the selected timed duration. */
export function buildInstantUrduPassage(durationSeconds: number, seed = 0): string {
  const targetCharacters = Math.max(durationSeconds * 7, 180);
  const passages: string[] = [];
  let length = 0;
  let cursor = Math.abs(seed) % instantUrduPassages.length;

  while (length < targetCharacters) {
    const sentence = instantUrduPassages[cursor];
    passages.push(sentence);
    length += sentence.length + 1;
    cursor = (cursor + 7) % instantUrduPassages.length;
  }

  return passages.join(" ");
}
