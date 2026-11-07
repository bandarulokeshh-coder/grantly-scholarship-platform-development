"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import { readStored, removeStored, writeStored } from "@/lib/storage";
import type { StorageValidator } from "@/lib/storage";

export interface StoredState<T> {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  /** False on the server and during hydration, true once storage is read. */
  ready: boolean;
  reset: () => void;
}

/**
 * SSR-safe localStorage state. Nothing is read until after mount, so server and
 * client markup always match. Stored data is validated and silently replaced
 * with the default when it is malformed.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validator: StorageValidator<T>,
): StoredState<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);
  const initialRef = useRef(initialValue);

  useEffect(() => {
    setValue(readStored(key, validator, initialRef.current));
    setReady(true);
  }, [key, validator]);

  useEffect(() => {
    if (ready) {
      writeStored(key, value);
    }
  }, [key, ready, value]);

  const reset = useCallback(() => {
    setValue(initialRef.current);
    removeStored(key);
  }, [key]);

  return { value, setValue, ready, reset };
}
