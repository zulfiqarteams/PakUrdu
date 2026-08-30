export type BiographyCategory =
  | "prophetic"
  | "family"
  | "companions"
  | "rashidun"
  | "scholars"
  | "scientists"
  | "history";

export interface BiographySource {
  title: string;
  author?: string;
  institution?: string;
  url: string;
  sourceType: "quran" | "hadith" | "seerah" | "academic" | "encyclopedia" | "reference";
  note?: string;
}

export interface BiographyChapter {
  id: string;
  title: string;
  summary: string;
  text: string;
  sources?: BiographySource[];
}

export interface TimelineEvent {
  id: string;
  label: string;
  date?: string;
  description: string;
}

export interface BiographyEntry {
  id: string;
  name: string;
  respectfulName: string;
  aliases: string[];
  category: BiographyCategory;
  subcategory: string;
  era: string;
  region?: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  levelContent?: Partial<Record<"beginner" | "intermediate" | "advanced" | "expert", { summary: string; text: string }>>;
  summary: string;
  biography: string;
  chapters: BiographyChapter[];
  timeline: TimelineEvent[];
  relationships: Array<{ relation: string; personId: string; label: string }>;
  relatedIds: string[];
  achievements: string[];
  sources: BiographySource[];
  quiz: Array<{ question: string; options: string[]; answer: number; explanation?: string }>;
}
