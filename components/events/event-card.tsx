// components/events/event-card.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

// ... (interfaces remain the same) ...
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
interface EventCardProps {
  event: GameEvent;
  onSelectEvent: (event: GameEvent) => void;
}


export function EventCard({ event, onSelectEvent }: EventCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isFull = event.currentPlayers >= event.maxPlayers;

  return (
    <Card
      className="glass-card p-4 rounded-2xl cursor-pointer hover:scale-[1.03] transition-transform duration-300"
      onClick={() => onSelectEvent(event)}
    >
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-white pr-2">{event.title}</h3>
          <Badge
            variant="secondary"
            className="bg-white/20 text-white border-none whitespace-nowrap"
          >
            {event.sport}
          </Badge>
        </div>
        <div className="space-y-2 text-sm text-white/80">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-blue-300" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-green-300" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-purple-300" />
            <span>{event.time}</span>
          </div>
        </div>
        <div className="border-t border-white/20 my-3"></div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-yellow-300" />
            <span className="text-white">
              {event.currentPlayers} / {event.maxPlayers} Players
            </span>
          </div>
          {isFull && <Badge variant="destructive">Full</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}

export function EventCardSkeleton() {
  return (
    <Card className="glass-card p-4 rounded-2xl animate-pulse">
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 w-3/4 bg-white/20 rounded-md"></div>
          <div className="h-6 w-1/4 bg-white/20 rounded-md"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-5/6 bg-white/20 rounded-md"></div>
          <div className="h-4 w-4/6 bg-white/20 rounded-md"></div>
          <div className="h-4 w-3/6 bg-white/20 rounded-md"></div>
        </div>
        <div className="border-t border-white/20 my-3"></div>
        <div className="flex justify-between items-center">
          <div className="h-5 w-1/2 bg-white/20 rounded-md"></div>
        </div>
      </CardContent>
    </Card>
  );
}
