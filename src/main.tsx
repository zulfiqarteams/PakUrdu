import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import { BASE_PATH } from "@/config/site";
import { ProfileProvider } from "@/features/profiles/context/ProfileContext";
import { ProgressProvider } from "@/features/progress/context/ProgressContext";
import { SessionResultProvider } from "@/features/results/context/SessionResultContext";
import { SettingsProvider } from "@/features/settings";
import "@/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element (#root) not found in index.html");
}

createRoot(rootElement).render(
  <StrictMode>
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
  </StrictMode>,
);
