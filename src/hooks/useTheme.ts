"use client";

import { useCallback, useEffect } from "react";

import { themePreferenceSchema } from "@/lib/schemas";
import type { ThemePreference } from "@/lib/schemas";
import { STORAGE_KEYS } from "@/lib/storage";
import { useLocalStorage } from "@/hooks/useLocalStorage";

function applyTheme(preference: ThemePreference): void {
  const root = document.documentElement;
  if (preference === "system") {
    delete root.dataset.theme;
    root.style.colorScheme = "";
    return;
  }
  root.dataset.theme = preference;
  root.style.colorScheme = preference;
}

export interface ThemeControls {
  ready: boolean;
  preference: ThemePreference;
  toggleTheme: () => void;
}

export function useTheme(): ThemeControls {
  const { value, setValue, ready } = useLocalStorage<ThemePreference>(
    STORAGE_KEYS.theme,
    "system",
    themePreferenceSchema,
  );

  useEffect(() => {
    if (ready) {
      applyTheme(value);
    }
  }, [ready, value]);

  const toggleTheme = useCallback(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark =
      document.documentElement.dataset.theme === "dark" ||
      (value === "system" && prefersDark);
    setValue(isDark ? "light" : "dark");
  }, [setValue, value]);

  return { ready, preference: value, toggleTheme };
}
