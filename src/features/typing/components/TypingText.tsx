import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { TargetCharacter } from "@/features/typing/types";

interface TypingTextProps {
  characters: TargetCharacter[];
  statusSummary: string;
  showFeedback?: boolean;
  sizeVariant?: "default" | "compact";
  layout?: "default" | "scroll" | "line";
  resetKey?: string | number;
}

type CharacterRun = {
  key: number;
  status: Exclude<TargetCharacter["status"], "current">;
  characters: TargetCharacter[];
  text: string;
  currentOffset: number | null;
};

const SCROLL_ANCHOR_RATIO = 0.62;

const sizeVariantClasses: Record<"default" | "compact", string> = {
  default: "text-4xl leading-[4.75rem] sm:text-5xl sm:leading-[5.5rem]",
  compact: "text-[clamp(1.25rem,5vh,3rem)] leading-[clamp(3.5rem,10vh,5rem)]",
};

/**
 * Keep each shaping run contiguous. The current grapheme is treated as part
 * of the pending run for DOM purposes; its exact glyph position is measured
 * with a Range, so the blinking cursor does not require an isolated span.
 */
function buildRuns(characters: TargetCharacter[]): CharacterRun[] {
  const runs: CharacterRun[] = [];
  for (const character of characters) {
    const visualStatus = character.status === "current" ? "pending" : character.status;
    const previous = runs[runs.length - 1];
    if (previous && previous.status === visualStatus) {
      const offset = previous.characters.length;
      previous.characters.push(character);
      previous.text += character.char;
      if (character.status === "current") previous.currentOffset = offset;
      continue;
    }
    runs.push({
      key: character.index,
      status: visualStatus,
      characters: [character],
      text: character.char,
      currentOffset: character.status === "current" ? 0 : null,
    });
  }
  return runs;
}

function runClass(status: CharacterRun["status"], showFeedback: boolean) {
  if (status === "correct") return "typing-run typing-run--correct";
  if (status === "incorrect" && showFeedback) return "typing-run typing-run--incorrect";
  return "typing-run typing-run--pending";
}

export function TypingText({
  characters,
  statusSummary,
  showFeedback = true,
  sizeVariant = "default",
  layout = "default",
  resetKey,
}: TypingTextProps) {
  const runs = useMemo(() => buildRuns(characters), [characters]);

  if (layout === "scroll") {
    return (
      <ScrollableTypingText
        runs={runs}
        characters={characters}
        statusSummary={statusSummary}
        showFeedback={showFeedback}
        sizeVariant={sizeVariant}
        resetKey={resetKey}
      />
    );
  }

  return (
    <div className="typing-text-shell urdu-text" dir="rtl" lang="ur">
      <div
        className={cn(
          "typing-text-flow mx-auto w-full text-center",
          sizeVariantClasses[sizeVariant],
        )}
        dir="rtl"
        lang="ur"
      >
        {runs.map((run) => (
          <span
            key={run.key}
            className={runClass(run.status, showFeedback)}
            dir="rtl"
            lang="ur"
          >
            {run.text}
          </span>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {statusSummary}
      </p>
    </div>
  );
}

function ScrollableTypingText({
  runs,
  characters,
  statusSummary,
  showFeedback,
  sizeVariant,
  resetKey,
}: {
  runs: CharacterRun[];
  characters: TargetCharacter[];
  statusSummary: string;
  showFeedback: boolean;
  sizeVariant: "default" | "compact";
  resetKey?: string | number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRunRef = useRef<HTMLSpanElement | null>(null);
  const [cursor, setCursor] = useState({ top: 0, height: 0, visible: false });

  const currentIndex = characters.findIndex((character) => character.status === "current");
  const currentRunIndex = runs.findIndex((run) => run.currentOffset !== null);

  // Kept in a ref (rather than recreated inside the ResizeObserver
  // effect below) so the observer/listener effect can stay mount-only
  // while still always measuring against the latest runs/refs.
  const measureRef = useRef<() => void>(() => {});
  measureRef.current = () => {
    const container = containerRef.current;
    const run = currentRunRef.current;
    if (!container || !run) return;

    const textNode = run.firstChild;
    if (!textNode) return;
    const range = document.createRange();
    const currentOffset = runs[currentRunIndex]?.currentOffset ?? 0;
    const currentCharacter = runs[currentRunIndex]?.characters[currentOffset];
    if (!currentCharacter) return;
    const graphemeStart = runs[currentRunIndex]?.characters
      .slice(0, currentOffset)
      .reduce((total, item) => total + item.char.length, 0) ?? 0;
    const graphemeEnd = graphemeStart + currentCharacter.char.length;
    range.setStart(textNode, graphemeStart);
    range.setEnd(textNode, graphemeEnd);
    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const anchor = containerRect.width * SCROLL_ANCHOR_RATIO;
    const targetX = rect.left - containerRect.left;
    const delta = anchor - targetX;

    // The cursor itself stays pinned at the fixed anchor (`left: 62%`
    // in CSS) — only the text track is shifted by `delta` so the
    // current glyph lands under it. Previously `delta` was ALSO
    // applied as a horizontal transform on the cursor span on top of
    // its already-anchored CSS position, so it ended up offset by
    // `delta` from the anchor instead of sitting on the current
    // character — that double-shift is what made the cursor look
    // like it was floating at a random/centered spot. Only the
    // vertical offset (for line-height differences) belongs on the
    // cursor itself.
    setCursor({
      top: rect.top - containerRect.top,
      height: Math.max(28, rect.height),
      visible: true,
    });
    container.style.setProperty("--typing-shift-x", `${delta}px`);
  };

  // Reposition on every keystroke / text swap.
  useLayoutEffect(() => {
    measureRef.current();
  }, [currentIndex, resetKey, runs]);

  // Set up the ResizeObserver/resize listener once per mount instead
  // of tearing it down and rebuilding it on every keystroke — the
  // previous version recreated both inside the per-keystroke effect
  // above, which meant every single character typed forced an extra
  // observer disconnect/reconnect and layout pass on top of the
  // (unavoidable) Range measurement, adding up to visible lag during
  // fast typing.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => measureRef.current());
    observer.observe(container);
    const handleResize = () => measureRef.current();
    window.addEventListener("resize", handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="typing-text-shell urdu-text" dir="rtl" lang="ur">
      <div
        ref={containerRef}
        className={cn(
          "typing-scroll-viewport relative mx-auto w-full overflow-hidden",
          sizeVariant === "compact" ? "min-h-[5.5rem]" : "min-h-[7rem]",
        )}
        dir="rtl"
        lang="ur"
      >
        <div
          className={cn(
            "typing-scroll-track urdu-text inline-block min-w-max whitespace-nowrap",
            sizeVariantClasses[sizeVariant],
          )}
          dir="rtl"
          lang="ur"
        >
          {runs.map((run, index) => (
            <span
              key={run.key}
              ref={run.currentOffset !== null && index === currentRunIndex ? currentRunRef : undefined}
              className={cn(runClass(run.status, showFeedback), "typing-run--scroll")}
              dir="rtl"
              lang="ur"
              aria-current={run.currentOffset !== null ? "step" : undefined}
            >
              {run.text}
            </span>
          ))}
        </div>
        {cursor.visible && (
          <span
            aria-hidden="true"
            className="typing-cursor"
            style={{
              transform: `translate3d(0, ${cursor.top}px, 0)`,
              height: cursor.height,
            }}
          />
        )}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {statusSummary}
      </p>
    </div>
  );
}
