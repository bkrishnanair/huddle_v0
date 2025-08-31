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
      title: "Discover Venues",
      description: "Explore the best courts, fields, and sports facilities nearby"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Never Miss a Game",
      description: "Schedule and join games with real-time updates and reminders"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Stay Connected",
      description: "Chat with your team and coordinate game plans seamlessly"
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
            className="text-white/90 hover:text-white hover:bg-white/20 rounded-full px-6"
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
                Your Game is Waiting. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Find it with Huddle.</span>
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                Discover, join, and organize sports games in your community. 
                Connect with local players and never miss the perfect game.
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
                Start Playing Today
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="ghost" 
                className="text-white/90 hover:text-white hover:bg-white/20 px-8 py-4 text-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                How it Works
              </Button>
            </div>

            {/* Use Cases Section */}
            <div className="max-w-5xl mx-auto w-full">
                <h3 className="text-3xl font-bold text-white mb-8">Built for Every Player</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1: The Weekend Warrior */}
                    <Card className="glass-card border-white/20 text-left">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mb-4">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">For the Weekend Warrior</h4>
                            <p className="text-white/70">You love the game but can't commit to a league. With Huddle, you can find a high-quality cricket match or a casual basketball run whenever your schedule opens up. Spend less time searching and more time playing.</p>
                        </CardContent>
                    </Card>

                    {/* Card 2: The Team Captain */}
                    <Card className="glass-card border-white/20 text-left">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mb-4">
                                <Users className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">For the Team Captain</h4>
                            <p className="text-white/70">Stop chasing RSVPs in endless group chats. Create your event on Huddle, set the number of players you need, and watch your roster fill up in real-time. We make organizing effortless so you can focus on the win.</p>
                        </CardContent>
                    </Card>

                    {/* Card 3: The Newcomer */}
                    <Card className="glass-card border-white/20 text-left">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 glass rounded-lg flex items-center justify-center mb-4">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">For the Newcomer</h4>
                            <p className="text-white/70">Just moved to a new city? Huddle is your key to the local sports scene. Discover popular courts, fields, and communities. Meet new people and find your team, no matter where you are.</p>
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
