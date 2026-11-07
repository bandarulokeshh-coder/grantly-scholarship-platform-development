import type { Metadata } from "next";

import { CompareTool } from "@/components/compare/CompareTool";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Compare scholarships",
  description:
    "Place up to three scholarships side by side: amount, deadline, eligibility, documents and match score.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Bonus view"
        title="Compare scholarships"
        description="Two or three options, one screen. See where the money, deadlines and requirements actually differ."
      />
      <CompareTool />
    </div>
  );
}
