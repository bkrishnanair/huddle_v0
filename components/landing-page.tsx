"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  Trophy, 
  ArrowRight,
  Play,
  Sparkles
} from "lucide-react";

// Custom Huddle Logo SVG
const HuddleLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-white"
  >
    <path
      d="M4 4V20M20 4V20M4 12H20M12 4V12C12 14.2091 10.2091 16 8 16C5.79086 16 4 14.2091 4 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Find Your Team",
      description: "Connect with local players and join exciting games in your area"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Explore Nearby Games",
      description: "Explore games happening near you on an interactive map. Filter by sport, time, and find your next game instantly."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Stay in the Loop, Always.",
      description: "Get real-time event updates, chat directly with players, and receive timely push notifications so you're always in the know."
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Build Your Sports Community",
      description: "Connect with local players, expand your sports network, and find your perfect match."
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen liquid-gradient relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-400/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-purple-400/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-green-400/20 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <HuddleLogo />
            </div>
            <h1 className="text-2xl font-bold text-white">Huddle</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={onGetStarted}
            className="glass-card text-white/90 hover:text-white hover:bg-white/20 rounded-full px-6"
          >
            Get Started
          </Button>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Main Tagline */}
            <div className="mb-8">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Stop Searching, Start Playing. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Find Your Huddle.</span>
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                Discover and join local sports games in real-time. Connect with players, organize events effortlessly, and never miss a moment of the action.
              </p>
            </div>

            {/* Feature Showcase */}
            <div className="mb-12">
              <Card className="glass-card border-white/20 max-w-4xl mx-auto">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mr-4">
                      {features[currentFeature].icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-semibold text-white mb-2">
                        {features[currentFeature].title}
                      </h3>
                      <p className="text-white/70">
                        {features[currentFeature].description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Feature Indicators */}
                  <div className="flex justify-center space-x-2">
                    {features.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentFeature ? 'bg-white w-6' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={onGetStarted}
                className="glass-card hover:glow text-white border-white/30 px-8 py-4 text-lg font-semibold group"
              >
                Join the Huddle
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            {/* <Button 
              variant="ghost" 
              className="text-white/90 hover:text-white hover:bg-white/20 px-8 py-4 text-lg"
            >
              <Play className="mr-2 w-5 h-5" />
              How it Works
            </Button>
            */}
            </div>

            {/* Use Cases Section */}
            <div className="max-w-5xl mx-auto w-full">
                <h3 className="text-3xl font-bold text-white mb-8">Built for Every Player</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1: The Casual Player */}
                    <Card className="glass-card border-white/20 text-left">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mb-4">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">For the Casual Player</h4>
                            <p className="text-white/70">Play When You Can. Love playing but short on time? Huddle helps you find quality games that fit your schedule, from casual runs to organized matches. Less searching, more playing.</p>
                        </CardContent>
                    </Card>

                    {/* Card 2: The Organizer */}
                    <Card className="glass-card border-white/20 text-left">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mb-4">
                                <Users className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">For the Organizer</h4>
                            <p className="text-white/70">Effortless Event Management. Say goodbye to group chat chaos. Create events, manage RSVPs, track attendance with check-ins, and even get AI assistance for event descriptions. Focus on the game, not the logistics.</p>
                        </CardContent>
                    </Card>

                    {/* Card 3: The Explorer */}
                    <Card className="glass-card border-white/20 text-left">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mb-4">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">For the Explorer</h4>
                            <p className="text-white/70">Discover Your Sports Scene. New in town or just looking for something new? Explore nearby games on the map, filter by sport and time, and instantly connect with local communities. Your next favorite game is waiting.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <div className="flex justify-center items-center space-x-6 text-white/60 text-sm">
            <span>© 2024 Huddle. All rights reserved.</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </footer>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <Button 
          onClick={onGetStarted}
          className="glass-card hover:glow text-white border-white/30 rounded-full w-14 h-14 p-0 shadow-2xl"
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
