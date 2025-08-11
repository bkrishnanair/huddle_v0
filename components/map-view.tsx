"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus, User, LogOut, MapPin } from "lucide-react"
import EventDetailsModal from "./event-details-modal"
import CreateEventModal from "./create-event-modal"

interface MapViewProps {
  user: any
  onLogout: () => void
}

interface GameEvent {
  id: string
  title: string
  sport: string
  location: string
  latitude: number
  longitude: number
  date: string
  time: string
  maxPlayers: number
  currentPlayers: number
  createdBy: string
  players: string[]
}

export default function MapView({ user, onLogout }: MapViewProps) {
  const [events, setEvents] = useState<GameEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          // Default to San Francisco if location access denied
          setUserLocation({ lat: 37.7749, lng: -122.4194 })
        },
      )
    } else {
      // Default location
      setUserLocation({ lat: 37.7749, lng: -122.4194 })
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!userLocation || !mapRef.current) return

    // Simple map implementation using a visual representation
    const mapContainer = mapRef.current
    mapContainer.innerHTML = ""

    // Create map background
    const mapBg = document.createElement("div")
    mapBg.className = "w-full h-full bg-green-100 relative overflow-hidden"
    mapBg.style.backgroundImage = `
      radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
    `

    mapContainer.appendChild(mapBg)
    setMapInstance(mapBg)
  }, [userLocation])

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch("/api/events")
        if (response.ok) {
          const data = await response.json()
          setEvents(data.events)
        }
      } catch (error) {
        console.error("Failed to load events:", error)
      }
    }

    loadEvents()
  }, [])

  // Render event pins on map
  useEffect(() => {
    if (!mapInstance || !userLocation) return

    // Clear existing pins
    const existingPins = mapInstance.querySelectorAll(".event-pin")
    existingPins.forEach((pin: Element) => pin.remove())

    // Add user location pin
    const userPin = document.createElement("div")
    userPin.className = "absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg z-10"
    userPin.style.left = "50%"
    userPin.style.top = "50%"
    userPin.style.transform = "translate(-50%, -50%)"
    userPin.title = "Your location"
    mapInstance.appendChild(userPin)

    // Add event pins
    events.forEach((event, index) => {
      const pin = document.createElement("div")
      pin.className =
        "event-pin absolute w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:bg-red-600 transition-colors z-20 flex items-center justify-center"

      // Position pins around the user location
      const angle = index * 60 * (Math.PI / 180)
      const radius = 80 + (index % 3) * 40
      const x = 50 + Math.cos(angle) * ((radius / mapInstance.offsetWidth) * 100)
      const y = 50 + Math.sin(angle) * ((radius / mapInstance.offsetHeight) * 100)

      pin.style.left = `${Math.max(5, Math.min(95, x))}%`
      pin.style.top = `${Math.max(5, Math.min(95, y))}%`
      pin.style.transform = "translate(-50%, -50%)"
      pin.title = event.title

      // Add sport icon
      const icon = document.createElement("div")
      icon.className = "text-white text-xs font-bold"
      icon.textContent = event.sport.charAt(0).toUpperCase()
      pin.appendChild(icon)

      pin.addEventListener("click", () => setSelectedEvent(event))
      mapInstance.appendChild(pin)
    })
  }, [mapInstance, events, userLocation])

  // Update the handleLogout function
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      onLogout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleEventCreated = (newEvent: GameEvent) => {
    setEvents((prev) => [...prev, newEvent])
    setShowCreateModal(false)
  }

  const handleEventUpdated = (updatedEvent: GameEvent) => {
    setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    setSelectedEvent(updatedEvent)
  }

  if (!userLocation) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Huddle</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{user.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />

        {/* Map Legend */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Your location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Games nearby</span>
          </div>
        </div>

        {/* Create Event Button */}
        <Button
          onClick={() => setShowCreateModal(true)}
          className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-700 rounded-full w-14 h-14 shadow-lg"
          size="lg"
        >
          <Plus className="w-6 h-6" />
        </Button>

        {/* Events Counter */}
        <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium">
          {events.length} games nearby
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          user={user}
          onClose={() => setSelectedEvent(null)}
          onEventUpdated={handleEventUpdated}
        />
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          user={user}
          userLocation={userLocation}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={handleEventCreated}
        />
      )}
    </div>
  )
}
