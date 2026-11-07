import { daysUntil } from "@/lib/dates";
import { formatInr } from "@/lib/format";
import { matchScore } from "@/lib/match";
import {
  CATEGORY_LABELS,
  LEVEL_LABELS,
} from "@/types";
import type {
  DiscoverFilters,
  EducationLevel,
  ProviderType,
  Scholarship,
  StudentProfile,
} from "@/types";

export const DEFAULT_FILTERS: DiscoverFilters = {
  search: "",
  minAmount: 0,
  maxAmount: 0,
  deadlineWindow: "any",
  category: "all",
  level: "all",
  providerType: "all",
  sort: "best-match",
};

export const AMOUNT_PRESETS = [
  { value: 0, label: "Any minimum" },
  { value: 10_000, label: "₹10,000 and above" },
  { value: 25_000, label: "₹25,000 and above" },
  { value: 50_000, label: "₹50,000 and above" },
  { value: 100_000, label: "₹1,00,000 and above" },
] as const;

export const MAX_AMOUNT_PRESETS = [
  { value: 0, label: "Any maximum" },
  { value: 25_000, label: "Up to ₹25,000" },
  { value: 50_000, label: "Up to ₹50,000" },
  { value: 100_000, label: "Up to ₹1,00,000" },
  { value: 200_000, label: "Up to ₹2,00,000" },
] as const;

export const DEADLINE_WINDOWS = [
  { value: "any", label: "Any time" },
  { value: "7", label: "Next 7 days" },
  { value: "21", label: "Next 21 days" },
  { value: "30", label: "Next 30 days" },
  { value: "60", label: "Next 60 days" },
] as const;

const WINDOW_DAYS: Record<DiscoverFilters["deadlineWindow"], number | null> = {
  any: null,
  "7": 7,
  "21": 21,
  "30": 30,
  "60": 60,
};

function matchesQuery(scholarship: Scholarship, query: string): boolean {
  if (!query) {
    return true;
  }
  const haystack = [
    scholarship.name,
    scholarship.provider,
    scholarship.providerType,
    scholarship.summary,
    ...scholarship.level,
    ...scholarship.category,
    ...(scholarship.eligibility.courses ?? []),
    ...(scholarship.eligibility.states ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

/** Pure filtering + sorting so the behaviour is easy to read and test. */
export function filterAndSortScholarships(
  list: Scholarship[],
  filters: DiscoverFilters,
  profile: StudentProfile | null,
): Scholarship[] {
  const query = filters.search.trim().toLowerCase();
  const windowDays = WINDOW_DAYS[filters.deadlineWindow];

  const filtered = list.filter((scholarship) => {
    if (!matchesQuery(scholarship, query)) {
      return false;
    }
    if (filters.minAmount > 0 && scholarship.amount < filters.minAmount) {
      return false;
    }
    if (filters.maxAmount > 0 && scholarship.amount > filters.maxAmount) {
      return false;
    }
    if (windowDays !== null) {
      const days = daysUntil(scholarship.deadline);
      if (days < 0 || days > windowDays) {
        return false;
      }
    }
    if (filters.category !== "all" && !scholarship.category.includes(filters.category)) {
      return false;
    }
    if (filters.level !== "all" && !scholarship.level.includes(filters.level)) {
      return false;
    }
    if (filters.providerType !== "all" && scholarship.providerType !== filters.providerType) {
      return false;
    }
    return true;
  });

  const withScores = filtered.map((scholarship) => ({
    scholarship,
    score: matchScore(profile, scholarship).score,
  }));

  withScores.sort((a, b) => {
    if (filters.sort === "highest-amount") {
      return b.scholarship.amount - a.scholarship.amount;
    }
    if (filters.sort === "closing-soon") {
      return a.scholarship.deadline.localeCompare(b.scholarship.deadline);
    }
    if (a.score === null || b.score === null) {
      return a.scholarship.deadline.localeCompare(b.scholarship.deadline);
    }
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.scholarship.deadline.localeCompare(b.scholarship.deadline);
  });

  return withScores.map((item) => item.scholarship);
}

export interface ActiveFilterChip {
  key: keyof DiscoverFilters;
  label: string;
  /** Value to restore to when the chip is dismissed. */
  resetTo: DiscoverFilters[keyof DiscoverFilters];
}

export function getActiveFilterChips(filters: DiscoverFilters): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (filters.search) {
    chips.push({ key: "search", label: `“${filters.search}”`, resetTo: "" });
  }
  if (filters.minAmount > 0) {
    const preset = AMOUNT_PRESETS.find((item) => item.value === filters.minAmount);
    chips.push({
      key: "minAmount",
      label: preset ? preset.label : "Amount filter",
      resetTo: 0,
    });
  }
  if (filters.maxAmount > 0) {
    chips.push({
      key: "maxAmount",
      label: `Up to ${formatInr(filters.maxAmount)}`,
      resetTo: 0,
    });
  }
  if (filters.deadlineWindow !== "any") {
    const preset = DEADLINE_WINDOWS.find((item) => item.value === filters.deadlineWindow);
    chips.push({
      key: "deadlineWindow",
      label: preset ? preset.label : "Deadline filter",
      resetTo: "any",
    });
  }
  if (filters.category !== "all") {
    chips.push({
      key: "category",
      label: `Category: ${CATEGORY_LABELS[filters.category]}`,
      resetTo: "all",
    });
  }
  if (filters.level !== "all") {
    chips.push({
      key: "level",
      label: `Level: ${LEVEL_LABELS[filters.level]}`,
      resetTo: "all",
    });
  }
  if (filters.providerType !== "all") {
    chips.push({
      key: "providerType",
      label: `Provider: ${filters.providerType}`,
      resetTo: "all",
    });
  }

  return chips;
}

export function countActiveFilters(filters: DiscoverFilters): number {
  return getActiveFilterChips(filters).length;
}

export const LEVEL_FILTER_OPTIONS: { value: EducationLevel | "all"; label: string }[] = [
  { value: "all", label: "Every level" },
  { value: "school", label: "School (Class 9–12)" },
  { value: "diploma", label: "Diploma / ITI" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "postgraduate", label: "Postgraduate" },
];

export const PROVIDER_FILTER_OPTIONS: {
  value: ProviderType | "all";
  label: string;
}[] = [
  { value: "all", label: "Every provider" },
  { value: "National", label: "National" },
  { value: "State", label: "State" },
  { value: "Private", label: "Private" },
];
