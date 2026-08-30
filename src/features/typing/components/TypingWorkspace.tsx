import { useEffect } from "react";
import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { TypingTestSurface } from "@/features/typing/components/TypingTestSurface";
import { TypingStats } from "@/features/typing/components/TypingStats";
import type { UseTypingSessionResult } from "@/features/typing/hooks/useTypingSession";
import type { ExpectedKey } from "@/features/keyboard/data/phoneticMap";
import { HandFingerGuide, fingerForKey } from "@/features/keyboard";
import { useSettings } from "@/features/settings";
import { HomeRowProgress } from "@/components/HomeRowProgress";
import { useVideoBackground } from "@/components/VideoBackground";
import { useLocation } from "react-router-dom";

export interface TypingWorkspaceProps {
  session: UseTypingSessionResult;
  footer?: ReactNode;
  header?: ReactNode;
  className?: string;
  keyboardTitle?: ReactNode;
  showKeyboard?: boolean;
  showFingerGuide?: boolean;
  showReset?: boolean;
  onReset?: () => void;
  statusSummary?: string;
  sizeVariant?: "default" | "compact";
  layout?: "scroll" | "line" | "default";
  expectedKeyOverride?: ExpectedKey;
}

/**
 * Global typing surface used by Home, Learn, Practice and Tests.
 * Pages provide content/configuration; this component owns the exact
 * vertical order, capture path, keyboard synchronization and metrics UI.
 */
export function TypingWorkspace({
  session,
  footer,
  header,
  className,
  keyboardTitle,
  showKeyboard,
  showFingerGuide = true,
  showReset = false,
  onReset,
  statusSummary,
  sizeVariant = "default",
  layout = "scroll",
  expectedKeyOverride,
}: TypingWorkspaceProps) {
  const { typingFeedback } = useSettings();
  const location = useLocation();
  const { setFocusMode } = useVideoBackground();
  const isDeepTestRoute = location.pathname === "/test";
  const expectedKey = expectedKeyOverride ?? session.expectedKey;

  useEffect(() => {
    if (!isDeepTestRoute || session.ended) {
      setFocusMode(false);
    }
  }, [isDeepTestRoute, session.ended, setFocusMode]);

  const handleTypingActivity = () => {
    if (isDeepTestRoute && !session.ended) {
      setFocusMode(true);
    }
  };
  const activeFinger = expectedKey ? fingerForKey(expectedKey.key) : null;
  const summary = statusSummary ?? (
    session.ended
      ? "Typing session complete."
      : `${session.typing.correctCharacters} correct, ${session.typing.incorrectCharacters} incorrect, ${session.typing.currentIndex} typed.`
  );

  return (
    <section className={cn("typing-workspace-global typing-interface w-full min-w-0", className)}>
      {header && <div className="mb-3 typing-workspace-header">{header}</div>}

      {/* 1. Header metrics */}
      <TypingStats
        accuracy={session.typing.sessionAccuracy}
        currentIndex={session.typing.currentIndex}
        totalCharacters={session.typing.sessionKeystrokes}
        incorrectCharacters={session.typing.incorrectCharacters}
        wpm={session.wpm}
        cpm={session.cpm}
        elapsedMs={session.elapsedMs}
        mode="header"
      />

      {showKeyboard && (
        <HomeRowProgress
          className="mt-3"
          currentIndex={session.typing.currentIndex}
          totalCharacters={session.typing.totalCharacters}
          expectedKey={expectedKey?.key}
        />
      )}

      {/* 2. Shared text-first typing surface. */}
      <TypingTestSurface
        typing={session.typing}
        showKeyboard={showKeyboard}
        keyboardTitle={keyboardTitle ?? "On-screen keyboard"}
        expectedKey={expectedKey}
        pressedKey={session.pressedKey}
        sizeVariant={sizeVariant}
        layout={layout}
        statusSummary={summary}
        typingFeedback={typingFeedback}
        canType={session.timer.canAcceptInput}
        isLocked={session.ended}
        onActiveChange={session.setCaptureActive}
        onTypingActivity={handleTypingActivity}
        onKeyPress={session.keyboardTap.onKeyPress}
        onBackspace={session.keyboardTap.onBackspace}
      />

      {/* Optional finger guidance stays below the keyboard, never beside the metrics. */}
      {showKeyboard && showFingerGuide && (
        <div className="mt-3">
          <HandFingerGuide activeGuide={activeFinger} />
        </div>
      )}

      {/* 4. Contextual footer */}
      {(showReset || footer) && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          {showReset ? (
            <button
              type="button"
              onClick={() => {
                session.reset();
                onReset?.();
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-border-strong hover:text-ink"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Reset
            </button>
          ) : <span />}
          {footer && <div>{footer}</div>}
        </div>
      )}
    </section>
  );
}
