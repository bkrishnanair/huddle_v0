"use client";

import { useState, useEffect, useMemo } from "react";
import { getEvents } from "@/lib/db";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateEventModal from "@/components/create-event-modal";
import EventDetailsModal from "@/components/event-details-modal";
import { EventCard } from "@/components/events/event-card";
import { SummaryHeader } from "@/components/events/summary-header";
import { useAuth } from "@/lib/firebase-context";

interface GameEvent {
  id: string;
  title: string;
  sport: string;
  location: any;
  date: string;
  time: string;
  maxPlayers: number;
  currentPlayers: number;
  createdBy: string;
  players: string[];
}

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const sports = useMemo(() => {
    const allSports = events.map((e) => e.sport);
    return ["All", ...Array.from(new Set(allSports))];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.sport.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSport = selectedSport === "All" || event.sport === selectedSport;
      return matchesSearch && matchesSport;
    });
  }, [events, searchQuery, selectedSport]);

  const summaryStats = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const eventsToday = events.filter((e) => e.date === today).length;
    const yourUpcoming = user
      ? events.filter(
          (e) =>
            new Date(e.date) >= now &&
            (e.createdBy === user.uid || e.players.includes(user.uid))
        ).length
      : 0;
    return { totalEvents: events.length, eventsToday, yourUpcoming };
  }, [events, user]);

  return (
    <div className="min-h-screen liquid-gradient p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Discover Events</h1>
          <p className="text-white/80">Find and join games happening around you.</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="glass-card mt-4 md:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </header>

      <SummaryHeader
        totalEvents={summaryStats.totalEvents}
        eventsToday={summaryStats.eventsToday}
        yourUpcomingEvents={summaryStats.yourUpcoming}
      />

      <div className="glass-card p-4 rounded-2xl mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
            <Input
              placeholder="Search by name or sport..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-white/20 text-white placeholder:text-white/60"
            />
          </div>
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="glass border-white/20 text-white">
              <SelectValue placeholder="Filter by sport" />
            </SelectTrigger>
            <SelectContent className="glass-card">
              {sports.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-white/80">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center glass-card p-8 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
          <p className="text-white/70 mb-4">
            Try adjusting your filters or be the first to create an event!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onSelectEvent={setSelectedEvent} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={(newEvent) => {
            setEvents((prev) => [newEvent, ...prev]);
            setShowCreateModal(false);
          }}
        />
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEventUpdated={(updatedEvent) => {
            setEvents((prev) =>
              prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
            );
          }}
        />
      )}
    </div>
  );
}
