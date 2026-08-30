# typing

The core real-time typing engine (Part 7).

## Architecture

```
Physical Keyboard / Mobile Software Keyboard   Native Urdu OS Keyboard / IME
  ↓ beforeinput "insertText" (Latin key)          ↓ composition-safe <input> value
  → phoneticMap translation (getUrduForKey)        (left untouched, already Urdu)
      ↓                                            ↓
TypingCaptureArea            (components/TypingCaptureArea.tsx)
  ↓ feeds translated/composed characters into engine state
useTypingEngine()            (hooks/useTypingEngine.ts)
  ↓ dispatches to
core/typingEngine.ts         (pure functions, no React)
  ↓ produces
TypingState
  ↓ rendered by
TypingText / TypingStats
```

`core/typingEngine.ts` has zero dependency on React, lesson data, profiles,
persistence, or timing — it is pure `targetText` + `userInput` in,
`TypingState` out. See `core/__tests__/typingEngine.test.ts` for direct
tests of this layer (run with `npx tsx path/to/that/file`; no test
framework is configured in this project yet).

## Unicode

`utils/graphemes.ts` segments text with `Intl.Segmenter` (`granularity:
"grapheme"`) instead of raw string indexing, so an Urdu letter plus any
combining marks it carries is treated as one unit for comparison,
backspace, and completion. No `.normalize()` is ever called — target text
is compared exactly as authored.

## Mobile

`TypingCaptureArea` only auto-focuses its hidden input on devices that
report a fine pointer (i.e. likely have a physical keyboard). On touch
devices, auto-focusing would pop the software keyboard open on page load
unprompted; the page-level physical keyboard listener accepts the first
valid keystroke immediately, while touch devices retain their existing
on-screen input path.

## Out of scope for Part 7

WPM, timers, streaks, XP, persistence, profile stats, and the Test Engine
are not implemented here. The engine only exposes what a future part
needs to build those: `correctCharacters`, `incorrectCharacters`,
`currentIndex`, `accuracy`, and `isComplete`.

## Phonetic keyboard translation (bugfix)

There is no dedicated "keyboard engine" module from an earlier part —
`features/keyboard` was an unimplemented Part 1 placeholder. `TypingCaptureArea`
therefore captures input directly via a real (visually hidden) `<input>`
element rather than delegating to a pre-existing keyboard engine. See
`features/keyboard/README.md` for what was added there to support this.

Earlier versions of `TypingCaptureArea` only ever read the input's native
`value`, on the assumption the browser would already hand back Urdu
graphemes. That's only true for a learner with a native Urdu/Arabic OS
keyboard layout installed — for everyone else (the intended audience,
typing on an ordinary Latin keyboard with the course's phonetic mapping),
the browser inserted the literal Latin letter, which could never compare
equal to the Urdu target no matter what `normalizeUrduForComparison` did.
`TypingCaptureArea` now applies `phoneticMap`'s translation itself, via a
`beforeinput` handler, before the untranslated Latin character ever
reaches the input's value or the engine. See that handler's doc comment
for exactly which `inputType`s are translated vs. left alone for native
Urdu keyboards/IMEs.
