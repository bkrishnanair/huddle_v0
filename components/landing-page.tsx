"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  MapPin, 
  CheckCircle,
  ArrowRight,
  Cpu,
  Trophy
} from "lucide-react";

const HuddleLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-foreground">
    <path d="M4 4V20M20 4V20M4 12H20M12 4V12C12 14.2091 10.2091 16 8 16C5.79086 16 4 14.2091 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface LandingPageProps {
  onGetStarted: () => void;
}

const features = [
    {
      icon: <MapPin className="w-8 h-8 text-emerald-400" />,
      title: "Find Games Instantly",
      description: "See every pickup game happening around you on a real-time map. Your next game is just a tap away."
    },
    {
      icon: <Cpu className="w-8 h-8 text-emerald-400" />,
      title: "AI-Assisted Events",
      description: "Let AI help you craft the perfect event title and description to attract players and fill your roster faster."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-emerald-400" />,
      title: "Verified Check-ins",
      description: "Build your reputation with our check-in system. Organizers see you're reliable, so you get more invites."
    }
  ];

export default function LandingPage({ onGetStarted }: LandingPageProps) {
    const [currentFeature, setCurrentFeature] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 5000);
        return () => clearInterval(interval);
      }, []);

  return (
    <div className="min-h-screen liquid-gradient text-foreground overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 glass-surface rounded-lg flex items-center justify-center">
              <HuddleLogo />
            </div>
            <h1 className="text-2xl font-bold">Huddle</h1>
          </div>
          <Button variant="secondary" onClick={onGetStarted} className="px-6 h-11 rounded-full">
            Get Started
          </Button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-50 to-slate-300 mb-6 leading-tight">
              Stop the group-chat chaos. Find your game now.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Real-time map, instant RSVPs, and AI that fills rosters fast.
            </p>
            <div className="flex justify-center items-center">
              <Button onClick={onGetStarted} size="lg" className="h-14 px-10 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                Start Playing Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="w-full max-w-4xl mx-auto mt-20 md:mt-32 px-4">
              <Card className="glass-surface border-white/15">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-left">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      {features[currentFeature].icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-50 mb-2">
                        {features[currentFeature].title}
                      </h3>
                      <p className="text-slate-300 text-lg">
                        {features[currentFeature].description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-2 mt-8">
                    {features.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentFeature ? 'bg-emerald-400 w-6' : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
        </main>

        <footer className="p-6 mt-16 md:mt-24 text-center">
          <div className="flex justify-center items-center space-x-6 text-slate-400 text-sm">
            <span>© 2024 Huddle. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
