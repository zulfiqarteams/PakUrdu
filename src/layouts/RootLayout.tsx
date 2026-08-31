import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/layouts/Navbar";
import { Footer } from "@/layouts/Footer";
import { useLanguage } from "@/i18n/useLanguage";
import { installGlobalLocalization } from "@/i18n/globalLocalization";
import { useEffect, useState } from "react";
import { AppLoadingOverlay } from "@/components/AppLoadingOverlay";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function RootLayout() {
  const { language, direction } = useLanguage();
  const [isBooting, setIsBooting] = useState(true);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.lang = language === "ur" ? "ur" : language === "roman" ? "en" : "en";
    document.documentElement.dir = direction;
    const observer = installGlobalLocalization(language);
    return () => observer.disconnect();
  }, [language, direction]);

  useEffect(() => {
    let timer: number | undefined;
    const frame = window.requestAnimationFrame(() => {
      // Keep the branded splash long enough to establish the identity while
      // remaining short enough that it never feels like a fake page load.
      timer = window.setTimeout(() => setIsBooting(false), 520);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <AppLoadingOverlay visible={isBooting} />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex-1">
          {/* keyed on pathname so navigating to a different page (via the
              still-functional navbar) automatically clears a caught error
              instead of leaving the fallback stuck until a manual reload. */}
          <ErrorBoundary key={location.pathname} label="This page">
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </div>
  );
}
