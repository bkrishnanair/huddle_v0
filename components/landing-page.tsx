"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Compass,
  Download,
  MapPin,
  Music2,
  Radio,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { trackFunnelEvent } from "@/lib/analytics";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { InstallDialog } from "@/components/install-dialog";
import { HuddleLogo } from "@/components/huddle-logo";
import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onGetStarted: () => void;
  isAuthenticated?: boolean;
}

/** Illustrative campus preview, not a claim about live inventory. */
function CampusMapVisual() {
  return (
    <div className="relative isolate mx-auto w-full max-w-xl">
      <div className="absolute -inset-8 -z-10 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-panel shadow-2xl sm:aspect-[1/1.05]">
        <svg
          viewBox="0 0 500 520"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Illustration of campus paths and event pins"
        >
          <defs>
            <pattern
              id="campus-grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M32 0H0V32"
                fill="none"
                stroke="#ffffff"
                strokeOpacity=".035"
              />
            </pattern>
          </defs>
          <rect width="500" height="520" fill="url(#campus-grid)" />
          <path
            d="M290 0C260 95 390 120 385 245S475 365 500 375V0Z"
            fill="#173934"
            fillOpacity=".45"
          />
          <path
            d="M0 400Q130 300 215 365T440 460L500 520H0Z"
            fill="#173934"
            fillOpacity=".5"
          />
          <g fill="#1D2A3D" stroke="#2A3A4F" strokeWidth="1.5">
            <rect
              x="74"
              y="108"
              width="87"
              height="52"
              rx="8"
              transform="rotate(-12 74 108)"
            />
            <rect
              x="195"
              y="53"
              width="62"
              height="96"
              rx="8"
              transform="rotate(-12 195 53)"
            />
            <rect
              x="342"
              y="177"
              width="104"
              height="62"
              rx="8"
              transform="rotate(-12 342 177)"
            />
            <rect
              x="95"
              y="274"
              width="83"
              height="64"
              rx="8"
              transform="rotate(-12 95 274)"
            />
            <rect
              x="253"
              y="295"
              width="72"
              height="80"
              rx="8"
              transform="rotate(-12 253 295)"
            />
          </g>
          <g fill="none" strokeLinecap="round">
            <path
              d="M-30 250L540 125M-20 432L530 318M170 -20Q115 230 235 550M308 -20L425 550"
              stroke="#29374A"
              strokeWidth="13"
            />
            <path
              d="M-30 250L540 125M-20 432L530 318M170 -20Q115 230 235 550M308 -20L425 550"
              stroke="#182336"
              strokeWidth="8"
            />
            <path
              d="M160 370Q155 220 300 200"
              stroke="#2DD4BF"
              strokeWidth="3"
              strokeDasharray="3 9"
              opacity=".7"
            />
          </g>
          <g
            fill="#7C8EA6"
            fontFamily="sans-serif"
            fontSize="10"
            letterSpacing="2"
          >
            <text x="42" y="204" transform="rotate(-12 42 204)">
              CAMPUS DRIVE
            </text>
            <text x="337" y="297">
              THE QUAD
            </text>
          </g>
        </svg>
        <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-canvas/80 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5 text-orange-400" /> College Park, MD
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
            Campus preview
          </span>
        </div>
        <div className="absolute left-[21%] top-[25%] flex h-12 w-12 rotate-[-8deg] items-center justify-center rounded-2xl border border-orange-300/40 bg-orange-500 text-canvas shadow-glow">
          <Zap className="h-6 w-6" />
        </div>
        <div className="absolute right-[27%] top-[36%] flex h-16 w-16 items-center justify-center rounded-full border-8 border-teal-400/15 bg-teal-400/20 shadow-xl">
          <span className="absolute inset-0 rounded-full border border-teal-300/30 motion-safe:animate-ping" />
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-400 text-canvas">
            <Music2 className="h-5 w-5" />
          </span>
        </div>
        <div className="absolute bottom-[30%] left-[25%] flex h-11 w-11 items-center justify-center rounded-full border border-violet-300/40 bg-violet-500 text-white shadow-xl">
          <Users className="h-5 w-5" />
        </div>
        <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/15 bg-canvas/85 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-300/25 to-emerald-500/5 text-teal-300">
              <Music2 className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-teal-300">
                Find your kind of night
              </p>
              <h3 className="mt-1 font-display text-xl font-bold text-white">
                Open mic. Open invite.
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Your next plan could be right here.
              </p>
            </div>
            <ArrowRight className="hidden h-5 w-5 text-slate-300 sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({
  onGetStarted,
  isAuthenticated = false,
}: LandingPageProps) {
  const router = useRouter();
  const {
    isMounted,
    isInstalled,
    isDialogOpen,
    setIsDialogOpen,
    promptInstall,
  } = usePwaInstall();
  const handleInstallClick = async (placement: "hero" | "nav") => {
    trackFunnelEvent({
      name: "landing_cta_click",
      properties: {
        placement: placement === "hero" ? "install_hero" : "install_nav",
      },
    });
    const outcome = await promptInstall();
    if (outcome === "dialog" || outcome === "unavailable")
      setIsDialogOpen(true);
  };
  useEffect(() => {
    trackFunnelEvent({ name: "landing_view" });
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#0B101B";
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, []);
  const handleOpenMap = (placement: "hero" | "nav" | "footer" = "hero") => {
    trackFunnelEvent({ name: "landing_cta_click", properties: { placement } });
    router.push("/map");
  };
  const handleHostEvent = () => {
    trackFunnelEvent({
      name: "landing_cta_click",
      properties: { placement: "organizer" },
    });
    router.push("/map?intent=create");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-canvas font-body text-slate-100">
      <header className="relative z-10 border-b border-white/5">
        <nav
          aria-label="Primary"
          className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8"
        >
          <button
            onClick={() => router.push("/")}
            aria-label="Huddle home"
            className="flex items-center gap-2.5 rounded-xl pr-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400"
          >
            <HuddleLogo size={34} />
            <span className="font-display text-2xl font-bold tracking-tight">
              huddle<span className="text-orange-400">.</span>
            </span>
          </button>
          <div className="flex items-center gap-2 sm:gap-5">
            <a
              href="#organizers"
              className="hidden min-h-11 items-center text-sm font-medium text-slate-300 hover:text-white md:inline-flex"
            >
              For organizers
            </a>
            {!isInstalled && isMounted && (
              <Button
                variant="ghost"
                className="hidden text-slate-300 lg:inline-flex"
                onClick={() => handleInstallClick("nav")}
              >
                <Download /> Install app
              </Button>
            )}
            {!isAuthenticated && (
              <Button
                variant="ghost"
                onClick={onGetStarted}
                className="px-3 text-slate-300"
              >
                Sign in
              </Button>
            )}
            <Button
              onClick={() => handleOpenMap("nav")}
              className="rounded-full px-4 sm:px-5"
            >
              Explore <ArrowRight />
            </Button>
          </div>
        </nav>
      </header>
      <main>
        <section className="relative isolate mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="pointer-events-none absolute -left-40 top-0 -z-10 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/5 px-3 py-2 text-xs font-semibold text-teal-300">
              <Radio className="h-3.5 w-3.5" /> Less scrolling. More showing up.
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl xl:text-7xl">
              See what’s happening around campus.
              <br />
              <span className="text-orange-400">Right now.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-400 sm:text-lg">
              The pickup game. The open mic. The people you haven’t met yet.
              Your next good plan is closer than you think.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => handleOpenMap("hero")}
                className="rounded-2xl px-7 text-base"
              >
                Find my next plan <ArrowRight />
              </Button>
              {!isInstalled && isMounted && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleInstallClick("hero")}
                  className="rounded-2xl px-5"
                >
                  <Download /> Get the app
                </Button>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
              {[
                "Free to explore",
                "No download needed",
                "Browse without an account",
              ].map((text) => (
                <span key={text} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-teal-400" />
                  {text}
                </span>
              ))}
            </div>
          </div>
          <CampusMapVisual />
        </section>
        <section
          aria-labelledby="how-it-works"
          className="mx-auto max-w-7xl px-5 pb-20 sm:px-8"
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <h2
              id="how-it-works"
              className="text-xs font-semibold uppercase tracking-widest text-slate-400"
            >
              Out of the group chat. Into the moment.
            </h2>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Compass,
                title: "Find your scene",
                body: "A whole campus of plans, on one map. Filter by what you’re into and when you’re free.",
              },
              {
                icon: MapPin,
                title: "Get the whole picture",
                body: "The time, the place, the people going. Everything you need before heading out.",
              },
              {
                icon: Users,
                title: "Make it a plan",
                body: "Sign in, save your spot, and show up. Good things happen when you get together.",
              },
            ].map((step, i) => (
              <div
                key={step.title}
                className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-7"
              >
                <div className="mb-7 flex items-center justify-between">
                  <step.icon className="h-6 w-6 text-orange-400" />
                  <span className="font-mono text-xs text-slate-500">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section
          id="organizers"
          aria-labelledby="organizers-heading"
          className="mx-auto max-w-7xl px-5 pb-20 sm:px-8"
        >
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-panel px-6 py-10 sm:p-12 lg:grid lg:grid-cols-2 lg:gap-16">
            <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                For the people who make it happen
              </span>
              <h2
                id="organizers-heading"
                className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Bring the plan.
                <br />
                We’ll help bring the people.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                Club meetup or your first pickup game — give it a place on the
                map and keep everyone in the loop.
              </p>
              <Button onClick={handleHostEvent} className="mt-7">
                Create your first event <ArrowRight />
              </Button>
            </div>
            <div className="mt-10 space-y-3 lg:mt-0">
              {[
                {
                  icon: MapPin,
                  title: "Get discovered",
                  text: "Put your event where your campus is looking.",
                },
                {
                  icon: Users,
                  title: "Keep your crew together",
                  text: "Manage RSVPs, waitlists, and event chat in one place.",
                },
                {
                  icon: CalendarCheck,
                  title: "See who shows up",
                  text: "Check in your attendees and understand your turnout.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="px-5 pb-20 text-center">
          <Sparkles className="mx-auto mb-5 h-6 w-6 text-teal-300" />
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Your next “you had to be there” starts here.
          </h2>
          <Button
            size="lg"
            className="mt-7 rounded-full"
            onClick={() => handleOpenMap("footer")}
          >
            Open the map <ArrowRight />
          </Button>
          <p className="mt-4 text-sm text-slate-400">
            See what’s out there. Decide when you get there.
          </p>
        </section>
      </main>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-5 py-6 sm:flex-row sm:items-center sm:px-8">
          <p className="text-xs text-slate-400">
            Huddle Map, LLC · College Park, MD
          </p>
          <nav aria-label="Footer" className="flex gap-6">
            {[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-xs text-slate-400 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
      <InstallDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
