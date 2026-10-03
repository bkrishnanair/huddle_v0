"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Compass, Download, MapPin, Pause, Play, Users } from "lucide-react";
import { trackFunnelEvent } from "@/lib/analytics";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { InstallDialog } from "@/components/install-dialog";
import { HuddleLogo } from "@/components/huddle-logo";
import { Button } from "@/components/ui/button";
import { CampusScene, GatheringVisual } from "@/components/landing/campus-scene";
import styles from "@/components/landing/landing-motion.module.css";

interface LandingPageProps {
  onGetStarted: () => void;
  isAuthenticated?: boolean;
}

export default function LandingPage({ onGetStarted, isAuthenticated = false }: LandingPageProps) {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  // Static first render: SSR, disabled JavaScript and reduced-motion users see all content.
  const [reducedMotion, setReducedMotion] = useState(true);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const { isMounted, isInstalled, isDialogOpen, setIsDialogOpen, promptInstall } = usePwaInstall();

  useEffect(() => {
    trackFunnelEvent({ name: "landing_view" });
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#0B101B";
    return () => { document.body.style.backgroundColor = previous; };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    const updateVisibility = () => setVisible(document.visibilityState === "visible");
    updatePreference();
    updateVisibility();
    media.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);

    const sections = root.current?.querySelectorAll<HTMLElement>("[data-motion-section]") ?? [];
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        element.dataset.inView = String(entry.isIntersecting);
        if (entry.isIntersecting) element.dataset.entered = "true";
      }
    }, { threshold: 0.08 }) : null;
    sections.forEach(section => {
      if (observer) observer.observe(section);
      else section.dataset.inView = "true";
    });
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const handleInstallClick = async (placement: "hero" | "nav") => {
    trackFunnelEvent({ name: "landing_cta_click", properties: { placement: placement === "hero" ? "install_hero" : "install_nav" } });
    const outcome = await promptInstall();
    if (outcome === "dialog" || outcome === "unavailable") setIsDialogOpen(true);
  };
  const handleOpenMap = (placement: "hero" | "nav" | "footer" = "hero") => {
    trackFunnelEvent({ name: "landing_cta_click", properties: { placement } });
    router.push("/map");
  };
  const handleHostEvent = () => {
    trackFunnelEvent({ name: "landing_cta_click", properties: { placement: "organizer" } });
    router.push("/map?intent=create");
  };

  return (
    <div ref={root} className={styles.page + " min-h-screen overflow-x-clip bg-canvas font-body text-slate-100"} data-motion={!reducedMotion && !paused && visible ? "on" : "off"}>
      <a href="#landing-main" className="sr-only z-50 rounded-xl bg-orange-400 p-3 text-slate-950 focus:not-sr-only focus:absolute focus:left-4 focus:top-4">Skip to content</a>
      <header className="relative z-10">
        <nav aria-label="Primary" className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 border-b border-white/10 px-5 sm:min-h-24 sm:px-8">
          <Link href="/" aria-label="Huddle home" className="flex min-h-11 items-center gap-2 rounded-xl">
            <HuddleLogo size={32} aria-hidden="true" />
            <span className="font-display text-2xl font-bold tracking-tight">huddle<span className="text-orange-400">.</span></span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-slate-400 lg:flex">
            <a href="#how-it-works" className="inline-flex min-h-11 items-center transition-colors hover:text-white">How it works</a>
            <a href="#organizers" className="inline-flex min-h-11 items-center transition-colors hover:text-white">For organizers</a>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            {!isInstalled && isMounted && <Button variant="ghost" className="hidden text-slate-300 xl:inline-flex" onClick={() => handleInstallClick("nav")}><Download aria-hidden="true" /> Install app</Button>}
            {!isAuthenticated && <Button variant="ghost" onClick={onGetStarted} className="px-3 text-slate-300">Sign in</Button>}
            <Button onClick={() => handleOpenMap("nav")} className="rounded-full px-4 shadow-none sm:px-5">Explore <ArrowUpRight aria-hidden="true" /></Button>
          </div>
        </nav>
      </header>
      <main id="landing-main">
        <section data-motion-section aria-labelledby="hero-heading" className="relative mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8 sm:pt-16">
          <div className={styles.reveal + " relative z-10 text-center"}>
            <p className="mb-6 inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[.2em] text-teal-300 sm:text-xs"><span className="h-1.5 w-1.5 rounded-full bg-teal-300" /> The campus event map</p>
            <h1 id="hero-heading" className={styles.heroTitle + " font-display font-semibold text-orange-50"}>
              Less scrolling.<br /><span className={styles.heroAccent + " text-orange-400"}>More showing up.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">See what’s happening around campus.<br className="hidden sm:block" /> The pickup game. The open mic. The people you haven’t met yet.</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={() => handleOpenMap("hero")} className="group rounded-full px-7 shadow-none">Explore the map <ArrowUpRight aria-hidden="true" className="motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" /></Button>
              {!isInstalled && isMounted && <Button size="lg" variant="ghost" onClick={() => handleInstallClick("hero")} className="rounded-full text-slate-300"><Download aria-hidden="true" /> Add to your phone</Button>}
            </div>
            <p className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-teal-300" aria-hidden="true" /> Free to explore</span>
              <span>No download or account needed to browse</span>
            </p>
          </div>
          <div className={styles.revealLater + " mt-3 sm:mt-0"}><CampusScene /></div>
          <div className="mt-6 flex items-center justify-between gap-3 border-b border-white/10 pb-5">
            <a href="#how-it-works" className="inline-flex min-h-11 items-center gap-2 text-xs text-slate-400 hover:text-white"><ArrowDown className="h-3.5 w-3.5" aria-hidden="true" /> A little less online. A little more out there.</a>
            <button type="button" onClick={() => setPaused(value => !value)} disabled={reducedMotion} aria-pressed={paused || reducedMotion} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3 text-xs text-slate-400 hover:bg-white/5 hover:text-white disabled:cursor-default disabled:opacity-70" aria-label={reducedMotion ? "Reduced motion enabled" : paused ? "Play landing animations" : "Pause landing animations"}>
              {paused || reducedMotion ? <Play className="h-3 w-3" aria-hidden="true" /> : <Pause className="h-3 w-3" aria-hidden="true" />}
              <span className="hidden sm:inline">{reducedMotion ? "Reduced motion" : paused ? "Play motion" : "Pause motion"}</span>
            </button>
          </div>
        </section>

        <section id="how-it-works" data-motion-section aria-labelledby="how-heading" className="mx-auto max-w-7xl scroll-mt-6 px-5 py-12 sm:px-8 sm:py-20">
          <div className={styles.reveal + " mb-12 grid gap-5 lg:grid-cols-2 lg:items-end"}>
            <div><p className="mb-4 font-mono text-xs uppercase tracking-widest text-slate-500">01 / From a pin to a plan</p><h2 id="how-heading" className="max-w-xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Your campus is bigger<br />than your group chat.</h2></div>
            <p className="max-w-md text-base leading-relaxed text-slate-400 lg:justify-self-end">Good things are happening outside your usual circle. Huddle makes them easier to find. What happens next is up to you.</p>
          </div>
          <div className={styles.revealLater + " grid gap-8 md:grid-cols-3 md:gap-10"}>
            {[
              { icon: Compass, number: "01", title: "Find your scene.", body: "Browse nearby events by what you’re into and when you’re free.", detail: "A campus full of possibilities", color: "text-teal-300" },
              { icon: MapPin, number: "02", title: "Get the whole picture.", body: "Check the time, the place, and the details before heading out.", detail: "Less back-and-forth", color: "text-orange-300" },
              { icon: Users, number: "03", title: "Make it a plan.", body: "Sign in to RSVP. Send the link to a friend. Meet them there.", detail: "The best part is offline", color: "text-violet-300" },
            ].map(step => (
              <article key={step.number} className="group border-t border-white/15 pt-6">
                <div className="mb-8 flex items-center justify-between"><step.icon className={"h-7 w-7 " + step.color} aria-hidden="true" /><span className="font-mono text-xs text-slate-500">{step.number}</span></div>
                <h3 className="font-display text-2xl font-semibold">{step.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">{step.body}</p>
                <p className={"mt-7 text-xs " + step.color}>{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="organizers" data-motion-section aria-labelledby="organizers-heading" className="mx-auto max-w-7xl scroll-mt-6 px-5 py-12 sm:px-8 sm:py-20">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-md lg:grid lg:grid-cols-2">
            <div className={styles.reveal + " p-7 sm:p-12"}>
              <p className="font-mono text-xs uppercase tracking-widest text-orange-300">02 / Make something happen</p>
              <h2 id="organizers-heading" className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Bring the plan.<br /><span className="text-slate-400">Make room for<br className="hidden lg:block" /> someone new.</span></h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-400">Keep your group chat. Give everyone else a way in. Put your club meetup, pickup game, or study session on the map.</p>
              <Button onClick={handleHostEvent} className="mt-7 rounded-full shadow-none">Put your event on the map <ArrowUpRight aria-hidden="true" /></Button>
              <p className="mt-4 text-xs text-slate-500">Event details, RSVPs, and event chat. Together.</p>
            </div>
            <div className={styles.revealLater + " flex flex-col justify-center border-t border-white/10 px-4 pb-6 pt-3 sm:px-8 lg:border-l lg:border-t-0"}>
              <GatheringVisual />
              <p className="mx-auto max-w-xs text-center text-sm leading-relaxed text-slate-400">Not just the people who already know.<br /><span className="text-teal-200">The people who’d love to be there.</span></p>
            </div>
          </div>
        </section>

        <section data-motion-section aria-labelledby="last-heading" className="relative mx-auto max-w-7xl px-5 pb-20 pt-12 text-center sm:px-8 sm:pb-28 sm:pt-20">
          <div className={styles.reveal}>
            <p className="mb-6 font-mono text-xs uppercase tracking-widest text-teal-300">Built in College Park. Made for showing up.</p>
            <h2 id="last-heading" className={styles.finalWord + " font-display font-semibold"}>Meet you<br /><span className="text-orange-400">out there.</span></h2>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-slate-400">Your next “you had to be there” starts somewhere. See what’s around you.</p>
            <Button size="lg" onClick={() => handleOpenMap("footer")} className="mt-7 rounded-full shadow-none">Open the map <ArrowRight aria-hidden="true" /></Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 py-6 sm:px-8 lg:flex-row lg:items-center">
          <p className="text-xs text-slate-500">Huddle Map, LLC · College Park, MD</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-1">
            {[{ href: "/directory", label: "Event directory" }, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }, { href: "/contact", label: "Contact" }, { href: "/feedback", label: "Feedback" }].map(link => <Link key={link.href} href={link.href} className="inline-flex min-h-11 min-w-11 items-center text-xs text-slate-400 hover:text-white">{link.label}</Link>)}
          </nav>
        </div>
      </footer>
      <InstallDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
