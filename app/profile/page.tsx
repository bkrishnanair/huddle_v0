"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut, Trophy, Calendar, Users, MapPin } from "lucide-react"

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

interface UserStats {
  joined: number
  organized: number
  upcoming: number
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<UserStats>({ joined: 0, organized: 0, upcoming: 0 })
  const [recentEvents, setRecentEvents] = useState<GameEvent[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        // Check auth first
        const authResponse = await fetch("/api/auth/me")
        if (!authResponse.ok) {
          router.push("/")
          return
        }

        const userData = await authResponse.json()
        setUser(userData.user)
        setLoading(false)

        fetchUserEvents(userData.user.uid)
      } catch (error) {
        console.error("Profile initialization failed:", error)
        router.push("/")
      }
    }

    const fetchUserEvents = async (userId: string) => {
      try {
        const eventsResponse = await fetch(`/api/users/${userId}/events`)
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json()
          const joinedEvents = eventsData.joinedEvents || []
          const organizedEvents = eventsData.organizedEvents || []

          const now = new Date()
          const upcoming = [...joinedEvents, ...organizedEvents].filter((event) => {
            const eventDate = new Date(event.date)
            return eventDate > now
          }).length

          setStats({
            joined: joinedEvents.length,
            organized: organizedEvents.length,
            upcoming,
          })

          const allEvents = [...joinedEvents, ...organizedEvents]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
          setRecentEvents(allEvents)
        }
      } catch (error) {
        console.error("Failed to fetch user events:", error)
      }
    }

    initializeProfile()
  }, [router])

  const handleBack = () => {
    router.push("/")
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
      router.push("/")
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen glass-bg flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen glass-bg">
      <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-slate-800 text-white">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/20">
            Logout
            <LogOut className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="text-center pb-8 px-4">
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold">{user.name?.charAt(0) || user.email?.charAt(0) || "U"}</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{user.name || "User"}</h1>
          <p className="text-white/80 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="px-4 -mt-6 pb-20">
        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-1">{stats.joined}</div>
                <div className="text-sm text-white/70">Events Joined</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">{stats.organized}</div>
                <div className="text-sm text-white/70">Organized</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400 mb-1">{stats.upcoming}</div>
                <div className="text-sm text-white/70">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Achievements</h2>
            <div className="flex items-center space-x-3 text-white/70">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">
                {stats.joined > 0 ? "Event Participant!" : "Join your first event to earn badges!"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Events</h2>
            </div>

            {recentEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70 mb-2">No events yet</p>
                <p className="text-white/50 text-sm mb-4">Start by joining or creating an event</p>
                <Button onClick={handleBack} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Explore Events
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentEvents.map((event) => (
                  <div key={event.id} className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white">{event.title}</h3>
                      <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded">{event.sport}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-white/70">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>
                          {event.currentPlayers}/{event.maxPlayers}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10"
                onClick={handleBack}
              >
                <Calendar className="w-4 h-4 mr-3" />
                View My Events
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10"
                onClick={handleBack}
              >
                <MapPin className="w-4 h-4 mr-3" />
                Find Nearby Events
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
