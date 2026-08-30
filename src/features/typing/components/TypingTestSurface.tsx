import type { ReactNode } from "react";
import { Keyboard } from "lucide-react";
import { cn } from "@/lib/cn";
import { TypingCaptureArea } from "@/features/typing/components/TypingCaptureArea";
import { TypingText } from "@/features/typing/components/TypingText";
import { VirtualKeyboard } from "@/features/keyboard";
import type { PressedKey } from "@/features/keyboard";
import type { ExpectedKey } from "@/features/keyboard/data/phoneticMap";
import type { UseTypingEngineResult } from "@/features/typing/hooks/useTypingEngine";

interface TypingTestSurfaceProps {
  typing: UseTypingEngineResult;
  showKeyboard?: boolean;
  keyboardTitle?: ReactNode;
  expectedKey?: ExpectedKey;
  pressedKey?: PressedKey | null;
  sizeVariant?: "default" | "compact";
  layout?: "scroll" | "line" | "default";
  statusSummary?: string;
  typingFeedback?: boolean;
  canType?: () => boolean;
  isLocked?: boolean;
  onActiveChange?: (active: boolean) => void;
  onTypingActivity?: () => void;
  onKeyPress?: (char: string) => void;
  onBackspace?: () => void;
  footer?: ReactNode;
  className?: string;
}

/**
 * ONE shared visual typing surface. Practice, Tests, Home Row and long-form
 * Biography practice all render their live text through this component.
 * The engine remains responsible for comparison/metrics; this component only
 * owns presentation, capture and secondary keyboard controls.
 */
export function TypingTestSurface({
  typing,
  showKeyboard = false,
  keyboardTitle = "On-screen keyboard",
  expectedKey,
  pressedKey,
  sizeVariant = "default",
  layout = "scroll",
  statusSummary,
  typingFeedback = true,
  canType,
  isLocked = false,
  onActiveChange,
  onTypingActivity,
  onKeyPress,
  onBackspace,
  footer,
  className,
}: TypingTestSurfaceProps) {
  const summary = statusSummary ?? `${typing.correctCharacters} correct, ${typing.incorrectCharacters} incorrect, ${typing.currentIndex} typed.`;

  return (
    <section className={cn("typing-test-surface", className)}>
      <div className="typing-display-global min-w-0 px-1 py-4 sm:px-2 sm:py-6">
        <TypingCaptureArea
          typing={typing}
          onActiveChange={onActiveChange}
          suppressNativeKeyboardOnTouch={showKeyboard}
          canType={canType}
          isLocked={isLocked}
          onTypingActivity={onTypingActivity}
        >
          <div className="w-full min-w-0 overflow-hidden">
            <TypingText
              characters={typing.characters}
              statusSummary={summary}
              showFeedback={typingFeedback}
              layout={layout}
              sizeVariant={sizeVariant}
            />
          </div>
        </TypingCaptureArea>
      </div>

      {showKeyboard && (
        <details className="typing-secondary-panel mt-4 rounded-xl border border-border/60 bg-surface/45 p-3 sm:p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink">
            <span className="inline-flex items-center gap-2">
              <Keyboard size={16} aria-hidden="true" />
              {keyboardTitle}
            </span>
            <span className="text-xs font-normal text-ink-faint">
              {expectedKey?.shift ? "Shift" : "Keyboard"}
            </span>
          </summary>
          <div className="mt-4">
            <VirtualKeyboard
              pressedKey={pressedKey}
              expectedKey={expectedKey}
              sizeVariant={sizeVariant}
              onKeyPress={onKeyPress}
              onBackspace={onBackspace}
            />
          </div>
        </details>
      )}

      {footer && <div className="mt-4 flex justify-end border-t border-border/50 pt-4">{footer}</div>}
    </section>
  );
}
