import type { LessonDifficulty } from "@/types";

/**
 * The kind of lesson. Drives which content fields are meaningful and
 * (later) which practice component the Typing Engine renders — the
 * lesson engine itself stays agnostic and just passes this through.
 */
export type LessonType =
  | "introduction"
  | "key"
  | "character"
  | "combination"
  | "word"
  | "sentence"
  | "paragraph"
  | "mixed"
  | "review"
  | "test";

/**
 * The kind of practice an exercise represents. Kept separate from
 * `LessonType` — a single lesson can carry several exercises of
 * different types (e.g. a "word" lesson can mix `recognition` and
 * `guidedTyping` exercises).
 */
export type LessonStepKind = "learn" | "observe" | "practice" | "review" | "master";

export interface LessonStep {
  id: string;
  kind: LessonStepKind;
  title: string;
  instruction: string;
  /** Text that must be typed to finish this step. Non-typing steps omit it. */
  target?: string;
  character?: string;
  phonetic?: string;
  expectedKey?: { key: string; shift: boolean };
  minimumAccuracy?: number;
  note?: string;
  examples?: LessonExample[];
}

export type ExerciseType =
  | "recognition"
  | "guidedTyping"
  | "repetition"
  | "words"
  | "sentences"
  | "paragraph";

/**
 * A single practice unit inside a lesson. Deliberately plain data —
 * no behavior, no React. The future Typing Engine will consume
 * `target` (and `instruction`) without needing to know anything else
 * about the lesson it came from.
 */
export interface Exercise {
  id: string;
  type: ExerciseType;
  instruction: string;
  /** The literal text the learner will eventually type against. */
  target: string;
  metadata?: Record<string, string | number | boolean>;
}

/** One worked example shown in a lesson's "Examples" section. */
export interface LessonExample {
  /** Urdu text, rendered right-to-left. */
  urdu: string;
  /** Roman-Urdu / phonetic reading, e.g. "seb". Optional — not every
   *  example needs a transliteration (e.g. a bare letter). */
  transliteration?: string;
  /** English gloss, e.g. "apple". Optional for the same reason. */
  meaning?: string;
}

/**
 * A lesson's body content. Every field is optional except
 * `explanation` — not every lesson type uses examples, a single
 * target text, or exercises, and forcing all of them would make
 * simpler lesson types (like `introduction`) carry empty arrays for
 * no reason.
 */
export interface LessonContent {
  /** Short educational explanation shown before any practice. */
  explanation: string;
  examples?: LessonExample[];
  /** A single primary piece of target text for the lesson, when the
   *  lesson revolves around one passage rather than a list of
   *  exercises (e.g. a paragraph lesson). */
  targetText?: string;
  /** Practice-section instructions, shown above the (future) typing
   *  interface. */
  instructions?: string;
  exercises?: Exercise[];
}

/**
 * A single lesson — the smallest unit a learner navigates to
 * directly (one lesson = one `/lesson/:id` page).
 */
export interface Lesson {
  id: string;
  levelId: string;
  moduleId: string;
  /** Position within its module, 1-based. Used for both display
   *  ("Lesson 3") and next/previous ordering. */
  order: number;
  title: string;
  description: string;
  difficulty: LessonDifficulty;
  /** "What you will learn" — short, learner-facing statements. */
  objectives: string[];
  type: LessonType;
  /** Ordered learning experience shown on the lesson page. */
  steps?: LessonStep[];
  introducedCharacters?: string[];
  targetCharacter?: string;
  phonetic?: string;
  requiredAccuracy?: number;
  content: LessonContent;
  metadata?: Record<string, string | number | boolean>;
}

/** A themed group of lessons within a level. */
export interface Module {
  id: string;
  levelId: string;
  /** Position within its level, 1-based. */
  order: number;
  title: string;
  description: string;
}

/** A major stage of the curriculum (Getting Started, Words, ...). */
export interface Level {
  id: string;
  /** Position within the course, 1-based (0-indexed conceptually as
   *  "Level 0" for display — see `displayIndex` on the catalog). */
  order: number;
  title: string;
  description: string;
  /**
   * Static/mock lock state for Part 6. This is NOT derived from
   * completion — there is no completion tracking yet. A future part
   * will replace this with a real progress-driven computation.
   */
  locked: boolean;
}

/** The single top-level course this app currently teaches. */
export interface Course {
  id: string;
  title: string;
  description: string;
}
