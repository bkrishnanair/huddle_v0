"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Link as LinkIcon, Plus, Target, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const HuddleLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white drop-shadow-md">
    <path d="M4 4V20M20 4V20M4 12H20M12 4V12C12 14.2091 10.2091 16 8 16C5.79086 16 4 14.2091 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AbstractMapVisual = () => {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center pointer-events-none">
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.4, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-72 h-72 rounded-full bg-teal-400/20 blur-[100px] mix-blend-screen"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute w-80 h-80 rounded-full bg-amber-400/20 blur-[120px] mix-blend-screen ml-40 mt-20"
      />
      <div className="relative z-10 w-full max-w-sm aspect-square bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_0_80px_rgba(45,212,191,0.15)] flex items-center justify-center p-8 overflow-hidden">
        {/* Radar Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full rounded-full border border-teal-500/10" />
          <motion.div
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute w-1/2 h-1/2 rounded-full border border-teal-500/30"
          />
          <motion.div
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
            className="absolute w-1/2 h-1/2 rounded-full border border-teal-500/30"
          />
        </div>

        {/* Floating Pins */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_20px_rgba(212,175,55,1)]"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-teal-400 rounded-full shadow-[0_0_20px_rgba(45,212,191,1)]"
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 right-1/4 w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(129,140,248,1)]"
        />

        {/* Center Pulse */}
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md z-20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <Target className="w-6 h-6 text-teal-400" />
        </div>
      </div>
    </div>
  );
};

const valueProps = [
  {
    icon: <Compass className="w-7 h-7 text-teal-400" />,
    title: "Hyperlocal Discovery",
    description: "See real-time events, study groups, and meetups happening within walking distance."
  },
  {
    icon: <Users className="w-7 h-7 text-amber-400" />,
    title: "Kill the Flake Rate",
    description: "Frictionless RSVPs and attendee tracking. Know exactly who is showing up before you even leave your room."
  },
  {
    icon: <LinkIcon className="w-7 h-7 text-indigo-400" />,
    title: "One-Tap Sharing",
    description: "Generate dynamic preview links for WhatsApp or iMessage. No app download required for friends to view and join."
  }
];

interface LandingPageProps {
  onGetStarted: () => void;
  isAuthenticated?: boolean;
}

export default function LandingPage({ onGetStarted, isAuthenticated = false }: LandingPageProps) {
  const router = useRouter();

  const handleOpenMap = () => {
    router.push('/map');
  };

  const handleHostEvent = () => {
    // Navigate to map with an intent state or just tell them
    router.push('/map?intent=create');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-slate-50 overflow-hidden font-sans selection:bg-teal-500/30">
      {/* Background Noise & Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between p-6 px-6 md:px-12 w-full max-w-7xl mx-auto"
        >
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors hover:bg-white/10">
              <HuddleLogo />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">Huddle</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onGetStarted}
              className="px-6 h-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium tracking-tight text-white shadow-lg"
            >
              {isAuthenticated ? "Open App" : "Sign In"}
            </Button>
          </div>
        </motion.header>

        {/* Split Screen Hero */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center py-12 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[75vh]">

            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-8 z-20 text-center lg:text-left pt-10 lg:pt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-semibold tracking-wide uppercase mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  <span>Your Social Life, Visualized</span>
                </div>

                <h1 className="text-5xl sm:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-6 drop-shadow-2xl">
                  The Live Map for<br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300">
                    Local Connection.
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium tracking-tight">
                  Discover what's happening around you right now. Drop a pin, ditch the chaotic group chats, and instantly connect with your local community.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
              >
                <Button
                  onClick={handleOpenMap}
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-full shadow-[0_0_30px_rgba(45,212,191,0.3)] hover:shadow-[0_0_40px_rgba(45,212,191,0.5)] transition-all duration-300 transform hover:-translate-y-1 tracking-tight"
                >
                  <MapPin className="mr-2 w-5 h-5" />
                  Open Live Map
                </Button>

                <Button
                  onClick={handleHostEvent}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-amber-400/50 text-white rounded-full transition-all duration-300 tracking-tight shadow-xl group"
                >
                  <Plus className="mr-2 w-5 h-5 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
                  Host an Event
                </Button>
              </motion.div>
            </div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="relative w-full aspect-square max-w-[600px] mx-auto lg:ml-auto"
            >
              <AbstractMapVisual />
            </motion.div>

          </div>
        </main>

        {/* 3-Column Bento Box Value Props */}
        <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24 z-20">
          <div className="grid md:grid-cols-3 gap-6">
            {valueProps.map((prop, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <Card className="h-full bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 hover:border-teal-500/30 transition-colors duration-500 rounded-3xl overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <CardContent className="p-8 relative z-10 flex flex-col h-full">
                    <div className="w-14 h-14 bg-black/50 border border-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-500">
                      {prop.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-amber-400 transition-colors duration-300">
                      {prop.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed font-medium">
                      {prop.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl mx-auto px-6 py-24 text-center z-20"
        >
          <div className="p-16 rounded-[3rem] bg-gradient-to-b from-[#1A1A1A] to-[#121212] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-md">
              Your community is waiting.
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto tracking-tight font-medium">
              Join thousands of locals turning screen time into real-world connection.
            </p>

            <Button
              onClick={handleOpenMap}
              size="lg"
              className="h-16 px-12 text-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300 transform hover:scale-105 tracking-tight border border-transparent"
            >
              Explore the Map
            </Button>
          </div>
        </motion.section>

        {/* Minimal Footer */}
        <footer className="p-8 text-center relative z-20 border-t border-white/5 w-full mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto text-slate-500 text-sm font-medium">
            <div className="mb-4 md:mb-0">
              © 2026 Huddle. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}