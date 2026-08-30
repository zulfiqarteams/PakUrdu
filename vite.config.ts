import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { BASE_PATH } from "./src/config/site";

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this app from a sub-path (not the domain root),
  // so every built asset URL needs that prefix. This now reads from
  // src/config/site.ts (the single source of truth noted there) instead
  // of repeating the path here — previously this string and the one in
  // site.ts could silently drift apart, which is exactly the kind of
  // mismatch that makes the favicon (and every other static asset) 404
  // after a redeploy. Only src/main.tsx's <BrowserRouter basename> still
  // needs to independently match, since it can't import Vite's own
  // config module.
  base: BASE_PATH,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
