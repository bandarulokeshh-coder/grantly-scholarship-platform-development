import type { Metadata } from "next";

import { DocumentsView } from "@/components/documents/DocumentsView";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Documents",
  description:
    "One combined document checklist across every saved scholarship. Tick a document once and reuse it everywhere.",
  alternates: { canonical: "/documents" },
};

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Step 3 · Prepare"
        title="Your documents, once"
        description="Collecting paperwork is the slowest part of any application. Grantly merges every saved scholarship into a single checklist."
      />
      <DocumentsView />
    </div>
  );
}
