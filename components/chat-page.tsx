"use client"

import { useState, useEffect } from "react"
import { getEvents } from "@/lib/db"
import { MessageCircle, Users, Calendar } from "lucide-react"
import EventChat from "@/components/event-chat"

interface Event {
  id: string
  title: string
  sport: string
  currentPlayers: number
  maxPlayers: number
  players: string[]
}

interface ChatPageProps {
  user: any
}

export default function ChatPage({ user }: ChatPageProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserEvents = async () => {
      console.log("[v0] ChatPage: Starting to load user events for user:", user.uid)
      try {
        console.log("[v0] ChatPage: Calling getEvents()...")
        const allEvents = await getEvents()
        console.log("[v0] ChatPage: getEvents() returned:", allEvents)
        // Filter events where user is a participant
        const userEvents = allEvents.filter((event) => event.players.includes(user.uid) || event.createdBy === user.uid)
        console.log("[v0] ChatPage: Filtered user events:", userEvents)
        setEvents(userEvents)
        console.log("[v0] ChatPage: Events state updated successfully")
      } catch (error) {
        console.error("[v0] ChatPage: Error loading user events:", error)
      } finally {
        console.log("[v0] ChatPage: Setting loading to false")
        setLoading(false)
      }
    }

    loadUserEvents()
  }, [user.uid])

  console.log("[v0] ChatPage: Rendering with loading =", loading, "events count =", events.length)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
        <div className="glass-card mx-4 mt-4 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedEvent(null)} className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Chats
            </button>
            <div className="text-center">
              <h2 className="font-semibold text-gray-900">{selectedEvent.title}</h2>
              <p className="text-sm text-gray-600">{selectedEvent.sport}</p>
            </div>
            <div className="w-16"></div>
          </div>
        </div>

        <div className="px-4 mt-4">
          <EventChat eventId={selectedEvent.id} user={user} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="glass-card mx-4 mt-4 p-4 rounded-2xl">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
            <p className="text-gray-600">Your event conversations</p>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="px-4 mt-6 space-y-4">
        {events.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No chats yet</h3>
            <p className="text-gray-600">Join or create events to start chatting with other players!</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="glass-card p-4 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{event.sport}</span>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.currentPlayers}/{event.maxPlayers}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
