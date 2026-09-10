import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Huddle",
  description: "How Huddle protects your data, location, and campus event privacy.",
};

export default function PrivacyPage() {
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
          <span className="ins-mono text-xs text-ink-3">Privacy & Trust</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="border-b border-line pb-8 mb-8">
          <span className="ins-mono text-xs text-action font-semibold">Policy Statement</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink mt-2">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-ink-3">
            Last updated: August 2026 · College Park, MD
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-ink-2">
          <section className="p-6 rounded-sheet bg-sheet border border-line space-y-3">
            <h2 className="font-display text-xl font-bold text-ink">1. Zero-Trust Student Privacy</h2>
            <p>
              Huddle is designed specifically for college campuses. We do not sell your personal data, and we do not monetize student location histories. You can browse all campus events anonymously without creating an account or downloading an app.
            </p>
          </section>

          <section className="p-6 rounded-sheet bg-sheet border border-line space-y-3">
            <h2 className="font-display text-xl font-bold text-ink">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-ink">Account Information:</strong> When you sign up via Google or email, we receive your name and email address.
              </li>
              <li>
                <strong className="text-ink">RSVPs & Roster Privacy:</strong> When you RSVP to an event, your sensitive answers and private notes are stored in an encrypted, isolated roster subcollection accessible solely by the authorized event organizer.
              </li>
              <li>
                <strong className="text-ink">Location Data:</strong> Location queries are used ephemerally in your browser to center the map and display nearby events. We do not maintain a permanent location tracking log.
              </li>
              <li>
                <strong className="text-ink">Push Notification Tokens:</strong> Web push tokens (FCM) are stored securely and used exclusively for event reminders and attendee updates.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-sheet bg-sheet border border-line space-y-3">
            <h2 className="font-display text-xl font-bold text-ink">3. Analytics & Telemetry</h2>
            <p>
              We collect aggregate, non-personally identifiable conversion metrics (such as map views and category interactions) to measure platform health and improve event discovery. We do not log student PII in telemetry pipelines.
            </p>
          </section>

          <section className="p-6 rounded-sheet bg-sheet border border-line space-y-3">
            <h2 className="font-display text-xl font-bold text-ink">4. Data Deletion & Inquiries</h2>
            <p>
              You may request complete deletion of your account, event history, and associated roster entries at any time by contacting{" "}
              <a href="mailto:support@huddlemap.live" className="text-action underline font-medium">
                support@huddlemap.live
              </a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
