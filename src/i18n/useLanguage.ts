import { useSettings } from "@/features/settings";
import { ui } from "./translations";
import { localizeText } from "./localizeText";

export function useLanguage() {
  const { language, setSetting } = useSettings();
  const t = ui[language];

  return {
    language,
    t,
    /** Centralized source-string translation for legacy/static UI surfaces. */
    text: (source: string, vars?: Record<string, string | number>) => localizeText(source, language, vars),
    setLanguage: (next: typeof language) => setSetting("language", next),
    direction: language === "ur" ? "rtl" as const : "ltr" as const,
    isUrdu: language === "ur",
  };
}
