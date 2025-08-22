// components/chat-list.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatListProps {
  events: any[];
  onSelectChat: (eventId: string) => void;
  selectedEventId?: string;
}

export function ChatList({ events, onSelectChat, selectedEventId }: ChatListProps) {
  if (!events.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No chats available. Join an event to start chatting!
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2">
        {events.map((event) => (
          <Card
            key={event.id}
            className={`cursor-pointer transition-all ${
              selectedEventId === event.id ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
            onClick={() => onSelectChat(event.id)}
          >
            <CardContent className="flex items-center p-3">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={`/api/placeholder/${event.id}`} alt={event.title} />
                <AvatarFallback>{event.title?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{event.title}</h3>
                <p className="text-sm text-gray-400 truncate">
                  {event.lastMessage || "No messages yet"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
