/**
 * Tests for src/config/site.ts — the single source of truth for the
 * site's canonical URL, used by useSEO, index.html, robots.txt, and
 * sitemap.xml.
 *
 * No test framework (vitest/jest) is configured in this project, so
 * this file follows the same dependency-free pattern as the other
 * `__tests__` files. Run it directly with any TypeScript-capable
 * runner, e.g.:
 *
 *   npx tsx src/config/__tests__/site.test.ts
 */
import { BASE_PATH, DEFAULT_OG_IMAGE, SITE_URL, absoluteUrl } from "../site";

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

// --- absoluteUrl -----------------------------------------------------------

test("Test 1 — root path '/' resolves to the site URL with a trailing slash", () => {
  assertEqual(absoluteUrl("/"), `${SITE_URL}/`);
});

test("Test 2 — empty string resolves the same as root", () => {
  assertEqual(absoluteUrl(""), `${SITE_URL}/`);
});

test("Test 3 — a simple path gets a leading slash stripped and no trailing slash", () => {
  assertEqual(absoluteUrl("/learn"), `${SITE_URL}/learn`);
});

test("Test 4 — a path with no leading slash still resolves correctly", () => {
  assertEqual(absoluteUrl("learn"), `${SITE_URL}/learn`);
});

test("Test 5 — a path with a trailing slash has it removed (no duplicate canonical URLs)", () => {
  assertEqual(absoluteUrl("/learn/"), `${SITE_URL}/learn`);
});

test("Test 6 — a nested path resolves with all segments intact", () => {
  assertEqual(absoluteUrl("/lesson/alphabet-01-alif"), `${SITE_URL}/lesson/alphabet-01-alif`);
});

test("Test 7 — repeated slashes in a path don't produce a malformed URL", () => {
  assertEqual(absoluteUrl("//learn//reading//"), `${SITE_URL}/learn//reading`);
});

test("Test 8 — output never contains the app's own BASE_PATH duplicated", () => {
  // SITE_URL already embeds BASE_PATH once; absoluteUrl must not prepend
  // it a second time when given a route-only path like "/learn".
  const url = absoluteUrl("/learn");
  const occurrences = url.split(BASE_PATH.replace(/\/+$/, "")).length - 1;
  assertEqual(occurrences, 1, `Expected BASE_PATH to appear exactly once in ${url}`);
});

// --- Site constants sanity --------------------------------------------------

test("Test 9 — SITE_URL has no trailing slash (absoluteUrl relies on this)", () => {
  assertEqual(SITE_URL.endsWith("/"), false);
});

test("Test 10 — SITE_URL uses https", () => {
  assertEqual(SITE_URL.startsWith("https://"), true);
});

test("Test 11 — DEFAULT_OG_IMAGE is an absolute URL under SITE_URL", () => {
  assertEqual(DEFAULT_OG_IMAGE.startsWith(SITE_URL), true);
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
  throw new Error(`${failures} site config test(s) failed — see output above.`);
}
