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
  Trophy,
  Zap,
  Clock,
  Heart,
  Star,
  Play,
  Calendar,
  MessageCircle,
  Award
} from "lucide-react";

const HuddleLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-foreground">
    <path d="M4 4V20M20 4V20M4 12H20M12 4V12C12 14.2091 10.2091 16 8 16C5.79086 16 4 14.2091 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Floating background elements component
const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="floating-orb absolute top-20 left-[10%] w-4 h-4 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: '0s' }} />
    <div className="floating-orb absolute top-[30%] right-[15%] w-6 h-6 rounded-full bg-blue-400/20 animate-bounce" style={{ animationDelay: '2s' }} />
    <div className="floating-orb absolute top-[60%] left-[20%] w-3 h-3 rounded-full bg-purple-400/20 animate-pulse" style={{ animationDelay: '4s' }} />
    <div className="floating-orb absolute bottom-[30%] right-[25%] w-5 h-5 rounded-full bg-green-400/20 animate-bounce" style={{ animationDelay: '1s' }} />
    <div className="floating-orb absolute top-[80%] left-[80%] w-4 h-4 rounded-full bg-orange-400/20 animate-pulse" style={{ animationDelay: '3s' }} />
    
    {/* Geometric shapes */}
    <div className="absolute top-[15%] right-[10%] w-8 h-8 border border-primary/20 rotate-45 animate-spin" style={{ animationDuration: '10s' }} />
    <div className="absolute bottom-[20%] left-[10%] w-6 h-6 border border-blue-400/20 rotate-12 animate-ping" style={{ animationDelay: '2s' }} />
  </div>
);

interface LandingPageProps {
  onGetStarted: () => void;
}

const features = [
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Find Games Instantly",
      description: "See every pickup game happening around you on a real-time map. Your next game is just a tap away."
    },
    {
      icon: <Cpu className="w-8 h-8 text-primary" />,
      title: "AI-Assisted Events",
      description: "Let AI help you craft the perfect event title and description to attract players and fill your roster faster."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "Verified Check-ins",
      description: "Build your reputation with our check-in system. Organizers see you're reliable, so you get more invites."
    }
  ];

const howItWorks = [
  {
    step: "1",
    icon: <MapPin className="w-6 h-6" />,
    title: "Discover Games",
    description: "Open the map and instantly see pickup games happening around you in real-time."
  },
  {
    step: "2", 
    icon: <Calendar className="w-6 h-6" />,
    title: "Join or Create",
    description: "Found your game? Join with one tap. Don't see anything? Create your own event in seconds."
  },
  {
    step: "3",
    icon: <Users className="w-6 h-6" />,
    title: "Play & Connect", 
    description: "Show up, play, and build your local sports community. Rate players and earn your reputation."
  }
];

const socialProof = [
  { icon: <Users className="w-5 h-5" />, stat: "5,000+", label: "Active Players" },
  { icon: <Calendar className="w-5 h-5" />, stat: "1,200+", label: "Games Created" },
  { icon: <Star className="w-5 h-5" />, stat: "4.9/5", label: "App Rating" },
  { icon: <Award className="w-5 h-5" />, stat: "98%", label: "Show-up Rate" }
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
    <div className="min-h-screen liquid-gradient text-foreground overflow-hidden relative">
      <FloatingElements />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Enhanced Header */}
        <header className="flex items-center justify-between p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 glass-surface rounded-lg flex items-center justify-center shadow-lg">
              <HuddleLogo />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Huddle</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:flex text-slate-300 hover:text-white hover:bg-white/10">
              How it works
            </Button>
            <Button variant="secondary" onClick={onGetStarted} className="px-6 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              Get Started
            </Button>
          </div>
        </header>

        {/* Enhanced Hero Section */}
        <main className="flex-1 flex flex-col px-4 md:px-6">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="max-w-5xl mx-auto">
              {/* Social Proof Badge */}
              <div className="inline-flex items-center space-x-2 glass-surface rounded-full px-4 py-2 mb-8 border border-white/20">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
                </div>
                <span className="text-sm text-slate-300">Join 5,000+ players already having fun</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 leading-tight">
                Where pickup games
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-400">come to life</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                Ditch the endless group chats. Find your game in seconds with our AI-powered platform that connects players, fills rosters instantly, and builds lasting sports communities.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
                <Button onClick={onGetStarted} size="lg" className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Play className="mr-2 w-5 h-5" />
                  Start Playing Now
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg glass-surface border-white/30 hover:bg-white/10 rounded-full transition-all duration-300">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  See How It Works
                </Button>
              </div>

              {/* Social Proof Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                {socialProof.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-primary mb-1">
                      {item.icon}
                      <span className="text-2xl font-bold">{item.stat}</span>
                    </div>
                    <p className="text-sm text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="max-w-6xl mx-auto py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                From idea to game in <span className="text-primary">3 simple steps</span>
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                We've made finding and organizing pickup games so simple, you'll wonder how you ever managed without us.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step, index) => (
                <Card key={index} className="glass-surface border-white/15 hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-orange-400/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-primary/30 group-hover:to-orange-400/30 transition-all duration-300">
                      <div className="text-primary">
                        {step.icon}
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-sm">{step.step}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Enhanced Features Showcase */}
          <div className="max-w-4xl mx-auto py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Built for <span className="text-primary">real players</span>
              </h2>
              <p className="text-lg text-slate-300">
                Every feature designed to get you off your phone and onto the field.
              </p>
            </div>

            <Card className="glass-surface border-white/15 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-left">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-orange-400/20 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl">
                    {features[currentFeature].icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-semibold text-slate-50 mb-3">
                      {features[currentFeature].title}
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      {features[currentFeature].description}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-3 mt-10">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        index === currentFeature 
                          ? 'bg-primary w-8 shadow-lg' 
                          : 'bg-slate-600 w-3 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Final CTA Section */}
          <div className="max-w-4xl mx-auto py-16 text-center">
            <Card className="glass-surface border-white/15 bg-gradient-to-r from-white/5 to-primary/5">
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to level up your game?
                </h2>
                <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of players who've already discovered the easiest way to find, create, and join pickup games in their neighborhood.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Button onClick={onGetStarted} size="lg" className="h-16 px-12 text-xl font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Zap className="mr-3 w-6 h-6" />
                    Get Started - It's Free
                  </Button>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Setup takes less than 2 minutes
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className="p-6 mt-8 text-center backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-slate-400 text-sm">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Made with love for the sports community</span>
            </div>
            <div className="flex items-center space-x-6">
              <span>© 2024 Huddle. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <span className="hidden sm:inline">•</span>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
