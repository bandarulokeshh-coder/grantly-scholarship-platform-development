"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import type { ReactNode } from "react";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  savedDocumentsSchema,
  studentProfileSchema,
  trackerSchema,
} from "@/lib/schemas";
import { STORAGE_KEYS } from "@/lib/storage";
import type {
  ApplicationStatus,
  StudentProfile,
  TrackerEntry,
  TrackerMap,
} from "@/types";

const storedProfileSchema = studentProfileSchema.nullable();
const emptyTracker: TrackerMap = {};
const emptyDocuments: string[] = [];

export interface GrantlyContextValue {
  ready: boolean;
  profile: StudentProfile | null;
  saveProfile: (profile: StudentProfile) => void;
  clearProfile: () => void;
  tracker: TrackerMap;
  trackedIds: string[];
  statusOf: (id: string) => ApplicationStatus | null;
  setStatus: (id: string, status: ApplicationStatus) => void;
  toggleSave: (id: string) => void;
  removeEntry: (id: string) => void;
  documents: string[];
  toggleDocument: (document: string) => void;
  isDocumentDone: (document: string) => boolean;
  resetDocuments: () => void;
}

const GrantlyContext = createContext<GrantlyContextValue | null>(null);

export function GrantlyProvider({ children }: { children: ReactNode }) {
  const profileStore = useLocalStorage<StudentProfile | null>(
    STORAGE_KEYS.profile,
    null,
    storedProfileSchema,
  );
  const trackerStore = useLocalStorage<TrackerMap>(
    STORAGE_KEYS.tracker,
    emptyTracker,
    trackerSchema,
  );
  const documentStore = useLocalStorage<string[]>(
    STORAGE_KEYS.documents,
    emptyDocuments,
    savedDocumentsSchema,
  );

  const saveProfile = useCallback(
    (profile: StudentProfile) => {
      profileStore.setValue(profile);
    },
    [profileStore],
  );

  const clearProfile = useCallback(() => {
    profileStore.reset();
  }, [profileStore]);

  const setStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      const entry: TrackerEntry = {
        status,
        updatedAt: new Date().toISOString(),
      };
      trackerStore.setValue((current) => ({ ...current, [id]: entry }));
    },
    [trackerStore],
  );

  const removeEntry = useCallback(
    (id: string) => {
      trackerStore.setValue((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    },
    [trackerStore],
  );

  const toggleSave = useCallback(
    (id: string) => {
      trackerStore.setValue((current) => {
        const next = { ...current };
        if (next[id]) {
          delete next[id];
          return next;
        }
        next[id] = { status: "saved", updatedAt: new Date().toISOString() };
        return next;
      });
    },
    [trackerStore],
  );

  const toggleDocument = useCallback(
    (document: string) => {
      documentStore.setValue((current) =>
        current.includes(document)
          ? current.filter((item) => item !== document)
          : [...current, document],
      );
    },
    [documentStore],
  );

  const value = useMemo<GrantlyContextValue>(() => {
    const trackedIds = Object.keys(trackerStore.value);
    return {
      ready:
        profileStore.ready && trackerStore.ready && documentStore.ready,
      profile: profileStore.value,
      saveProfile,
      clearProfile,
      tracker: trackerStore.value,
      trackedIds,
      statusOf: (id: string) => trackerStore.value[id]?.status ?? null,
      setStatus,
      toggleSave,
      removeEntry,
      documents: documentStore.value,
      toggleDocument,
      isDocumentDone: (document: string) =>
        documentStore.value.includes(document),
      resetDocuments: documentStore.reset,
    };
  }, [
    profileStore.ready,
    profileStore.value,
    trackerStore.ready,
    trackerStore.value,
    documentStore.ready,
    documentStore.value,
    documentStore.reset,
    saveProfile,
    clearProfile,
    setStatus,
    toggleSave,
    removeEntry,
    toggleDocument,
  ]);

  return (
    <GrantlyContext.Provider value={value}>{children}</GrantlyContext.Provider>
  );
}

export function useGrantly(): GrantlyContextValue {
  const context = useContext(GrantlyContext);
  if (!context) {
    throw new Error("useGrantly must be used inside GrantlyProvider");
  }
  return context;
}
