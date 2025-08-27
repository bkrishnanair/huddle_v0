"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, X, Loader2 } from "lucide-react"; // FINAL POLISH: Import Loader2 icon

// ... (interface remains the same) ...
interface GameEvent {
  id: string;
  title: string;
  sport: string;
  location: any;
  date: string;
  time: string;
  maxPlayers: number;
  currentPlayers: number;
  players: string[];
}
interface EventDetailsModalProps {
  event: GameEvent;
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated: (updatedEvent: GameEvent) => void;
}

export default function EventDetailsModal({
  event,
  isOpen,
  onClose,
  onEventUpdated,
}: EventDetailsModalProps) {
  // FINAL POLISH: Add loading state for the RSVP action.
  const [isRsvpLoading, setIsRsvpLoading] = useState(false);

  if (!isOpen) return null;

  const handleRsvp = async () => {
    setIsRsvpLoading(true); // FINAL POLISH: Set loading to true on click.
    try {
      const response = await fetch(`/api/events/${event.id}/rsvp`, {
        method: "POST",
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        onEventUpdated(updatedEvent.event);
      } else {
        console.error("Failed to RSVP");
        // Here you would show an error toast to the user.
      }
    } catch (error) {
      console.error("Error during RSVP:", error);
    } finally {
      setIsRsvpLoading(false); // FINAL POLISH: Reset loading state.
    }
  };

  const isFull = event.currentPlayers >= event.maxPlayers;
  // This is a placeholder for the current user's ID.
  // In a real app, this would come from an auth context.
  const currentUserId = "user-123"; 
  const hasJoined = event.players.includes(currentUserId);

  const renderRsvpButton = () => {
    if (hasJoined) {
      return <Button className="w-full" disabled>You've Joined</Button>;
    }
    if (isFull) {
      return <Button className="w-full" disabled>Event is Full</Button>;
    }
    return (
      <Button onClick={handleRsvp} className="w-full" disabled={isRsvpLoading}>
        {/* FINAL POLISH: Show spinner and "Joining..." text when loading. */}
        {isRsvpLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          "Join Game"
        )}
      </Button>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md glass-card border-none rounded-2xl shadow-2xl relative">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{event.title}</h2>
              <Badge variant="secondary" className="bg-white/20 text-white border-none mt-1">
                {event.sport}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full absolute top-4 right-4">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-3 text-sm text-white/80">
            <div className="flex items-center"><MapPin className="w-4 h-4 mr-3 text-blue-300" /><span>{event.location}</span></div>
            <div className="flex items-center"><Calendar className="w-4 h-4 mr-3 text-green-300" /><span>{new Date(event.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            <div className="flex items-center"><Clock className="w-4 h-4 mr-3 text-purple-300" /><span>{event.time}</span></div>
            <div className="flex items-center"><Users className="w-4 h-4 mr-3 text-yellow-300" /><span>{event.currentPlayers} / {event.maxPlayers} Players</span></div>
          </div>
        </div>

        <div className="bg-white/10 px-6 py-4 rounded-b-2xl">
          {renderRsvpButton()}
        </div>
      </div>
    </div>
  );
}
