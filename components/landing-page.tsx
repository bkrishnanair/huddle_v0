"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  MapPin,
  Calendar,
  Zap,
  Clock,
  Heart,
  BookOpen,
  Mic,
  Palette,
  Plus
} from "lucide-react";

const HuddleLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white drop-shadow-md">
    <path d="M4 4V20M20 4V20M4 12H20M12 4V12C12 14.2091 10.2091 16 8 16C5.79086 16 4 14.2091 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// High-End Premium Dark Aesthetic Background
const PremiumBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-950">
    {/* Subtle Space Overlay */}
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

    {/* Dynamic Glowing Accents */}
    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen opacity-50 animate-pulse" style={{ animationDuration: '8s' }} />
    <div className="absolute top-[20%] -right-20 w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[120px] mix-blend-screen opacity-50 animate-pulse" style={{ animationDuration: '10s' }} />
    <div className="absolute -bottom-40 left-[20%] w-[700px] h-[700px] rounded-full bg-indigo-500/15 blur-[150px] mix-blend-screen opacity-40 animate-pulse" style={{ animationDuration: '12s' }} />

    {/* Modern Grid Pattern (Very Subtle) */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
  </div>
);

interface LandingPageProps {
  onGetStarted: () => void;
}

const useCases = [
  {
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    title: "The Student",
    description: "Find a last-minute study group for your midterm, join a club meeting on the mall, or unwind with a game of soccer after class."
  },
  {
    icon: <Mic className="w-8 h-8 text-blue-400" />,
    title: "The Creator",
    description: "Hosting a workshop, an open mic night, or a yoga class? Huddle gives you the tools to reach your local community and manage your event effortlessly."
  },
  {
    icon: <Palette className="w-8 h-8 text-indigo-400" />,
    title: "The Explorer",
    description: "New to the area or just looking for something to do? Open the map and instantly see the vibrant, real-time pulse of your community."
  }
];

const howItWorks = [
  {
    step: "1",
    icon: <MapPin className="w-6 h-6 text-primary" />,
    title: "Hyperlocal Discovery",
    description: "Don't bury your event in a noisy group chat. Put it on the live map where people are already looking."
  },
  {
    step: "2",
    icon: <Users className="w-6 h-6 text-blue-400" />,
    title: "Track Attendance",
    description: "Frictionless RSVPs and real-time headcounts. Know exactly how many people to expect."
  },
  {
    step: "3",
    icon: <Calendar className="w-6 h-6 text-indigo-400" />,
    title: "One-Tap Sharing",
    description: "Generate a dynamic preview link for WhatsApp, Instagram, or Discord. No app download required to join."
  }
];

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [currentUseCase, setCurrentUseCase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUseCase((prev) => (prev + 1) % useCases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen text-slate-50 overflow-hidden relative bg-slate-950 font-sans selection:bg-primary/30">
      <PremiumBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Modern Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <HuddleLogo />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">Huddle</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onGetStarted} className="px-6 h-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 font-medium tracking-tight text-white shadow-lg">
              Sign In
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col px-4 md:px-6 relative z-10">
          <div className="flex-1 flex flex-col items-center justify-center text-center pb-20 pt-10">
            <div className="max-w-5xl mx-auto mt-12 md:mt-24 relative">

              {/* Premium Glow Behind Text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

              <h1 className="text-5xl sm:text-7xl md:text-[5.5rem] font-black text-white mb-6 leading-[1.05] tracking-tighter relative z-10 drop-shadow-lg">
                Your Community is Waiting.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-500">Find it with Huddle.</span>
              </h1>

              <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-medium tracking-tight bg-slate-900/40 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl relative z-10">
                From pickup games to study groups, discover and join what's happening around you in real-time.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-24 relative z-10">
                <Button onClick={onGetStarted} size="lg" className="group h-14 px-10 text-lg font-bold bg-primary text-white border border-transparent hover:bg-primary/90 rounded-full shadow-[0_0_30px_rgba(217,119,6,0.5)] hover:shadow-[0_0_40px_rgba(217,119,6,0.7)] transition-all duration-500 transform hover:-translate-y-1 tracking-tight">
                  <MapPin className="mr-2 w-5 h-5 group-hover:animate-bounce" />
                  Open Live Map
                </Button>

                <Button onClick={onGetStarted} variant="outline" size="lg" className="h-14 px-8 text-lg bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/30 text-white rounded-full transition-all duration-300 tracking-tight shadow-xl">
                  <Plus className="mr-2 w-5 h-5" />
                  Host an Event
                </Button>
              </div>
            </div>
          </div>

          {/* Pillars Section */}
          <div className="max-w-6xl mx-auto py-24 relative z-10 border-t border-white/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                From idea to event in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-400">3 simple steps</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto tracking-tight">
                We've made finding and organizing local events so simple, you'll wonder how you ever managed without us.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step, index) => (
                <Card key={index} className="bg-white/[0.03] backdrop-blur-xl border-white/10 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-8 text-center relative z-10">
                    <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      {step.icon}
                    </div>
                    <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/10 transition-colors">
                      <span className="text-slate-300 font-bold text-sm tracking-tighter">{step.step}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed tracking-tight text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Enhanced Use Cases Showcase */}
          <div className="max-w-4xl mx-auto py-24 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">every community</span>
              </h2>
              <p className="text-lg text-slate-400 tracking-tight">
                Every feature is designed to get you off your phone and into your community.
              </p>
            </div>

            <Card className="bg-slate-900/50 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
              <CardContent className="p-10 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-left">
                  <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-inner">
                    <div className="scale-125 transition-transform duration-500">
                      {useCases[currentUseCase].icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                      {useCases[currentUseCase].title}
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed tracking-tight">
                      {useCases[currentUseCase].description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center space-x-3 mt-12">
                  {useCases.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentUseCase(index)}
                      className={`h-2 rounded-full transition-all duration-500 ${index === currentUseCase
                        ? 'bg-primary w-10 shadow-[0_0_10px_rgba(217,119,6,0.5)]'
                        : 'bg-white/20 w-3 hover:bg-white/40'
                        }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Final CTA Section */}
          <div className="max-w-4xl mx-auto py-24 text-center relative z-10">
            <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-primary/10 border-white/10 backdrop-blur-3xl shadow-[0_0_60px_rgba(217,119,6,0.1)] overflow-hidden">
              <CardContent className="p-16 relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-md">
                  Ready to find your crowd?
                </h2>
                <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto tracking-tight font-medium">
                  Join thousands of members who've already discovered the easiest way to find, create, and join local events.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                  <Button onClick={onGetStarted} size="lg" className="h-16 px-12 text-xl font-bold bg-white text-slate-950 hover:bg-slate-200 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 transform hover:scale-105 tracking-tight border border-transparent">
                    <Zap className="mr-3 w-6 h-6 text-primary" />
                    Get Started - It's Free
                  </Button>
                  <div className="flex items-center text-slate-400 text-sm font-medium">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    Setup takes less than 2 minutes
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="p-6 mt-8 text-center relative z-20 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-slate-500 text-sm">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-primary" />
              <span>Made with love for local communities</span>
            </div>
            <div className="flex items-center space-x-6">
              <span>© 2025 Huddle. All rights reserved.</span>
              <span className="hidden sm:inline opacity-50">•</span>
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <span className="hidden sm:inline opacity-50">•</span>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}