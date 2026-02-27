"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle } from "lucide-react"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/firebase-context"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pin, MoreVertical, Clock, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: any
}

interface EventChatProps {
  eventId: string
  organizerId: string
  pinnedMessage?: string
}

export default function EventChat({ eventId, organizerId, pinnedMessage }: EventChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [scheduleTime, setScheduleTime] = useState("")
  const [scheduleIsAnnouncement, setScheduleIsAnnouncement] = useState(false)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isOrganizer = user?.uid === organizerId;

  // Real-time listener for chat messages
  useEffect(() => {
    if (!db) return

    const chatRef = collection(db, "events", eventId, "chat")
    const q = query(chatRef, orderBy("timestamp", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatMessage[]

      setMessages(newMessages)
    })

    return () => unsubscribe()
  }, [eventId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handlePinMessage = async (messageText: string) => {
    try {
      const idToken = await user?.getIdToken()
      if (!idToken) return;

      const response = await fetch(`/api/events/${eventId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ action: "pin", message: messageText }),
        credentials: 'include'
      })

      if (response.ok) {
        toast.success("Message pinned!")
      } else {
        toast.error("Failed to pin message.")
      }
    } catch (e) {
      toast.error("Unexpected error pinning message.")
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || sending || !user) return

    setSending(true)
    try {
      const idToken = await user.getIdToken()
      const response = await fetch(`/api/events/${eventId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ message: newMessage, userId: user.uid, userName: user.displayName }),
        credentials: 'include' // <-- Ensures session cookies are sent for authentication
      })

      if (response.ok) {
        setNewMessage("")
        // Do not show a toast for every message to avoid being noisy.
        // The message appearing in the chat is sufficient feedback.
      } else {
        const errorData = await response.json()
        toast.error(`Failed to send message: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("An unexpected error occurred while sending your message.")
    } finally {
      setSending(false)
    }
  }

  const handleScheduleMessage = async () => {
    if (!newMessage.trim() || !scheduleTime) return;
    setSending(true);

    try {
      const idToken = await user?.getIdToken();
      if (!idToken) return;

      const scheduleDate = new Date(scheduleTime);
      if (scheduleDate <= new Date()) {
        toast.error("Schedule time must be in the future.");
        setSending(false);
        return;
      }

      const response = await fetch(`/api/events/${eventId}/chat/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          scheduledFor: scheduleDate.toISOString(),
          isAnnouncement: scheduleIsAnnouncement
        }),
        credentials: 'include'
      });

      if (response.ok) {
        toast.success("Message scheduled successfully!");
        setNewMessage("");
        setShowScheduleDialog(false);
        setScheduleTime("");
        setScheduleIsAnnouncement(false);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to schedule message.");
      }
    } catch (error) {
      console.error("Error scheduling:", error);
      toast.error("Unexpected error scheduling message.");
    } finally {
      setSending(false);
    }
  }

  const formatTime = (timestamp: any) => {
    if (!timestamp) return ""

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="flex flex-col h-full bg-slate-950/20">
      {/* Chat Header */}
      <div className="flex items-center space-x-2 p-3 border-b border-white/10 bg-white/5">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-white">Event Chat</h3>
        <span className="text-sm text-slate-400">({messages.length} messages)</span>
      </div>

      {pinnedMessage && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 p-3 px-4 flex items-start gap-3 w-full shrink-0">
          <Pin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-amber-500/80 mb-0.5">Pinned Announcement</p>
            <p className="text-sm text-amber-50 font-medium leading-relaxed">{pinnedMessage}</p>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-700" />
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.userId === user?.uid ? "justify-end" : "justify-start"}`}>
                <div
                  className={`relative group max-w-xs lg:max-w-md px-3 py-2 rounded-2xl ${message.userId === user?.uid
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(234,88,12,0.2)]"
                    : "bg-white/10 text-slate-100 border border-white/5"
                    }`}
                >
                  {user?.uid === organizerId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -right-8 top-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-white/10"
                        >
                          <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-surface border-white/10 w-32">
                        <DropdownMenuItem onClick={() => handlePinMessage(message.message)} className="text-xs font-bold text-slate-300 focus:bg-white/10 cursor-pointer">
                          <Pin className="mr-2 h-3.5 w-3.5 text-amber-500" />
                          Pin Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  {message.userId !== user?.uid && (
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-primary/80">{message.userName}</p>
                  )}
                  <p className="text-sm leading-relaxed">{message.message}</p>
                  <p className={`text-[9px] mt-1 text-right font-medium ${message.userId === user?.uid ? "text-primary-foreground/70" : "text-slate-400"}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-white/5">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            maxLength={500}
            disabled={sending}
            className="flex-1 glass border-white/20 text-white placeholder:text-white/40 h-10"
          />
          {isOrganizer && (
            <Button
              type="button"
              onClick={() => setShowScheduleDialog(true)}
              disabled={!newMessage.trim() || sending}
              size="icon"
              variant="outline"
              className="px-0 w-10 h-10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300"
              title="Schedule Message"
            >
              <Clock className="w-4 h-4" />
            </Button>
          )}
          <Button type="submit" disabled={!newMessage.trim() || sending} size="sm" className="px-4 h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex justify-end mt-1">
          <p className="text-[10px] text-slate-500">{newMessage.length}/500</p>
        </div>
      </form>

      {/* Schedule Message Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="glass-surface border-white/10 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              Schedule Broadcast
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-xs text-slate-400 italic">Message to send:</p>
              <p className="text-sm font-medium text-slate-200 mt-1 line-clamp-3">{newMessage}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-300">
                Send Date & Time
              </Label>
              <Input
                type="datetime-local"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="bg-slate-900/50 border-white/10 text-white"
                style={{ colorScheme: "dark" }}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-900/10 border border-indigo-500/20">
              <div>
                <Label className="font-bold flex items-center gap-2 text-sm text-indigo-100">
                  <Pin className="w-3.5 h-3.5 text-amber-500" /> Make Announcement
                </Label>
                <p className="text-[10px] text-indigo-300 mt-1 uppercase tracking-wider">Pins to top when sent</p>
              </div>
              <Switch checked={scheduleIsAnnouncement} onCheckedChange={setScheduleIsAnnouncement} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)} className="border-white/10 text-white">Cancel</Button>
            <Button
              onClick={handleScheduleMessage}
              disabled={sending || !scheduleTime}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
