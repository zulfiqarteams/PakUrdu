import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { TargetCharacter } from "@/features/typing/types";

interface TypingTextProps {
  characters: TargetCharacter[];
  statusSummary: string;
  showFeedback?: boolean;
  sizeVariant?: "default" | "compact";
  layout?: "default" | "scroll" | "line" | "stream";
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
/**
 * Where the active line sits within the stream viewport, as a
 * fraction of its height. 0.3 (not 0.5) keeps 1-2 upcoming lines
 * visible below the active one, matching how a paragraph-style
 * typing stream is normally read (see master-spec §3.5/§3.8).
 */
const STREAM_ANCHOR_RATIO_Y = 0.3;

/**
 * Dead-zone half-width, as a fraction of the viewport's relevant
 * dimension, around the anchor. As long as the current character
 * stays inside this band, the text track does NOT move — only the
 * (now free-floating) cursor moves to it. The track only re-centers
 * once the character would drift outside the band.
 *
 * Without this, every single keystroke recomputed `delta` from
 * scratch and re-applied it, so the *entire line* slid by one
 * glyph-width on every character typed — a continuous, visible
 * scroll in sync with typing that read as "words/cursor moving
 * up-down / back-and-forth" while typing normally. Real typing-test
 * UIs (Monkeytype, 10FastFingers, etc.) all use this dead-zone
 * pattern: the cursor is free to move within a comfortable middle
 * band, and the line only shifts — smoothly, once — when it nears
 * the edge, instead of nudging on every keystroke.
 */
const DEAD_ZONE_RATIO = 0.14;

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

  if (layout === "stream") {
    return (
      <StreamTypingText
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
  const [cursor, setCursor] = useState({ x: 0, top: 0, height: 0, visible: false });
  // Tracks the shift value we last actually applied to the track, so a
  // dead-zone re-center can add to it instead of recomputing "from
  // anchor" (which is what caused a full re-snap on every keystroke).
  const appliedShiftRef = useRef(0);

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

    // A session reset/backspace-to-start has no resetKey reaching this
    // renderer, so the current index itself is the reliable global reset
    // signal. Never carry an old horizontal shift into a fresh passage.
    if (currentIndex <= 0) {
      appliedShiftRef.current = 0;
      container.style.setProperty("--typing-shift-x", "0px");
    }

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
    const deadZone = containerRect.width * DEAD_ZONE_RATIO;
    // RTL: the caret marks the boundary between what's already typed
    // (visually to the right) and what's still pending (to the left),
    // so it belongs at the current character's *right* edge, not its
    // left. Using `rect.left` here put the caret a full glyph-width to
    // the wrong side of the target character — visually landing on top
    // of / cutting through the glyph instead of sitting cleanly beside
    // it, which is what made the caret look oddly placed and made the
    // letter it overlapped look "cracked."
    //
    // This measurement already reflects whatever shift is currently
    // applied to the track (getBoundingClientRect is post-transform),
    // so `targetX` is the character's real on-screen position right now.
    const targetX = rect.right - containerRect.left;

    if (Math.abs(targetX - anchor) <= deadZone) {
      // Inside the comfortable band: let the cursor move to the
      // character's real position and leave the track alone. This is
      // what makes normal typing feel like a stationary line with a
      // moving caret, instead of the whole line sliding every keystroke.
      setCursor({
        x: targetX,
        top: rect.top - containerRect.top,
        height: Math.max(28, rect.height),
        visible: true,
      });
      return;
    }

    // Drifted past the band (fast typing, a jump, or line/passage
    // reset) — re-center in one smooth move, same as before, and
    // remember the shift we applied so the next dead-zone check is
    // measured against it correctly.
    const delta = anchor - targetX;
    const newShift = appliedShiftRef.current + delta;
    appliedShiftRef.current = newShift;
    setCursor({
      x: anchor,
      top: rect.top - containerRect.top,
      height: Math.max(28, rect.height),
      visible: true,
    });
    container.style.setProperty("--typing-shift-x", `${newShift}px`);
  };

  // Full re-center on reset (new passage / restart) — a stale shift
  // from the previous passage should never carry over.
  useLayoutEffect(() => {
    appliedShiftRef.current = 0;
    const container = containerRef.current;
    if (container) container.style.setProperty("--typing-shift-x", "0px");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

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
              transform: `translate3d(${cursor.x}px, ${cursor.top}px, 0)`,
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

/**
 * Master-spec §3.5: a continuous, multi-line stream of the passage —
 * not one static line, and explicitly not the single-line
 * horizontal-scroll pattern `ScrollableTypingText` above implements
 * (§3.8 in that spec calls that pattern out by name and rejects it).
 *
 * Text wraps naturally at a fixed width (normal browser line-breaking
 * — RTL wrapping is the browser's own, not reimplemented here), and
 * the viewport shows a few lines at once. Only the *vertical* position
 * needs correcting per keystroke: the active line is kept at a
 * constant anchor near the top of the viewport by shifting the whole
 * text block with `transform: translateY(...)`, so completed lines
 * scroll up and out as the learner progresses — same transform-only,
 * measured-not-estimated technique as `ScrollableTypingText`, just on
 * the Y axis instead of X.
 *
 * The cursor's horizontal position is NOT shifted — each line is
 * already positioned correctly by normal text flow within the fixed-
 * width container, so the cursor simply tracks the active character's
 * real measured `left`. Only its vertical position is pinned to the
 * anchor (since that's exactly where the shifted active line now
 * sits).
 */
function StreamTypingText({
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
  const trackRef = useRef<HTMLDivElement>(null);
  const currentRunRef = useRef<HTMLSpanElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, height: 0, visible: false });
  // See ScrollableTypingText's appliedShiftRef — same reasoning, Y axis.
  const appliedShiftRef = useRef(0);

  const currentIndex = characters.findIndex((character) => character.status === "current");
  const currentRunIndex = runs.findIndex((run) => run.currentOffset !== null);

  const measureRef = useRef<() => void>(() => {});
  measureRef.current = () => {
    const container = containerRef.current;
    const track = trackRef.current;
    const run = currentRunRef.current;
    if (!container || !track) return;

    // No active character (session not yet started, or finished) —
    // reset scroll to the top and hide the cursor rather than leaving
    // it pinned at wherever it last was.
    if (!run) {
      appliedShiftRef.current = 0;
      track.style.setProperty("--typing-shift-y", "0px");
      setCursor((previous) => (previous.visible ? { ...previous, visible: false } : previous));
      return;
    }

    // The shared surface does not receive the session's internal version,
    // so currentIndex === 0 is the global reset signal for the stream too.
    if (currentIndex <= 0) {
      appliedShiftRef.current = 0;
      track.style.setProperty("--typing-shift-y", "0px");
    }

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

    const anchorY = containerRect.height * STREAM_ANCHOR_RATIO_Y;
    const deadZoneY = containerRect.height * DEAD_ZONE_RATIO;
    // Post-transform measurement, same as the horizontal case: this is
    // the character's real on-screen Y right now, given whatever shift
    // is already applied.
    const targetY = rect.top - containerRect.top;
    const cursorX = rect.right - containerRect.left; // free-floating either way

    if (Math.abs(targetY - anchorY) <= deadZoneY) {
      // Inside the band: this covers ordinary same-line movement, and
      // also absorbs Nastaliq's normal per-glyph baseline "stair-step"
      // within a line — both used to force a fresh re-center on every
      // keystroke (the vertical "up-down while typing" feeling). Now
      // only the cursor tracks it; the block stays put.
      setCursor({ x: cursorX, y: targetY, height: Math.max(28, rect.height), visible: true });
      const cursorEl = cursorRef.current;
      if (cursorEl) {
        cursorEl.style.animation = "none";
        void cursorEl.offsetWidth;
        cursorEl.style.animation = "";
      }
      return;
    }

    // Actually moved to a new line (or a big jump) — re-center for real.
    const deltaY = anchorY - targetY;
    const newShift = appliedShiftRef.current + deltaY;
    appliedShiftRef.current = newShift;

    setCursor({
      x: cursorX,
      y: anchorY,
      height: Math.max(28, rect.height),
      visible: true,
    });
    track.style.setProperty("--typing-shift-y", `${newShift}px`);

    // Blink should pause/reset on every keystroke rather than
    // continuing mid-cycle into the new position (master-spec §3.3).
    // Restarting a CSS animation this way (clear it, force a reflow,
    // re-apply) doesn't touch the `transform` inline style above, so
    // the move itself still transitions smoothly — only the blink
    // clock resets.
    const cursorEl = cursorRef.current;
    if (cursorEl) {
      cursorEl.style.animation = "none";
      void cursorEl.offsetWidth;
      cursorEl.style.animation = "";
    }
  };

  useLayoutEffect(() => {
    appliedShiftRef.current = 0;
    const track = trackRef.current;
    if (track) track.style.setProperty("--typing-shift-y", "0px");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useLayoutEffect(() => {
    measureRef.current();
  }, [currentIndex, resetKey, runs]);

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
          "typing-stream-viewport relative mx-auto w-full",
          sizeVariant === "compact" && "typing-stream-viewport--compact",
        )}
        dir="rtl"
        lang="ur"
      >
        <div
          ref={trackRef}
          className={cn("typing-stream-track urdu-text", sizeVariantClasses[sizeVariant])}
          dir="rtl"
          lang="ur"
        >
          {runs.map((run, index) => (
            <span
              key={run.key}
              ref={run.currentOffset !== null && index === currentRunIndex ? currentRunRef : undefined}
              className={runClass(run.status, showFeedback)}
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
            ref={cursorRef}
            aria-hidden="true"
            className="typing-cursor typing-cursor--stream"
            style={{
              transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
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
