"use client"

import { useEffect, useState, useMemo } from "react"
import { GameEvent } from "@/lib/types"
import { EventCard } from "@/components/events/event-card"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/firebase-context"
import { useRouter } from "next/navigation"
import EventDetailsDrawer from "@/components/event-details-drawer"

interface EventListProps {
  userId: string
  eventType: "organized" | "joined" | "history"
  searchQuery?: string
}

export function EventList({ userId, eventType, searchQuery = "" }: EventListProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<GameEvent[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past">("upcoming")

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {
        // Default to SF if location denied
        setUserLocation({ lat: 37.7749, lng: -122.4194 })
      }
    )
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const { getAuth } = await import("firebase/auth");
        const currentUser = getAuth().currentUser;
        const idToken = currentUser ? await currentUser.getIdToken() : "";

        const response = await fetch(`/api/users/${userId}/events?type=${eventType}`, {
          headers: {
            "Authorization": `Bearer ${idToken}`
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch events with status: ${response.status}`)
        }

        const data = await response.json()
        let fetchedEvents = data.events || []

        // Calculate distances if location is available
        if (userLocation) {
          fetchedEvents = fetchedEvents.map((event: GameEvent) => {
            if (event.geopoint) {
              const R = 3958.8; // Radius in miles
              const dLat = (event.geopoint.latitude - userLocation.lat) * Math.PI / 180;
              const dLon = (event.geopoint.longitude - userLocation.lng) * Math.PI / 180;
              const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(event.geopoint.latitude * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              return { ...event, distance: Math.round(R * c * 10) / 10 };
            }
            return event;
          });
        }

        setEvents(fetchedEvents)
      } catch (err) {
        console.error(`Error fetching ${eventType} events:`, err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchEvents()
    }
  }, [userId, eventType, userLocation])

  const handleUnjoin = async (eventId: string) => {
    if (!user) return;

    // Optimistic UI update
    const previousEvents = [...events];
    setEvents(events.filter(e => e.id !== eventId));

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ action: "leave" }),
        credentials: "include"
      });

      if (response.ok) {
        toast.success("You've unjoined the game");
      } else {
        throw new Error("Failed to leave event on server");
      }
    } catch (err) {
      console.error("Unjoin error:", err);
      toast.error("An error occurred while leaving the event");
      // Revert optimistic update
      setEvents(previousEvents);
    }
  }

  const processedEvents = useMemo(() => {
    let filtered = events;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.name?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q)
      );
    }

    const parseDateTime = (ev: GameEvent) => {
      if (!ev.date) return 0;
      try {
        const timePart = ev.time || '00:00:00';
        const d = ev.date.includes('/') ? new Date(ev.date) : new Date(`${ev.date}T${timePart}`);
        return isNaN(d.getTime()) ? 0 : d.getTime();
      } catch { return 0; }
    };

    // Sort soonest first by default
    filtered.sort((a, b) => parseDateTime(a) - parseDateTime(b));
    if (eventType === "history") {
      // History should show most recent past first
      filtered.sort((a, b) => parseDateTime(b) - parseDateTime(a));
    }

    return filtered;
  }, [events, searchQuery, eventType]);

  const isUpcoming = (ev: GameEvent) => {
    if (!ev.date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let d;
    if (ev.date.includes('/')) {
      d = new Date(ev.date);
    } else {
      d = new Date(`${ev.date}T00:00:00`);
    }
    return d >= today;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center glass-surface rounded-lg p-4">
        <AlertCircle className="w-10 h-10 text-destructive mb-3" />
        <p className="font-semibold text-lg mb-1">Could not load events</p>
        <p className="text-sm text-slate-400">{error}</p>
      </div>
    )
  }

  if (processedEvents.length === 0) {
    return (
      <div className="text-center py-8 glass-surface rounded-lg p-4">
        <p className="text-slate-400">
          {searchQuery
            ? "No events match your search."
            : eventType === "history"
              ? "No past events to show."
              : eventType === "organized"
                ? "You haven't organized any events yet."
                : "You haven't joined any events yet."}
        </p>
      </div>
    )
  }

  return (
    <>
      {eventType === "organized" || eventType === "joined" ? (
        <div className="space-y-6">
          <div className="flex bg-slate-800/50 p-1 rounded-xl w-fit">
            <button
              onClick={() => setTimeFilter("upcoming")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${timeFilter === "upcoming" ? "bg-primary text-primary-foreground shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              Upcoming ({processedEvents.filter(isUpcoming).length})
            </button>
            <button
              onClick={() => setTimeFilter("past")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${timeFilter === "past" ? "bg-primary text-primary-foreground shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              Past ({processedEvents.filter(e => !isUpcoming(e)).length})
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {timeFilter === "upcoming" && (
              processedEvents.filter(isUpcoming).length === 0 ? (
                <p className="text-slate-400 text-sm glass-surface p-4 rounded-xl text-center">No upcoming events.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {processedEvents.filter(isUpcoming).map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onSelectEvent={setSelectedEvent}
                      onUnjoin={eventType === "joined" ? () => handleUnjoin(event.id) : undefined}
                      showMapButton={true}
                    />
                  ))}
                </div>
              )
            )}

            {timeFilter === "past" && (
              processedEvents.filter(e => !isUpcoming(e)).length === 0 ? (
                <p className="text-slate-400 text-sm glass-surface p-4 rounded-xl text-center">No past events yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {processedEvents.filter(e => !isUpcoming(e)).reverse().map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onSelectEvent={setSelectedEvent}
                      onUnjoin={eventType === "joined" ? () => handleUnjoin(event.id) : undefined}
                      showMapButton={true}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelectEvent={setSelectedEvent}
              showMapButton={true}
            />
          ))}
        </div>
      )}

      {selectedEvent && (
        <EventDetailsDrawer
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEventUpdated={(updatedEvent) => {
            setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
          }}
        />
      )}
    </>
  )
}
