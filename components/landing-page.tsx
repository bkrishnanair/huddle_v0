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
  Award,
  BookOpen,
  Mic,
  Palette
} from "lucide-react";

const HuddleLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-foreground">
    <path d="M4 4V20M20 4V20M4 12H20M12 4V12C12 14.2091 10.2091 16 8 16C5.79086 16 4 14.2091 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Floating background elements component
const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="floating-orb absolute top-20 left-[10%] w-4 h-4 rounded-full bg-primary/20 animate-pulse"
      style={{ animationDelay: "0s" }}
    />
    <div
      className="floating-orb absolute top-[30%] right-[15%] w-6 h-6 rounded-full bg-blue-400/20 animate-bounce"
      style={{ animationDelay: "2s" }}
    />
    <div
      className="floating-orb absolute top-[60%] left-[20%] w-3 h-3 rounded-full bg-purple-400/20 animate-pulse"
      style={{ animationDelay: "4s" }}
    />
    <div
      className="floating-orb absolute bottom-[30%] right-[25%] w-5 h-5 rounded-full bg-green-400/20 animate-bounce"
      style={{ animationDelay: "1s" }}
    />
    <div
      className="floating-orb absolute top-[80%] left-[80%] w-4 h-4 rounded-full bg-orange-400/20 animate-pulse"
      style={{ animationDelay: "3s" }}
    />

    {/* Geometric shapes */}
    <div
      className="absolute top-[15%] right-[10%] w-8 h-8 border border-primary/20 rotate-45 animate-spin"
      style={{ animationDuration: "10s" }}
    />
    <div
      className="absolute bottom-[20%] left-[10%] w-6 h-6 border border-blue-400/20 rotate-12 animate-ping"
      style={{ animationDelay: "2s" }}
    />
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
      icon: <Mic className="w-8 h-8 text-primary" />,
      title: "The Creator",
      description: "Hosting a workshop, an open mic night, or a yoga class? Huddle gives you the tools to reach your local community and manage your event effortlessly."
    },
    {
      icon: <Palette className="w-8 h-8 text-primary" />,
      title: "The Explorer",
      description: "New to the area or just looking for something to do? Open the map and instantly see the vibrant, real-time pulse of your community."
    }
  ];
  
const howItWorks = [
  {
    step: "1",
    icon: <MapPin className="w-6 h-6" />,
    title: "Discover Events",
    description: "Open the map and instantly see events happening around you in real-time."
  },
  {
    step: "2", 
    icon: <Calendar className="w-6 h-6" />,
    title: "Join or Create",
    description: "Found your event? Join with one tap. Don't see anything? Create your own in seconds."
  },
  {
    step: "3",
    icon: <Users className="w-6 h-6" />,
    title: "Connect & Belong", 
    description: "Show up, participate, and build your local community. Rate events and earn your reputation."
  }
];

const socialProof = [
  { icon: <Users className="w-5 h-5" />, stat: "X,000+", label: "Active Members" },
  { icon: <Calendar className="w-5 h-5" />, stat: "Y,000+", label: "Events Created" },
  { icon: <Star className="w-5 h-5" />, stat: "#.#/#", label: "App Rating" },
  { icon: <Award className="w-5 h-5" />, stat: "##%", label: "Satisfaction Rate" }
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
            {/*
            <Button variant="ghost" className="hidden md:flex text-slate-300 hover:text-white hover:bg-white/10">
              How it works
            </Button>
            */}
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
                <span className="text-sm text-slate-300">Join X,000+ members already connecting</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 leading-tight">
                Your Community is Waiting.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-400">Find it with Huddle.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                From pickup games to study groups, discover and join what's happening around you in real-time.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
                <Button onClick={onGetStarted} size="lg" className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Play className="mr-2 w-5 h-5" />
                  Explore Events
                </Button>
                {/*
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg glass-surface border-white/30 hover:bg-white/10 rounded-full transition-all duration-300">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  See How It Works
                </Button>
                */}
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
                From idea to event in <span className="text-primary">3 simple steps</span>
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                We've made finding and organizing local events so simple, you'll wonder how you ever managed without us.
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
          

          {/* Enhanced Use Cases Showcase */}
          <div className="max-w-4xl mx-auto py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Built for <span className="text-primary">every community</span>
              </h2>
              <p className="text-lg text-slate-300">
                Every feature is designed to get you off your phone and into your community.
              </p>
            </div>

            <Card className="glass-surface border-white/15 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-left">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-orange-400/20 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl">
                    {useCases[currentUseCase].icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-semibold text-slate-50 mb-3">
                      {useCases[currentUseCase].title}
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      {useCases[currentUseCase].description}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-3 mt-10">
                  {useCases.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentUseCase(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        index === currentUseCase 
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
                  Ready to find your crowd?
                </h2>
                <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of members who've already discovered the easiest way to find, create, and join local events.
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
              <span>Made with love for local communities</span>
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