"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, LogOut, Trophy, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/firebase-context";
import Link from "next/link";

// Interface for a single event object
interface GameEvent {
  id: string;
  title: string;
  sport: string;
  location: string;
  date: string;
  time: string;
  maxPlayers: number;
  currentPlayers: number;
}

// Interface for the user's statistics
interface UserStats {
  joined: number;
  organized: number;
  upcoming: number;
}

export default function ProfilePage() {
  // Authentication and navigation hooks
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  // State for user stats and events
  const [stats, setStats] = useState<UserStats>({ joined: 0, organized: 0, upcoming: 0 });
  const [recentEvents, setRecentEvents] = useState<GameEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Effect to fetch user data and associated events
  useEffect(() => {
    // If auth is done and there's no user, redirect to home
    if (!authLoading && !user) {
      router.push("/");
      return;
    }

    // If a user is logged in, fetch their events
    if (user) {
      const fetchUserEvents = async (userId: string) => {
        try {
          const response = await fetch(`/api/users/${userId}/events`);
          if (response.ok) {
            const data = await response.json();
            const organized = data.organizedEvents || [];
            const joined = data.joinedEvents || [];
            const now = new Date();

            // Calculate stats for the top card
            const upcomingCount = [...joined, ...organized].filter(
              (event) => new Date(event.date) > now
            ).length;
            setStats({
              joined: joined.length,
              organized: organized.length,
              upcoming: upcomingCount,
            });

            // Get the 3 most recent events for the "Recent Events" card
            const allEvents = [...joined, ...organized]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3);
            setRecentEvents(allEvents);
          }
        } catch (error) {
          console.error("Failed to fetch user events:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserEvents(user.uid);
    }
  }, [user, authLoading, router]);

  // Handler for the logout action
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Helper to format dates consistently
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Loading state while fetching user and event data
  if (loading || authLoading) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen liquid-gradient pb-24">
      {/* Header Section with gradient and user info */}
      <header className="relative bg-gradient-to-b from-blue-500/30 to-transparent p-4 text-white">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-white/10">
            Logout <LogOut className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <div className="text-center py-6">
          <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl font-bold">{user.displayName?.charAt(0) || "U"}</span>
          </div>
          <h1 className="text-2xl font-bold">{user.displayName || "User"}</h1>
          <p className="text-white/80">{user.email}</p>
        </div>
      </header>

      {/* Main content area with floating cards */}
      <main className="px-4 -mt-10">
        {/* Stats Card */}
        <Card className="glass-card mb-6 shadow-lg">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center text-white">
              <div>
                <p className="text-2xl font-bold">{stats.joined}</p>
                <p className="text-sm text-white/70">Events Joined</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.organized}</p>
                <p className="text-sm text-white/70">Organized</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
                <p className="text-sm text-white/70">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Card */}
        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Achievements</h2>
            <div className="flex items-center space-x-3 text-white/80">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>Join your first event to earn badges!</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Events Card */}
        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Events</h2>
            {recentEvents.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-white/70 mb-4">Start by joining or creating an event.</p>
                <Link href="/" passHref>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">Explore Events</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentEvents.map((event) => (
                  <div key={event.id} className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-white">{event.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-white/70 mt-1">
                        <div className="flex items-center"><Calendar className="w-3 h-3 mr-1" /><span>{formatDate(event.date)}</span></div>
                        <div className="flex items-center"><Users className="w-3 h-3 mr-1" /><span>{event.currentPlayers}/{event.maxPlayers}</span></div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-none">{event.sport}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Button asChild variant="ghost" className="w-full justify-start text-white/90 hover:bg-white/10 hover:text-white">
                <Link href="/events"><Users className="w-4 h-4 mr-3" /> View My Events</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start text-white/90 hover:bg-white/10 hover:text-white">
                <Link href="/"><MapPin className="w-4 h-4 mr-3" /> Find Nearby Events</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
