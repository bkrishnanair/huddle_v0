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

interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: any
}

interface EventChatProps {
  eventId: string
}

export default function EventChat({ eventId }: EventChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl ${message.userId === user?.uid
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(234,88,12,0.2)]"
                    : "bg-white/10 text-slate-100 border border-white/5"
                    }`}
                >
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
          <Button type="submit" disabled={!newMessage.trim() || sending} size="sm" className="px-4 h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex justify-end mt-1">
          <p className="text-[10px] text-slate-500">{newMessage.length}/500</p>
        </div>
      </form>
    </div>
  )
}
