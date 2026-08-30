import type { Course } from "@/features/lessons/types";

/**
 * There is only one course today. This still lives behind the same
 * catalog API as everything else so a second course could be added
 * later without changing how callers ask for "the current course".
 */
export const course: Course = {
  id: "urdu-phonetic-typing",
  title: "Urdu Phonetic Typing",
  description:
    "Learn to type Urdu using a phonetic keyboard — from your very first letter to professional, paragraph-length writing.",
};
