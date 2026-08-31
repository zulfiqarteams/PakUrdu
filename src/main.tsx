import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import { BASE_PATH } from "@/config/site";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProfileProvider } from "@/features/profiles/context/ProfileContext";
import { ProgressProvider } from "@/features/progress/context/ProgressContext";
import { SessionResultProvider } from "@/features/results/context/SessionResultContext";
import { SettingsProvider } from "@/features/settings";
import "@/index.css";

// Keep the browser tab icon explicit at runtime as well as in index.html.
// Vite resolves BASE_URL for both local development and GitHub Pages.
const faviconHref = `${import.meta.env.BASE_URL}favicon.png?v=2`;
let faviconLink = document.querySelector<HTMLLinkElement>('link[data-pakurdu-favicon]');
if (!faviconLink) {
  faviconLink = document.createElement("link");
  faviconLink.rel = "icon";
  faviconLink.type = "image/png";
  faviconLink.sizes = "64x64";
  faviconLink.dataset.pakurduFavicon = "true";
  document.head.appendChild(faviconLink);
}
faviconLink.href = faviconHref;

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element (#root) not found in index.html");
}

createRoot(rootElement).render(
  <StrictMode>
    {/* Outermost boundary: also catches a crash inside a context provider
        itself (e.g. corrupted localStorage during initial state setup),
        which a boundary placed only inside <App/> would miss. */}
    <ErrorBoundary label="The app">
      <BrowserRouter basename={BASE_PATH.replace(/\/+$/, "")}>
        <ProfileProvider>
          <SettingsProvider>
            <ProgressProvider>
              <SessionResultProvider>
                <App />
              </SessionResultProvider>
            </ProgressProvider>
          </SettingsProvider>
        </ProfileProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
