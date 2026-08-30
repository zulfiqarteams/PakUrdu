import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_SETTINGS, readSettings, writeSettings } from "@/features/settings/services/settingsStorage";
import type { SettingsState } from "@/features/settings/services/settingsStorage";

interface SettingsContextValue extends SettingsState {
  setSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function applySettingsToDocument(settings: SettingsState) {
  const root = document.documentElement;
  root.classList.toggle("dark", settings.darkTheme);
  root.classList.toggle("settings-large-text", settings.largeInterface);
  root.lang = settings.language === "ur" ? "ur" : settings.language === "roman" ? "en" : "en";
  root.dir = settings.language === "ur" ? "rtl" : "ltr";
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(() => readSettings());

  useLayoutEffect(() => {
    applySettingsToDocument(settings);
    writeSettings(settings);
  }, [settings]);

  const setSetting = useCallback(<K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  }, []);

  const value = useMemo(
    () => ({ ...settings, setSetting }),
    [settings, setSetting],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}

export { DEFAULT_SETTINGS };
export type { SettingsState };
