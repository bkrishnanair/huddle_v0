"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase-context";
import { useRouter } from "next/navigation";
import { EventCard, EventCardSkeleton } from "@/components/events/event-card";
import EventDetailsDrawer from "@/components/event-details-drawer";
import { GameEvent } from "@/lib/types";
import { getCategoryColor } from "@/lib/utils";
import {
  Loader2,
  Radio,
  TrendingUp,
  Sparkles,
  LayoutGrid,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const CATEGORY_EMOJI: Record<string, string> = {
  Sports: "⚽",
  Music: "🎵",
  Community: "🤝",
  Learning: "📚",
  "Food & Drink": "🍕",
  Tech: "💻",
  "Arts & Culture": "🎨",
  Outdoors: "🌲",
};

interface FeaturedData {
  happeningNow: GameEvent[];
  popularThisWeek: GameEvent[];
  newOnHuddle: GameEvent[];
  categoryCounts: { name: string; count: number }[];
  serendipityPicks?: GameEvent[];
}

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<FeaturedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/events/featured");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch featured events:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 pb-28">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-64 bg-slate-800/50 rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const happeningNow = data?.happeningNow || [];
  const popular = data?.popularThisWeek || [];
  const newEvents = data?.newOnHuddle || [];
  const categories = data?.categoryCounts || [];
  const serendipityPicks = data?.serendipityPicks || [];

  return (
    <div className="min-h-screen bg-slate-950 pb-28">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">
            {getGreeting()}, {user?.displayName?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Discover what&apos;s happening around campus
          </p>
        </div>

        {/* ============ SERENDIPITY PICKS ============ */}
        {serendipityPicks.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Sparkles className="w-5 h-5 text-teal-400" />
              </div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                Serendipity Picks
              </h2>
              <span className="text-[10px] text-teal-400 font-bold bg-teal-400/10 px-2 py-0.5 rounded-full border border-teal-400/20">
                Recommended for you
              </span>
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 snap-x snap-mandatory">
              {serendipityPicks.map((event) => (
                <div
                  key={`sp-${event.id}`}
                  onClick={() => setSelectedEvent(event)}
                  className="snap-start shrink-0 w-[280px] bg-teal-950/30 border border-teal-500/20 rounded-2xl p-4 cursor-pointer hover:bg-teal-900/40 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">
                      {CATEGORY_EMOJI[event.category || event.sport || ""] || "✨"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-white truncate">
                        {event.name || event.title}
                      </h3>
                      <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
                        {event.category || event.sport}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-400 truncate max-w-[150px]">
                      ⏱️ {event.date} {event.time}
                    </span>
                    <span className="text-xs text-white font-bold bg-white/10 px-2 py-0.5 rounded-full">
                      {event.currentPlayers}/{event.maxPlayers}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============ HAPPENING NOW ============ */}
        {happeningNow.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Radio className="w-5 h-5 text-emerald-400" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                Happening Now
              </h2>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                {happeningNow.length} live
              </span>
            </div>

            {/* Horizontal scroll carousel */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 snap-x snap-mandatory">
              {happeningNow.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="snap-start shrink-0 w-[280px] glass-surface border border-emerald-500/20 rounded-2xl p-4 cursor-pointer hover:bg-white/5 transition-all group relative overflow-hidden"
                >
                  {/* Live pulse */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">
                      Live
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">
                      {CATEGORY_EMOJI[event.category || event.sport || ""] || "📍"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-white truncate">
                        {event.name || event.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {event.category || event.sport}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-400 truncate max-w-[150px]">
                      📍 {event.venue || event.location || "TBD"}
                    </span>
                    <span className="text-xs text-white font-bold bg-white/10 px-2 py-0.5 rounded-full">
                      {event.currentPlayers}/{event.maxPlayers}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============ BROWSE BY CATEGORY ============ */}
        {categories.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                Browse by Category
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const color = getCategoryColor(cat.name);
                const emoji = CATEGORY_EMOJI[cat.name] || "📍";
                return (
                  <button
                    key={cat.name}
                    onClick={() =>
                      router.push(
                        `/discover?category=${encodeURIComponent(cat.name)}`
                      )
                    }
                    className="group flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: `${color}15`,
                      borderColor: `${color}30`,
                    }}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <div className="text-left min-w-0 flex-1">
                      <span className="text-sm font-bold text-white truncate block">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {cat.count} {cat.count === 1 ? "event" : "events"}
                      </span>
                    </div>
                    <ChevronRight
                      className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors shrink-0"
                    />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ============ POPULAR THIS WEEK ============ */}
        {popular.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <h2 className="text-lg font-black text-white uppercase tracking-wider">
                  Popular This Week
                </h2>
              </div>
              <button
                onClick={() => router.push("/discover")}
                className="text-xs text-primary font-bold flex items-center gap-1 hover:underline"
              >
                See all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {popular.slice(0, 6).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelectEvent={setSelectedEvent}
                  showMapButton
                />
              ))}
            </div>
          </section>
        )}

        {/* ============ NEW ON HUDDLE ============ */}
        {newEvents.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                New on Huddle
              </h2>
            </div>
            <div className="space-y-3">
              {newEvents.slice(0, 5).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelectEvent={setSelectedEvent}
                  showMapButton
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!loading &&
          happeningNow.length === 0 &&
          popular.length === 0 &&
          newEvents.length === 0 && (
            <div className="text-center pt-16">
              <div className="text-5xl mb-4">🗺️</div>
              <h2 className="text-xl font-bold text-white mb-2">
                No events yet
              </h2>
              <p className="text-slate-400 mb-6">
                Be the first to create an event on campus!
              </p>
              <button
                onClick={() => router.push("/map")}
                className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Go to Map
              </button>
            </div>
          )}
      </div>

      {/* Event Details Drawer */}
      {selectedEvent && (
        <EventDetailsDrawer
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEventUpdated={() => {}}
        />
      )}
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
