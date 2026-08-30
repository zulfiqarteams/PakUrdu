import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "../config/site";

export interface SEOInput {
  /** Page title, without the site name suffix (that's added automatically). */
  title: string;
  /** 150–160 character meta description for this specific page. */
  description?: string;
  /**
   * Set to true for pages with no unique, crawlable content of their own
   * (personal dashboards, account settings, 404s). Keeps thin/duplicate
   * pages out of the index without blocking real content pages.
   */
  noIndex?: boolean;
  /** Current route pathname, e.g. from `useLocation().pathname`. */
  pathname: string;
  /**
   * Optional JSON-LD structured data object for this specific page
   * (e.g. a Person schema on a biography page, a Course schema on
   * /learn). Rendered as-is inside a `<script type="application/ld+json">`
   * tag by useSEO. Omit for pages with no meaningful structured data
   * beyond the site-wide EducationalApplication block in index.html.
   */
  structuredData?: Record<string, unknown>;
}

export interface SEOTags {
  fullTitle: string;
  description: string | undefined;
  canonical: string;
  robots: "index, follow" | "noindex, follow";
  ogTitle: string;
  ogUrl: string;
  ogDescription: string | undefined;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string | undefined;
  twitterImage: string;
  ogType: "website";
  ogSiteName: string;
  ogLocale: string;
  ogLocaleAlternate: string;
  structuredData?: Record<string, unknown>;
}

/**
 * Pure function: given SEO input for the current route, computes every
 * value `useSEO` writes to the document. No DOM access, so this is safe
 * to unit test directly — see `__tests__/useSEO.test.ts`.
 */
export function buildSEOTags({ title, description, noIndex = false, pathname, structuredData }: SEOInput): SEOTags {
  const fullTitle = `${title} · ${SITE_NAME}`;
  const canonical = absoluteUrl(pathname);

  return {
    fullTitle,
    description,
    canonical,
    robots: noIndex ? "noindex, follow" : "index, follow",
    ogTitle: fullTitle,
    ogUrl: canonical,
    ogDescription: description,
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: DEFAULT_OG_IMAGE,
    ogType: "website",
    ogSiteName: SITE_NAME,
    ogLocale: "en_US",
    ogLocaleAlternate: "ur_PK",
    structuredData,
  };
}
