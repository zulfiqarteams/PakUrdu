# PakUrdu Cinematic MP4 Background Integration

The project now includes the supplied `pakurdu_intro_v2.mp4` as a single global cinematic background.

## Architecture

- `src/components/VideoBackground.tsx` owns the fixed video layer and a small context used to toggle deep-focus mode.
- `src/layouts/RootLayout.tsx` mounts the provider/background once, so routes do not create duplicate video elements.
- `src/features/typing/components/TypingCaptureArea.tsx` exposes an optional `onTypingActivity` callback without changing the typing engine source of truth.
- `src/features/typing/components/TypingWorkspace.tsx` enables focus mode only on `/test` while the session is active.
- `src/index.css` contains the cinematic video, glass shield, responsive tuning and reduced-motion fallback.

## Asset path

The MP4 is stored at `public/assets/pakurdu_intro_v2.mp4` and is referenced through `import.meta.env.BASE_URL`, so it works both with Vite's local root and the configured GitHub Pages sub-path.

## Visual states

- Normal/home/practice: video is visible as an ambient layer under an 85% dark shield and 12px backdrop blur.
- Active `/test`: accepted typing activity switches the shield to 95% and reduces video intensity with a 700ms transition.
- Completed/left test route: focus mode is cleared automatically.
- Mobile: lower video intensity and stronger shield for readability/performance.
- `prefers-reduced-motion`: video is hidden and the shield becomes a solid dark canvas.

## Video metadata

The supplied asset is H.264, 1280×720, 40.96 seconds, YUV420p, approximately 1.35 MB.
