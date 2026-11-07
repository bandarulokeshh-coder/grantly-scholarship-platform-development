"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BellRing,
  Bookmark,
  BookmarkCheck,
  Check,
  CircleAlert,
} from "lucide-react";

import { useGrantly } from "@/components/providers/GrantlyProvider";
import { MatchBadge } from "@/components/discover/MatchBadge";
import { UrgencyBadge } from "@/components/discover/UrgencyBadge";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/dates";
import { formatInr } from "@/lib/format";
import { matchLabel, matchScore } from "@/lib/match";
import type { Scholarship } from "@/types";

export function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  const { ready, profile, statusOf, toggleSave } = useGrantly();
  const [message, setMessage] = useState("");
  const tracked = ready && statusOf(scholarship.id) !== null;
  const match = matchScore(profile, scholarship);

  const handleSave = (): void => {
    toggleSave(scholarship.id);
    setMessage(
      tracked
        ? `${scholarship.name} removed from your list.`
        : `${scholarship.name} saved to your list.`,
    );
  };

  return (
    <li className="surface-card group flex flex-col p-4 transition-colors hover:border-primary/40 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="neutral">{scholarship.providerType}</Badge>
        <UrgencyBadge deadline={scholarship.deadline} />
        <MatchBadge score={match.score} />
        {tracked ? (
          <Badge tone="primary" icon={<BookmarkCheck size={13} />}>
            In my list
          </Badge>
        ) : null}
      </div>

      <h3 className="mt-3 text-lg font-bold leading-snug sm:text-xl">
        <Link
          href={`/scholarship/${scholarship.id}`}
          className="focus-ring rounded-md underline-offset-4 hover:underline"
        >
          {scholarship.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-ink-soft">{scholarship.provider}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-surface-muted px-3 py-2.5">
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">
            Amount / year
          </dt>
          <dd className="text-sm font-bold tabular-nums sm:text-base">
            {formatInr(scholarship.amount)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">
            Deadline
          </dt>
          <dd className="text-sm font-bold sm:text-base">
            {formatDate(scholarship.deadline)}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex-1">
        {match.score === null ? (
          <p className="text-sm text-ink-soft">
            Complete your profile to see your match.{" "}
            <Link href="/#profile-setup" className="focus-ring rounded font-semibold text-link underline underline-offset-2">
              Add details
            </Link>
          </p>
        ) : (
          <div>
            <p className="text-sm font-semibold">
              {matchLabel(match.score)}: you meet {match.metCount} of{" "}
              {match.evaluatedCount} criteria.
            </p>
            <ul className="mt-2 space-y-1">
              {match.reasons.slice(0, 2).map((reason) => (
                <li key={reason} className="flex items-start gap-1.5 text-xs text-ink-soft">
                  <Check aria-hidden="true" size={13} className="mt-0.5 shrink-0 text-success" />
                  {reason} matches
                </li>
              ))}
              {match.missing.slice(0, 2).map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-xs text-ink-soft">
                  <CircleAlert aria-hidden="true" size={13} className="mt-0.5 shrink-0 text-warning" />
                  Missing: {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={`/scholarship/${scholarship.id}`}
          className={buttonClasses("primary", "sm", "flex-1 justify-center sm:flex-none")}
        >
          View details
          <ArrowRight aria-hidden="true" size={15} />
        </Link>
        <button
          type="button"
          onClick={handleSave}
          disabled={!ready}
          aria-label={
            tracked
              ? `Remove ${scholarship.name} from my list`
              : `Save ${scholarship.name} to my list`
          }
          className={buttonClasses(
            "secondary",
            "sm",
            cn("flex-1 justify-center sm:flex-none", tracked && "border-primary/50 text-link"),
          )}
        >
          {tracked ? (
            <BookmarkCheck aria-hidden="true" size={15} />
          ) : (
            <Bookmark aria-hidden="true" size={15} />
          )}
          {tracked ? "Saved" : "Save"}
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {message}
      </p>
      {tracked ? (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ink-faint">
          <BellRing aria-hidden="true" size={12} />
          Track it from your dashboard.
        </p>
      ) : null}
    </li>
  );
}
