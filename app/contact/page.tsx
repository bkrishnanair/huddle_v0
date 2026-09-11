import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Huddle",
  description: "Get in touch with the Huddle team for support, feedback, or campus partnerships.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0B101B] text-slate-50 selection:bg-primary/20 selection:text-primary">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B101B]/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
            Back to Huddle
          </Link>
          <span className="ins-mono text-xs text-slate-500">Help & Support</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="border-b border-white/10 pb-8 mb-8">
          <span className="ins-mono text-xs text-primary font-semibold">Get In Touch</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-50 mt-2">
            Contact Support
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Have questions, feedback, or need help claiming an event? We're here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/50 backdrop-blur-md border border-white/10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-white/10">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl font-bold text-slate-50">Email Support</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                For general support inquiries, bug reports, and account questions:
              </p>
            </div>
            <a
              href="mailto:support@huddlemap.live"
              className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              support@huddlemap.live →
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 backdrop-blur-md border border-white/10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-live-tint text-live flex items-center justify-center border border-white/10">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl font-bold text-slate-50">Campus Clubs & Orgs</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
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

        <div className="mt-8 p-6 rounded-3xl bg-slate-800/50 border border-white/10 flex items-center gap-4">
          <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
          <p className="text-xs text-slate-400">
            Huddle Map, LLC · University of Maryland, College Park, MD 20742
          </p>
        </div>
      </main>
    </div>
  );
}
