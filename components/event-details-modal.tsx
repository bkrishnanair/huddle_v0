"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, Users, Calendar } from "lucide-react"

interface EventDetailsModalProps {
  event: any
  user: any
  onClose: () => void
  onEventUpdated: (event: any) => void
}

export default function EventDetailsModal({ event, user, onClose, onEventUpdated }: EventDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Update the isUserJoined check
  const isUserJoined = event.players?.includes(user.uid) || false
  const isFull = event.currentPlayers >= event.maxPlayers

  const handleRSVP = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/events/${event.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: isUserJoined ? "leave" : "join" }),
      })

      if (response.ok) {
        const updatedEvent = await response.json()
        onEventUpdated(updatedEvent.event)
      }
    } catch (error) {
      console.error("RSVP failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
              <Badge variant="secondary" className="mb-2">
                {event.sport}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Date & Time */}
          <div className="flex items-center space-x-3 text-gray-600">
            <Calendar className="w-5 h-5" />
            <div>
              <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
              <p className="text-sm">{formatTime(event.time)}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-3 text-gray-600">
            <MapPin className="w-5 h-5" />
            <div>
              <p className="font-medium text-gray-900">Location</p>
              <p className="text-sm">{event.location}</p>
            </div>
          </div>

          {/* Players */}
          <div className="flex items-center space-x-3 text-gray-600">
            <Users className="w-5 h-5" />
            <div>
              <p className="font-medium text-gray-900">
                Players: {event.currentPlayers} / {event.maxPlayers}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(event.currentPlayers / event.maxPlayers) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Your status:</span>
            <Badge variant={isUserJoined ? "default" : "outline"}>{isUserJoined ? "Joined" : "Not joined"}</Badge>
          </div>

          {/* RSVP Button */}
          <div className="pt-4">
            {isUserJoined ? (
              <Button
                onClick={handleRSVP}
                disabled={isLoading}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
              >
                {isLoading ? "Leaving..." : "Leave Game"}
              </Button>
            ) : (
              <Button
                onClick={handleRSVP}
                disabled={isLoading || isFull}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Joining..." : isFull ? "Game Full" : "Join Game"}
              </Button>
            )}
          </div>

          {isFull && !isUserJoined && (
            <p className="text-sm text-amber-600 text-center bg-amber-50 p-2 rounded">
              This game is currently full. Check back later for openings!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
