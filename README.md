# PAKURDU — Urdu Typing Tutorial

**PAKURDU** is a free, client-side Urdu typing tutorial: learn Urdu typing
online with phonetic keyboard lessons, guided practice, timed typing tests,
and progress tracking. Built with React, TypeScript, Vite, Tailwind CSS, and
React Router — no backend, no signup, no cost.

🔗 **Live app:** https://zulfiqarteams.github.io/Portfolio_Website/PakUrdu/

Keywords: Urdu typing tutorial, learn Urdu typing, Urdu keyboard, online Urdu
typing practice, free Urdu typing test, Urdu phonetic keyboard, type Urdu
online.

## Features

- **95-lesson, data-driven curriculum** — Alif → Yay and mapped Urdu
  character variants, with keyboard position and correct-finger guidance
- Single-key, combination, word, sentence, paragraph, professional, and
  mastery-level practice
- 141-word Urdu practice bank with common vocabulary plus naturally mixed
  Islamic vocabulary
- Progressive difficulty with review lessons
- A dedicated **Urdu typing test** (1/3/5-minute timed tests with WPM and
  accuracy scoring)
- Persisted lesson completion through a local profile/progress system
- Typing sounds, dark mode, English/Roman Urdu/Urdu language switcher, and
  responsive design for mobile and desktop

## SEO

Every route sets its own `<title>`, meta description, canonical URL, and
Open Graph/Twitter tags via `src/hooks/useSEO.ts` (see `src/pages/*.tsx` for
usage). Personal/account pages (`/profile`, `/settings`, `/progress`,
`/results`) are marked `noindex` since they hold no unique searchable
content per visitor. `public/robots.txt` and `public/sitemap.xml` are
included; `public/404.html` implements the standard
[SPA-on-GitHub-Pages redirect trick](https://github.com/rafgraph/spa-github-pages)
since GitHub Pages has no server-side routing.

**Optional next step — a fully generated sitemap:** the 95 `/lesson/:id`
pages aren't individually listed in `sitemap.xml` because their slugs are
generated at runtime from lesson data; Google reaches all of them through
the ordinary links on `/learn`. If you want every lesson URL in the sitemap
too, add a small Node script that imports `getCourse()` from
`src/features/lessons`, loops over every lesson's `id`, and writes
`public/sitemap.xml` as a `prebuild` step — that avoids hand-maintaining 95
URLs that could drift out of sync with the curriculum.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production build

```bash
npm run build
```

The build output in `dist/` is ready to deploy as-is to GitHub Pages. If you
ever move the app to a different repo, folder, or a custom domain, update
these three places together (they all encode the same base path):

- `vite.config.ts` → `base`
- `src/main.tsx` → `<BrowserRouter basename>`
- `src/config/site.ts` → `BASE_PATH` and `SITE_URL`

...and update the absolute URLs in `index.html`, `public/robots.txt`, and
`public/sitemap.xml` to match.

## Type check / lint

```bash
npm run lint
```

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · lucide-react.
No backend, database, or auth — the app remains fully client-side.
