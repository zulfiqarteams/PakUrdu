import type { Lesson } from "@/features/lessons/types";
import { generatedLessons } from "../curriculum";

/**
 * The complete course is deliberately data-driven. Orientation remains in
 * its own file because it predates the step-by-step curriculum; the 90
 * structured lessons are generated from the curriculum definitions and
 * therefore remain easy to extend without duplicating React components.
 */
export const allLessons: Lesson[] = generatedLessons;
