# Typing Engine — public API

One shared engine renders and scores every typing surface in the app
(Home's hero widget, Learn/Practice, Test, LessonPractice, Biography,
SahiUrdu). This doc is the quick-reference for adopting it on a new
screen; see `README.md` in this folder for architecture/rationale.

## Layers, outside → in

```
useTypingSession()      session-level: timer, WPM/CPM, on-screen keyboard sync
  └── useTypingEngine()  per-keystroke comparison state (this is the "engine")
        └── core/typingEngine.ts   pure functions, zero React, zero DOM
```

Most new screens should reach for `TypingWorkspace` + `useTypingSession`
(the highest level — a complete, ready-made typing surface with stats,
capture, and the optional on-screen keyboard already wired together).
Drop to `useTypingEngine` + `TypingTestSurface`/`TypingText` directly only
when a screen's layout genuinely can't fit `TypingWorkspace`'s structure
(e.g. Biography's long-form reading layout, SahiUrdu's custom flow).
**Never** hand-roll character comparison or cursor math on a new
screen — every existing screen goes through one of these two paths, and
a new one should too.

## `useTypingEngine({ targetText, strictness? })`

```ts
import { useTypingEngine } from "@/features/typing/hooks/useTypingEngine";

const typing = useTypingEngine({ targetText: "پاکستان" });
typing.typeCharacter("پ");  // one already-composed grapheme, not a KeyboardEvent
typing.backspace();
typing.reset();
```

Returns `TypingState` (see `types/index.ts`) plus:
- `characters: TargetCharacter[]` — per-grapheme `{ index, char, status }`,
  the single source of truth `TypingText` renders from.
- `mistakes`, `sessionKeystrokes`, `sessionCorrectKeystrokes`, `sessionAccuracy`
  — session bookkeeping that survives backspace-and-retry (unlike the
  per-snapshot `correctCharacters`/`accuracy`).

`strictness?: "lenient" | "strict"` (default `"lenient"`):
- **lenient** (every screen today): a wrong keystroke is still recorded
  and the cursor advances — the learner can keep going and fix mistakes
  later, or leave them.
- **strict**: a wrong keystroke is rejected outright — `userInput` does
  not change, the cursor does not advance, the learner must retype the
  correct grapheme. **Known gap:** a rejected keystroke in strict mode
  currently gives no visual feedback (no flash/shake) since nothing
  changes in state for `TypingText` to render differently. No screen
  uses strict mode yet — if one adopts it, add a transient "shake"
  indicator before shipping it, so a rejected keystroke doesn't look
  like the app simply ignored the key.

## `TypingText`

Pure presentation: takes `characters` (from `useTypingEngine`) and
renders one `<span>` per contiguous run of same-status graphemes (not
one span per character — see the doc comment on `buildRuns` for why:
fewer DOM nodes, same visual result, since only the active grapheme's
own position needs individual measurement).

- `layout="stream"` (**default** for `TypingWorkspace`/`TypingTestSurface`,
  used by Home, Practice, Test, and LessonPractice) — a continuous
  multi-line stream: text wraps naturally across a few visible lines
  instead of one long horizontally-scrolling line. The active line is
  kept at a constant vertical anchor near the top of the viewport by
  shifting the whole text block with `transform: translateY(...)`
  (measured from the real rendered line, same as the horizontal case
  below); the cursor's horizontal position is not shifted — each line
  is already positioned correctly by normal text flow, so the cursor
  just tracks the active character's real measured `left` directly.
  Blink pauses/resets on every keystroke (`animation: none` → reflow →
  re-enable) so it never looks like it's mid-cycle when it lands on
  the new character.
  **Not yet done:** no virtualization — the whole passage's spans are
  in the DOM at once (fine for the passage lengths currently used by
  Practice/Test/etc.; would need revisiting if a screen ever feeds it
  a genuinely long text).
- `layout="scroll"` (opt-in only now; used by Biography's long-form
  reading surface) — the older single-line horizontal-scroll pattern.
  Master-spec §3.5/§3.8 explicitly rejects this pattern for typing
  *tests*, which is why it's no longer the default anywhere — but
  Biography's reading flow is a different use case (a long passage
  meant to be read continuously on one line, not a multi-line practice
  stream) and was left as-is rather than changed speculatively.

## `TypingCaptureArea`

Owns actual input capture — the hidden `<input>`, the `beforeinput`
phonetic-keyboard translation, and native-Urdu-IME passthrough. Wrap
`TypingText` in it; don't build a second capture path.

## `TypingStats`

Pure display, no calculation — `mode="header"` renders the compact
3-card (WPM / CPM / Accuracy) row; the default mode adds Time,
Characters, and Errors. Fed entirely from `useTypingSession`/
`useTypingEngine` state.

## Adding a new typing screen — checklist

1. Reach for `TypingWorkspace` + `useTypingSession` first.
2. If that doesn't fit, use `useTypingEngine` + `TypingTestSurface`
   directly (see Biography.tsx / SahiUrdu.tsx for real examples).
3. Do not write new character-comparison logic — everything routes
   through `core/typingEngine.ts`.
4. If the screen needs a strictness behavior other than the lenient
   default, pass `strictness` explicitly and read the known gap above
   before shipping it.
