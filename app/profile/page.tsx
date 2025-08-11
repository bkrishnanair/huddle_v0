"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Calendar, MapPin, Users, Trophy, GamepadIcon } from "lucide-react"
import SharedHeader from "@/components/shared-header"

interface GameEvent {
  id: string
  title: string
  sport: string
  location: string
  date: string
  time: string
  maxPlayers: number
  currentPlayers: number
  createdBy: string
  players: string[]
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [joinedEvents, setJoinedEvents] = useState<GameEvent[]>([])
  const [organizedEvents, setOrganizedEvents] = useState<GameEvent[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)

          // Fetch user events
          const eventsResponse = await fetch(`/api/users/${userData.user.uid}/events`)
          if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json()
            setJoinedEvents(eventsData.joinedEvents)
            setOrganizedEvents(eventsData.organizedEvents)
          }
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    router.push("/")
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedHeader user={user} onLogout={handleLogout} />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{organizedEvents.length}</p>
                <p className="text-sm text-gray-600">Games Organized</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <GamepadIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{joinedEvents.length}</p>
                <p className="text-sm text-gray-600">Games Joined</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Games You've Organized */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              <span>Games You've Organized</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {organizedEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>You haven't organized any games yet.</p>
                <Button className="mt-4" onClick={() => router.push("/")}>
                  Create Your First Game
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {organizedEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{event.title}</h3>
                          <Badge variant="secondary">{event.sport}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(event.date)} at {formatTime(event.time)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>
                              {event.currentPlayers} / {event.maxPlayers} players
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Games You've Joined */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GamepadIcon className="w-5 h-5 text-green-600" />
              <span>Games You've Joined</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {joinedEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <GamepadIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>You haven't joined any games yet.</p>
                <Button className="mt-4" onClick={() => router.push("/")}>
                  Find Games to Join
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {joinedEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{event.title}</h3>
                          <Badge variant="secondary">{event.sport}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(event.date)} at {formatTime(event.time)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>
                              {event.currentPlayers} / {event.maxPlayers} players
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
