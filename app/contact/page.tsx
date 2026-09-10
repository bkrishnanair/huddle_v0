import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Huddle",
  description: "Get in touch with the Huddle team for support, feedback, or campus partnerships.",
};

export default function ContactPage() {
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
          <span className="ins-mono text-xs text-ink-3">Help & Support</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="border-b border-line pb-8 mb-8">
          <span className="ins-mono text-xs text-action font-semibold">Get In Touch</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink mt-2">
            Contact Support
          </h1>
          <p className="mt-3 text-sm text-ink-3">
            Have questions, feedback, or need help claiming an event? We're here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-sheet bg-sheet border border-line flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-control bg-action-tint text-action flex items-center justify-center border border-line">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl font-bold text-ink">Email Support</h2>
              <p className="text-xs text-ink-2 leading-relaxed">
                For general support inquiries, bug reports, and account questions:
              </p>
            </div>
            <a
              href="mailto:support@huddlemap.live"
              className="mt-6 inline-flex items-center text-sm font-semibold text-action hover:underline"
            >
              support@huddlemap.live →
            </a>
          </div>

          <div className="p-6 rounded-sheet bg-sheet border border-line flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-control bg-live-tint text-live flex items-center justify-center border border-line">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl font-bold text-ink">Campus Clubs & Orgs</h2>
              <p className="text-xs text-ink-2 leading-relaxed">
                Want to partner with Huddle or verify your student organization account?
              </p>
            </div>
            <a
              href="mailto:clubs@huddlemap.live"
              className="mt-6 inline-flex items-center text-sm font-semibold text-live hover:underline"
            >
              clubs@huddlemap.live →
            </a>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-sheet bg-surface border border-line flex items-center gap-4">
          <MapPin className="w-5 h-5 text-ink-3 shrink-0" />
          <p className="text-xs text-ink-2">
            Huddle Map, LLC · University of Maryland, College Park, MD 20742
          </p>
        </div>
      </main>
    </div>
  );
}
