import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Huddle",
  description: "Terms and conditions for organizing and attending events on Huddle.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-action-tint selection:text-action">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-ink-3 hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-action" />
            Back to Huddle
          </Link>
          <span className="ins-mono text-xs text-ink-3">Terms of Service</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="border-b border-line pb-8 mb-8">
          <span className="ins-mono text-xs text-action font-semibold">User Agreement</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink mt-2">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-ink-3">
            Last updated: August 2026 · College Park, MD
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-ink-2">
          <section className="p-6 rounded-sheet bg-sheet border border-line space-y-3">
            <h2 className="font-display text-xl font-bold text-ink">1. Platform Purpose</h2>
            <p>
              Huddle provides a real-time discovery map for college campus events, student organization meetups, and pickup recreation. By accessing or using Huddle, you agree to comply with campus policies and these terms.
            </p>
          </section>

          <section className="p-6 rounded-sheet bg-sheet border border-line space-y-3">
            <h2 className="font-display text-xl font-bold text-ink">2. Community Standards & Conduct</h2>
            <p>
              Organizers and attendees are expected to foster safe, respectful spaces. The following are strictly prohibited:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Posting fraudulent, misleading, or commercial spam events.</li>
              <li>Harassment, discriminatory behavior, or activities violating university conduct guidelines.</li>
              <li>Unauthorized collection or distribution of attendee roster contact information.</li>
            </ul>
          </section>

          <section className="p-6 rounded-sheet bg-sheet border border-line space-y-3">
            <h2 className="font-display text-xl font-bold text-ink">3. Event Hosting & RSVPs</h2>
            <p>
              Organizers are solely responsible for event logistics, location safety, and accurate start times. Huddle is not liable for schedule changes, venue closures, or interpersonal interactions at gatherings.
            </p>
          </section>

          <section className="p-6 rounded-sheet bg-sheet border border-line space-y-3">
            <h2 className="font-display text-xl font-bold text-ink">4. Termination</h2>
            <p>
              We reserve the right to remove events or suspend user accounts that repeatedly violate community trust or create safety hazards for students.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
