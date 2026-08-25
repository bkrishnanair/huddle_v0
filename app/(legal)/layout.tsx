import type React from "react";
import Link from "next/link";

/**
 * Shared chrome for the legal and contact pages.
 *
 * These are the only routes outside the marketing landing page that a visitor
 * reaches without an account, so they render on the Instrument paper ground
 * rather than the legacy dark app shell. They sit in their own route group so
 * they do not inherit app/(app)/layout.tsx, which mounts the auth gate, the
 * bottom navigation and the map providers — none of which belong on a policy
 * page.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper font-body text-ink">
      <header className="border-b border-line bg-paper">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-4 px-6"
        >
          <Link
            href="/"
            className="-my-2 rounded-chip py-2 font-display text-[22px] font-bold leading-6 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
          >
            Huddle
          </Link>
          <Link
            href="/map"
            className="inline-flex h-9 items-center rounded-chip bg-action px-4 text-sm font-semibold text-white transition-colors duration-micro ease-ins hover:bg-action-hover"
          >
            Open the map
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-[720px] px-6 py-14 sm:py-16">{children}</main>

      <footer className="border-t border-line bg-paper">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-6 py-6">
          <p className="text-[13px] leading-5 text-ink-3">
            Huddle Map, LLC · College Park, MD
          </p>
          <nav aria-label="Footer" className="flex gap-5">
            {[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="-my-2 rounded-chip py-2 text-[13px] leading-5 text-ink-2 transition-colors duration-micro ease-ins hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
