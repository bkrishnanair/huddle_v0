import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, CalendarPlus, Monitor } from "lucide-react";
import { GameEvent } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';

import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { useFollowing } from "@/hooks/use-following";

const getCategoryIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
    Sports: "⚽", Music: "🎵", Community: "🤝", Learning: "📚",
    "Food & Drink": "🍕", Tech: "💻", "Arts & Culture": "🎨",
    Outdoors: "🌲", default: "📍"
  }
  return icons[category] || icons.default
}

interface EventCardProps {
  event: GameEvent;
  onSelectEvent: (event: GameEvent) => void;
  showMapButton?: boolean;
  onUnjoin?: (eventId: string) => void;
}

export const EventCard = React.memo(({ event, onSelectEvent, showMapButton = false, onUnjoin }: EventCardProps) => {
  const isFull = event.currentPlayers >= event.maxPlayers;
  const { followingSet } = useFollowing();

  // Calculate friends attending
  const friendsAttendingCount = event.players ? event.players.filter(uid => followingSet.has(uid)).length : 0;

  const getTimeDifference = (date: string, time: string) => {
    if (!date || date === "Today" || date === "Tomorrow" || date.includes("/")) {
      return date || "TBD";
    }

    try {
      const eventDateTime = new Date(`${date}T${time || '00:00'}`);
      if (isNaN(eventDateTime.getTime())) return "Upcoming";
      return formatDistanceToNow(eventDateTime, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Upcoming";
    }
  };

  const isEventOngoing = () => {
    if (!event.date || !event.time) return false;
    try {
      const startDateTime = new Date(`${event.date}T${event.time}`);
      if (isNaN(startDateTime.getTime())) return false;

      const now = new Date();
      if (now < startDateTime) return false;

      let endDateTime;
      if (event.endTime) {
        endDateTime = new Date(`${event.date}T${event.endTime}`);
      } else {
        // Default to 2 hours duration
        endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);
      }

      return now <= endDateTime;
    } catch (error) {
      return false;
    }
  };

  const ongoing = isEventOngoing();

  return (
    <Card className="glass-surface border-white/15 overflow-hidden flex flex-col">
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 pr-2 overflow-hidden">
            <h3 className="font-bold text-lg text-slate-50 truncate">
              <span className="mr-1.5">{event.icon || getCategoryIcon(event.category)}</span>
              {event.name}
            </h3>
            {ongoing && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap text-[9px] font-black uppercase tracking-wider px-1.5 shadow-sm animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping"></span>
                Ongoing
              </Badge>
            )}
            {event.maxPlayers - event.currentPlayers > 0 && event.maxPlayers - event.currentPlayers <= 3 && (
              <Badge variant="destructive" className="bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap text-[9px] font-black uppercase tracking-wider px-1.5 shadow-sm">
                Limited Seating
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {friendsAttendingCount > 0 && (
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border border-orange-500/30 whitespace-nowrap text-[10px] font-bold px-1.5 shadow-sm">
                🔥 {friendsAttendingCount} {friendsAttendingCount === 1 ? 'friend' : 'friends'}
              </Badge>
            )}
            {(event.eventType === 'virtual' || event.eventType === 'hybrid') && (
              <Badge className={`border whitespace-nowrap text-[9px] font-black uppercase tracking-wider px-1.5 ${event.eventType === 'virtual'
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                : 'bg-violet-500/20 text-violet-400 border-violet-500/30'
                }`}>
                {event.eventType === 'virtual' ? '🖥️ Virtual' : '📡 Hybrid'}
              </Badge>
            )}
            <Badge variant="secondary" className="bg-white/10 text-slate-300 border-none whitespace-nowrap shrink-0">
              {event.category}
            </Badge>
          </div>
        </div>
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-emerald-400" />
            <span>{getTimeDifference(event.date, event.time)} • {event.time}</span>
          </div>
          <div className="flex items-center">
            {event.eventType === 'virtual' ? (
              <>
                <Monitor className="w-4 h-4 mr-2 text-blue-400" />
                <span className="truncate">🖥️ Virtual Event{event.location ? ` • ${event.location}` : ''}</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
                <span className="truncate">{event.distance ? `${event.distance.toFixed(1)} miles away` : (event.venue || event.location || 'Location TBD')}</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
      <div className="bg-white/5 px-4 py-3 flex justify-between items-center gap-3">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-slate-400" />
          <span className="text-slate-300 font-medium">
            {event.currentPlayers} / {event.maxPlayers}
          </span>
        </div>
        <div className="flex gap-2">
          {showMapButton && (
            <Button
              size="sm"
              variant="outline"
              asChild
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-9 px-3"
            >
              <Link href={`/map?eventId=${event.id}&intent=locate`}>
                <MapPin className="w-4 h-4 mr-1.5 text-primary" />
                Map
              </Link>
            </Button>
          )}
          {onUnjoin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-9 w-9 bg-white/5 border-white/20 text-white hover:bg-white/10 shrink-0">
                  <CalendarPlus className="w-4 h-4 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-white/10 text-slate-200">
                <DropdownMenuItem onClick={() => window.open(generateGoogleCalendarUrl(event), '_blank')} className="cursor-pointer hover:bg-white/10 text-xs font-bold">
                  Google Calendar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadIcsFile(event)} className="cursor-pointer hover:bg-white/10 text-xs font-bold">
                  Apple / Outlook (.ics)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {onUnjoin && (
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                onUnjoin(event.id);
              }}
              className="h-9 px-3"
            >
              Unjoin
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => onSelectEvent(event)}
            className="bg-primary text-primary-foreground h-9 px-4"
            disabled={isFull}
          >
            {isFull ? "Full" : "View Details"}
          </Button>
        </div>
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
