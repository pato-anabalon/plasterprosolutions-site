"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

type ThemeToggleProps = {
  tone?: "dark" | "light";
};

const storageKey = "plasterpro-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle({ tone = "light" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") {
      return "light";
    }

    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  });

  const isDark = theme === "dark";
  const trackClasses =
    tone === "dark"
      ? "border-white/14 bg-white/8 text-white"
      : "border-charcoal/12 bg-surface text-charcoal";

  return (
    <button
      className={`focus-ring inline-grid h-12 grid-cols-2 items-center rounded-full border p-1 text-xs font-black uppercase tracking-[0.12em] shadow-[0_14px_38px_rgba(25,23,20,0.08)] transition hover:border-spicy-orange ${trackClasses}`}
      data-testid="theme-toggle"
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      suppressHydrationWarning
      onClick={() => {
        const nextTheme = isDark ? "light" : "dark";
        applyTheme(nextTheme);
        window.localStorage.setItem(storageKey, nextTheme);
        setTheme(nextTheme);
      }}
    >
      <span
        className={`grid size-10 place-items-center rounded-full transition ${
          !isDark
            ? "bg-spicy-orange text-white shadow-[0_10px_24px_rgba(227,65,15,0.28)]"
            : "text-current/45"
        }`}
      >
        <Sun size={16} aria-hidden="true" />
      </span>
      <span
        className={`grid size-10 place-items-center rounded-full transition ${
          isDark
            ? "bg-spicy-orange text-white shadow-[0_10px_24px_rgba(227,65,15,0.28)]"
            : "text-current/45"
        }`}
      >
        <Moon size={15} aria-hidden="true" />
      </span>
    </button>
  );
}
