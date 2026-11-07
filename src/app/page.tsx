import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardList,
  Compass,
  FileCheck2,
  LockKeyhole,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { ProfileSetup } from "@/components/onboarding/ProfileSetup";
import { ScholarshipCard } from "@/components/discover/ScholarshipCard";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { scholarships, scholarshipCount } from "@/data/scholarships";
import { formatDate } from "@/lib/dates";
import { formatInrCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "Grantly — Find the scholarships you actually qualify for",
  description:
    "A calmer way to fund your education: build a one-minute profile, see matched Indian scholarships with plain-language reasons, and track every application.",
  alternates: { canonical: "/" },
};

const journey = [
  {
    icon: Compass,
    title: "Find",
    description:
      "Filter by amount, deadline, category and course to see scholarships that fit your life.",
  },
  {
    icon: FileCheck2,
    title: "Check",
    description:
      "Every card explains why it matches and exactly which criterion is missing.",
  },
  {
    icon: Send,
    title: "Apply",
    description:
      "Follow plain-language steps and tick off documents once, reused everywhere.",
  },
  {
    icon: TrendingUp,
    title: "Track",
    description:
      "Move each application from saved to result. Never miss a deadline again.",
  },
];

const closingSoon = [...scholarships]
  .sort((a, b) => a.deadline.localeCompare(b.deadline))
  .slice(0, 3);

export default function HomePage() {
  return (
    <div className="space-y-14 sm:space-y-20">
      <section
        aria-labelledby="hero-heading"
        className="grid items-center gap-8 pt-2 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12"
      >
        <div>
          <Badge tone="primary" icon={<Sparkles size={13} />}>
            Built for Indian students, Class 9 to postgraduate
          </Badge>
          <h1
            id="hero-heading"
            className="mt-4 text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-5xl"
          >
            Find the scholarships you actually qualify for.
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-soft text-balance-pretty sm:text-lg">
            Scholarship hunting usually means twenty tabs and a lot of guessing.
            Grantly asks four short questions, explains every match in plain
            language, and keeps your applications in one calm place.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/discover" className={buttonClasses("primary", "md")}>
              Find my scholarships
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link
              href="#profile-setup"
              className={buttonClasses("secondary", "md")}
            >
              Build my profile
            </Link>
          </div>

          <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-ink-soft">
            <li className="flex items-center gap-1.5">
              <LockKeyhole aria-hidden="true" size={14} className="text-success" />
              No account needed
            </li>
            <li className="flex items-center gap-1.5">
              <Check aria-hidden="true" size={14} className="text-success" />
              Saved in your browser
            </li>
            <li className="flex items-center gap-1.5">
              <Wallet aria-hidden="true" size={14} className="text-success" />
              Completely free
            </li>
          </ul>
        </div>

        <aside
          aria-labelledby="preview-heading"
          className="surface-card relative overflow-hidden p-5 sm:p-6"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary-soft blur-2xl"
          />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">
                Example match
              </p>
              <h2 id="preview-heading" className="mt-1 text-base font-bold">
                How a match looks
              </h2>
            </div>
            <div className="relative">
              <ProgressRing value={88} size={68} strokeWidth={8} />
              <span className="sr-only">Example match score: 88 percent</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-line bg-canvas p-3.5">
            <p className="text-sm font-bold">AICTE Pragati Scholarship for Girls</p>
            <p className="mt-0.5 text-xs text-ink-soft">
              AICTE · {formatInrCompact(50000)} per year · closes{" "}
              {formatDate(scholarships[4].deadline)}
            </p>
            <ul className="mt-3 space-y-1.5 text-xs">
              <li className="flex items-center gap-2 text-ink-soft">
                <Check aria-hidden="true" size={13} className="text-success" />
                Your study level is supported
              </li>
              <li className="flex items-center gap-2 text-ink-soft">
                <Check aria-hidden="true" size={13} className="text-success" />
                Family income is within the limit
              </li>
              <li className="flex items-start gap-2 text-ink-soft">
                <ClipboardList aria-hidden="true" size={13} className="mt-0.5 text-warning" />
                Still needed: income certificate
              </li>
            </ul>
          </div>

          <p className="mt-3 text-xs text-ink-faint">
            Illustrative example built from the sample dataset. Your real matches
            appear after the four profile questions.
          </p>
        </aside>
      </section>

      <section aria-labelledby="how-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">
              How it works
            </p>
            <h2 id="how-heading" className="mt-1 text-2xl font-extrabold sm:text-3xl">
              Four steps, start to finish
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-soft">
            The same four steps you already follow — just organised, so nothing
            slips through.
          </p>
        </div>

        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((item, index) => (
            <li key={item.title} className="surface-card p-5">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-link">
                  <item.icon aria-hidden="true" size={20} />
                </span>
                <span className="text-xs font-bold tabular-nums text-ink-faint">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold">{item.title}</h3>
              <p className="mt-1 text-sm text-ink-soft text-balance-pretty">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section id="profile-setup" aria-label="Set up your profile" className="scroll-mt-24">
        <div className="mb-4 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">
            One minute setup
          </p>
          <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
            Tell Grantly about you
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            No documents, no uploads. Four answers are enough to rank every
            scholarship by fit.
          </p>
        </div>
        <ProfileSetup />
      </section>

      <section aria-labelledby="closing-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">
              Closing soon
            </p>
            <h2 id="closing-heading" className="mt-1 text-2xl font-extrabold sm:text-3xl">
              Deadlines in the next few weeks
            </h2>
          </div>
          <Link href="/discover" className={buttonClasses("secondary", "sm")}>
            <Search aria-hidden="true" size={15} />
            Browse all {scholarshipCount}
          </Link>
        </div>
        <ul className="mt-5 grid gap-4 lg:grid-cols-3">
          {closingSoon.map((scholarship) => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="cta-heading"
        className="surface-card flex flex-col items-start gap-4 bg-primary p-6 text-on-primary sm:flex-row sm:items-center sm:justify-between sm:p-8"
      >
        <div>
          <h2 id="cta-heading" className="text-xl font-extrabold text-on-primary sm:text-2xl">
            Your funding story starts with one search
          </h2>
          <p className="mt-1 max-w-lg text-sm text-white/85">
            Browse {scholarshipCount} sample scholarships, see what fits, and keep
            every deadline in view.
          </p>
        </div>
        <Link
          href="/discover"
          className={buttonClasses(
            "secondary",
            "md",
            "shrink-0 border-transparent bg-white text-[#1f1a63] hover:bg-white/90",
          )}
        >
          Start discovering
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </section>
    </div>
  );
}
