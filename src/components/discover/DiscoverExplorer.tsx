"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import {
  ArrowRight,
  Search,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import { ActiveFilterChips } from "@/components/discover/ActiveFilterChips";
import { FiltersPanel } from "@/components/discover/FiltersPanel";
import { ScholarshipCard } from "@/components/discover/ScholarshipCard";
import { useGrantly } from "@/components/providers/GrantlyProvider";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeletonList } from "@/components/ui/Skeleton";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  filterAndSortScholarships,
} from "@/lib/discover";
import { sanitizeSearchQuery } from "@/lib/schemas";
import { SORT_LABELS, SORT_OPTIONS } from "@/types";
import type { DiscoverFilters, Scholarship, SortOption } from "@/types";

export interface DiscoverExplorerProps {
  scholarships: Scholarship[];
}

export function DiscoverExplorer({ scholarships }: DiscoverExplorerProps) {
  const { ready, profile } = useGrantly();
  const [filters, setFilters] = useState<DiscoverFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(searchInput, 250);
  const safeSearch = sanitizeSearchQuery(debouncedSearch);

  const results = useMemo(
    () =>
      filterAndSortScholarships(
        scholarships,
        { ...filters, search: safeSearch },
        profile,
      ),
    [scholarships, filters, safeSearch, profile],
  );

  const updateFilters = (patch: Partial<DiscoverFilters>): void => {
    setFilters((previous) => ({ ...previous, ...patch }));
  };

  const resetFilters = (): void => {
    setFilters({ ...DEFAULT_FILTERS });
    setSearchInput("");
  };

  const activeCount = countActiveFilters({ ...filters, search: safeSearch });
  const isSearchPending = searchInput !== debouncedSearch;

  return (
    <div className="space-y-5">
      {ready && !profile ? (
        <div className="surface-card flex flex-col gap-3 border-primary/30 bg-primary-soft/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm text-ink">
            <Sparkles aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-link" />
            <span>
              You are browsing as a guest. Match percentages appear once you add
              four details to your profile.
            </span>
          </p>
          <Link
            href="/#profile-setup"
            className={buttonClasses("primary", "sm", "shrink-0 justify-center")}
          >
            Unlock my matches
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside aria-labelledby="filters-heading" className="hidden lg:block">
          <div className="surface-card sticky top-24 p-4">
            <h2 id="filters-heading" className="mb-3 text-base font-bold">
              Filters
            </h2>
            <FiltersPanel
              filters={filters}
              idPrefix="desktop"
              onChange={updateFilters}
              onReset={resetFilters}
            />
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <div className="surface-card p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="scholarship-search"
                  className="mb-1 block text-xs font-semibold text-ink-soft"
                >
                  Search scholarships
                </label>
                <div className="relative">
                <Search
                  aria-hidden="true"
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
                />
                <input
                  id="scholarship-search"
                  type="search"
                  inputMode="search"
                  maxLength={80}
                  value={searchInput}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setSearchInput(event.target.value.slice(0, 80))
                  }
                  placeholder="Search by name, provider or course"
                  aria-describedby="search-hint"
                  className="min-h-11 w-full rounded-xl border border-line bg-surface py-2 pl-10 pr-10 text-sm text-ink placeholder:text-ink-faint focus-ring [&::-webkit-search-cancel-button]:hidden"
                />
                {searchInput ? (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    aria-label="Clear search"
                    className="focus-ring absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft hover:bg-surface-muted hover:text-ink"
                  >
                    <X aria-hidden="true" size={16} />
                  </button>
                ) : null}
                </div>
              </div>

              <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1 sm:flex-none">
                  <label
                    htmlFor="sort"
                    className="mb-1 block text-xs font-semibold text-ink-soft"
                  >
                    Sort by
                  </label>
                  <select
                    id="sort"
                    value={filters.sort}
                    onChange={(event) =>
                      updateFilters({ sort: event.target.value as SortOption })
                    }
                    className="min-h-11 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm font-semibold text-ink focus-ring"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {SORT_LABELS[option]}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  className={buttonClasses(
                    "secondary",
                    "sm",
                    "min-h-11 shrink-0 lg:hidden",
                  )}
                  aria-haspopup="dialog"
                >
                  <SlidersHorizontal aria-hidden="true" size={16} />
                  Filters
                  {activeCount > 0 ? (
                    <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-bold text-on-primary">
                      {activeCount}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>

            <p id="search-hint" className="mt-2 text-xs text-ink-faint">
              Search is limited to 80 characters. Results update as you type.
            </p>

            <div className="mt-3">
              <ActiveFilterChips
                filters={{ ...filters, search: safeSearch }}
                onChange={updateFilters}
                onClearAll={resetFilters}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p
              role="status"
              aria-live="polite"
              className="text-sm font-semibold text-ink-soft"
            >
              {ready
                ? `Showing ${results.length} of ${scholarships.length} scholarships`
                : "Loading scholarships…"}
            </p>
            {isSearchPending ? (
              <span className="text-xs text-ink-faint">Searching…</span>
            ) : null}
          </div>

          <h2 className="sr-only">Scholarship results</h2>

          {!ready ? (
            <CardSkeletonList count={4} />
          ) : results.length === 0 ? (
            <EmptyState
              icon={<SearchX size={22} />}
              title="No scholarships match those filters"
              description={`Try a wider deadline window, a different amount range, or clear the search. There are ${scholarships.length} scholarships in this sample set.`}
              action={
                <Button onClick={resetFilters}>Reset filters</Button>
              }
            />
          ) : (
            <ul className="space-y-4">
              {results.map((scholarship) => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Filter scholarships"
        description="Changes apply immediately to the list behind this dialog."
      >
        <FiltersPanel
          filters={filters}
          idPrefix="mobile"
          onChange={updateFilters}
          onReset={resetFilters}
        >
          <Button onClick={() => setDialogOpen(false)} className="w-full">
            Show {results.length} results
          </Button>
        </FiltersPanel>
      </Dialog>
    </div>
  );
}
