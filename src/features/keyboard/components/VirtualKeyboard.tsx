import { useState } from "react";
import { cn } from "@/lib/cn";
import { getUrduForKey, keyboardRows, shiftPhoneticMap, type ExpectedKey } from "@/features/keyboard/data/phoneticMap";
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
  const interactive = Boolean(onKeyPress);
  const [touchShift, setTouchShift] = useState(false);
  const shiftHeld = Boolean(pressedKey?.shift) || touchShift;
  const shiftActive = pressedKey?.key === "shift" || shiftHeld;

  const press = (key: string) => {
    const value = shiftHeld && shiftPhoneticMap[key] !== undefined ? shiftPhoneticMap[key] : getUrduForKey(key);
    if (!value) return;
    onKeyPress?.(value);
    if (touchShift) setTouchShift(false);
  };

  const keyHeight = compact ? "h-[clamp(2rem,5.2vh,3.35rem)]" : "h-10 sm:h-12";
  const gap = compact ? "gap-[0.45vh]" : "gap-1 sm:gap-1.5";

  return (
    <div dir="ltr" className={cn("w-full select-none", gap)}>
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className={cn("flex w-full", gap)}>
          {rowIndex === keyboardRows.length - 1 && (
            <ModifierKey label="Shift" active={shiftActive} expected={Boolean(expectedKey?.shift)} height={keyHeight} interactive={interactive} onPress={() => setTouchShift((v) => !v)} />
          )}
          {row.map((key) => {
            const active = pressedKey?.key === key;
            const expected = expectedKey?.key === key;
            const base = getUrduForKey(key);
            const shifted = shiftPhoneticMap[key];
            const shown = shiftHeld && shifted !== undefined ? shifted : base;
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
                  !active && expected && "keyboard-premium-key--expected",
                )}
              >
                <span className={cn("keyboard-premium-urdu", compact ? "text-[clamp(16px,2.8vh,22px)]" : "text-[18px] sm:text-[21px]", active && "text-white")} dir="rtl" lang="ur">
                  <span className={cn("keyboard-premium-face", shiftHeld && shifted !== undefined ? "keyboard-premium-face--shift" : "keyboard-premium-face--base")}>{shown}</span>
                </span>
                <span className={cn("absolute bottom-1 right-1.5 font-mono text-[8px] uppercase leading-none sm:text-[9px]", active ? "text-white/65" : "text-ink-faint")}>{key}</span>
              </button>
            );
          })}
          {rowIndex === keyboardRows.length - 1 && (
            <ModifierKey label="Shift" active={shiftActive} expected={Boolean(expectedKey?.shift)} height={keyHeight} interactive={interactive} onPress={() => setTouchShift((v) => !v)} />
          )}
        </div>
      ))}
      <div className={cn("flex w-full", gap)}>
        <button type="button" tabIndex={-1} disabled={!interactive} aria-label="Space" onPointerDown={(e) => { e.preventDefault(); if (interactive) onKeyPress?.(" "); }} className={cn("keyboard-premium-space flex-1 rounded-[10px] border transition-all duration-150", compact ? "h-[clamp(1.35rem,3.2vh,2rem)]" : "h-8 sm:h-10", pressedKey?.key === "space" && "keyboard-premium-key--pressed", expectedKey?.key === "space" && "keyboard-premium-key--expected")} />
        {interactive && <button type="button" tabIndex={-1} aria-label="Backspace" onPointerDown={(e) => { e.preventDefault(); onBackspace?.(); }} className={cn("keyboard-premium-space flex flex-1 items-center justify-center rounded-[10px] border text-sm transition-all duration-150", compact ? "h-[clamp(1.35rem,3.2vh,2rem)]" : "h-8 sm:h-10")}>⌫</button>}
      </div>
    </div>
  );
}

function ModifierKey({ label, active, expected, height, interactive, onPress }: { label: string; active: boolean; expected: boolean; height: string; interactive: boolean; onPress: () => void }) {
  const className = cn("flex min-w-0 flex-[1.45] items-center justify-center rounded-[10px] border text-xs font-medium transition-all duration-150", height, interactive && "cursor-pointer touch-manipulation active:scale-[0.97]", active && "keyboard-premium-modifier--pressed", !active && expected && "keyboard-premium-modifier--expected");
  return interactive ? <button type="button" tabIndex={-1} aria-label={label} aria-pressed={active} onPointerDown={(e) => { e.preventDefault(); onPress(); }} className={className}>{label}</button> : <span className={className}>{label}</span>;
}
