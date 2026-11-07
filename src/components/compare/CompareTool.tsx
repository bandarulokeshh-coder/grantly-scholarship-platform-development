"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Lock, Trophy } from "lucide-react";

import { MatchBadge } from "@/components/discover/MatchBadge";
import { UrgencyBadge } from "@/components/discover/UrgencyBadge";
import { useGrantly } from "@/components/providers/GrantlyProvider";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { scholarships } from "@/data/scholarships";
import { formatDate } from "@/lib/dates";
import { formatInr } from "@/lib/format";
import { matchScore } from "@/lib/match";
import { CATEGORY_LABELS, LEVEL_LABELS } from "@/types";
import type { Scholarship } from "@/types";

interface ComparisonFact {
  label: string;
  value: string;
}

function factsFor(scholarship: Scholarship): ComparisonFact[] {
  return [
    {
      label: "Deadline",
      value: formatDate(scholarship.deadline),
    },
    { label: "Provider", value: scholarship.provider },
    { label: "Provider type", value: scholarship.providerType },
    {
      label: "Study levels",
      value: scholarship.level.map((level) => LEVEL_LABELS[level]).join(", "),
    },
    {
      label: "Categories",
      value: scholarship.category
        .map((category) => CATEGORY_LABELS[category])
        .join(", "),
    },
    {
      label: "Family income",
      value: scholarship.eligibility.maxIncome
        ? `Up to ${formatInr(scholarship.eligibility.maxIncome)}`
        : "No income limit",
    },
    {
      label: "States",
      value: scholarship.eligibility.states?.join(", ") ?? "All states",
    },
    {
      label: "Courses",
      value: scholarship.eligibility.courses?.join(", ") ?? "Any course",
    },
    {
      label: "Documents",
      value: `${scholarship.documents.length} required`,
    },
  ];
}

const initialSelection = [
  scholarships[0]?.id ?? "",
  scholarships[1]?.id ?? "",
  scholarships[2]?.id ?? "",
];

export function CompareTool() {
  const { ready, profile } = useGrantly();
  const [selection, setSelection] = useState<string[]>(initialSelection);

  const chosen = useMemo(
    () =>
      selection
        .map((id) => scholarships.find((item) => item.id === id))
        .filter((item): item is Scholarship => item !== undefined),
    [selection],
  );

  const scored = chosen.map((scholarship) => ({
    scholarship,
    match: matchScore(profile, scholarship),
  }));

  const bestScore = scored.reduce<number | null>((best, item) => {
    if (item.match.score === null) {
      return best;
    }
    return best === null ? item.match.score : Math.max(best, item.match.score);
  }, null);

  const updateSelection = (index: number, id: string): void => {
    setSelection((current) =>
      current.map((value, position) => (position === index ? id : value)),
    );
  };

  return (
    <div className="space-y-5">
      <section aria-labelledby="compare-picker-heading" className="surface-card p-4 sm:p-5">
        <h2 id="compare-picker-heading" className="text-base font-bold">
          Choose up to three scholarships
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          The comparison updates as you change a selection.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {selection.map((value, index) => (
            <div key={index}>
              <label
                htmlFor={`compare-${index}`}
                className="mb-1.5 block text-sm font-semibold"
              >
                Scholarship {index + 1}
              </label>
              <select
                id={`compare-${index}`}
                value={value}
                onChange={(event) => updateSelection(index, event.target.value)}
                className="min-h-11 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink transition-colors hover:border-primary/50 focus-ring"
              >
                {scholarships.map((scholarship) => {
                  const takenElsewhere = selection.some(
                    (selected, position) =>
                      position !== index && selected === scholarship.id,
                  );
                  return (
                    <option
                      key={scholarship.id}
                      value={scholarship.id}
                      disabled={takenElsewhere}
                    >
                      {scholarship.name}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}
        </div>
        <p role="status" aria-live="polite" className="mt-3 text-xs text-ink-faint">
          Comparing {chosen.length} scholarships.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {scored.map(({ scholarship, match }) => {
          const isBest =
            ready &&
            profile !== null &&
            match.score !== null &&
            bestScore !== null &&
            match.score === bestScore;
          return (
            <article
              key={scholarship.id}
              className="surface-card flex flex-col p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone="neutral">{scholarship.providerType}</Badge>
                <MatchBadge score={match.score} />
                {isBest ? (
                  <Badge tone="success" icon={<Trophy size={13} />}>
                    Best match here
                  </Badge>
                ) : null}
              </div>

              <h2 className="mt-2 text-base font-bold leading-snug">
                <Link
                  href={`/scholarship/${scholarship.id}`}
                  className="focus-ring rounded underline-offset-4 hover:underline"
                >
                  {scholarship.name}
                </Link>
              </h2>

              <p className="mt-2 text-2xl font-extrabold tabular-nums">
                {formatInr(scholarship.amount)}
                <span className="text-xs font-semibold text-ink-faint"> / year</span>
              </p>
              <div className="mt-2">
                <UrgencyBadge deadline={scholarship.deadline} />
              </div>

              {match.score === null ? (
                <p className="mt-3 flex items-start gap-1.5 text-xs text-ink-soft">
                  <Lock aria-hidden="true" size={13} className="mt-0.5 shrink-0" />
                  Complete your profile to see this match.
                </p>
              ) : (
                <p className="mt-3 text-xs text-ink-soft text-balance-pretty">
                  {match.summary}
                </p>
              )}

              <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-xs">
                {factsFor(scholarship).map((fact) => (
                  <div key={fact.label} className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-ink-faint">{fact.label}:</dt>
                    <dd className="min-w-0 flex-1 break-words text-ink-soft">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4">
                <Link
                  href={`/scholarship/${scholarship.id}`}
                  className={buttonClasses("secondary", "sm", "w-full justify-center")}
                >
                  Full details
                  <ArrowRight aria-hidden="true" size={15} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
