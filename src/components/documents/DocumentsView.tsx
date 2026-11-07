"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, FileCheck2, FolderOpen, RotateCcw } from "lucide-react";

import { useGrantly } from "@/components/providers/GrantlyProvider";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Skeleton } from "@/components/ui/Skeleton";
import { getScholarshipById } from "@/data/scholarships";
import { formatDate } from "@/lib/dates";
import { pluralise } from "@/lib/format";
import type { Scholarship } from "@/types";

interface DocumentGroup {
  name: string;
  scholarships: Scholarship[];
}

export function DocumentsView() {
  const {
    ready,
    tracker,
    isDocumentDone,
    toggleDocument,
    resetDocuments,
  } = useGrantly();
  const [message, setMessage] = useState("");

  const trackedScholarships = useMemo<Scholarship[]>(() => {
    return Object.keys(tracker)
      .map((id) => getScholarshipById(id))
      .filter((item): item is Scholarship => item !== undefined)
      .sort((a, b) => a.deadline.localeCompare(b.deadline));
  }, [tracker]);

  const groups = useMemo<DocumentGroup[]>(() => {
    const map = new Map<string, Scholarship[]>();
    trackedScholarships.forEach((scholarship) => {
      scholarship.documents.forEach((document) => {
        const existing = map.get(document) ?? [];
        if (!existing.some((item) => item.id === scholarship.id)) {
          existing.push(scholarship);
        }
        map.set(document, existing);
      });
    });
    return Array.from(map.entries())
      .map(([name, scholarshipsForDocument]) => ({
        name,
        scholarships: scholarshipsForDocument,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [trackedScholarships]);

  const readyCount = groups.filter((group) => isDocumentDone(group.name)).length;
  const percent = groups.length === 0 ? 0 : (readyCount / groups.length) * 100;

  if (!ready) {
    return (
      <div className="space-y-4" aria-busy="true">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div>
        <h2 className="sr-only">Your document checklist</h2>
        <EmptyState
        icon={<FolderOpen size={22} />}
        title="No documents to collect yet"
        description="Save a scholarship first. Grantly then combines every required document into one checklist you only tick once."
        action={
          <Link href="/discover" className={buttonClasses("primary", "md")}>
            Find scholarships
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        }
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p aria-live="polite" className="sr-only">
        {message}
      </p>

      <section
        aria-labelledby="progress-heading"
        className="surface-card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6"
      >
        <ProgressRing value={percent} size={120} strokeWidth={11} />
        <div className="min-w-0 flex-1">
          <h2 id="progress-heading" className="text-xl font-extrabold sm:text-2xl">
            {readyCount} of {groups.length} documents ready
          </h2>
          <p className="mt-1 text-sm text-ink-soft text-balance-pretty">
            {percent === 100
              ? "Everything is collected. You can submit any application without a last-minute scramble."
              : `Across ${pluralise(trackedScholarships.length, "saved scholarship")}, ${groups.length - readyCount} document${groups.length - readyCount === 1 ? "" : "s"} still need${groups.length - readyCount === 1 ? "s" : ""} collecting.`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="success" icon={<FileCheck2 size={13} />}>
              {readyCount} ready
            </Badge>
            <Badge tone="warning">{groups.length - readyCount} pending</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                resetDocuments();
                setMessage("Document ticks cleared.");
              }}
            >
              <RotateCcw aria-hidden="true" size={14} />
              Clear ticks
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="documents-list-heading">
        <h2 id="documents-list-heading" className="text-xl font-extrabold sm:text-2xl">
          Your combined checklist
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Tick each document as you collect it. One tick counts for every
          scholarship below.
        </p>

        <ul className="mt-4 space-y-2">
          {groups.map((group) => {
            const done = isDocumentDone(group.name);
            return (
              <li key={group.name} className="surface-card p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <input
                    id={`doc-${group.name}`}
                    type="checkbox"
                    checked={done}
                    onChange={() => {
                      toggleDocument(group.name);
                      setMessage(
                        done
                          ? `${group.name} marked as pending.`
                          : `${group.name} marked as ready.`,
                      );
                    }}
                    className="mt-1 size-5 shrink-0 accent-[var(--primary)]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <label
                        htmlFor={`doc-${group.name}`}
                        className="cursor-pointer text-sm font-semibold"
                      >
                        {group.name}
                      </label>
                      {done ? (
                        <Badge tone="success">Ready</Badge>
                      ) : (
                        <Badge tone="warning">Pending</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-ink-soft">
                      Unlocks {pluralise(group.scholarships.length, "scholarship")}:
                    </p>
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {group.scholarships.map((scholarship) => (
                        <li key={scholarship.id}>
                          <Link
                            href={`/scholarship/${scholarship.id}`}
                            className="focus-ring inline-flex items-center rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-ink-soft hover:text-ink"
                          >
                            {scholarship.name}
                            <span className="sr-only">
                              {" "}
                              — closes {formatDate(scholarship.deadline)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="tips-heading"
        className="surface-card border-primary/25 bg-primary-soft/40 p-5"
      >
        <h2 id="tips-heading" className="text-base font-bold">
          Three habits that save weeks
        </h2>
        <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
          <li>
            Scan certificates once, name them clearly, and keep a folder on your
            phone.
          </li>
          <li>
            Income and caste certificates often take 10–15 days, so start those
            first.
          </li>
          <li>
            Check that your name matches exactly on Aadhaar, bank passbook and
            marksheet.
          </li>
        </ul>
      </section>
    </div>
  );
}
