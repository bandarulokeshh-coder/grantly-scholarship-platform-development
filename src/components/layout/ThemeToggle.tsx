"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { ready, preference, toggleTheme } = useTheme();

  const systemDark =
    ready &&
    preference === "system" &&
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const isDark = ready && (preference === "dark" || systemDark);
  const label = !ready
    ? "Switch colour theme"
    : isDark
      ? "Switch to light theme"
      : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      className="focus-ring flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
    >
      {isDark ? (
        <Sun aria-hidden="true" size={19} />
      ) : (
        <Moon aria-hidden="true" size={19} />
      )}
    </button>
  );
}
