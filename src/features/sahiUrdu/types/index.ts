export type UrduErrorType =
  | "spelling"
  | "pronunciation"
  | "diacritics"
  | "variant"
  | "confusion";

export type UrduFormStatus = "wrong" | "common" | "variant" | "preferred";
export type Difficulty = "easy" | "medium" | "hard";
export type Frequency = "very-high" | "high" | "medium" | "low";

export interface UrduSource {
  name: string;
  url: string;
  type: "dictionary" | "academic" | "reference";
  note?: string;
}

export interface UrduWord {
  id: string;
  correctWord: string;
  roman?: string;
  meaning: string;
  meaningUrdu?: string;
  explanation?: string;
  errorType: UrduErrorType;
  formStatus: UrduFormStatus;
  commonWrongForms?: string[];
  commonForms?: string[];
  diacritics?: string;
  difficulty: Difficulty;
  frequency: Frequency;
  category: string[];
  examples?: string[];
  relatedWords?: string[];
  pronunciation?: string;
  pronunciationNote?: string;
  audio?: string | null;
  confidence: "high" | "medium";
  sources: UrduSource[];
}
