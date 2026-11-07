import { AlertTriangle, CalendarClock, CircleCheck } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type { BadgeTone } from "@/components/ui/Badge";
import { getUrgency } from "@/lib/dates";

const toneByLevel: Record<string, BadgeTone> = {
  critical: "danger",
  soon: "warning",
  open: "success",
  closed: "neutral",
};

/** Deadline urgency always pairs colour with an icon and text. */
export function UrgencyBadge({ deadline }: { deadline: string }) {
  const urgency = getUrgency(deadline);
  const Icon =
    urgency.level === "critical"
      ? AlertTriangle
      : urgency.level === "open"
        ? CircleCheck
        : CalendarClock;

  return (
    <Badge tone={toneByLevel[urgency.level] ?? "neutral"} icon={<Icon size={13} />}>
      {urgency.label}
    </Badge>
  );
}
