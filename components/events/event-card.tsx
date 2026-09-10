import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, CalendarPlus, Monitor, Eye, Repeat, Megaphone, BadgeCheck } from "lucide-react";
import { GameEvent } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';

import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { useFollowing } from "@/hooks/use-following";
import { getCategoryColor, isEventLive } from "@/lib/utils";

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
  hasNewUpdate?: boolean;
}

export const EventCard = React.memo(({ event, onSelectEvent, showMapButton = false, onUnjoin, hasNewUpdate }: EventCardProps) => {
  const isFull = event.currentPlayers >= event.maxPlayers;
  const { followingSet } = useFollowing();

  // Calculate friends attending
  const friendsAttendingCount = event.players ? event.players.filter(uid => followingSet.has(uid)).length : 0;

  const ongoing = isEventLive(event);

  return (
    <Card className="bg-paper border-line shadow-sm overflow-hidden flex flex-col group hover:border-line-strong transition-colors cursor-pointer" onClick={() => onSelectEvent(event)}>
      <CardContent className="p-4 flex-grow relative">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col gap-2 pr-2 overflow-hidden w-full">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-mono text-ink-3 uppercase">{event.category}</span>
              {ongoing && (
                <Badge className="bg-live-tint text-live-ink border-live/20 text-[9px] font-mono tracking-mono uppercase shadow-none gap-1 px-1.5 hover:bg-live-tint">
                  <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse"></span>
                  Live Now
                </Badge>
              )}
            </div>
            
            <h3 className="font-bold font-body text-lg text-ink truncate flex items-center">
              {event.name}
              {event.isOrganizerVerified && (
                <BadgeCheck className="w-4 h-4 ml-1.5 text-action shrink-0" strokeWidth={1.5} />
              )}
            </h3>
            
            <div className="flex flex-wrap gap-2 mt-1">
              {event.maxPlayers - event.currentPlayers > 0 && event.maxPlayers - event.currentPlayers <= 3 && (
                <Badge variant="outline" className="border-line text-ink text-[9px] font-mono tracking-mono uppercase shadow-none px-1.5">
                  Limited Seating
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-3 text-ink-2">
          <div className="flex items-center text-sm font-mono gap-2">
            <Clock className="w-4 h-4 text-ink-3" strokeWidth={1.5} />
            <span className="truncate">
              {event.date === "Today" || event.date === "Tomorrow" 
                ? `${event.date} at ${event.time}` 
                : `${event.date} • ${event.time}`}
            </span>
          </div>

          <div className="flex items-center text-sm font-mono gap-2">
            <MapPin className="w-4 h-4 text-ink-3" strokeWidth={1.5} />
            <span className="truncate">
              {typeof event.location === 'string' ? event.location : "Location unavailable"}
            </span>
          </div>
          
          <div className="flex items-center text-sm font-mono gap-2">
            <Users className="w-4 h-4 text-ink-3" strokeWidth={1.5} />
            <span>{event.currentPlayers} / {event.maxPlayers} going</span>
            {friendsAttendingCount > 0 && (
              <span className="text-action font-bold ml-1">({friendsAttendingCount} friends)</span>
            )}
          </div>
        </div>
      </CardContent>
      {(showMapButton || onUnjoin) && (
        <div className="bg-surface px-4 py-3 flex justify-end items-center gap-2 border-t border-line" onClick={(e) => e.stopPropagation()}>
          {showMapButton && (
            <Button
              size="sm"
              variant="outline"
              asChild
              className="bg-paper border-line text-ink hover:bg-surface h-9 px-3"
            >
              <Link href={`/map?eventId=${event.id}&intent=locate`}>
                <MapPin className="w-4 h-4 mr-1.5 text-action" />
                Map
              </Link>
            </Button>
          )}
          {onUnjoin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-9 w-9 bg-paper border-line text-ink hover:bg-surface shrink-0">
                  <CalendarPlus className="w-4 h-4 text-action" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-paper border-line text-ink">
                <DropdownMenuItem className="text-red-500 font-bold focus:bg-red-50 focus:text-red-600 cursor-pointer" onClick={() => onUnjoin(event.id)}>
                  Leave Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </Card>
  );
});

EventCard.displayName = 'EventCard';

export function EventCardSkeleton() {
  return (
    <Card className="bg-paper border-line shadow-sm overflow-hidden flex flex-col animate-pulse">
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 w-3/4 bg-surface-deep rounded-chip"></div>
          <div className="h-6 w-1/4 bg-surface-deep rounded-chip"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-5/6 bg-surface-deep rounded-chip"></div>
          <div className="h-4 w-4/6 bg-surface-deep rounded-chip"></div>
        </div>
      </CardContent>
      <div className="bg-surface-sunk px-4 py-3 flex justify-between items-center border-t border-line">
        <div className="h-5 w-1/3 bg-surface-deep rounded-chip"></div>
        <div className="h-9 w-1/4 bg-surface-deep rounded-control"></div>
      </div>
    </Card>
  );
}