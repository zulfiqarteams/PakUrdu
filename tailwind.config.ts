import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens, backed by CSS variables (see src/index.css).
        // Values are the same light-theme palette as before; the
        // variable layer is what lets a future `.dark` class change
        // them without touching component code.
        paper: "var(--color-paper)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        ink: {
          DEFAULT: "var(--color-ink)",
          soft: "var(--color-ink-soft)",
          faint: "var(--color-ink-faint)",
        },
        brand: {
          50: "var(--color-brand-50)",
          100: "var(--color-brand-100)",
          300: "var(--color-brand-300)",
          500: "var(--color-brand-500)",
          600: "var(--color-brand-600)",
          700: "var(--color-brand-700)",
        },
        gold: {
          100: "var(--color-gold-100)",
          300: "var(--color-gold-300)",
          500: "var(--color-gold-500)",
          600: "var(--color-gold-600)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        // Status roles, used consistently for feedback (badges,
        // alerts, form validation, lesson/test status).
        danger: "var(--color-error-500)",
        success: {
          50: "var(--color-success-50)",
          500: "var(--color-success-500)",
          600: "var(--color-success-600)",
        },
        warning: {
          50: "var(--color-warning-50)",
          500: "var(--color-warning-500)",
          600: "var(--color-warning-600)",
        },
        error: {
          50: "var(--color-error-50)",
          500: "var(--color-error-500)",
          600: "var(--color-error-600)",
        },
        info: {
          50: "var(--color-info-50)",
          500: "var(--color-info-500)",
          600: "var(--color-info-600)",
        },
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        urdu: ["\"Noto Nastaliq Urdu\"", "\"Noto Naskh Arabic\"", "\"Noto Sans Arabic\"", "serif"],
        mono: ["\"JetBrains Mono\"", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "16px",
        xl: "22px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 35, 46, 0.04), 0 8px 24px -12px rgba(23, 35, 46, 0.12)",
        raised: "0 2px 4px rgba(23, 35, 46, 0.06), 0 16px 32px -16px rgba(23, 35, 46, 0.18)",
      },
      maxWidth: {
        content: "1180px",
      },
      keyframes: {
        caret: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      // Note: `animate-spin` / `animate-pulse` (used by Loading.tsx)
      // are Tailwind core utilities and don't need to be redefined here.
      animation: {
        caret: "caret 1s step-end infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
