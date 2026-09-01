import { useEffect, useState } from "react";
import { getPhysicalKeyLabel } from "@/features/keyboard/data/phoneticMap";

/** The physical key currently held down (or `"space"`), plus whether Shift is held with it. */
export interface PressedKey {
  key: string;
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  capsLock: boolean;
  lastKey?: string;
}

/**
 * Tracks the key currently held down (or `"space"`), for visual
 * highlighting only — this never feeds typed characters into the
 * typing engine, which instead reads the (IME/composition-safe)
 * input element's value. See `TypingCaptureInput`.
 *
 * `shift` reflects `event.shiftKey` at the time of the most recent
 * keydown/keyup, so a "hold Shift" hint can react live as the
 * learner actually presses and releases Shift, rather than only
 * describing what the *target* character needs (see `ExpectedKey`
 * in `phoneticMap.ts`, which is the static, target-driven half of
 * that hint).
 *
 * The listener is only attached while `enabled` is true (i.e. while
 * the typing capture input is actually focused), so this doesn't add
 * a permanent global keydown/keyup listener to every page that
 * happens to import the keyboard feature.
 */
export function usePressedKey(enabled: boolean, resetKey?: string | number): PressedKey | null {
  // Tracked separately on purpose. Shift is a modifier held across
  // several other keydown/keyup pairs (e.g. holding Shift while
  // tapping several letters in a row) — folding it into one
  // `{key, shift}` object keyed off the *last* non-modifier key meant
  // that key's keyup wiped the whole object, including `shift`, even
  // though the learner was still physically holding Shift. That made
  // the on-screen keyboard's Shift face flicker back to the base
  // letters mid-hold. `shiftHeld` now only ever changes on Shift's
  // own keydown/keyup (or blur), independent of whatever other key is
  // active.
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [shiftHeld, setShiftHeld] = useState(false);
  const [ctrlHeld, setCtrlHeld] = useState(false);
  const [altHeld, setAltHeld] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [lastKey, setLastKey] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveKey(null);
      setShiftHeld(false);
      setCtrlHeld(false);
      setAltHeld(false);
      setCapsLock(false);
      setLastKey(null);
      return;
    }

    function normalize(event: KeyboardEvent): string | null {
      if (event.code === "Space" || event.key === " ") return "space";
      if (event.key === "Shift") return "shift";
      if (event.key === "Control") return "ctrl";
      if (event.key === "Alt") return "alt";
      return getPhysicalKeyLabel(event.code) ?? (event.key.length === 1 ? event.key.toLowerCase() : null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      setCapsLock(event.getModifierState("CapsLock"));
      if (event.key === "Shift") {
        setShiftHeld(true);
        setActiveKey("shift");
        setLastKey("shift");
        return;
      }
      if (event.key === "Control") {
        setCtrlHeld(true);
        setActiveKey("ctrl");
        setLastKey("ctrl");
        return;
      }
      if (event.key === "Alt") {
        setAltHeld(true);
        setActiveKey("alt");
        setLastKey("alt");
        return;
      }
      const key = normalize(event);
      if (key) { setActiveKey(key); setLastKey(key); }
      if (event.shiftKey) setShiftHeld(true);
      if (event.ctrlKey) setCtrlHeld(true);
      if (event.altKey) setAltHeld(true);
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === "Shift") {
        setShiftHeld(false);
        setActiveKey((current) => (current === "shift" ? null : current));
        return;
      }
      if (event.key === "Control") {
        setCtrlHeld(false);
        setActiveKey((current) => (current === "ctrl" ? null : current));
        return;
      }
      if (event.key === "Alt") {
        setAltHeld(false);
        setActiveKey((current) => (current === "alt" ? null : current));
        return;
      }
      const key = normalize(event);
      setActiveKey((current) => (current === key ? null : current));
      // Defensive: `event.shiftKey` reflects Shift's real state at
      // this keyup too, in case Shift's own keyup was ever missed
      // (e.g. a browser/OS shortcut stole it).
      if (!event.shiftKey) setShiftHeld(false);
      if (!event.ctrlKey) setCtrlHeld(false);
      if (!event.altKey) setAltHeld(false);
      setCapsLock(event.getModifierState("CapsLock"));
    }

    function clearPressedKey() {
      setActiveKey(null);
      setShiftHeld(false);
      setCtrlHeld(false);
      setAltHeld(false);
      setCapsLock(false);
      setLastKey(null);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearPressedKey);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearPressedKey);
      clearPressedKey();
    };
  }, [enabled, resetKey]);

  if (activeKey === null && !shiftHeld && !ctrlHeld && !altHeld && !capsLock && !lastKey) return null;
  return { key: activeKey ?? (ctrlHeld ? "ctrl" : altHeld ? "alt" : "shift"), shift: shiftHeld, ctrl: ctrlHeld, alt: altHeld, capsLock, lastKey: lastKey ?? undefined };
}
