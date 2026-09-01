/**
 * Single source of truth for site-wide identity used by SEO tags,
 * the sitemap, and JSON-LD structured data.
 *
 * IMPORTANT: `BASE_PATH` and `SITE_URL` must match where the app is
 * actually deployed. If you ever move the repo, folder, or switch to
 * a custom domain, update these two values (and vite.config.ts +
 * src/main.tsx's <BrowserRouter basename> which must match BASE_PATH)
 * — everything else derives from them automatically.
 */

export const SITE_NAME = "PAKURDU — Urdu Typing Tutorial";

// Deployed at https://zulfiqarteams.github.io/PakUrdu/
export const BASE_PATH = "/Z_Tech/PakUrdu/";
export const SITE_URL = "https://zulfiqarteams.github.io/Z_Tech/PakUrdu";

export const DEFAULT_DESCRIPTION =
  "Free Urdu typing tutorial with phonetic lessons, a virtual keyboard, guided practice, typing tests, and progress tracking. Learn Urdu typing online at your own pace.";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-cover.png`;

/** Builds an absolute canonical URL for a given app-relative path like "/learn". */
export function absoluteUrl(path: string): string {
  const cleanPath = path.replace(/^\/+/, "").replace(/\/+$/, "");
  return cleanPath ? `${SITE_URL}/${cleanPath}` : `${SITE_URL}/`;
}
