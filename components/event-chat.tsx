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
      const response = await fetch(`/api/events/${eventId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage, userId: user.uid, userName: user.displayName }),
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
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center space-x-2 p-3 border-b bg-gray-50">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold">Event Chat</h3>
        <span className="text-sm text-gray-500">({messages.length} messages)</span>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.userId === user?.uid ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                    message.userId === user?.uid ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.userId !== user?.uid && (
                    <p className="text-xs font-semibold mb-1 opacity-75">{message.userName}</p>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${message.userId === user?.uid ? "text-blue-100" : "text-gray-500"}`}>
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
      <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            maxLength={500}
            disabled={sending}
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim() || sending} size="sm" className="px-3">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">{newMessage.length}/500 characters</p>
      </form>
    </div>
  )
}
