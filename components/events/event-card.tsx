// components/events/event-card.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


// DENORM: Update the GameEvent interface to include denormalized organizer data.
interface GameEvent {
  id: string;
  title: string;
  sport: string;
  location: string;
  date: string;
  time: string;
  maxPlayers: number;
  currentPlayers: number;
  organizerName: string;
  organizerPhotoURL?: string;
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
    });
  };

  const isFull = event.currentPlayers >= event.maxPlayers;

  return (
    <Card
      className="glass-card p-4 rounded-2xl cursor-pointer hover:scale-[1.03] transition-transform duration-300 flex flex-col"
      onClick={() => onSelectEvent(event)}
    >
      <CardContent className="p-0 flex-grow">
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
            <span>{formatDate(event.date)} at {event.time}</span>
          </div>
        </div>
      </CardContent>
      <div className="border-t border-white/20 my-3"></div>
      <div className="flex justify-between items-center text-sm">
        {/* DENORM: Display the organizer's info directly from the event object. */}
        <div className="flex items-center">
          <Avatar className="w-6 h-6 mr-2">
            <AvatarImage src={event.organizerPhotoURL} />
            <AvatarFallback>
              <UserCircle className="w-6 h-6 text-white/70" />
            </AvatarFallback>
          </Avatar>
          <span className="text-white/90">{event.organizerName}</span>
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-yellow-300" />
          <span className="text-white font-medium">
            {event.currentPlayers} / {event.maxPlayers}
          </span>
          {isFull && <Badge variant="destructive" className="ml-2">Full</Badge>}
        </div>
      </div>
    </Card>
  );
}

// ... (Skeleton remains the same) ...
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
        </div>
      </CardContent>
       <div className="border-t border-white/20 my-3"></div>
        <div className="flex justify-between items-center">
            <div className="flex items-center">
                <div className="w-6 h-6 mr-2 rounded-full bg-white/20"></div>
                <div className="h-4 w-24 bg-white/20 rounded-md"></div>
            </div>
            <div className="h-5 w-1/3 bg-white/20 rounded-md"></div>
        </div>
    </Card>
  );
}
