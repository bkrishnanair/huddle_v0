"use client"

import { useState, useEffect } from "react"
import { getEvents } from "@/lib/db"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import CreateEventModal from "@/components/create-event-modal"
import EventDetailsModal from "@/components/event-details-modal"

interface Event {
  id: string
  title: string
  sport: string
  location: { lat: number; lng: number; address: string }
  date: string
  time: string
  maxPlayers: number
  currentPlayers: number
  createdBy: string
  players: string[]
}

interface EventsPageProps {
  user: any
}

export default function EventsPage({ user }: EventsPageProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await getEvents()
        setEvents(eventsData)
      } catch (error) {
        console.error("Error loading events:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="glass-card mx-4 mt-4 p-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600">Find and join games near you</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
          >
            Create Event
          </Button>
        </div>
      </div>

      {/* Events List */}
      <div className="px-4 mt-6 space-y-4">
        {events.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600 mb-4">Be the first to create an event in your area!</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Create First Event
            </Button>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="glass-card p-4 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {event.sport}
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{event.location.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.currentPlayers}/{event.maxPlayers} players
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={(newEvent) => {
            setEvents([newEvent, ...events])
            setShowCreateModal(false)
          }}
          user={user}
        />
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          user={user}
          onEventUpdated={(updatedEvent) => {
            setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
          }}
        />
      )}
    </div>
  )
}
