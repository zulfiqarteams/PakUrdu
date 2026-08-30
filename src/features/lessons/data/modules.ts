import type { Module } from "@/features/lessons/types";

export const modules: Module[] = [
  { id: "module-letters-1", levelId: "level-0", order: 1, title: "Alif to Daal", description: "The first ten Urdu characters and their physical keys." },
  { id: "module-letters-2", levelId: "level-0", order: 2, title: "Daal to Sheen", description: "The next group of characters, including shifted keys." },
  { id: "module-letters-3", levelId: "level-0", order: 3, title: "Suaad to Gaaf", description: "Build confidence with the middle of the Urdu alphabet." },
  { id: "module-letters-4", levelId: "level-0", order: 4, title: "Laam to Yay", description: "Finish the alphabet and master the remaining keys." },
  { id: "module-combinations-1", levelId: "level-1", order: 1, title: "Build the Shape", description: "Combine recently learned letters into short patterns." },
  { id: "module-combinations-2", levelId: "level-1", order: 2, title: "Review the Pattern", description: "Mix combinations until the key sequence feels automatic." },
  { id: "module-words-foundations", levelId: "level-2", order: 1, title: "Word Foundations", description: "Short, highly familiar words built from early letters." },
  { id: "module-words-common", levelId: "level-2", order: 2, title: "Common Vocabulary", description: "Everyday, family, school, and routine vocabulary." },
  { id: "module-words-fluency", levelId: "level-2", order: 3, title: "Word Fluency", description: "Longer words, names, values, and mixed review." },
  { id: "module-sentences", levelId: "level-3", order: 1, title: "Complete Sentences", description: "Put useful Urdu words together with punctuation." },
  { id: "module-paragraphs", levelId: "level-4", order: 1, title: "Fluency Passages", description: "Sustain accurate typing over several sentences." },
  { id: "module-professional", levelId: "level-5", order: 1, title: "Formal Writing", description: "Office, educational, and professional Urdu." },
  { id: "module-mastery", levelId: "level-6", order: 1, title: "Final Mastery", description: "Final mixed lessons before independent tests." },
];
