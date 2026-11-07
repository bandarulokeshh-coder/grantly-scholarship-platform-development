"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarClock,
  Compass,
  IndianRupee,
  Send,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { useGrantly } from "@/components/providers/GrantlyProvider";
import { UrgencyBadge } from "@/components/discover/UrgencyBadge";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { getScholarshipById } from "@/data/scholarships";
import { formatDate, getUrgency, isDueThisWeek } from "@/lib/dates";
import { formatInr, formatInrCompact, pluralise } from "@/lib/format";
import {
  APPLICATION_STATUSES,
  STATUS_BOARD,
  STATUS_LABELS,
} from "@/types";
import type { ApplicationStatus, Scholarship, TrackerEntry } from "@/types";

interface DashboardItem {
  scholarship: Scholarship;
  entry: TrackerEntry;
}

const selectClass =
  "min-h-11 w-full rounded-xl border border-line bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-primary/50 focus-ring";

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <div className="surface-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">
          {label}
        </p>
        <span aria-hidden="true" className="text-link">
          {icon}
        </span>
      </div>
      <p className="mt-1.5 text-2xl font-extrabold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-ink-soft">{hint}</p>
    </div>
  );
}

export function DashboardView() {
  const { ready, tracker, statusOf, setStatus, removeEntry } = useGrantly();
  const [message, setMessage] = useState("");

  const items = useMemo<DashboardItem[]>(() => {
    return Object.entries(tracker)
      .map(([id, entry]) => {
        const scholarship = getScholarshipById(id);
        return scholarship ? { scholarship, entry } : null;
      })
      .filter((item): item is DashboardItem => item !== null)
      .sort((a, b) => a.scholarship.deadline.localeCompare(b.scholarship.deadline));
  }, [tracker]);

  const savedCount = items.filter((item) => item.entry.status === "saved").length;
  const appliedCount = items.filter((item) => item.entry.status === "applied").length;
  const liveItems = items.filter((item) => item.entry.status !== "not-selected");
  const potentialFunding = liveItems.reduce(
    (total, item) => total + item.scholarship.amount,
    0,
  );
  const wonFunding = items
    .filter((item) => item.entry.status === "won")
    .reduce((total, item) => total + item.scholarship.amount, 0);
  const dueThisWeek = liveItems.filter((item) =>
    isDueThisWeek(item.scholarship.deadline),
  );

  if (!ready) {
    return (
      <div className="space-y-5" aria-busy="true">
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-32" />
        <div className="grid gap-3 lg:grid-cols-4">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <h2 className="sr-only">Your tracked scholarships</h2>
        <EmptyState
        icon={<Compass size={22} />}
        title="Your dashboard is waiting for its first scholarship"
        description="Save a scholarship from Discover and it appears here with a deadline, a document list and a status you can move forward."
        action={
          <Link href="/discover" className={buttonClasses("primary", "md")}>
            Discover scholarships
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        }
        />
      </div>
    );
  }

  const handleStatusChange = (
    item: DashboardItem,
    next: ApplicationStatus,
  ): void => {
    setStatus(item.scholarship.id, next);
    setMessage(
      `${item.scholarship.name} moved to ${STATUS_LABELS[next]}.`,
    );
  };

  const handleRemove = (item: DashboardItem): void => {
    removeEntry(item.scholarship.id);
    setMessage(`${item.scholarship.name} removed from your dashboard.`);
  };

  return (
    <div className="space-y-6">
      <p aria-live="polite" className="sr-only">
        {message}
      </p>

      <section aria-label="Your scholarship numbers">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Saved"
            value={String(savedCount)}
            hint={`${pluralise(items.length, "scholarship")} in your pipeline`}
            icon={<TrendingUp size={18} />}
          />
          <StatCard
            label="Applied"
            value={String(appliedCount)}
            hint={
              wonFunding > 0
                ? `${formatInr(wonFunding)} won so far`
                : "No results recorded yet"
            }
            icon={<Send size={18} />}
          />
          <StatCard
            label="Potential funding"
            value={formatInrCompact(potentialFunding)}
            hint={`Across ${pluralise(liveItems.length, "live application")}`}
            icon={<Wallet size={18} />}
          />
        </div>
      </section>

      <section
        aria-labelledby="due-heading"
        className="surface-card border-primary/25 bg-primary-soft/40 p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="due-heading" className="flex items-center gap-2 text-base font-bold sm:text-lg">
            <CalendarClock aria-hidden="true" size={18} className="text-link" />
            Due this week
          </h2>
          <Badge tone={dueThisWeek.length > 0 ? "warning" : "success"}>
            {dueThisWeek.length > 0
              ? `${pluralise(dueThisWeek.length, "deadline")} soon`
              : "Nothing due in 7 days"}
          </Badge>
        </div>

        {dueThisWeek.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">
            Your next seven days are clear. Keep your documents ready so a good
            match never slips past.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dueThisWeek.map((item) => (
              <li key={item.scholarship.id}>
                <Link
                  href={`/scholarship/${item.scholarship.id}`}
                  className="focus-ring flex min-h-11 flex-wrap items-center justify-between gap-2 rounded-xl bg-surface px-3 py-2 transition-colors hover:bg-surface-muted"
                >
                  <span className="text-sm font-semibold">
                    {item.scholarship.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-ink-soft">
                      {formatDate(item.scholarship.deadline)}
                    </span>
                    <UrgencyBadge deadline={item.scholarship.deadline} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="board-heading">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="board-heading" className="text-xl font-extrabold sm:text-2xl">
            Status board
          </h2>
          <p className="text-xs text-ink-soft">
            Use the “Move to” menu on each card. No dragging needed.
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {STATUS_BOARD.map((column) => {
            const columnItems = items.filter((item) =>
              column.statuses.includes(item.entry.status),
            );
            return (
              <div key={column.key} className="surface-card flex flex-col p-3">
                <div className="flex items-center justify-between gap-2 px-1">
                  <h3 className="text-sm font-bold">{column.title}</h3>
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-bold tabular-nums text-ink-soft">
                    {columnItems.length}
                    <span className="sr-only"> scholarships</span>
                  </span>
                </div>
                <p className="mt-0.5 px-1 text-[11px] text-ink-faint">
                  {column.description}
                </p>

                {columnItems.length === 0 ? (
                  <p className="mt-3 rounded-xl border border-dashed border-line px-3 py-6 text-center text-xs text-ink-faint">
                    Nothing here yet
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {columnItems.map((item) => (
                      <li
                        key={item.scholarship.id}
                        className="rounded-xl border border-line bg-surface p-3"
                      >
                        <Link
                          href={`/scholarship/${item.scholarship.id}`}
                          className="focus-ring rounded text-sm font-semibold leading-snug underline-offset-4 hover:underline"
                        >
                          {item.scholarship.name}
                        </Link>
                        <p className="mt-1 text-xs text-ink-soft">
                          {formatInr(item.scholarship.amount)} ·{" "}
                          {formatDate(item.scholarship.deadline)}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <UrgencyBadge deadline={item.scholarship.deadline} />
                        </div>

                        <div className="mt-2.5">
                          <label
                            htmlFor={`move-${item.scholarship.id}`}
                            className="mb-1 block text-[11px] font-semibold text-ink-faint"
                          >
                            Move to
                          </label>
                          <select
                            id={`move-${item.scholarship.id}`}
                            value={statusOf(item.scholarship.id) ?? "saved"}
                            onChange={(event) =>
                              handleStatusChange(
                                item,
                                event.target.value as ApplicationStatus,
                              )
                            }
                            className={selectClass}
                          >
                            {APPLICATION_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {STATUS_LABELS[status]}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="focus-ring mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-1 text-xs font-semibold text-ink-faint hover:text-danger"
                        >
                          <Trash2 aria-hidden="true" size={13} />
                          Remove
                          <span className="sr-only">
                            {" "}
                            {item.scholarship.name} from dashboard
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="timeline-heading" className="surface-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="timeline-heading" className="text-lg font-bold sm:text-xl">
            Upcoming deadlines
          </h2>
          <Badge tone="neutral" icon={<CalendarClock size={13} />}>
            {items.length} tracked
          </Badge>
        </div>

        <ol className="mt-4 space-y-0">
          {items.map((item) => {
            const urgency = getUrgency(item.scholarship.deadline);
            return (
              <li
                key={item.scholarship.id}
                className="relative flex gap-3 border-l-2 border-line pb-4 pl-4 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className={
                    urgency.level === "critical"
                      ? "absolute -left-[7px] top-1 size-3 rounded-full bg-danger"
                      : urgency.level === "soon"
                        ? "absolute -left-[7px] top-1 size-3 rounded-full bg-warning"
                        : "absolute -left-[7px] top-1 size-3 rounded-full bg-success"
                  }
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/scholarship/${item.scholarship.id}`}
                      className="focus-ring rounded text-sm font-semibold underline-offset-4 hover:underline"
                    >
                      {item.scholarship.name}
                    </Link>
                    <span className="text-xs font-semibold text-ink-soft">
                      {formatDate(item.scholarship.deadline)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge tone="neutral">{STATUS_LABELS[item.entry.status]}</Badge>
                    <UrgencyBadge deadline={item.scholarship.deadline} />
                    <span className="text-xs text-ink-faint">
                      <IndianRupee aria-hidden="true" size={11} className="inline" />
                      {formatInr(item.scholarship.amount)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
