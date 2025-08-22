// components/profile/event-list.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";

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
  events: GameEvent[];
  emptyStateMessage: string;
}

export function EventList({ events, emptyStateMessage }: EventListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

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
          <CardContent>
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
