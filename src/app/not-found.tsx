import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Home, SearchX } from "lucide-react";

import { buttonClasses } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist. Head back to Grantly to find scholarships.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="surface-card mx-auto max-w-2xl px-5 py-10 text-center sm:px-8 sm:py-14">
      <span
        aria-hidden="true"
        className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-link"
      >
        <SearchX size={26} />
      </span>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">
        404 · Page not found
      </p>
      <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
        We could not find that page
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft text-balance-pretty">
        The link may be old, or the scholarship may have moved. Your saved list is
        safe — start again from Discover or your dashboard.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/discover" className={buttonClasses("primary", "md")}>
          <Compass aria-hidden="true" size={17} />
          Discover scholarships
        </Link>
        <Link href="/" className={buttonClasses("secondary", "md")}>
          <Home aria-hidden="true" size={17} />
          Go home
        </Link>
      </div>
    </div>
  );
}
