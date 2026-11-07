import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CircleCheck,
  GraduationCap,
  IndianRupee,
  Link2,
  MapPin,
  Users,
} from "lucide-react";

import { DetailActions } from "@/components/detail/DetailActions";
import { DocumentsChecklist } from "@/components/detail/DocumentsChecklist";
import { EligibilityPanel } from "@/components/detail/EligibilityPanel";
import { UrgencyBadge } from "@/components/discover/UrgencyBadge";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { getScholarshipById, scholarships } from "@/data/scholarships";
import { formatDate } from "@/lib/dates";
import { formatInr } from "@/lib/format";
import { isSafeHttpsUrl } from "@/lib/links";
import { CATEGORY_LABELS, LEVEL_LABELS } from "@/types";

interface ScholarshipPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return scholarships.map((scholarship) => ({ id: scholarship.id }));
}

export async function generateMetadata({
  params,
}: ScholarshipPageProps): Promise<Metadata> {
  const { id } = await params;
  const scholarship = getScholarshipById(id);

  if (!scholarship) {
    return { title: "Scholarship not found" };
  }

  return {
    title: scholarship.name,
    description: `${scholarship.summary} Sample data for demonstration.`.slice(0, 300),
    alternates: { canonical: `/scholarship/${scholarship.id}` },
  };
}

export default async function ScholarshipPage({ params }: ScholarshipPageProps) {
  const { id } = await params;
  const scholarship = getScholarshipById(id);

  if (!scholarship) {
    notFound();
  }

  const safeLink = isSafeHttpsUrl(scholarship.link) ? scholarship.link : null;
  const related = scholarships
    .filter(
      (item) =>
        item.id !== scholarship.id && item.providerType === scholarship.providerType,
    )
    .slice(0, 2);

  return (
    <div className="space-y-5">
      <Link
        href="/discover"
        className="focus-ring inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Back to discover
      </Link>

      <header className="surface-card p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="primary">{scholarship.providerType} provider</Badge>
          <UrgencyBadge deadline={scholarship.deadline} />
          <Badge tone="neutral">{scholarship.documents.length} documents</Badge>
        </div>

        <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
          {scholarship.name}
        </h1>

        <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
          <Building2 aria-hidden="true" size={15} className="shrink-0" />
          {scholarship.provider}
        </p>

        <p className="mt-3 max-w-3xl text-sm text-ink-soft text-balance-pretty sm:text-base">
          {scholarship.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {scholarship.level.map((level) => (
            <Badge key={level} tone="neutral" icon={<GraduationCap size={13} />}>
              {LEVEL_LABELS[level]}
            </Badge>
          ))}
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="min-w-0 space-y-5">
          <EligibilityPanel scholarship={scholarship} />

          <section aria-labelledby="glance-heading" className="surface-card p-5 sm:p-6">
            <h2 id="glance-heading" className="text-lg font-bold sm:text-xl">
              At a glance
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-faint">
                  <IndianRupee aria-hidden="true" size={13} />
                  Amount per year
                </dt>
                <dd className="mt-1 text-sm font-semibold">{formatInr(scholarship.amount)}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-faint">
                  <CalendarDays aria-hidden="true" size={13} />
                  Closing date
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {formatDate(scholarship.deadline)}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-faint">
                  <Users aria-hidden="true" size={13} />
                  Community categories
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {scholarship.category.map((category) => CATEGORY_LABELS[category]).join(", ")}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-faint">
                  <MapPin aria-hidden="true" size={13} />
                  Eligible states
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {scholarship.eligibility.states?.join(", ") ?? "All states"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">
                  Family income limit
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {scholarship.eligibility.maxIncome
                    ? `Up to ${formatInr(scholarship.eligibility.maxIncome)} per year`
                    : "No income limit"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">
                  Course requirement
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {scholarship.eligibility.courses?.join(", ") ?? "Any course"}
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="steps-heading" className="surface-card p-5 sm:p-6">
            <h2 id="steps-heading" className="text-lg font-bold sm:text-xl">
              How to apply
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Five steps, in the order that keeps your application safe.
            </p>
            <ol className="mt-4 space-y-3">
              {scholarship.steps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-link"
                  >
                    {index + 1}
                  </span>
                  <p className="text-sm text-ink-soft">
                    <span className="sr-only">Step {index + 1}: </span>
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <DocumentsChecklist documents={scholarship.documents} />

          {related.length > 0 ? (
            <section aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-lg font-bold sm:text-xl">
                Similar {scholarship.providerType.toLowerCase()} scholarships
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {related.map((item) => (
                  <li key={item.id} className="surface-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                      {item.providerType}
                    </p>
                    <h3 className="mt-1 text-sm font-bold">
                      <Link
                        href={`/scholarship/${item.id}`}
                        className="focus-ring rounded underline-offset-4 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-xs text-ink-soft">
                      {formatInr(item.amount)} per year · closes {formatDate(item.deadline)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside aria-label="Scholarship actions" className="space-y-4 lg:sticky lg:top-24">
          <div className="surface-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">
              Funding per year
            </p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums">
              {formatInr(scholarship.amount)}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <UrgencyBadge deadline={scholarship.deadline} />
              <span className="text-xs text-ink-soft">
                Closes {formatDate(scholarship.deadline)}
              </span>
            </div>

            <div className="mt-4 border-t border-line pt-4">
              {safeLink ? (
                <a
                  href={safeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("primary", "md", "w-full")}
                >
                  <Link2 aria-hidden="true" size={16} />
                  Official portal
                  <ArrowUpRight aria-hidden="true" size={15} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <p className="rounded-xl bg-surface-muted p-3 text-xs text-ink-soft">
                  The official link for this scheme is unavailable.
                </p>
              )}
              <p className="mt-2 flex items-start gap-1.5 text-xs text-ink-faint">
                <CircleCheck aria-hidden="true" size={13} className="mt-0.5 shrink-0" />
                Opens the official home page. Always verify the current
                notification there.
              </p>
            </div>

            <div className="mt-5 border-t border-line pt-4">
              <DetailActions
                scholarshipId={scholarship.id}
                scholarshipName={scholarship.name}
              />
            </div>
          </div>

          <p className="rounded-xl border border-line bg-surface-muted px-3 py-2 text-xs text-ink-soft">
            Sample data for demonstration. Amounts, deadlines and eligibility are
            illustrative.
          </p>
        </aside>
      </div>
    </div>
  );
}
