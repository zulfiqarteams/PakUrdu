import type { LucideIcon } from "lucide-react";

/** A single entry in the primary site navigation. */
export interface NavItem {
  label: string;
  path: string;
  icon?: LucideIcon;
}

/** A future-feature preview card shown on the home page. */
export interface FeaturePreview {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Text direction for a piece of content. Used to keep RTL (Urdu) and
 * LTR (numbers, technical values, Latin UI copy) content correctly
 * isolated when they appear side by side.
 */
export type TextDirection = "rtl" | "ltr";

/** Difficulty tier shown on a lesson. Visual label only. */
export type LessonDifficulty = "Beginner" | "Intermediate" | "Professional";

/**
 * Visual state of a lesson card. Supplied by the caller (eventually
 * the lesson engine) — LessonCard only renders whichever state it's
 * given, it never derives this itself.
 */
export type LessonStatus = "available" | "current" | "completed" | "locked";

/** Direction of change for a StatCard's optional trend indicator. */
export type StatTrend = "up" | "down" | "neutral";
