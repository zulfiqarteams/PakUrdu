// Types
export type {
  SessionResult,
  Feedback,
  FeedbackTone,
  SessionResultStatus,
} from "@/features/results/types";

// Pure core (no React — safe to unit test directly)
export { getFeedback } from "@/features/results/core/feedback";
export { isNewPersonalBest } from "@/features/results/core/personalBest";
export { buildSessionResult } from "@/features/results/core/sessionResult";
export { getResultNavigationTargets } from "@/features/results/core/navigation";
export type { ResultNavigationTargets } from "@/features/results/core/navigation";
export { getMistakeSummaryMessage } from "@/features/results/core/mistakeSummary";
export { formatAccuracy, formatWpm, formatPreviousBest } from "@/features/results/core/display";

// Context
export { SessionResultProvider, useSessionResult } from "@/features/results/context/SessionResultContext";
