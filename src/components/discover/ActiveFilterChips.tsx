"use client";

import { X } from "lucide-react";

import { getActiveFilterChips } from "@/lib/discover";
import type { DiscoverFilters } from "@/types";

export interface ActiveFilterChipsProps {
  filters: DiscoverFilters;
  onChange: (patch: Partial<DiscoverFilters>) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({
  filters,
  onChange,
  onClearAll,
}: ActiveFilterChipsProps) {
  const chips = getActiveFilterChips(filters);

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-ink-faint">
        Active
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() =>
            onChange({
              [chip.key]: chip.resetTo,
            } as Partial<DiscoverFilters>)
          }
          className="focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs font-semibold text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
        >
          {chip.label}
          <span className="sr-only">Remove filter</span>
          <X aria-hidden="true" size={13} />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="focus-ring inline-flex min-h-11 items-center rounded-full px-3 text-xs font-bold text-link underline underline-offset-2 hover:no-underline"
      >
        Clear all
      </button>
    </div>
  );
}
