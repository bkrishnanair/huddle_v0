"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackFunnelEvent } from "@/lib/analytics";

/**
 * Marketing landing page — the "Instrument" surface (design block 7).
 *
 * This is the only route that uses the display face (Bricolage Grotesque, via
 * --font-display). Everything else here is the shared Instrument token set from
 * app/globals.css: paper ground, ink text, blue for action, green for liveness.
 *
 * Two rules this page exists to respect:
 *   1. Blue (`action`) is anything you can press. Green (`live`) is a fact about
 *      the world and is never a control.
 *   2. All numerals are mono, uppercase, tabular — see the `.ins-mono` utility.
 */

interface LandingPageProps {
  onGetStarted: () => void;
  isAuthenticated?: boolean;
}

/* ---------------------------------------------------------------- wordmark */

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-[22px] leading-6 font-bold text-ink ${className}`}
    >
      Huddle
    </span>
  );
}

/* ------------------------------------------------------------- hero visual */

/**
 * Abstract campus map in Instrument tones. Deliberately not a screenshot: it
 * shows the pin language (live ring, upcoming dot, cluster) at a glance without
 * claiming to be a literal capture of the app. Self-contained inline SVG — the
 * previous version pulled a noise texture from a third-party domain, which put
 * someone else's uptime in front of our hero.
 */
function CampusMapVisual() {
  const venues = [
    { x: 30, y: 44, label: "Flower Power Hour", live: true },
    { x: 62, y: 66, label: "Mario Kart Tournament", live: true },
    { x: 24, y: 28, label: "Softball v. Rutgers", live: false },
    { x: 71, y: 30, label: "EnTERPreneur Conf.", live: false },
    { x: 44, y: 78, label: "Open Mic Night", live: false },
    { x: 82, y: 56, label: "Arboretum Walk", live: false },
  ];

  return (
    <div
      className="relative w-full overflow-hidden rounded-sheet border border-line bg-surface shadow-raised"
      style={{ aspectRatio: "5 / 4" }}
    >
      <svg
        viewBox="0 0 500 400"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Stylised map of the University of Maryland campus showing live and upcoming events"
        className="absolute inset-0 h-full w-full"
      >
        <rect width="500" height="400" fill="var(--ins-surface)" />
        {/* green space */}
        <ellipse cx="250" cy="196" rx="140" ry="42" fill="var(--ins-live-tint)" opacity="0.5" />
        <ellipse cx="432" cy="300" rx="72" ry="86" fill="var(--ins-live-tint)" opacity="0.55" />
        {/* blocks */}
        {[
          [160, 150, 170, 46], [96, 88, 92, 50], [316, 92, 96, 52],
          [120, 262, 96, 54], [300, 258, 84, 48], [156, 330, 100, 44],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="var(--ins-surface-sunk)" />
        ))}
        {/* roads: sunk casing under a white centre reads as paper cartography */}
        {[
          "M0,150 C150,142 330,148 500,140",
          "M0,246 C170,238 330,242 500,234",
          "M250,20 C254,150 256,280 252,400",
          "M78,60 C68,180 78,290 116,380",
        ].map((d, i) => (
          <g key={i}>
            <path d={d} stroke="var(--ins-surface-sunk)" strokeWidth="11" fill="none" />
            <path d={d} stroke="#FFFFFF" strokeWidth="6" fill="none" />
          </g>
        ))}
        <text x="250" y="182" textAnchor="middle" fontSize="11" fill="var(--ins-ink-3)">
          McKeldin Mall
        </text>
        <text x="432" y="292" textAnchor="middle" fontSize="10" fill="var(--ins-live-ink)">
          Arboretum
        </text>
      </svg>

      {/* pins */}
      {venues.map((v) => (
        <div
          key={v.label}
          className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{ left: `${v.x}%`, top: `${v.y}%` }}
        >
          {v.live && (
            <span
              aria-hidden="true"
              className="ins-radarping absolute h-[26px] w-[26px] rounded-full border-[1.5px] border-live"
            />
          )}
          <span
            aria-hidden="true"
            className={`relative flex items-center justify-center rounded-full border-2 border-white shadow-raised ${v.live ? "h-[26px] w-[26px] bg-live" : "h-[18px] w-[18px] bg-ink"
              }`}
          />
        </div>
      ))}

      {/* live chip — a fact, so green, and never clickable */}
      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-chip border border-line bg-sheet px-2.5 py-1.5 shadow-raised">
        <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-live" />
        <span className="ins-mono text-[10px] leading-none text-ink">2 live now · College Park</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- page */

export default function LandingPage({
  onGetStarted,
  isAuthenticated = false,
}: LandingPageProps) {
  const router = useRouter();

  // The app is still dark-themed: `body` inherits --background (a dark navy) from
  // the legacy token set. This page is the first Instrument surface, so while it
  // is mounted we paint the document ground paper and restore it on unmount.
  // Without this, iOS rubber-band scrolling and route transitions flash navy
  // behind a light page. Remove once the whole app has migrated and :root is light.
  useEffect(() => {
    trackFunnelEvent({ name: "landing_view" });
    const { body } = document;
    const previous = body.style.backgroundColor;
    body.style.backgroundColor = "var(--ins-paper)";
    return () => {
      body.style.backgroundColor = previous;
    };
  }, []);

  const handleOpenMap = () => router.push("/map");
  const handleHostEvent = () => router.push("/map?intent=create");

  const steps = [
    { n: "01", title: "Open the map", body: "Events near you appear as pins. No account, no download." },
    { n: "02", title: "Tap a pin", body: "Time, place, how many people are going." },
    { n: "03", title: "Show up", body: "Get a reminder before it starts." },
  ];

  const organizerClaims = [
    { label: "Show-rate tracking", body: "Every event's show rate is computed from real check-ins, not RSVPs." },
    { label: "One-tap check-ins", body: "Open check-in at start time; attendees confirm themselves." },
    { label: "Roster export", body: "Download any roster as CSV, including answers to your RSVP questions." },
  ];

  return (
    <div className="min-h-screen bg-paper font-body text-ink">
      {/* ---------------------------------------------------------- nav --- */}
      <header className="border-b border-line bg-paper">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-4 px-6"
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            className="-my-2 rounded-chip py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
            aria-label="Huddle home"
          >
            <Wordmark />
          </button>

          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="#organizers"
              className="-my-2 hidden rounded-chip py-2 text-[15px] font-medium text-ink-2 transition-colors duration-micro ease-ins hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action sm:inline"
            >
              I organize events
            </a>
            {!isAuthenticated && (
              <button
                type="button"
                onClick={onGetStarted}
                className="inline-flex h-9 items-center rounded-chip border border-line bg-sheet px-4 text-sm font-semibold text-ink transition-colors duration-micro ease-ins hover:bg-surface"
              >
                Sign in
              </button>
            )}
            <button
              type="button"
              onClick={handleOpenMap}
              className="inline-flex h-9 items-center rounded-chip bg-action px-4 text-sm font-semibold text-white transition-colors duration-micro ease-ins hover:bg-action-hover"
            >
              Open the map
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* -------------------------------------------------------- hero --- */}
        <section className="mx-auto max-w-[1120px] px-6 py-14 sm:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <h1 className="font-display text-[34px] font-bold leading-[1.1] text-ink sm:text-[40px] sm:leading-[44px]">
                See what&rsquo;s happening around campus.{" "}
                <span className="whitespace-nowrap text-action">Right now.</span>
              </h1>

              <p className="mt-5 max-w-[40ch] text-[15px] leading-[22px] text-ink-2">
                Live events near you with no app, no account, no missing out.
              </p>

              <div className="mt-8 flex flex-col items-start gap-4">
                <button
                  type="button"
                  onClick={handleOpenMap}
                  className="inline-flex h-11 items-center rounded-control bg-action px-7 text-[15px] font-semibold text-white transition-[background-color,transform] duration-micro ease-ins hover:bg-action-hover active:scale-[0.98]"
                >
                  Open the map
                </button>
                <p className="ins-mono text-xs leading-4 text-ink-3">
                  Free · no signup · works in your browser
                </p>
              </div>
            </div>

            <div className="lg:pl-4">
              <CampusMapVisual />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ how it works --- */}
        <section
          aria-labelledby="how-it-works"
          className="mx-auto max-w-[1120px] px-6 py-14 sm:py-16"
        >
          <h2 id="how-it-works" className="ins-mono text-xs leading-4 text-ink-3">
            How it works
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="border-l border-line pl-6">
                <div className="ins-mono text-xs leading-4 text-ink-4">{s.n}</div>
                <h3 className="mt-3 text-lg font-semibold leading-6 text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-[22px] text-ink-2">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------- organizers --- */}
        <section
          id="organizers"
          aria-labelledby="organizers-heading"
          className="border-y border-line bg-surface"
        >
          <div className="mx-auto grid max-w-[1120px] items-start gap-10 px-6 py-14 sm:py-16 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="ins-mono text-xs leading-4 text-ink-3">For organizers</p>
              <h2
                id="organizers-heading"
                className="mt-3 font-display text-[28px] font-bold leading-[1.15] text-ink sm:text-[32px] sm:leading-9"
              >
                Run events people actually show up to.
              </h2>

              <dl className="mt-6">
                {organizerClaims.map((c, i) => (
                  <div
                    key={c.label}
                    className={`border-t border-line py-4 ${i === organizerClaims.length - 1 ? "border-b" : ""
                      }`}
                  >
                    <dt className="ins-mono text-xs leading-4 text-ink-3">{c.label}</dt>
                    <dd className="mt-1.5 text-[15px] leading-[22px] text-ink">{c.body}</dd>
                  </div>
                ))}
              </dl>

              <button
                type="button"
                onClick={handleHostEvent}
                className="mt-8 inline-flex h-11 items-center rounded-control border border-line bg-sheet px-7 text-[15px] font-semibold text-ink transition-colors duration-micro ease-ins hover:bg-surface-sunk"
              >
                Create your first event
              </button>
            </div>

            <div className="rounded-sheet border border-line bg-sheet p-5 shadow-raised">
              <p className="ins-mono text-xs leading-4 text-ink-3">Already on Huddle</p>
              <p className="mt-3 text-[15px] leading-[22px] text-ink-2">
                Campus events from TerpLink are already on the map. If one of them is
                yours, claim it and the RSVPs students have already made come with it.
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <dt className="ins-mono text-[10px] leading-[14px] text-ink-3">Events on the map</dt>
                  <dd className="ins-mono mt-1 text-[22px] font-semibold leading-7 text-ink">565</dd>
                </div>
                <div>
                  <dt className="ins-mono text-[10px] leading-[14px] text-ink-3">Campus</dt>
                  <dd className="mt-1 text-[15px] font-semibold leading-7 text-ink">UMD</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------- footer --- */}
      <footer className="bg-paper">
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
              <a
                key={l.href}
                href={l.href}
                className="-my-2 rounded-chip py-2 text-[13px] leading-5 text-ink-2 transition-colors duration-micro ease-ins hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
