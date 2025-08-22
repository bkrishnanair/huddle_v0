"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase-context";
import { getUserEvents } from "@/lib/db";
import { ChatList } from "./chat-list";
import EventChat from "./event-chat";
import { MessageSquare, Loader2 } from "lucide-react";

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
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch user events for chat:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user, authLoading, selectedEventId]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin mr-4" />
        <span className="text-xl">Loading Chats...</span>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-center p-4">
        <div>
          <MessageSquare className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">No Chats Available</h2>
          <p className="text-white/70">Join an event to start chatting with other players.</p>
        </div>
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


Gemini
"use client";
// Import necessary React hooks and components.
import React, { useState, useEffect } from "react";
// Import authentication context and database functions.
import { useAuth } from "@/lib/firebase-context";
import { getUserEvents } from "@/lib/db";
// Import chat-related components.
import { ChatList } from "./chat-list";
import EventChat from "./event-chat";
// Import icons from lucide-react.
import { MessageSquare, Loader2 } from "lucide-react";

// The main component for the chat page.
export default function ChatPage() {
  // Get user authentication status and loading state.
  const { user, loading: authLoading } = useAuth();
  // State to store the list of events (chats).
  const [events, setEvents] = useState<any[]>([]);
  // State to store the currently selected event ID.
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  // State to manage the loading status of the page.
  const [loading, setLoading] = useState(true);

  // Effect hook to fetch user events when the component mounts or user/auth status changes.
  useEffect(() => {
    // If authentication is in progress, do nothing.
    if (authLoading) return;
    
    // If a user is logged in, fetch their events.
    if (user) {
      getUserEvents(user.uid)
        .then((userEvents) => {
          // Set the fetched events in the state.
          setEvents(userEvents);
          // If there are events and no event is selected, select the first one.
          if (userEvents.length > 0 && !selectedEventId) {
            setSelectedEventId(userEvents[0].id);
          }
          // Set loading to false after fetching events.
          setLoading(false);
        })
        .catch((err) => {
          // Log any errors and set loading to false.
          console.error("Failed to fetch user events for chat:", err);
          setLoading(false);
        });
    } else {
      // If no user is logged in, set loading to false.
      setLoading(false);
    }
  }, [user, authLoading, selectedEventId]);

  // If the page or authentication is loading, show a loading spinner.
  if (loading || authLoading) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin mr-4" />
        <span className="text-xl">Loading Chats...</span>
      </div>
    );
  }

  // If the user has no events to chat in, show a message.
  if (events.length === 0) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-center p-4">
        <div>
          <MessageSquare className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">No Chats Available</h2>
          <p className="text-white/70">Join an event to start chatting with other players.</p>
        </div>
      </div>
    );
  }

  // Render the main chat page layout.
  return (
    <div className="min-h-screen liquid-gradient p-4 md:p-8">
      {/* Page header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Conversations</h1>
        <p className="text-white/80">Select an event to view the chat</p>
      </header>
      
      {/* Main content area with a glass-like card effect. */}
      <main className="glass-card rounded-2xl h-[calc(100vh-180px)] flex overflow-hidden">
        {/* Left panel: List of available chats. */}
        <div className="w-full md:w-1/3 border-r border-white/20">
          <ChatList
            events={events}
            onSelectChat={setSelectedEventId}
            selectedEventId={selectedEventId ?? undefined}
          />
        </div>

        {/* Right panel: The actual chat conversation for the selected event. */}
        <div className="hidden md:flex w-2/3 flex-col">
          {selectedEventId ? (
            // If an event is selected, show the event chat.
            <EventChat eventId={selectedEventId} />
          ) : (
            // If no event is selected, show a prompt.
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