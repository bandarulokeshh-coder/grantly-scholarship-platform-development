import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-lg font-extrabold tracking-tight">Grantly</p>
          <p className="mt-2 max-w-sm text-sm text-ink-soft text-balance-pretty">
            Find the scholarships you actually qualify for, then keep every
            deadline, document and result in one calm place.
          </p>
          <p className="mt-4 rounded-xl border border-line bg-surface-muted px-3 py-2 text-xs text-ink-soft">
            All scholarships shown here are sample data for demonstration. Always
            confirm details on the official portal before applying.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-ink-faint">
            Journey
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <Link href="/discover" className="focus-ring rounded text-ink-soft hover:text-ink">
                Discover
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="focus-ring rounded text-ink-soft hover:text-ink">
                My dashboard
              </Link>
            </li>
            <li>
              <Link href="/documents" className="focus-ring rounded text-ink-soft hover:text-ink">
                Documents
              </Link>
            </li>
            <li>
              <Link href="/#profile-setup" className="focus-ring rounded text-ink-soft hover:text-ink">
                Your profile
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-ink-faint">
            Official portals
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <a
                href="https://www.scholarships.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 rounded text-ink-soft hover:text-ink"
              >
                National Scholarship Portal
                <ExternalLink aria-hidden="true" size={13} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.ugc.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 rounded text-ink-soft hover:text-ink"
              >
                University Grants Commission
                <ExternalLink aria-hidden="true" size={13} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.aicte-india.org"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 rounded text-ink-soft hover:text-ink"
              >
                AICTE
                <ExternalLink aria-hidden="true" size={13} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 pb-24 pt-4 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6 md:pb-4">
          <p>Grantly is an independent guide. It is not an official government portal.</p>
          <p>Built for THE OUTPOST · Frontend Arena</p>
        </div>
      </div>
    </footer>
  );
}
