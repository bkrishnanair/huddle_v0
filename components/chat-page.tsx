// components/chat-page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase-context";
import { getUserEvents } from "@/lib/db";
import { ChatList } from "./chat-list";
import { EventChat } from "./event-chat";
import { Card } from "./ui/card";

export function ChatPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserEvents(user.uid)
        .then((userEvents) => {
          setEvents(userEvents);
          if (userEvents.length > 0) {
            setSelectedEventId(userEvents[0].id);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch user events:", err);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return <div className="text-center p-8">Loading chats...</div>;
  }

  return (
    <div className="h-screen w-full flex">
      <Card className="w-1/3 m-4">
        <ChatList
          events={events}
          onSelectChat={setSelectedEventId}
          selectedEventId={selectedEventId ?? undefined}
        />
      </Card>
      <div className="w-2/3 m-4">
        {selectedEventId ? (
          <EventChat eventId={selectedEventId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a chat to start messaging.
          </div>
        )}
      </div>
    </div>
  );
}
