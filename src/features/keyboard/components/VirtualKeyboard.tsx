import { useState } from "react";
import { useLanguage } from "@/i18n/useLanguage";
import { cn } from "@/lib/cn";
import { getUrduForKey, keyboardRows, type ExpectedKey } from "@/features/keyboard/data/phoneticMap";
import type { PressedKey } from "@/features/keyboard/hooks/usePressedKey";

interface VirtualKeyboardProps {
  pressedKey?: PressedKey | null;
  expectedKey?: ExpectedKey;
  sizeVariant?: "default" | "compact";
  onKeyPress?: (char: string) => void;
  onBackspace?: () => void;
}

export function VirtualKeyboard({ pressedKey, expectedKey, sizeVariant = "default", onKeyPress, onBackspace }: VirtualKeyboardProps) {
  const compact = sizeVariant === "compact";
  const { text } = useLanguage();
  const interactive = Boolean(onKeyPress);
  const [touchShift, setTouchShift] = useState(false);
  const [touchCtrl, setTouchCtrl] = useState(false);
  const [touchAlt, setTouchAlt] = useState(false);
  const [touchLastKey, setTouchLastKey] = useState<string | null>(null);
  const shiftHeld = Boolean(pressedKey?.shift) || touchShift;
  const ctrlHeld = Boolean(pressedKey?.ctrl) || touchCtrl;
  const altHeld = Boolean(pressedKey?.alt) || touchAlt;
  const extendedHeld = ctrlHeld || altHeld;
  const effectiveShift = shiftHeld !== Boolean(pressedKey?.capsLock);
  const altGrShiftHeld = extendedHeld && effectiveShift;
  const shiftActive = pressedKey?.key === "shift" || shiftHeld;
  const ctrlActive = pressedKey?.key === "ctrl" || ctrlHeld;
  const altActive = pressedKey?.key === "alt" || altHeld;
  const expectedCtrl = Boolean(expectedKey?.ctrl);
  const expectedAlt = Boolean(expectedKey?.alt);

  const press = (key: string) => {
    const layer = altGrShiftHeld ? "altgrShift" : extendedHeld ? "altgr" : effectiveShift ? "shift" : "base";
    const value = getUrduForKey(key, layer);
    if (!value) return;
    setTouchLastKey(key);
    window.setTimeout(() => setTouchLastKey((current) => current === key ? null : current), 180);
    onKeyPress?.(value);
    if (touchShift) setTouchShift(false);
  };

  const keyHeight = compact ? "h-[clamp(2rem,5.2vh,3.35rem)]" : "h-10 sm:h-12";
  const gap = compact ? "gap-[0.45vh]" : "gap-1 sm:gap-1.5";

  return (
    <div dir="ltr" className={cn("w-full select-none", gap)}>
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className={cn("flex w-full", gap)}>
          {row.map((key) => {
            const active = pressedKey?.key === key;
            const pulse = touchLastKey === key || pressedKey?.lastKey === key;
            const expected = expectedKey?.key === key;
            const layer = altGrShiftHeld ? "altgrShift" : extendedHeld ? "altgr" : effectiveShift ? "shift" : "base";
            const shown = getUrduForKey(key, layer) ?? getUrduForKey(key, "base");
            return (
              <button
                key={key}
                type="button"
                tabIndex={-1}
                disabled={!interactive}
                aria-label={shown ? `Type ${shown}` : key}
                onPointerDown={(event) => { event.preventDefault(); if (interactive) press(key); }}
                className={cn(
                  "keyboard-premium-key relative flex min-w-0 flex-1 items-center justify-center overflow-hidden rounded-[10px] border font-medium transition-all duration-150",
                  keyHeight,
                  interactive && "cursor-pointer touch-manipulation active:scale-[0.97]",
                  active && "keyboard-premium-key--pressed",
                  pulse && "keyboard-premium-key--press-pulse",
                  !active && expected && "keyboard-premium-key--expected",
                )}
              >
                <span className={cn("keyboard-premium-urdu", compact ? "text-[clamp(16px,2.8vh,22px)]" : "text-[18px] sm:text-[21px]", (shown?.length ?? 0) > 2 && "keyboard-premium-urdu--ligature", active && "text-white")} dir="rtl" lang="ur">
                  <span className={cn("keyboard-premium-face", layer !== "base" ? "keyboard-premium-face--shift" : "keyboard-premium-face--base")}>{shown}</span>
                </span>
                <span className={cn("absolute bottom-1 right-1.5 font-mono text-[8px] uppercase leading-none sm:text-[9px]", active ? "text-white/65" : "text-ink-faint")}>{key}</span>
              </button>
            );
          })}
          {rowIndex === keyboardRows.length - 1 && (
            <>
              <ModifierKey label="Shift" active={shiftActive} pressed={pressedKey?.lastKey === "shift"} expected={Boolean(expectedKey?.shift)} height={keyHeight} interactive={interactive} onPress={() => setTouchShift((v) => !v)} />
              <ModifierKey label="Alt" active={altActive} pressed={pressedKey?.lastKey === "alt"} expected={expectedAlt} height={keyHeight} interactive={interactive} onPress={() => setTouchAlt((v) => !v)} />
              <ModifierKey label="Ctrl" active={ctrlActive} pressed={pressedKey?.lastKey === "ctrl"} expected={expectedCtrl} height={keyHeight} interactive={interactive} onPress={() => setTouchCtrl((v) => !v)} />
            </>
          )}
        </div>
      ))}
      <div className={cn("flex w-full", gap)}>
        <button type="button" tabIndex={-1} disabled={!interactive} aria-label="Space" onPointerDown={(e) => { e.preventDefault(); if (interactive) { setTouchLastKey("space"); window.setTimeout(() => setTouchLastKey((current) => current === "space" ? null : current), 180); onKeyPress?.(" "); } }} className={cn("keyboard-premium-space flex-1 rounded-[10px] border transition-all duration-150", compact ? "h-[clamp(1.35rem,3.2vh,2rem)]" : "h-8 sm:h-10", pressedKey?.key === "space" && "keyboard-premium-key--pressed",
          (touchLastKey === "space" || pressedKey?.lastKey === "space") && "keyboard-premium-key--press-pulse", expectedKey?.key === "space" && "keyboard-premium-key--expected")} />
        {interactive && <button type="button" tabIndex={-1} aria-label="Backspace" onPointerDown={(e) => { e.preventDefault(); setTouchLastKey("backspace"); window.setTimeout(() => setTouchLastKey((current) => current === "backspace" ? null : current), 180); onBackspace?.(); }} className={cn("keyboard-premium-space flex flex-1 items-center justify-center rounded-[10px] border text-sm transition-all duration-150", compact ? "h-[clamp(1.35rem,3.2vh,2rem)]" : "h-8 sm:h-10", touchLastKey === "backspace" && "keyboard-premium-key--press-pulse")}>⌫</button>}
      </div>
      {(touchLastKey || pressedKey?.lastKey) && (
        <p className="mt-2 text-center text-[11px] font-medium text-ink-faint" aria-live="polite">
          {text("Key is pressed")}: {touchLastKey || pressedKey?.lastKey}
        </p>
      )}
    </div>
  );
}

function ModifierKey({ label, active, pressed = false, expected, height, interactive, onPress }: { label: string; active: boolean; pressed?: boolean; expected: boolean; height: string; interactive: boolean; onPress: () => void }) {
  const [pulse, setPulse] = useState(false);
  const className = cn("flex min-w-0 flex-[1.45] items-center justify-center rounded-[10px] border text-xs font-medium transition-all duration-150", height, interactive && "cursor-pointer touch-manipulation active:scale-[0.97]", active && "keyboard-premium-modifier--pressed", pulse && "keyboard-premium-modifier--press-pulse", pressed && "keyboard-premium-modifier--press-pulse", !active && expected && "keyboard-premium-modifier--expected");
  const handlePress = () => {
    setPulse(true);
    window.setTimeout(() => setPulse(false), 180);
    onPress();
  };
  return interactive ? <button type="button" tabIndex={-1} aria-label={label} aria-pressed={active} onPointerDown={(e) => { e.preventDefault(); handlePress(); }} className={className}>{label}</button> : <span className={className}>{label}</span>;
}
