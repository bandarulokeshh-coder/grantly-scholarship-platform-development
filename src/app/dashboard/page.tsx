import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";

import { DashboardView } from "@/components/dashboard/DashboardView";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonClasses } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "My dashboard",
  description:
    "Move scholarships from saved to preparing, applied and result. See what is due this week and your total potential funding.",
  alternates: { canonical: "/dashboard" },
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Steps 3 & 4 · Apply and track"
        title="My dashboard"
        description="Everything you saved, what is due soon, and what to do next. Statuses update instantly in this browser."
        actions={
          <Link href="/discover" className={buttonClasses("secondary", "sm")}>
            <Compass aria-hidden="true" size={16} />
            Find more
          </Link>
        }
      />
      <DashboardView />
    </div>
  );
}
