import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users } from "lucide-react";
import { GameEvent } from "@/lib/types";

interface EventCardProps {
  event: GameEvent;
  onSelectEvent: (event: GameEvent) => void;
}

export const EventCard = React.memo(({ event, onSelectEvent }: EventCardProps) => {
  const isFull = event.currentPlayers >= event.maxPlayers;

  const getTimeDifference = (date: string, time: string) => {
    return "in 45m";
  };

  return (
    <Card className="glass-surface border-white/15 overflow-hidden flex flex-col">
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-slate-50 pr-2">{event.title}</h3>
          <Badge variant="secondary" className="bg-white/10 text-slate-300 border-none whitespace-nowrap">
            {event.sport}
          </Badge>
        </div>
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-emerald-400" />
            <span>{getTimeDifference(event.date, event.time)} • {event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
            <span>{event.distance ? `${event.distance} miles away` : event.location}</span>
          </div>
        </div>
      </CardContent>
      <div className="bg-white/5 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-slate-400" />
          <span className="text-slate-300 font-medium">
            {event.currentPlayers} / {event.maxPlayers}
          </span>
        </div>
        <Button 
            size="sm" 
            onClick={() => onSelectEvent(event)} 
            className="bg-primary text-primary-foreground h-9 px-4"
            disabled={isFull}
        >
          {isFull ? "Full" : "View Details"}
        </Button>
      </div>
    </Card>
  );
});

EventCard.displayName = 'EventCard';

export function EventCardSkeleton() {
    return (
      <Card className="glass-surface border-white/15 overflow-hidden flex flex-col animate-pulse">
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-3">
            <div className="h-6 w-3/4 bg-slate-700 rounded-md"></div>
            <div className="h-6 w-1/4 bg-slate-700 rounded-md"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-5/6 bg-slate-700 rounded-md"></div>
            <div className="h-4 w-4/6 bg-slate-700 rounded-md"></div>
          </div>
        </CardContent>
        <div className="bg-white/5 px-4 py-3 flex justify-between items-center">
          <div className="h-5 w-1/3 bg-slate-700 rounded-md"></div>
          <div className="h-9 w-1/4 bg-primary rounded-md"></div>
        </div>
      </Card>
    );
  }
