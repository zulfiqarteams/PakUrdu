export function difficultyIndex(round: number): number { return Math.min(4, Math.floor(Math.max(0, round) / 5)); }
export function survivalDuration(round: number): number { return Math.max(20, 75 - difficultyIndex(round) * 10); }
