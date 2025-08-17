"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut, Trophy, MapPin, Calendar, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventList } from "@/components/profile/event-list"
import { useAuth } from "@/lib/firebase-context"

interface GameEvent {
  id: string
  title: string
  sport: string
  location: string
  date: string
  time: string
  maxPlayers: number
  currentPlayers: number
}

interface UserStats {
  joined: number
  organized: number
  upcoming: number
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<UserStats>({ joined: 0, organized: 0, upcoming: 0 })
  const [organizedEvents, setOrganizedEvents] = useState<GameEvent[]>([])
  const [joinedEvents, setJoinedEvents] = useState<GameEvent[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
      return
    }

    if (user) {
      const fetchUserEvents = async (userId: string) => {
        try {
          const eventsResponse = await fetch(`/api/users/${userId}/events`)
          if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json()
            const organized = eventsData.organizedEvents || []
            const joined = eventsData.joinedEvents || []

            const now = new Date()
            const upcoming = [...joined, ...organized].filter((event) => {
              const eventDate = new Date(event.date)
              return eventDate > now
            }).length

            setStats({
              joined: joined.length,
              organized: organized.length,
              upcoming,
            })
            setOrganizedEvents(organized)
            setJoinedEvents(joined)
          }
        } catch (error) {
          console.error("Failed to fetch user events:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchUserEvents(user.uid)
    }
  }, [user, authLoading, router])

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

  if (loading || authLoading) {
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
            <span className="text-2xl font-bold">{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{user.displayName || "User"}</h1>
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

        <Tabs defaultValue="organized">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="organized">Organized</TabsTrigger>
            <TabsTrigger value="joined">Joined</TabsTrigger>
          </TabsList>
          <TabsContent value="organized">
            <EventList events={organizedEvents} emptyStateMessage="You have not organized any events." />
          </TabsContent>
          <TabsContent value="joined">
            <EventList events={joinedEvents} emptyStateMessage="You have not joined any events." />
          </TabsContent>
        </Tabs>

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

        <Card className="glass-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10"
                onClick={handleBack}
              >
                <Users className="w-4 h-4 mr-3" />
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
