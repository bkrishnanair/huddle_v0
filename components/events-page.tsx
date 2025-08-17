"use client"

import { useState, useEffect } from "react"
import { getEvents } from "@/lib/db"
import { Calendar, MapPin, Users, Clock, Search, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  onSwitchToMap?: () => void
}

export default function EventsPage({ user, onSwitchToMap }: EventsPageProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSport, setSelectedSport] = useState("All Sports")
  const [viewMode, setViewMode] = useState<"nearby" | "my">("nearby")

  useEffect(() => {
    const loadEvents = async () => {
      console.log("[v0] EventsPage: Starting to load events...")
      try {
        console.log("[v0] EventsPage: Calling getEvents()...")
        const eventsData = await getEvents()
        console.log("[v0] EventsPage: getEvents() returned:", eventsData)
        setEvents(eventsData)
        console.log("[v0] EventsPage: Events state updated successfully")
      } catch (error) {
        console.error("[v0] EventsPage: Error loading events:", error)
      } finally {
        console.log("[v0] EventsPage: Setting loading to false")
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.sport.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSport = selectedSport === "All Sports" || event.sport === selectedSport
    const matchesView =
      viewMode === "nearby" ||
      (viewMode === "my" && (event.createdBy === user?.uid || event.players.includes(user?.uid)))

    return matchesSearch && matchesSport && matchesView
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  console.log("[v0] EventsPage: Rendering with loading =", loading, "events count =", events.length)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      <div className="glass-card mx-4 mt-4 p-4 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <Button variant="ghost" onClick={onSwitchToMap} className="text-gray-600 hover:text-gray-900 font-medium">
            <Map className="w-4 h-4 mr-2" />
            Map
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 border-white/20 rounded-xl"
          />
        </div>

        <div className="mb-4">
          <Button variant="default" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6">
            {selectedSport}
          </Button>
        </div>

        <div className="flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setViewMode("nearby")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
              viewMode === "nearby" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Nearby
          </button>
          <button
            onClick={() => setViewMode("my")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
              viewMode === "my" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Events
          </button>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events nearby</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or create a new event</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Create Event
            </Button>
          </div>
        ) : (
          filteredEvents.map((event) => (
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

      <div className="fixed bottom-24 right-6">
        <Button
          onClick={() => setShowCreateModal(true)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <span className="text-2xl">+</span>
        </Button>
      </div>

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
