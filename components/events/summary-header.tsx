// components/events/summary-header.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Sun } from "lucide-react";

interface SummaryHeaderProps {
  totalEvents: number;
  eventsToday: number;
  yourUpcomingEvents: number;
}

export function SummaryHeader({
  totalEvents,
  eventsToday,
  yourUpcomingEvents,
}: SummaryHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="glass-card p-4">
        <CardContent className="flex items-center p-0">
          <div className="bg-blue-500/20 p-3 rounded-full mr-4">
            <Calendar className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalEvents}</div>
            <p className="text-sm text-white/80">Total Events</p>
          </div>
        </CardContent>
      </Card>
      <Card className="glass-card p-4">
        <CardContent className="flex items-center p-0">
          <div className="bg-green-500/20 p-3 rounded-full mr-4">
            <Sun className="w-6 h-6 text-green-300" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{eventsToday}</div>
            <p className="text-sm text-white/80">Happening Today</p>
          </div>
        </CardContent>
      </Card>
      <Card className="glass-card p-4">
        <CardContent className="flex items-center p-0">
          <div className="bg-purple-500/20 p-3 rounded-full mr-4">
            <Users className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{yourUpcomingEvents}</div>
            <p className="text-sm text-white/80">Your Upcoming</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
