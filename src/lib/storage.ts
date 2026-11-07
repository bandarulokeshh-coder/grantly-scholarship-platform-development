/**
 * A tiny structural type so storage does not depend on a specific validator
 * implementation. Zod schemas satisfy this shape.
 */
export type StorageValidator<T> = {
  safeParse: (
    value: unknown,
  ) => { success: true; data: T } | { success: false };
};

export const STORAGE_KEYS = {
  profile: "grantly.profile.v1",
  tracker: "grantly.tracker.v1",
  documents: "grantly.documents.v1",
  theme: "grantly.theme.v1",
} as const;

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * Reads and validates a value from localStorage. Malformed data is ignored and
 * the caller's default is returned, so the app can never crash on bad storage.
 */
export function readStored<T>(
  key: string,
  schema: StorageValidator<T>,
  fallback: T,
): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed: unknown = JSON.parse(raw);
    const result = schema.safeParse(parsed);
    return result.success ? result.data : fallback;
  } catch {
    return fallback;
  }
}

export function writeStored(key: string, value: unknown): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode or quota). The app still works
    // for the current session, so there is nothing to recover from here.
  }
}

export function removeStored(key: string): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore: nothing depends on removal succeeding.
  }
}
