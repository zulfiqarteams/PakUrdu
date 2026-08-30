// Pure timer core (no React — safe to unit test directly)
export {
  createTimer,
  startTimer,
  pauseTimer,
  resumeTimer,
  completeTimer,
  resetTimer,
  getElapsedMs,
} from "@/features/statistics/core/timer";
export type { TimerStatus, TimerState } from "@/features/statistics/core/timer";

// Pure statistics core (no React — safe to unit test directly)
export { calculateWPM, calculateCPM, formatTime, calculateStatistics } from "@/features/statistics/core/statistics";
export type { TypingStatistics } from "@/features/statistics/core/statistics";

// Hook
export { useTypingTimer } from "@/features/statistics/hooks/useTypingTimer";
export type { UseTypingTimerResult } from "@/features/statistics/hooks/useTypingTimer";
