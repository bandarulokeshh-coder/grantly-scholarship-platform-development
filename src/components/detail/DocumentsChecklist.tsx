"use client";

import { FileCheck2 } from "lucide-react";

import { useGrantly } from "@/components/providers/GrantlyProvider";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

export function DocumentsChecklist({ documents }: { documents: string[] }) {
  const { ready, isDocumentDone, toggleDocument } = useGrantly();
  const doneCount = documents.filter((document) => isDocumentDone(document)).length;

  return (
    <section aria-labelledby="documents-heading" className="surface-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="documents-heading" className="text-lg font-bold sm:text-xl">
          Documents you will need
        </h2>
        <Badge tone={doneCount === documents.length ? "success" : "neutral"} icon={<FileCheck2 size={13} />}>
          {ready ? `${doneCount} of ${documents.length} ready` : "Loading"}
        </Badge>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Tick a document once and it stays ticked for every scholarship that needs
        it.
      </p>

      {!ready ? (
        <div className="mt-4 space-y-2">
          {documents.slice(0, 3).map((document) => (
            <Skeleton key={document} className="h-11 w-full" />
          ))}
        </div>
      ) : (
        <ul className="mt-4 space-y-1">
          {documents.map((document) => {
            const done = isDocumentDone(document);
            return (
              <li key={document}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface-muted">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleDocument(document)}
                    className="size-5 shrink-0 accent-[var(--primary)]"
                  />
                  <span className="flex flex-1 flex-wrap items-center gap-2 text-sm">
                    <span className={done ? "text-ink-soft line-through" : "text-ink"}>
                      {document}
                    </span>
                    {done ? <Badge tone="success">Ready</Badge> : null}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
