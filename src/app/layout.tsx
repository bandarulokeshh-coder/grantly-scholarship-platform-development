import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { GrantlyProvider } from "@/components/providers/GrantlyProvider";
import { themeInitScript } from "@/lib/theme-script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://grantly.vercel.app"),
  title: {
    default: "Grantly — Find the scholarships you actually qualify for",
    template: "%s · Grantly",
  },
  description:
    "Grantly turns scholarship hunting into four calm steps: find, check, apply, track. Built for Indian students from school to postgraduate.",
  applicationName: "Grantly",
  authors: [{ name: "Grantly" }],
  keywords: [
    "scholarships India",
    "scholarship finder",
    "education funding",
    "scholarship tracker",
    "student financial aid",
  ],
  openGraph: {
    type: "website",
    title: "Grantly — Find the scholarships you actually qualify for",
    description:
      "Match with Indian scholarships, see exactly what is missing, and track every application in one place.",
    siteName: "Grantly",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "Grantly — Find the scholarships you actually qualify for",
    description:
      "Match with Indian scholarships, see exactly what is missing, and track every application.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#080e1a" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script>{themeInitScript}</script>
      </head>
      <body className="min-h-dvh bg-canvas font-sans text-ink antialiased">
        <GrantlyProvider>
          <a
            href="#main-content"
            className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-primary"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 md:pb-16"
          >
            {children}
          </main>
          <SiteFooter />
          <MobileTabBar />
        </GrantlyProvider>
      </body>
    </html>
  );
}
