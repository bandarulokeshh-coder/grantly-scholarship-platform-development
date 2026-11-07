import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";

import { DiscoverExplorer } from "@/components/discover/DiscoverExplorer";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonClasses } from "@/components/ui/Button";
import { scholarships } from "@/data/scholarships";

export const metadata: Metadata = {
  title: "Discover scholarships",
  description:
    "Search and filter 25 sample Indian scholarships by amount, deadline, category, study level and provider type. Sorted by best match for your profile.",
  alternates: { canonical: "/discover" },
};

export default function DiscoverPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Step 1 · Find"
        title="Discover your scholarships"
        description="Every card shows the amount, the deadline in plain days, and why it does or does not fit your profile."
        actions={
          <Link href="/compare" className={buttonClasses("secondary", "sm")}>
            <ArrowLeftRight aria-hidden="true" size={16} />
            Compare
          </Link>
        }
      />
      <DiscoverExplorer scholarships={scholarships} />
    </div>
  );
}
