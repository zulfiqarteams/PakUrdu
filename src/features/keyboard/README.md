# keyboard

Minimal keyboard-visualization support added in Part 7, to let
`VirtualKeyboard` highlight a pressed/expected key for the typing engine.

## Honest scope note

This folder was an unimplemented placeholder through Part 6 — no "Part 5
keyboard engine" exists in this codebase to build on. Part 7's spec assumes
one exists (see its sections 10–11); since it doesn't, this folder now holds
just enough to satisfy those requirements, not a full keyboard-layout system:

- `data/phoneticMap.ts` — a Latin-key → Urdu-character mapping matching the
  real, widely-used **CRULP Urdu Phonetic Keyboard Layout v1.1** (the same
  standard behind Windows' built-in Urdu Phonetic keyboard, InPage, and
  open implementations like Navees) — its Base face (`phoneticMap`) and
  Shift face (`shiftPhoneticMap`), plus a QWERTY row layout including the
  common punctuation keys (`,` `.` `/` `!`). The app also models CRULP's
  third AltGr (Right Alt / Ctrl+Alt) face through `altGrPhoneticMap` and
  `altGrShiftPhoneticMap`; physical and on-screen Ctrl/Alt modifiers use
  the same extended layer. See the file's own doc comment for sources.
- `hooks/usePressedKey.ts` — tracks the currently-held physical key (and
  whether Shift is held with it), only while explicitly `enabled` (i.e.
  while the typing capture input is focused), so this doesn't add a
  permanent global listener.
- `components/VirtualKeyboard.tsx` — a decorative (`aria-hidden`) on-screen
  keyboard that shows both faces on every key cap and highlights the
  pressed key and the key (plus Shift state) expected next, looked up from
  `phoneticMap`.

This folder does not capture typed text itself, but
`features/typing/components/TypingCaptureArea.tsx` now calls `getUrduForKey`
directly (via this folder's `index.ts`) to translate an incoming physical/
on-screen keystroke into the Urdu character it should produce, before that
keystroke is compared or stored. That's a fix, not new scope: earlier,
`getUrduForKey` was wired up to *display* the mapping (`VirtualKeyboard`)
but nothing ever *applied* it to real keystrokes, so a learner typing on an
ordinary Latin keyboard — exactly who this mapping exists for — could never
be marked correct. A future part can still replace or expand this
mapping/layout without the typing engine itself needing to change, since it
only ever consumes `getUrduForKey`/`getExpectedKey`.
