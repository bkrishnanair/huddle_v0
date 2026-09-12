import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  Users,
  CalendarPlus,
  Monitor,
  Eye,
  Repeat,
  Megaphone,
  BadgeCheck,
  ArrowUpRight,
} from "lucide-react";
import { GameEvent } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { useFollowing } from "@/hooks/use-following";
import { getCategoryColor } from "@/lib/utils";
import { CategoryIcon } from "@/components/category-icon";

interface EventCardProps {
  event: GameEvent;
  onSelectEvent: (event: GameEvent) => void;
  showMapButton?: boolean;
  onUnjoin?: (eventId: string) => void;
  hasNewUpdate?: boolean;
}

export const EventCard = React.memo(
  ({
    event,
    onSelectEvent,
    showMapButton = false,
    onUnjoin,
    hasNewUpdate,
  }: EventCardProps) => {
    const isFull = event.currentPlayers >= event.maxPlayers;
    const { followingSet } = useFollowing();

    // Calculate friends attending
    const friendsAttendingCount = event.players
      ? event.players.filter((uid) => followingSet.has(uid)).length
      : 0;

    const getTimeDifference = (date: string, time: string) => {
      if (
        !date ||
        date === "Today" ||
        date === "Tomorrow" ||
        date.includes("/")
      ) {
        return date || "TBD";
      }

      try {
        const eventDateTime = new Date(`${date}T${time || "00:00"}`);
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
      <Card className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-panel shadow-lg transition-all duration-200 hover:border-white/25 hover:shadow-xl">
        <CardContent className="relative flex flex-1 flex-col p-5">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-70"
            style={{
              background: `linear-gradient(130deg, ${getCategoryColor(event.category)}24, transparent 75%)`,
            }}
          />
          <div className="relative mb-5 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
                style={{ color: getCategoryColor(event.category) }}
              >
                {event.icon ? (
                  <span className="text-xl">{event.icon}</span>
                ) : (
                  <CategoryIcon category={event.category} />
                )}
              </span>
              <span className="truncate text-xs font-semibold text-slate-300">
                {event.category}
              </span>
            </div>
            {ongoing ? (
              <Badge className="gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{" "}
                Live now
              </Badge>
            ) : isFull ? (
              <Badge className="rounded-full border border-white/10 bg-white/5 text-[10px] text-slate-300">
                Waitlist open
              </Badge>
            ) : (
              event.maxPlayers - event.currentPlayers <= 3 && (
                <Badge className="rounded-full border border-orange-400/20 bg-orange-400/10 text-[10px] text-orange-300">
                  Filling up
                </Badge>
              )
            )}
          </div>
          <h3 className="relative mb-2 line-clamp-2 min-h-14 font-display text-xl font-bold leading-7 tracking-tight text-white">
            {event.name}
            {event.isOrganizerVerified && (
              <BadgeCheck
                className="ml-1.5 inline h-4 w-4 text-teal-300"
                aria-label="Verified organizer"
              />
            )}
          </h3>
          <p className="mb-5 truncate text-xs text-slate-400">
            Hosted by {event.organizerName || "your campus community"}
          </p>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-slate-500" />
              <span className="font-mono text-[11px]">
                {getTimeDifference(event.date, event.time)} · {event.time}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              {event.eventType === "virtual" ? (
                <>
                  <Monitor className="h-4 w-4 shrink-0 text-teal-300" />
                  <span className="truncate">
                    Virtual event
                    {typeof event.location === "string"
                      ? ` · ${event.location}`
                      : ""}
                  </span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="truncate">
                    {event.distance ? (
                      <>
                        <span className="font-mono">
                          {event.distance.toFixed(1)}
                        </span>{" "}
                        miles away
                      </>
                    ) : typeof event.venue === "string" ? (
                      event.venue
                    ) : typeof event.location === "string" ? (
                      event.location
                    ) : (
                      "Location to be announced"
                    )}
                  </span>
                </>
              )}
            </div>
          </div>
          {(friendsAttendingCount > 0 ||
            event.recurrence ||
            event.eventType === "hybrid" ||
            hasNewUpdate) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {friendsAttendingCount > 0 && (
                <Badge className="gap-1.5 rounded-lg bg-orange-400/10 text-orange-300">
                  <Users className="h-3 w-3" />
                  <span className="font-mono">
                    {friendsAttendingCount}
                  </span>{" "}
                  {friendsAttendingCount === 1
                    ? "friend going"
                    : "friends going"}
                </Badge>
              )}
              {event.recurrence && (
                <Badge className="gap-1 rounded-lg bg-white/5 text-slate-300">
                  <Repeat className="h-3 w-3" />
                  {event.recurrence.type}
                  {(event as any).recurringCount > 1
                    ? ` · ${(event as any).recurringCount} upcoming`
                    : ""}
                </Badge>
              )}
              {event.eventType === "hybrid" && (
                <Badge className="rounded-lg bg-violet-400/10 text-violet-300">
                  In person + online
                </Badge>
              )}
              {hasNewUpdate && (
                <Badge className="gap-1 rounded-lg bg-orange-400/10 text-orange-300">
                  <Megaphone className="h-3 w-3" /> New update
                </Badge>
              )}
            </div>
          )}
          {!!event.tags?.length && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
        <div className="border-t border-white/5 bg-white/[0.025] p-4">
          <div className="mb-3 flex items-center justify-between gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                <span className="font-mono text-slate-200">
                  {event.currentPlayers}
                </span>{" "}
                / <span className="font-mono">{event.maxPlayers}</span> going
              </span>
            </span>
            {(event.viewCount ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span className="font-mono">{event.viewCount}</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {showMapButton && (
              <Button
                size="icon"
                variant="outline"
                asChild
                className="rounded-xl"
              >
                <Link
                  href={`/map?eventId=${event.id}&intent=locate`}
                  aria-label={`Find ${event.name} on the map`}
                >
                  <MapPin className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {onUnjoin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label={`Add ${event.name} to calendar`}
                    className="rounded-xl"
                  >
                    <CalendarPlus />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 rounded-2xl border-white/10 bg-panel p-2 text-slate-200"
                >
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(generateGoogleCalendarUrl(event), "_blank")
                    }
                    className="min-h-11 rounded-xl"
                  >
                    Google Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => downloadIcsFile(event)}
                    className="min-h-11 rounded-xl"
                  >
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
                className="rounded-xl"
              >
                Leave
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => onSelectEvent(event)}
              className="flex-1 rounded-xl bg-white/10 text-white shadow-none hover:bg-orange-500 hover:text-canvas"
            >
              View details <ArrowUpRight />
            </Button>
          </div>
        </div>
      </Card>
    );
  },
);

EventCard.displayName = "EventCard";

export function EventCardSkeleton() {
  return (
    <Card
      className="flex h-80 flex-col overflow-hidden rounded-3xl border-white/10 bg-panel motion-safe:animate-pulse"
      aria-label="Loading event"
    >
      <CardContent className="flex-1 space-y-5 p-5">
        <div className="h-11 w-11 rounded-2xl bg-white/10" />
        <div className="h-6 w-4/5 rounded-lg bg-white/10" />
        <div className="h-4 w-2/3 rounded-lg bg-white/5" />
        <div className="h-4 w-3/4 rounded-lg bg-white/5" />
      </CardContent>
      <div className="border-t border-white/5 p-4">
        <div className="h-11 rounded-xl bg-white/10" />
      </div>
    </Card>
  );
}
