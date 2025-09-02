"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, CalendarIcon, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import EventDetailsModal from "@/components/event-details-modal"
import { EventCard, EventCardSkeleton } from "@/components/events/event-card"
import { SummaryHeader, SummaryHeaderSkeleton } from "@/components/events/summary-header"
import { useAuth } from "@/lib/firebase-context"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import ManualLocationSearch from "@/components/manual-location-search"

interface GameEvent {
  id: string
  title: string
  sport: string
  location: any
  date: string
  time: string
  maxPlayers: number
  currentPlayers: number
  createdBy: string
  players: string[]
  organizerName: string
  organizerPhotoURL?: string
  latitude?: number
  longitude?: number
  isBoosted?: boolean
}

const SPORTS = [
  "All",
  "Basketball",
  "Soccer",
  "Tennis",
  "Cricket",
  "Baseball",
  "Volleyball",
  "Football",
  "Hockey",
  "Badminton",
  "Table Tennis",
]

export default function DiscoverPage() {
  const { user } = useAuth()

  const [allNearbyEvents, setAllNearbyEvents] = useState<GameEvent[]>([])

  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSport, setSelectedSport] = useState("All")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState("All")
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)
  const [selectedDistance, setSelectedDistance] = useState("All")

  const [locationAccessDenied, setLocationAccessDenied] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959 // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const loadNearbyEvents = (latitude: number, longitude: number) => {
    setLoading(true)
    setUserLocation({ lat: latitude, lng: longitude })
    setLocationAccessDenied(false)
    fetch(`/api/events/nearby?lat=${latitude}&lon=${longitude}&radius=50000`)
      .then((res) => res.json())
      .then((data) => {
        setAllNearbyEvents(data.events || [])
      })
      .catch((error) => {
        console.error("Error loading nearby events:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadNearbyEvents(position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        console.error("Geolocation error:", error)
        setLocationAccessDenied(true)
        setLoading(false)
      },
    )
  }, [])

  const filteredEvents = useMemo(() => {
    return allNearbyEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.sport.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSport = selectedSport === "All" || event.sport === selectedSport
      const matchesDate = !selectedDate || event.date === format(selectedDate, "yyyy-MM-dd")
      const eventHour = Number.parseInt(event.time.split(":")[0])
      const matchesTime =
        selectedTime === "All" ||
        (selectedTime === "Morning" && eventHour >= 5 && eventHour < 12) ||
        (selectedTime === "Afternoon" && eventHour >= 12 && eventHour < 17) ||
        (selectedTime === "Evening" && eventHour >= 17 && eventHour < 22)
      const matchesAvailability = !showOnlyAvailable || event.currentPlayers < event.maxPlayers

      let matchesDistance = true
      if (selectedDistance !== "All" && userLocation && event.latitude && event.longitude) {
        const distance = calculateDistance(userLocation.lat, userLocation.lng, event.latitude, event.longitude)
        const maxDistance = selectedDistance === "1" ? 1 : selectedDistance === "5" ? 5 : 10
        matchesDistance = distance <= maxDistance
      }

      return matchesSearch && matchesSport && matchesDate && matchesTime && matchesAvailability && matchesDistance
    })
  }, [
    allNearbyEvents,
    searchQuery,
    selectedSport,
    selectedDate,
    selectedTime,
    showOnlyAvailable,
    selectedDistance,
    userLocation,
  ])

  const summaryStats = useMemo(() => {
    const now = new Date()
    const today = now.toISOString().split("T")[0]
    const eventsToday = allNearbyEvents.filter((e) => e.date === today).length
    const yourUpcoming = user
      ? allNearbyEvents.filter(
          (e) => new Date(e.date) >= now && (e.createdBy === user.uid || e.players.includes(user.uid)),
        ).length
      : 0
    return { totalEvents: allNearbyEvents.length, eventsToday, yourUpcoming }
  }, [allNearbyEvents, user])

  return (
    <div className="min-h-screen liquid-gradient p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Discover Events</h1>
          <p className="text-white/80">Find and join games happening around you.</p>
        </div>
      </header>

      {locationAccessDenied ? (
        <ManualLocationSearch onLocationSubmit={({ lat, lng }) => loadNearbyEvents(lat, lng)} />
      ) : (
        <>
          {loading ? <SummaryHeaderSkeleton /> : <SummaryHeader {...summaryStats} />}

          <div className="glass-card p-4 rounded-2xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
              <div className="relative flex-grow lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
                <Input
                  placeholder="Search by name or sport..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="glass border-white/20 text-white">
                  <SelectValue placeholder="Filter by sport" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {SPORTS.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDistance} onValueChange={setSelectedDistance}>
                <SelectTrigger className="glass border-white/20 text-white">
                  <SelectValue placeholder="Distance" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="All">Any Distance</SelectItem>
                  <SelectItem value="1">Within 1 mile</SelectItem>
                  <SelectItem value="5">Within 5 miles</SelectItem>
                  <SelectItem value="10">Within 10 miles</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="glass border-white/20 text-white w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 glass-card">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>

              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="glass border-white/20 text-white">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="All">Any Time</SelectItem>
                  <SelectItem value="Morning">Morning (5am-12pm)</SelectItem>
                  <SelectItem value="Afternoon">Afternoon (12pm-5pm)</SelectItem>
                  <SelectItem value="Evening">Evening (5pm-10pm)</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2 text-white justify-center lg:justify-start lg:col-start-5">
                <Users className="w-4 h-4" />
                <Label htmlFor="availability-switch">Open Spots Only</Label>
                <Switch id="availability-switch" checked={showOnlyAvailable} onCheckedChange={setShowOnlyAvailable} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center glass-card p-8 rounded-2xl">
              <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
              <p className="text-white/70 mb-4">Try adjusting your filters or creating a new event!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onSelectEvent={setSelectedEvent} />
              ))}
            </div>
          )}
        </>
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEventUpdated={(updatedEvent) => {
            setAllNearbyEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
          }}
        />
      )}
    </div>
  )
}