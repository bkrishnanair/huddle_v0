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
    <Card className="glass-surface overflow-hidden flex flex-col transition-all hover:border-white/20 cursor-pointer" onClick={() => onSelectEvent(event)} style={{ border: '1px solid rgba(255,255,255,0.1)', borderLeft: `4px solid ${getCategoryColor(event.category)}`, backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
      <CardContent className="p-4 flex-grow relative transition-colors duration-300">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at top left, ${getCategoryColor(event.category)}, transparent 70%)` }} />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 pr-2 overflow-hidden">
              <h3 className="font-bold text-lg text-white drop-shadow-md truncate flex items-center pr-1">
                <span className="mr-1.5">{event.icon || getCategoryIcon(event.category)}</span>
                {event.name}
                {event.isOrganizerVerified && (
                  <BadgeCheck className="w-4 h-4 ml-1.5 text-blue-400 shrink-0" />
                )}
              </h3>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              {ongoing && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap text-[9px] font-black uppercase tracking-wider px-1.5 shadow-sm animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping"></span>
                  Ongoing
                </Badge>
              )}
              {event.recurrence && (
                <Badge className="bg-teal-500/20 text-teal-400 border border-teal-500/30 whitespace-nowrap text-[9px] font-black uppercase tracking-wider px-1.5 shadow-sm gap-0.5">
                  <Repeat className="w-2.5 h-2.5" />
                  {event.recurrence.type}{(event as any).recurringCount > 1 ? ` · ${(event as any).recurringCount} upcoming` : ''}
                </Badge>
              )}
              {event.maxPlayers - event.currentPlayers > 0 && event.maxPlayers - event.currentPlayers <= 3 && (
                <Badge variant="destructive" className="bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap text-[9px] font-black uppercase tracking-wider px-1.5 shadow-sm">
                  Limited Seating
                </Badge>
              )}
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex items-center text-slate-300 text-sm gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="truncate">
                {event.date === "Today" || event.date === "Tomorrow" 
                  ? `${event.date} at ${event.time}` 
                  : `${event.date} • ${event.time}`}
              </span>
            </div>

            <div className="flex items-center text-slate-300 text-sm gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="truncate">
                {typeof event.location === 'string' ? event.location : "Location unavailable"}
              </span>
            </div>
            
            <div className="flex items-center text-slate-300 text-sm gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{event.currentPlayers} / {event.maxPlayers} going</span>
              {friendsAttendingCount > 0 && (
                <span className="text-orange-400 font-bold ml-1 text-xs">({friendsAttendingCount} friends)</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );});

EventCard.displayName = 'EventCard';

export function EventCardSkeleton() {
  return (
    <Card className="glass-surface overflow-hidden flex flex-col animate-pulse" style={{ border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
      <CardContent className="p-4 flex-grow relative">
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 w-3/4 bg-slate-800 rounded-md"></div>
          <div className="h-6 w-1/4 bg-slate-800 rounded-md"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-5/6 bg-slate-800 rounded-md"></div>
          <div className="h-4 w-4/6 bg-slate-800 rounded-md"></div>
        </div>
      </CardContent>
    </Card>
  );
}