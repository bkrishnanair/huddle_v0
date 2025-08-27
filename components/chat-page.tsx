"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase-context";
import { getUserEvents } from "@/lib/db";
import { ChatList } from "@/components/chat-list";
import EventChat from "@/components/event-chat";
import { MessageSquare, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// FINAL POLISH: A skeleton loader component that mimics the chat page layout.
const ChatPageSkeleton = () => (
  <div className="min-h-screen liquid-gradient p-4 md:p-8 animate-pulse">
    <header className="mb-8">
      <div className="h-8 w-1/3 bg-white/20 rounded-md mb-2"></div>
      <div className="h-4 w-1/2 bg-white/20 rounded-md"></div>
    </header>
    <main className="glass-card rounded-2xl h-[calc(100vh-180px)] flex overflow-hidden">
      <div className="w-full md:w-1/3 border-r border-white/20 p-4 space-y-3">
        {/* Skeleton for chat list items */}
        <div className="h-16 w-full bg-white/10 rounded-lg"></div>
        <div className="h-16 w-full bg-white/10 rounded-lg"></div>
        <div className="h-16 w-full bg-white/10 rounded-lg"></div>
        <div className="h-16 w-full bg-white/10 rounded-lg"></div>
      </div>
      <div className="hidden md:flex w-2/3 flex-col p-4">
        {/* Skeleton for the chat window */}
        <div className="flex-grow space-y-4">
          <div className="h-10 w-1/2 bg-white/10 rounded-lg self-start"></div>
          <div className="h-10 w-3/5 bg-white/10 rounded-lg self-end"></div>
          <div className="h-10 w-2/5 bg-white/10 rounded-lg self-start"></div>
        </div>
        <div className="h-12 w-full bg-white/10 rounded-lg mt-4"></div>
      </div>
    </main>
  </div>
);


export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (user) {
      getUserEvents(user.uid)
        .then((userEvents) => {
          setEvents(userEvents);
          if (userEvents.length > 0 && !selectedEventId) {
            setSelectedEventId(userEvents[0].id);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user events for chat:", err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, authLoading, selectedEventId]);

  // FINAL POLISH: Use the new skeleton loader.
  if (loading || authLoading) {
    return <ChatPageSkeleton />;
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-center p-4">
        <Card className="glass-card p-8 text-white">
          <MessageSquare className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">No Chats Available</h2>
          <p className="text-white/70">Join an event to start chatting with other players.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen liquid-gradient p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Conversations</h1>
        <p className="text-white/80">Select an event to view the chat</p>
      </header>
      
      <main className="glass-card rounded-2xl h-[calc(100vh-180px)] flex overflow-hidden">
        <div className="w-full md:w-1/3 border-r border-white/20">
          <ChatList
            events={events}
            onSelectChat={setSelectedEventId}
            selectedEventId={selectedEventId ?? undefined}
          />
        </div>

        <div className="hidden md:flex w-2/3 flex-col">
          {selectedEventId ? (
            <EventChat eventId={selectedEventId} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/70">
              <MessageSquare className="w-12 h-12 mb-4" />
              <span className="text-lg">Select a conversation</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
