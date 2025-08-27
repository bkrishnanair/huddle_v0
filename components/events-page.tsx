"use client";

import { useState, useEffect, useMemo } from "react";
import { getEvents } from "@/lib/db";
import { Search, Plus, Calendar as CalendarIcon, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CreateEventModal from "@/components/create-event-modal";
import EventDetailsModal from "@/components/event-details-modal";
import { EventCard, EventCardSkeleton } from "@/components/events/event-card";
import { SummaryHeader, SummaryHeaderSkeleton } from "@/components/events/summary-header";
import { useAuth } from "@/lib/firebase-context";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// ... (interfaces remain the same) ...
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

// Statically defined list of sports for consistency
const SPORTS = [
  "All", "Basketball", "Soccer", "Tennis", "Cricket", "Baseball", "Volleyball",
  "Football", "Hockey", "Badminton", "Table Tennis"
];


export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("All");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
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

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.sport.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSport = selectedSport === "All" || event.sport === selectedSport;
      
      const matchesDate =
        !selectedDate || event.date === format(selectedDate, "yyyy-MM-dd");
        
      const eventHour = parseInt(event.time.split(":")[0]);
      const matchesTime = selectedTime === "All" ||
        (selectedTime === "Morning" && eventHour >= 5 && eventHour < 12) ||
        (selectedTime === "Afternoon" && eventHour >= 12 && eventHour < 17) ||
        (selectedTime === "Evening" && eventHour >= 17 && eventHour < 22);

      const matchesAvailability = !showOnlyAvailable || event.currentPlayers < event.maxPlayers;

      return matchesSearch && matchesSport && matchesDate && matchesTime && matchesAvailability;
    });
  }, [events, searchQuery, selectedSport, selectedDate, selectedTime, showOnlyAvailable]);

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
      {/* ... (Header remains the same) ... */}
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


      {loading ? <SummaryHeaderSkeleton /> : <SummaryHeader {...summaryStats} />}

      <div className="glass-card p-4 rounded-2xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div className="relative flex-grow lg:col-span-2">
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
              {SPORTS.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="glass border-white/20 text-white w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 glass-card">
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
            </PopoverContent>
          </Popover>

           <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="glass border-white/20 text-white">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent className="glass-card">
                <SelectItem value="All">Any Time</SelectItem>
                <SelectItem value="Morning">Morning (5am-12pm)</SelectItem>
                <SelectItem value="Afternoon">Afternoon (12pm-5pm)</SelectItem>
                <SelectItem value="Evening">Evening (5pm-10pm)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2 text-white justify-center lg:justify-start lg:col-start-4">
            <Users className="w-4 h-4"/>
            <Label htmlFor="availability-switch">Open Spots Only</Label>
            <Switch id="availability-switch" checked={showOnlyAvailable} onCheckedChange={setShowOnlyAvailable} />
          </div>

        </div>
      </div>

       {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
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
