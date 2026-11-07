"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Compass, RotateCcw, TriangleAlert } from "lucide-react";

import { Button, buttonClasses } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="surface-card mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-2xl bg-warning-soft text-warning"
      >
        <TriangleAlert size={26} />
      </span>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">
        Something went wrong
      </p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 text-2xl font-extrabold sm:text-3xl"
      >
        Grantly hit an unexpected bump
      </h1>
      <p className="mt-2 max-w-md text-sm text-ink-soft text-balance-pretty">
        Your saved scholarships and document ticks stay in this browser. Try the
        page again, or head to Discover while we recover.
      </p>
      {error.digest ? (
        <p className="mt-3 text-xs text-ink-faint">
          Reference code: <span className="font-mono">{error.digest}</span>
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={reset}>
          <RotateCcw aria-hidden="true" size={16} />
          Try again
        </Button>
        <Link href="/discover" className={buttonClasses("secondary", "md")}>
          <Compass aria-hidden="true" size={16} />
          Go to Discover
        </Link>
      </div>
    </div>
  );
}
