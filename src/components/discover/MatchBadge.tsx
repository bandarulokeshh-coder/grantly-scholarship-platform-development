import { Badge } from "@/components/ui/Badge";
import type { BadgeTone } from "@/components/ui/Badge";
import { matchLabel } from "@/lib/match";

function toneFor(score: number): BadgeTone {
  if (score >= 85) {
    return "accent";
  }
  if (score >= 60) {
    return "primary";
  }
  if (score >= 40) {
    return "warning";
  }
  return "neutral";
}

export function MatchBadge({ score }: { score: number | null }) {
  if (score === null) {
    return <Badge tone="neutral">Match locked</Badge>;
  }

  return (
    <Badge tone={toneFor(score)}>
      <span className="tabular-nums">{score}%</span>
      <span className="sr-only"> match — {matchLabel(score)}</span>
      <span aria-hidden="true">match</span>
    </Badge>
  );
}
