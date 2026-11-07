"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";

import { BrandMark } from "@/components/layout/BrandMark";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useGrantly } from "@/components/providers/GrantlyProvider";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const { profile, ready } = useGrantly();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <Link
          href="/"
          className="focus-ring flex items-center gap-2.5 rounded-xl py-1"
        >
          <BrandMark />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold tracking-tight">
              Grantly
            </span>
            <span className="hidden text-[11px] font-medium text-ink-faint sm:block">
              Scholarships made simple
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "focus-ring flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-primary-soft text-link"
                        : "text-ink-soft hover:bg-surface-muted hover:text-ink",
                    )}
                  >
                    <item.icon aria-hidden="true" size={17} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#profile-setup"
            className="focus-ring hidden min-h-11 min-w-[9.5rem] items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs font-semibold text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink sm:flex"
          >
            {ready && profile ? (
              <>
                <Check aria-hidden="true" size={15} className="text-success" />
                Profile ready
              </>
            ) : (
              "Complete profile"
            )}
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
