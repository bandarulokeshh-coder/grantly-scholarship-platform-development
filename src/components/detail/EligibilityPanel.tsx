"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleHelp, CircleX, CheckCircle2, Info, Lock } from "lucide-react";

import { useGrantly } from "@/components/providers/GrantlyProvider";
import { Badge } from "@/components/ui/Badge";
import type { BadgeTone } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Skeleton } from "@/components/ui/Skeleton";
import { matchScore } from "@/lib/match";
import type { CriterionStatus } from "@/lib/match";
import type { Scholarship } from "@/types";

const statusMeta: Record<
  CriterionStatus,
  { label: string; tone: BadgeTone; Icon: typeof CheckCircle2 }
> = {
  met: { label: "Met", tone: "success", Icon: CheckCircle2 },
  "not-met": { label: "Not met", tone: "danger", Icon: CircleX },
  unknown: { label: "Need info", tone: "warning", Icon: CircleHelp },
};

export function EligibilityPanel({ scholarship }: { scholarship: Scholarship }) {
  const { ready, profile } = useGrantly();
  const [simpleMode, setSimpleMode] = useState(false);
  const match = matchScore(profile, scholarship);

  if (!ready) {
    return (
      <section aria-labelledby="eligibility-heading" className="surface-card p-5">
        <h2 id="eligibility-heading" className="text-lg font-bold">
          Am I eligible?
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Loading your saved profile…
        </p>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="eligibility-heading" className="surface-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="eligibility-heading" className="text-lg font-bold sm:text-xl">
            Am I eligible?
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Checked against your profile, one criterion at a time.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSimpleMode((current) => !current)}
          aria-pressed={simpleMode}
          className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-3 text-xs font-bold text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
        >
          <Info aria-hidden="true" size={14} />
          Simple mode: {simpleMode ? "on" : "off"}
        </button>
      </div>

      {match.score === null ? (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-line bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm text-ink">
            <Lock aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-ink-faint" />
            Complete your profile to see your match. Until then every criterion
            shows as “need info”.
          </p>
          <Link
            href="/#profile-setup"
            className="focus-ring rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-on-primary hover:bg-primary-hover"
          >
            Add my details
          </Link>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-4 rounded-xl bg-surface-muted p-4">
          <ProgressRing value={match.score} size={84} strokeWidth={9} />
          <div className="min-w-0">
            <p className="text-sm font-bold sm:text-base">
              {match.score}% match · {match.metCount} of {match.evaluatedCount}{" "}
              criteria met
            </p>
            <p className="mt-1 text-sm text-ink-soft text-balance-pretty">
              {simpleMode ? match.simpleSummary : match.summary}
            </p>
          </div>
        </div>
      )}

      {simpleMode ? (
        <ul className="mt-4 space-y-2">
          {match.criteria.map((item) => {
            const meta = statusMeta[item.status];
            return (
              <li key={item.key} className="flex items-start gap-2 text-sm">
                <meta.Icon
                  aria-hidden="true"
                  size={16}
                  className={
                    item.status === "met"
                      ? "mt-0.5 shrink-0 text-success"
                      : item.status === "not-met"
                        ? "mt-0.5 shrink-0 text-danger"
                        : "mt-0.5 shrink-0 text-warning"
                  }
                />
                <span>
                  {item.simple}
                  <span className="sr-only"> ({meta.label})</span>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="mt-4">
          {match.criteria.map((item) => {
            const meta = statusMeta[item.status];
            return (
              <li
                key={item.key}
                className="flex gap-3 border-t border-line py-3 first:border-t-0 first:pt-0"
              >
                <meta.Icon
                  aria-hidden="true"
                  size={18}
                  className={
                    item.status === "met"
                      ? "mt-0.5 shrink-0 text-success"
                      : item.status === "not-met"
                        ? "mt-0.5 shrink-0 text-danger"
                        : "mt-0.5 shrink-0 text-warning"
                  }
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-ink-soft">{item.requirement}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">{item.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-4 text-xs text-ink-faint">
        Grantly checks the criteria in this sample dataset. Always read the
        official notification before you pay any fee or upload documents.
      </p>
    </section>
  );
}
