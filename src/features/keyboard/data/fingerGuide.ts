/**
 * Standard touch-typing finger assignment, keyed by physical
 * (lowercase) key. This is independent of `phoneticMap.ts` — it's
 * about which finger reaches which physical key on a QWERTY
 * keyboard, not which Urdu character a key produces — so it lives
 * in its own file and never touches the phonetic mapping.
 */

export type Hand = "Left" | "Right";
export type Finger = "Pinky" | "Ring" | "Middle" | "Index" | "Thumb";

export interface FingerGuide {
  hand: Hand;
  finger: Finger;
}

export const KEY_FINGER_MAP: Record<string, FingerGuide> = {
  q: { hand: "Left", finger: "Pinky" }, w: { hand: "Left", finger: "Ring" }, e: { hand: "Left", finger: "Middle" },
  r: { hand: "Left", finger: "Index" }, t: { hand: "Left", finger: "Index" },
  a: { hand: "Left", finger: "Pinky" }, s: { hand: "Left", finger: "Ring" }, d: { hand: "Left", finger: "Middle" },
  f: { hand: "Left", finger: "Index" }, g: { hand: "Left", finger: "Index" },
  z: { hand: "Left", finger: "Pinky" }, x: { hand: "Left", finger: "Ring" }, c: { hand: "Left", finger: "Middle" },
  v: { hand: "Left", finger: "Index" }, b: { hand: "Left", finger: "Index" },
  y: { hand: "Right", finger: "Index" }, u: { hand: "Right", finger: "Index" }, i: { hand: "Right", finger: "Middle" },
  o: { hand: "Right", finger: "Ring" }, p: { hand: "Right", finger: "Pinky" },
  h: { hand: "Right", finger: "Index" }, j: { hand: "Right", finger: "Index" }, k: { hand: "Right", finger: "Middle" },
  l: { hand: "Right", finger: "Ring" },
  n: { hand: "Right", finger: "Index" }, m: { hand: "Right", finger: "Index" },
  // Part 12's keyboardRows also includes "/" (PakUrdu's doesn't) —
  // standard touch-typing assigns it to the right pinky.
  ",": { hand: "Right", finger: "Middle" }, ".": { hand: "Right", finger: "Ring" }, "/": { hand: "Right", finger: "Pinky" },
  space: { hand: "Right", finger: "Thumb" },
};

/** The hand/finger that types a given physical key, if standard touch-typing covers it. */
export function fingerForKey(key: string): FingerGuide | null {
  return KEY_FINGER_MAP[key] ?? null;
}
