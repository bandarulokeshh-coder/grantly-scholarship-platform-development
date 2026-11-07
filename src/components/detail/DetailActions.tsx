"use client";

import { useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  CircleX,
  FilePenLine,
  Hourglass,
  Trophy,
} from "lucide-react";

import { useGrantly } from "@/components/providers/GrantlyProvider";
import { Badge } from "@/components/ui/Badge";
import type { BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { STATUS_LABELS } from "@/types";
import type { ApplicationStatus } from "@/types";

const statusTones: Record<ApplicationStatus, BadgeTone> = {
  saved: "neutral",
  preparing: "warning",
  applied: "primary",
  won: "success",
  waiting: "accent",
  "not-selected": "danger",
};

export interface DetailActionsProps {
  scholarshipId: string;
  scholarshipName: string;
}

export function DetailActions({
  scholarshipId,
  scholarshipName,
}: DetailActionsProps) {
  const { ready, statusOf, setStatus, toggleSave } = useGrantly();
  const [message, setMessage] = useState("");

  const status = statusOf(scholarshipId);
  const disabled = !ready;

  const changeStatus = (next: ApplicationStatus): void => {
    setStatus(scholarshipId, next);
    setMessage(`${scholarshipName}: saved as “${STATUS_LABELS[next]}”.`);
  };

  const handleSave = (): void => {
    toggleSave(scholarshipId);
    setMessage(
      status
        ? `${scholarshipName} removed from your list.`
        : `${scholarshipName} added to your saved list.`,
    );
  };

  const statusButton = (next: ApplicationStatus, label: string) => (
    <Button
      key={next}
      variant={status === next ? "primary" : "secondary"}
      size="sm"
      onClick={() => changeStatus(next)}
      disabled={disabled}
      aria-pressed={status === next}
      className="w-full justify-start"
    >
      {label}
    </Button>
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-faint">
          Your progress
        </h2>
        {status ? (
          <Badge tone={statusTones[status]}>{STATUS_LABELS[status]}</Badge>
        ) : (
          <Badge tone="neutral">Not saved</Badge>
        )}
      </div>

      <Button
        onClick={handleSave}
        disabled={disabled}
        variant={status ? "secondary" : "primary"}
        className="mt-3 w-full"
      >
        {status ? (
          <BookmarkCheck aria-hidden="true" size={17} />
        ) : (
          <Bookmark aria-hidden="true" size={17} />
        )}
        {status ? "Remove from my list" : "Save scholarship"}
      </Button>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold text-ink-soft">Move it forward</p>
        {statusButton("preparing", "Preparing")}
        {statusButton("applied", "Mark as applied")}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-ink-soft">Record the result</p>
        <div className="mt-2 grid gap-2">
          <Button
            variant={status === "won" ? "primary" : "secondary"}
            size="sm"
            onClick={() => changeStatus("won")}
            disabled={disabled}
            aria-pressed={status === "won"}
            className="justify-start"
          >
            <Trophy aria-hidden="true" size={15} />
            Won
          </Button>
          <Button
            variant={status === "waiting" ? "primary" : "secondary"}
            size="sm"
            onClick={() => changeStatus("waiting")}
            disabled={disabled}
            aria-pressed={status === "waiting"}
            className="justify-start"
          >
            <Hourglass aria-hidden="true" size={15} />
            Waiting
          </Button>
          <Button
            variant={status === "not-selected" ? "primary" : "secondary"}
            size="sm"
            onClick={() => changeStatus("not-selected")}
            disabled={disabled}
            aria-pressed={status === "not-selected"}
            className="justify-start"
          >
            <CircleX aria-hidden="true" size={15} />
            Not selected
          </Button>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs text-ink-faint">
        <FilePenLine aria-hidden="true" size={13} className="mt-0.5 shrink-0" />
        Statuses update your dashboard instantly.
      </p>

      <p aria-live="polite" className="sr-only">
        {message}
      </p>
    </div>
  );
}
