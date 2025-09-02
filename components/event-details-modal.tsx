"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Users, X, Loader2, UserCheck, UserCircle } from "lucide-react"
import { toast } from "sonner"
import EventChat from "@/components/event-chat"

interface GameEvent {
  id: string
  title: string
  sport: string
  location: any
  date: string
  time: string
  maxPlayers: number
  currentPlayers: number
  players: string[]
  createdBy: string
  playerDetails?: Array<{
    id: string
    displayName: string
    photoURL?: string
  }>
  checkedInPlayers?: string[]
  isBoosted?: boolean
}

interface EventDetailsModalProps {
  event: GameEvent
  isOpen: boolean
  onClose: () => void
  onEventUpdated: (updatedEvent: GameEvent) => void
  currentUserId?: string
}

export default function EventDetailsModal({
  event,
  isOpen,
  onClose,
  onEventUpdated,
  currentUserId = "user-123", // TODO: Get from auth context
}: EventDetailsModalProps) {
  const [isRsvpLoading, setIsRsvpLoading] = useState(false)
  const [checkingInPlayer, setCheckingInPlayer] = useState<string | null>(null)
  const [eventWithDetails, setEventWithDetails] = useState<GameEvent>(event)
  const [isBoostLoading, setIsBoostLoading] = useState(false)

  useEffect(() => {
    if (isOpen && event.id) {
      loadEventDetails()
    }
  }, [isOpen, event.id])

  const loadEventDetails = async () => {
    try {
      const response = await fetch(`/api/events/${event.id}/details`)
      if (response.ok) {
        const eventData = await response.json()
        setEventWithDetails(eventData)
      } else {
        toast.error("Failed to load event details.")
      }
    } catch (error) {
      console.error("Error loading event details:", error)
      toast.error("An unexpected error occurred while loading details.")
    }
  }

  if (!isOpen) return null

  const handleRsvp = async () => {
    setIsRsvpLoading(true)
    try {
      const hasJoined = eventWithDetails.players.includes(currentUserId)
      const action = hasJoined ? "leave" : "join"

      const response = await fetch(`/api/events/${eventWithDetails.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        const result = await response.json()
        const updatedEvent = result.event
        setEventWithDetails(updatedEvent)
        onEventUpdated(updatedEvent)
        toast.success(hasJoined ? "Successfully left the event." : "Successfully joined the event!")
        await loadEventDetails()
      } else {
        const errorData = await response.json()
        toast.error(`Failed to ${action} event: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error during RSVP:", error)
      toast.error("An unexpected error occurred during RSVP.")
    } finally {
      setIsRsvpLoading(false)
    }
  }

  const handleCheckIn = async (playerId: string) => {
    setCheckingInPlayer(playerId)
    try {
      const response = await fetch(`/api/events/${eventWithDetails.id}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      })

      if (response.ok) {
        const result = await response.json()
        setEventWithDetails(result.event)
        onEventUpdated(result.event)
        toast.success("Player checked in successfully.")
      } else {
        const errorData = await response.json()
        toast.error(`Failed to check in player: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error checking in player:", error)
      toast.error("An unexpected error occurred during check-in.")
    } finally {
      setCheckingInPlayer(null)
    }
  }

  const handleBoostEvent = async () => {
    setIsBoostLoading(true)
    try {
      const response = await fetch(`/api/events/${eventWithDetails.id}/boost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const result = await response.json()
        const updatedEvent = { ...eventWithDetails, isBoosted: true }
        setEventWithDetails(updatedEvent)
        onEventUpdated(updatedEvent)
        toast.success("Event boosted successfully!")
      } else {
        const errorData = await response.json()
        toast.error(`Failed to boost event: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error boosting event:", error)
      toast.error("An unexpected error occurred while boosting.")
    } finally {
      setIsBoostLoading(false)
    }
  }

  const isFull = eventWithDetails.currentPlayers >= eventWithDetails.maxPlayers
  const hasJoined = eventWithDetails.players.includes(currentUserId)
  const isOrganizer = eventWithDetails.createdBy === currentUserId

  const renderRsvpButton = () => {
    if (hasJoined) {
      return (
        <Button
          onClick={handleRsvp}
          variant="outline"
          className="w-full bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30"
          disabled={isRsvpLoading}
        >
          {isRsvpLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Leaving...
            </>
          ) : (
            "Leave Game"
          )}
        </Button>
      )
    }
    if (isFull) {
      return (
        <Button className="w-full" disabled>
          Event is Full
        </Button>
      )
    }
    return (
      <Button onClick={handleRsvp} className="w-full" disabled={isRsvpLoading}>
        {isRsvpLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          "Join Game"
        )}
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg glass-card border-none rounded-2xl shadow-2xl relative max-h-[90vh] flex flex-col">
        <div className="p-6 flex-shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{eventWithDetails.title}</h2>
              <Badge variant="secondary" className="bg-white/20 text-white border-none mt-1">
                {eventWithDetails.sport}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full absolute top-4 right-4"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10">
              <TabsTrigger value="details" className="text-white data-[state=active]:bg-white/20">
                Details
              </TabsTrigger>
              <TabsTrigger value="players" className="text-white data-[state=active]:bg-white/20">
                Players
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-white data-[state=active]:bg-white/20">
                Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-blue-300" />
                  <span>{eventWithDetails.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3 text-green-300" />
                  <span>
                    {new Date(eventWithDetails.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3 text-purple-300" />
                  <span>{eventWithDetails.time}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-3 text-yellow-300" />
                  <span>
                    {eventWithDetails.currentPlayers} / {eventWithDetails.maxPlayers} Players
                  </span>
                </div>
              </div>

              {isOrganizer && !eventWithDetails.isBoosted && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <Button
                    onClick={handleBoostEvent}
                    disabled={isBoostLoading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                  >
                    {isBoostLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Boosting...
                      </>
                    ) : (
                      "🚀 Boost Event (Free)"
                    )}
                  </Button>
                  <p className="text-xs text-white/60 mt-2 text-center">Make your event more visible on the map</p>
                </div>
              )}

              {eventWithDetails.isBoosted && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-center space-x-2 text-yellow-400">
                    <span className="text-lg">🚀</span>
                    <span className="font-semibold">This event is boosted!</span>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="players" className="mt-4">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {eventWithDetails.playerDetails && eventWithDetails.playerDetails.length > 0 ? (
                  eventWithDetails.playerDetails.map((player) => {
                    const isCheckedIn = eventWithDetails.checkedInPlayers?.includes(player.id)
                    return (
                      <div key={player.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={player.photoURL || "/placeholder.svg"} />
                            <AvatarFallback>
                              <UserCircle className="w-8 h-8 text-white/70" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">{player.displayName}</p>
                            {isCheckedIn && (
                              <p className="text-green-300 text-xs flex items-center">
                                <UserCheck className="w-3 h-3 mr-1" />
                                Checked In
                              </p>
                            )}
                          </div>
                        </div>

                        {isOrganizer && !isCheckedIn && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCheckIn(player.id)}
                            disabled={checkingInPlayer === player.id}
                            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                          >
                            {checkingInPlayer === player.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check In"}
                          </Button>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-white/60 text-center py-4">No players joined yet</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="chat" className="mt-4 flex-grow h-0">
               <div className="h-full flex flex-col">
                 <EventChat eventId={eventWithDetails.id} />
               </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-white/10 px-6 py-4 rounded-b-2xl mt-auto flex-shrink-0">{renderRsvpButton()}</div>
      </div>
    </div>
  )
}
