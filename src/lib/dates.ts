const DAY_IN_MS = 24 * 60 * 60 * 1000;

/** Today as a UTC-midnight timestamp, used for stable day counts. */
function todayUtc(): number {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

/** ISO date (YYYY-MM-DD) for a number of days from today. */
export function isoDaysFromToday(offset: number): string {
  const target = new Date(todayUtc() + offset * DAY_IN_MS);
  return target.toISOString().slice(0, 10);
}

/** Whole days between today and an ISO date. Negative means the date passed. */
export function daysUntil(isoDate: string): number {
  const target = Date.parse(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(target)) {
    return 0;
  }
  return Math.round((target - todayUtc()) / DAY_IN_MS);
}

/** "12 Mar 2026" — fixed locale so server and client agree. */
export function formatDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export type UrgencyLevel = "critical" | "soon" | "open" | "closed";

export interface Urgency {
  level: UrgencyLevel;
  days: number;
  label: string;
}

/**
 * Urgency is always communicated with colour AND text, so it never relies on
 * colour alone.
 */
export function getUrgency(isoDate: string): Urgency {
  const days = daysUntil(isoDate);

  if (days < 0) {
    return { level: "closed", days, label: "Closed" };
  }
  if (days === 0) {
    return { level: "critical", days, label: "Closes today" };
  }
  if (days < 7) {
    return {
      level: "critical",
      days,
      label: `Closing in ${days} ${days === 1 ? "day" : "days"}`,
    };
  }
  if (days < 21) {
    return {
      level: "soon",
      days,
      label: `${days} days left`,
    };
  }
  return {
    level: "open",
    days,
    label: `${days} days left`,
  };
}

/** Days from today until the end of the current week (inclusive). */
export function isDueThisWeek(isoDate: string): boolean {
  const days = daysUntil(isoDate);
  return days >= 0 && days <= 7;
}
