import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/i18n/useLanguage";
import { languageOptions } from "@/i18n/translations";
import { localizeText } from "@/i18n/localizeText";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languageOptions.find((item) => item.id === language) ?? languageOptions[0];

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t.nav.languageAria}
        title={t.nav.language}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-paper px-2.5 text-xs font-semibold text-ink-soft transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
      >
        <Languages size={15} aria-hidden="true" />
        <span>{current.short}</span>
        <ChevronDown size={13} aria-hidden="true" className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div role="menu" aria-label={t.nav.language} className="absolute end-0 top-full z-50 mt-2 w-44 rounded-lg border border-border bg-surface-elevated p-1.5 shadow-raised">
          {languageOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              role="menuitemradio"
              aria-checked={language === option.id}
              onClick={() => {
                setLanguage(option.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors",
                language === option.id ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-soft hover:bg-surface hover:text-ink",
              )}
            >
              <span>{localizeText(option.label, language)}</span>
              {language === option.id && <Check size={15} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
