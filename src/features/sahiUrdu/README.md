# صحیح اردو feature

The feature is intentionally data-driven. `data/words.ts` is the seed content repository; the UI never contains one page/component per word.

## Word schema

Each `UrduWord` can contain:

- `id`
- `correctWord`
- `roman`
- `meaning` / `meaningUrdu`
- `explanation`
- `errorType`
- `formStatus`
- `commonWrongForms` / `commonForms`
- `diacritics`
- `difficulty`
- `frequency`
- `category`
- `examples`
- `relatedWords`
- `pronunciation` / `pronunciationNote`
- `audio`
- `confidence`
- `sources`

The important distinction is between `wrong`, `common`, `variant`, and `preferred`. A dictionary-listed alternate form is never automatically presented as an error.

## Routes

All routes are handled by one reusable route component:

- `/sahi-urdu`
- `/sahi-urdu/words`
- `/sahi-urdu/words?category=املا`
- `/sahi-urdu/diacritics`
- `/sahi-urdu/practice`
- `/sahi-urdu/quiz`
- `/sahi-urdu/progress`
- `/sahi-urdu/word/:id`

## Progress

Progress is stored locally under `pakurdu:sahi-urdu-progress:v1`. The repository can later be swapped for IndexedDB, a profile-scoped store, or an API without changing the learning UI.

## Audio

The seed dataset intentionally uses `audio: null` rather than fake audio files. When a browser exposes `speechSynthesis`, the word detail page provides Urdu speech as a convenience. A future recorded-audio asset can be added through the same data field.
