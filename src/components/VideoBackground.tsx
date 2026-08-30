import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useSettings } from "@/features/settings";

interface VideoBackgroundContextValue {
  focusMode: boolean;
  setFocusMode: (active: boolean) => void;
}

const VideoBackgroundContext = createContext<VideoBackgroundContextValue | null>(null);

export function VideoBackgroundProvider({ children }: { children: ReactNode }) {
  const [focusMode, setFocusModeState] = useState(false);

  const setFocusMode = useCallback((active: boolean) => {
    setFocusModeState(active);
  }, []);

  const value = useMemo(
    () => ({ focusMode, setFocusMode }),
    [focusMode, setFocusMode],
  );

  return (
    <VideoBackgroundContext.Provider value={value}>
      {children}
    </VideoBackgroundContext.Provider>
  );
}

export function useVideoBackground() {
  const context = useContext(VideoBackgroundContext);
  if (!context) {
    throw new Error("useVideoBackground must be used inside VideoBackgroundProvider");
  }
  return context;
}

/**
 * The cinematic video is only ever visible where a section deliberately
 * punches a transparent hole through the opaque page background (currently
 * only the homepage Hero, and only in dark theme — see HeroTypingWidget).
 * Everywhere else it sits uselessly behind an opaque `bg-paper`/`bg-surface`
 * layer, decoding and compositing every frame for zero visual result. That
 * was a constant, avoidable CPU/GPU cost on every single page and in light
 * theme, which is the main thing making the whole app feel sluggish.
 *
 * So: only mount (download/decode/play) the <video> when it can actually be
 * seen — dark theme, on the homepage — and pause it whenever the tab isn't
 * visible. Everywhere else we render nothing.
 */
export function VideoBackground() {
  const { focusMode } = useVideoBackground();
  const { darkTheme } = useSettings();
  const location = useLocation();
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVisibleContext = darkTheme && location.pathname === "/";

  // Pause the video whenever the browser tab is backgrounded, so it never
  // burns CPU/battery for a frame nobody is looking at.
  useEffect(() => {
    if (!isVisibleContext) return;
    const handleVisibility = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isVisibleContext]);

  if (!isVisibleContext) return null;

  return (
    <div
      className={`video-background-wrapper${focusMode ? " video-background-wrapper--focus" : ""}`}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`main-bg-video${videoReady ? " main-bg-video--ready" : ""}`}
        onCanPlay={() => setVideoReady(true)}
      >
        <source
          src={`${import.meta.env.BASE_URL}assets/pakurdu_intro_v2.mp4`}
          type="video/mp4"
        />
      </video>
      <div className="video-overlay-shield" />
    </div>
  );
}
