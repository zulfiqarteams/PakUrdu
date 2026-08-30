// Types
export type {
  TypingState,
  TypingStatus,
  CharacterStatus,
  TargetCharacter,
  TypingMistake,
} from "@/features/typing/types";

// Pure core (no React — safe to unit test directly)
export {
  compareCharacters,
  calculateAccuracy,
  getTypingState,
  createInitialState,
  appendCharacter,
  removeLastCharacter,
  mergeMistakes,
} from "@/features/typing/core/typingEngine";

// Unicode utilities
export { segmentText } from "@/features/typing/utils/graphemes";
export { normalizeUrduForComparison } from "@/features/typing/utils/normalizeUrduText";
export { getWordChunkBoundaries, getChunkRange, getVisibleWordWindow } from "@/features/typing/utils/textWindow";

// Hooks
export { useTypingEngine } from "@/features/typing/hooks/useTypingEngine";
export type { UseTypingEngineResult } from "@/features/typing/hooks/useTypingEngine";
export { useKeyboardTapInput } from "@/features/typing/hooks/useKeyboardTapInput";

// Components
export { TypingText } from "@/features/typing/components/TypingText";
export { TypingTestSurface } from "@/features/typing/components/TypingTestSurface";
export { TypingStats } from "@/features/typing/components/TypingStats";
export { TypingCaptureArea } from "@/features/typing/components/TypingCaptureArea";

export { useTypingSession } from "@/features/typing/hooks/useTypingSession";
export type { UseTypingSessionOptions, UseTypingSessionResult } from "@/features/typing/hooks/useTypingSession";
export { TypingWorkspace } from "@/features/typing/components/TypingWorkspace";
export type { TypingWorkspaceProps } from "@/features/typing/components/TypingWorkspace";
