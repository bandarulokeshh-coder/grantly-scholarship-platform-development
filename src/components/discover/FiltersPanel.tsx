"use client";

import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  AMOUNT_PRESETS,
  DEADLINE_WINDOWS,
  MAX_AMOUNT_PRESETS,
  LEVEL_FILTER_OPTIONS,
  PROVIDER_FILTER_OPTIONS,
} from "@/lib/discover";
import { CATEGORIES, CATEGORY_LABELS } from "@/types";
import type {
  Category,
  DiscoverFilters,
  EducationLevel,
  ProviderType,
} from "@/types";

const controlClass =
  "min-h-11 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink transition-colors hover:border-primary/50 focus-ring";

const labelClass = "mb-1.5 block text-sm font-semibold";

export interface FiltersPanelProps {
  filters: DiscoverFilters;
  idPrefix: string;
  onChange: (patch: Partial<DiscoverFilters>) => void;
  onReset: () => void;
  children?: ReactNode;
}

export function FiltersPanel({
  filters,
  idPrefix,
  onChange,
  onReset,
  children,
}: FiltersPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${idPrefix}-amount`} className={labelClass}>
          Minimum amount per year
        </label>
        <select
          id={`${idPrefix}-amount`}
          value={filters.minAmount}
          onChange={(event) => onChange({ minAmount: Number(event.target.value) })}
          className={controlClass}
        >
          {AMOUNT_PRESETS.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-max-amount`} className={labelClass}>
          Maximum amount per year
        </label>
        <select
          id={`${idPrefix}-max-amount`}
          value={filters.maxAmount}
          onChange={(event) => onChange({ maxAmount: Number(event.target.value) })}
          className={controlClass}
        >
          {MAX_AMOUNT_PRESETS.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-deadline`} className={labelClass}>
          Deadline window
        </label>
        <select
          id={`${idPrefix}-deadline`}
          value={filters.deadlineWindow}
          onChange={(event) =>
            onChange({
              deadlineWindow: event.target.value as DiscoverFilters["deadlineWindow"],
            })
          }
          className={controlClass}
        >
          {DEADLINE_WINDOWS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-category`} className={labelClass}>
          Community category
        </label>
        <select
          id={`${idPrefix}-category`}
          value={filters.category}
          onChange={(event) =>
            onChange({ category: event.target.value as Category | "all" })
          }
          className={controlClass}
        >
          <option value="all">Every category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-level`} className={labelClass}>
          Education level
        </label>
        <select
          id={`${idPrefix}-level`}
          value={filters.level}
          onChange={(event) =>
            onChange({ level: event.target.value as EducationLevel | "all" })
          }
          className={controlClass}
        >
          {LEVEL_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-provider`} className={labelClass}>
          Provider type
        </label>
        <select
          id={`${idPrefix}-provider`}
          value={filters.providerType}
          onChange={(event) =>
            onChange({ providerType: event.target.value as ProviderType | "all" })
          }
          className={controlClass}
        >
          {PROVIDER_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Button variant="secondary" onClick={onReset} className="w-full">
        <RotateCcw aria-hidden="true" size={15} />
        Reset filters
      </Button>

      {children}
    </div>
  );
}
