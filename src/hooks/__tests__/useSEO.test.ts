/**
 * Tests for src/hooks/seoCore.ts — the pure, DOM-free logic behind
 * useSEO. useSEO itself needs a browser (document, React Router
 * context) so it isn't unit tested directly; buildSEOTags contains
 * all of its actual decision logic (title formatting, canonical URL,
 * noIndex → robots value, description fallbacks) and is deliberately
 * DOM-free so it can be.
 *
 * No test framework (vitest/jest) is configured in this project, so
 * this file follows the same dependency-free pattern as the other
 * `__tests__` files. Run it directly with any TypeScript-capable
 * runner, e.g.:
 *
 *   npx tsx src/hooks/__tests__/useSEO.test.ts
 */
import { buildSEOTags } from "../seoCore";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "../../config/site";

function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new Error(message ?? `Expected ${String(expected)}, got ${String(actual)}`);
  }
}

type TestFn = () => void;
const results: { name: string; passed: boolean; error?: unknown }[] = [];

function test(name: string, fn: TestFn): void {
  try {
    fn();
    results.push({ name, passed: true });
  } catch (error) {
    results.push({ name, passed: false, error });
  }
}

// --- Title ------------------------------------------------------------------

test("Test 1 — title keeps the site brand first for narrow tabs", () => {
  const tags = buildSEOTags({ title: "Learn Urdu Typing", pathname: "/learn" });
  assertEqual(tags.fullTitle, `${SITE_NAME} · Learn Urdu Typing`);
});

test("Test 2 — og:title and twitter:title match the full (suffixed) title, not the raw one", () => {
  const tags = buildSEOTags({ title: "Urdu Typing Test", pathname: "/test" });
  assertEqual(tags.ogTitle, tags.fullTitle);
  assertEqual(tags.twitterTitle, tags.fullTitle);
});

// --- Description --------------------------------------------------------------

test("Test 3 — description is passed through unchanged when provided", () => {
  const tags = buildSEOTags({
    title: "Practice",
    description: "Practice Urdu typing online.",
    pathname: "/practice",
  });
  assertEqual(tags.description, "Practice Urdu typing online.");
  assertEqual(tags.ogDescription, "Practice Urdu typing online.");
  assertEqual(tags.twitterDescription, "Practice Urdu typing online.");
});

test("Test 4 — description is undefined (not empty string) when omitted, so useSEO knows to skip the tag", () => {
  const tags = buildSEOTags({ title: "Settings", pathname: "/settings" });
  assertEqual(tags.description, undefined);
  assertEqual(tags.ogDescription, undefined);
  assertEqual(tags.twitterDescription, undefined);
});

// --- Canonical URL --------------------------------------------------------------

test("Test 5 — canonical URL is built from the route pathname", () => {
  const tags = buildSEOTags({ title: "Learn", pathname: "/learn" });
  assertEqual(tags.canonical, `${SITE_URL}/learn`);
  assertEqual(tags.ogUrl, tags.canonical);
});

test("Test 6 — root path canonical has a trailing slash, nested paths don't", () => {
  const home = buildSEOTags({ title: "Home", pathname: "/" });
  const lesson = buildSEOTags({ title: "Lesson", pathname: "/lesson/alphabet-01-alif" });
  assertEqual(home.canonical, `${SITE_URL}/`);
  assertEqual(lesson.canonical, `${SITE_URL}/lesson/alphabet-01-alif`);
});

// --- robots / noIndex --------------------------------------------------------------

test("Test 7 — defaults to indexable when noIndex is omitted", () => {
  const tags = buildSEOTags({ title: "Home", pathname: "/" });
  assertEqual(tags.robots, "index, follow");
});

test("Test 8 — noIndex: false is indexable", () => {
  const tags = buildSEOTags({ title: "Learn", pathname: "/learn", noIndex: false });
  assertEqual(tags.robots, "index, follow");
});

test("Test 9 — noIndex: true produces noindex, follow (used for Profile/Settings/Progress/Results/404)", () => {
  const tags = buildSEOTags({ title: "Settings", pathname: "/settings", noIndex: true });
  assertEqual(tags.robots, "noindex, follow");
});

// --- og:image ----------------------------------------------------------------

test("Test 10 — every page falls back to the site-wide default OG image", () => {
  const tags = buildSEOTags({ title: "Practice", pathname: "/practice" });
  assertEqual(tags.ogImage, DEFAULT_OG_IMAGE);
});

// --- Real per-page scenarios from src/pages/*.tsx --------------------------------

test("Test 11 — LessonDetail-style dynamic title/description round-trips correctly", () => {
  const lessonTitle = "Alif — First Letter";
  const lessonDescription = "Learn the Urdu letter Alif. Free Urdu typing lesson 1 of 95 on PAKURDU.";
  const tags = buildSEOTags({
    title: lessonTitle,
    description: lessonDescription,
    pathname: "/lesson/alphabet-01-alif",
    noIndex: false,
  });
  assertEqual(tags.fullTitle, `${SITE_NAME} · ${lessonTitle}`);
  assertEqual(tags.description, lessonDescription);
  assertEqual(tags.robots, "index, follow");
  assertEqual(tags.canonical, `${SITE_URL}/lesson/alphabet-01-alif`);
});

test("Test 12 — a not-found lesson id is noindexed (LessonDetail's error branch)", () => {
  const tags = buildSEOTags({
    title: "Lesson not found",
    pathname: "/lesson/does-not-exist",
    noIndex: true,
  });
  assertEqual(tags.robots, "noindex, follow");
  assertEqual(tags.description, undefined);
});

// --- Report ------------------------------------------------------------------
let failures = 0;
for (const result of results) {
  if (result.passed) {
    console.log(`✓ ${result.name}`);
  } else {
    failures++;
    console.error(`✗ ${result.name}`);
    console.error(result.error);
  }
}
console.log(`\n${results.length - failures}/${results.length} tests passed.`);
if (failures > 0) {
  throw new Error(`${failures} useSEO core test(s) failed — see output above.`);
}
