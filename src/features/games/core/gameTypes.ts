export type GameId = "letter-hunter" | "word-rush" | "combo-master" | "typing-sprint" | "urdu-survival";
export type GameCategory = "beginner" | "speed" | "accuracy" | "keyboard" | "advanced";
export interface GameDefinition { id: GameId; titleKey: string; descriptionKey: string; category: GameCategory; durationOptions: number[]; defaultDuration: number; }
export interface GameRecord { bestScore: number; gamesPlayed: number; bestWpm: number; bestAccuracy: number; bestStreak: number; updatedAt: string; }
export interface GameResult { score: number; wpm: number; cpm: number; accuracy: number; streak: number; }
