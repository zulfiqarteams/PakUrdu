import { useId, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  /**
   * Controlled active tab. Pass this together with `onValueChange`
   * when the caller needs to switch tabs itself (e.g. jumping to the
   * "Type" tab once a chapter is finished reading) instead of only
   * reacting to clicks — `Tabs` then just displays whichever value is
   * passed in rather than tracking it internally. Omit both to let
   * `Tabs` manage its own selection (starting at `defaultValue`).
   */
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

/**
 * Arrow-key navigation follows the WAI-ARIA tabs pattern: Left/Right
 * move focus and selection together, Home/End jump to the ends.
 */
export function Tabs({ items, defaultValue, value, onValueChange, className }: TabsProps) {
  const isControlled = value !== undefined;
  const [internalActive, setInternalActive] = useState(defaultValue ?? items[0]?.value);
  const active = isControlled ? value : internalActive;
  const baseId = useId();

  function setActive(next: string) {
    if (!isControlled) setInternalActive(next);
    onValueChange?.(next);
  }

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % items.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = items.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      const next = items[nextIndex];
      setActive(next.value);
      document.getElementById(`${baseId}-tab-${next.value}`)?.focus();
    }
  }

  return (
    <div className={className}>
      <div role="tablist" className="flex gap-1 border-b border-border">
        {items.map((item, index) => {
          const isActive = item.value === active;
          return (
            <button
              key={item.value}
              id={`${baseId}-tab-${item.value}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${item.value}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(item.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-brand-500 text-brand-700"
                  : "border-transparent text-ink-soft hover:text-ink",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.value}
          id={`${baseId}-panel-${item.value}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${item.value}`}
          hidden={item.value !== active}
          className="py-5"
        >
          {item.value === active && item.content}
        </div>
      ))}
    </div>
  );
}
