"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

const STORAGE_KEY = "lhg-theme";

function getInitialTheme(): "light" | "dark" {
  if (typeof document !== "undefined") {
    const theme = document.documentElement.dataset.theme;
    if (theme === "dark" || theme === "light") return theme;
  }

  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return "light";
}

export default function ThemeToggle({ lang }: { lang: Lang }) {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleMode = () => {
    const current = theme === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
  };

  const helperLabel = theme === "dark"
    ? (lang === "en" ? "Dark" : "Dunkel")
    : (lang === "en" ? "Light" : "Hell");
  const ariaLabel = theme === "dark"
    ? (lang === "en" ? "Switch to light mode" : "Zu hellem Modus wechseln")
    : (lang === "en" ? "Switch to dark mode" : "Zu dunklem Modus wechseln");

  return (
    <button
      type="button"
      onClick={toggleMode}
      className="theme-toggle"
      aria-label={ariaLabel}
      aria-pressed={theme === "dark"}
      title={ariaLabel}
      suppressHydrationWarning
    >
      <span className="theme-toggle-orb" aria-hidden="true">
        {theme === "dark" ? (
          <svg className="theme-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
          </svg>
        ) : (
          <svg className="theme-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 3v2m0 14v2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42M3 12h2m14 0h2M5.64 18.36l1.42-1.42m9.88-9.88 1.42-1.42" />
          </svg>
        )}
      </span>
      <span className="sr-only" suppressHydrationWarning>{helperLabel}</span>
    </button>
  );
}
