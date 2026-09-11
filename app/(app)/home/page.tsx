"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/lib/firebase-context"
import { EventGridCard } from "@/components/dashboard/event-grid-card"
import EventDetailsDrawer from "@/components/event-details-drawer"
import { GameEvent } from "@/lib/types"
import { Loader2, Search, SlidersHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"

interface FeaturedData {
  happeningNow: GameEvent[];
  popular: GameEvent[];
  newEvents: GameEvent[];
  categories: { name: string; count: number }[];
}

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<FeaturedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null)

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

  const { topMatches, upcomingEvents } = useMemo(() => {
    if (!data) return { topMatches: [], upcomingEvents: [] };
    
    // Tsenta Layout: "Top Job Matches" -> "Top Event Matches" (happening now + top popular)
    const matches = [...data.happeningNow, ...data.popular.slice(0, 3)].slice(0, 5).map((e, i) => ({
      ...e,
      _matchScore: 98 - (i * 4) // mock match score: 98, 94, 90...
    }));

    // "All applications" -> "Upcoming Events Grid" (rest of popular + new)
    const upcoming = [...data.popular.slice(3), ...data.newEvents];
    
    // Deduplicate by ID
    const uniqueUpcoming = upcoming.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    // Remove if already in matches
    const finalUpcoming = uniqueUpcoming.filter(u => !matches.some(m => m.id === u.id));

    return { topMatches: matches, upcomingEvents: finalUpcoming };
  }, [data]);

  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    )
  }

  return (
    <div className="flex-1 pb-24 overflow-x-hidden pt-4 bg-[#0f172a] min-h-screen">
      <div className="px-4 max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            {getGreeting()}, {user?.displayName?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover what's happening around campus, tailored for you.
          </p>
        </div>

        {/* Tsenta-style Global Search & Quick Filters */}
        <div className="flex flex-col gap-3">
          <div 
            onClick={() => router.push("/discover")}
            className="flex items-center gap-3 bg-[#1e293b]/50 border border-white/10 hover:border-white/20 transition-all rounded-2xl px-4 py-3 cursor-pointer"
          >
            <Search className="w-5 h-5 text-slate-400" />
            <span className="text-slate-400 text-sm font-medium flex-1">Search events, keywords, or vibes...</span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-800 px-2 py-1 rounded">cmd + k</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mask-edges">
            <button onClick={() => router.push("/discover?time=Today")} className="shrink-0 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-white/5 text-xs font-bold text-slate-300 transition-colors">
              Today
            </button>
            <button onClick={() => router.push("/discover?time=This Weekend")} className="shrink-0 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-white/5 text-xs font-bold text-slate-300 transition-colors">
              This Weekend
            </button>
            <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />
            {["Sports", "Music", "Community", "Food & Drink"].map(cat => (
              <button key={cat} onClick={() => router.push(`/discover?category=${cat}`)} className="shrink-0 px-3 py-1.5 rounded-full bg-[#1e293b]/50 hover:bg-[#1e293b] border border-white/5 text-xs font-bold text-slate-400 transition-colors">
                {cat}
              </button>
            ))}
            <button onClick={() => router.push("/discover")} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-xs font-bold text-teal-400 transition-colors ml-auto">
              <SlidersHorizontal className="w-3 h-3" /> Filters
            </button>
          </div>
        </div>

        {/* Top Matches (Horizontal Scroll) */}
        {topMatches.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Top Event Matches
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 snap-x snap-mandatory mask-edges">
              {topMatches.map((event: any) => (
                <div key={event.id} className="snap-start shrink-0 w-[300px] md:w-[320px]">
                  <EventGridCard 
                    event={event} 
                    onSelectEvent={setSelectedEvent} 
                    matchPercentage={event._matchScore} 
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events (Grid) */}
        {upcomingEvents.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                All Upcoming Events
              </h2>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-white/5">
                {upcomingEvents.length} events
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {upcomingEvents.map((event) => (
                <EventGridCard 
                  key={event.id} 
                  event={event} 
                  onSelectEvent={setSelectedEvent} 
                />
              ))}
            </div>
          </section>
        )}

        {(!data || (data.happeningNow.length === 0 && data.popular.length === 0 && data.newEvents.length === 0)) && (
          <div className="text-center py-20 border border-white/10 rounded-3xl bg-slate-900/50">
            <div className="text-4xl mb-4">🗺️</div>
            <h2 className="text-xl font-bold text-white mb-2">No events found</h2>
            <p className="text-slate-400 text-sm">Check back later or be the first to host!</p>
          </div>
        )}

      </div>

      {selectedEvent && (
        <EventDetailsDrawer
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEventUpdated={() => {}}
        />
      )}
    </div>
  )
}
