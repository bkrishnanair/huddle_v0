"use client"
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Loader2 } from "lucide-react";

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

interface EventListProps {
  userId: string;
  eventType: 'organized' | 'joined';
}

export function EventList({ userId, eventType }: EventListProps) {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/${userId}/events?type=${eventType}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch events with status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data.events || []);
      } catch (err: any) {
        setError(err.message);
        console.error(`Error fetching ${eventType} events:`, err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchEvents();
    }
  }, [userId, eventType]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        <p>Error loading events: {error}</p>
      </div>
    );
  }

  const emptyStateMessage = eventType === 'organized'
    ? "You haven't organized any events yet."
    : "You haven't joined any events yet.";

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
        <p className="text-white/70">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card key={event.id} className="bg-white/10 rounded-lg p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-white">{event.title}</h3>
              <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded">
                {event.sport}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-white/70">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>
                  {event.currentPlayers}/{event.maxPlayers}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
