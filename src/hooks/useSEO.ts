import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/useLanguage";
import { localizeText } from "@/i18n/localizeText";
import { buildSEOTags, type SEOInput } from "@/hooks/seoCore";

export type SEOOptions = Omit<SEOInput, "pathname">;

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const JSONLD_ID = "route-structured-data";

function setStructuredData(data: Record<string, unknown> | undefined) {
  const existing = document.getElementById(JSONLD_ID);
  if (!data) {
    existing?.remove();
    return;
  }
  let el = existing as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = JSONLD_ID;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Sets `document.title`, meta description, canonical URL, robots
 * directive, and Open Graph / Twitter Card tags for the current route.
 * Every routed page should call this once. Falls back to the site-wide
 * defaults already present in index.html when a page doesn't override
 * `description`, so there is always a description and canonical tag.
 *
 * All the actual tag *values* come from the pure `buildSEOTags` core in
 * seoCore.ts (unit tested); this hook only wires them into the DOM.
 */
export function useSEO(options: SEOOptions): void {
  const location = useLocation();
  const { title, description, noIndex, structuredData } = options;
  const { language } = useLanguage();

  useEffect(() => {
    const localizedTitle = localizeText(title, language);
    const localizedDescription = description ? localizeText(description, language) : description;
    const tags = buildSEOTags({ title: localizedTitle, description: localizedDescription, noIndex, pathname: location.pathname, structuredData });
    const previousTitle = document.title;
    document.title = tags.fullTitle;

    upsertLink("canonical", tags.canonical);

    if (tags.description) {
      upsertMeta("name", "description", tags.description);
    }

    upsertMeta("name", "robots", tags.robots);

    upsertMeta("property", "og:type", tags.ogType);
    upsertMeta("property", "og:title", tags.ogTitle);
    upsertMeta("property", "og:site_name", tags.ogSiteName);
    upsertMeta("property", "og:locale", tags.ogLocale);
    upsertMeta("property", "og:locale:alternate", tags.ogLocaleAlternate);
    upsertMeta("property", "og:url", tags.ogUrl);
    if (tags.ogDescription) {
      upsertMeta("property", "og:description", tags.ogDescription);
    }
    upsertMeta("property", "og:image", tags.ogImage);

    upsertMeta("name", "twitter:title", tags.twitterTitle);
    if (tags.twitterDescription) {
      upsertMeta("name", "twitter:description", tags.twitterDescription);
    }
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:image", tags.twitterImage);

    setStructuredData(tags.structuredData);

    return () => {
      document.title = previousTitle;
      setStructuredData(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, noIndex, structuredData, location.pathname, language]);
}

/** @deprecated Use `useSEO` instead — kept so any stray import still compiles. */
export const useDocumentTitle = (pageTitle: string) => useSEO({ title: pageTitle });
