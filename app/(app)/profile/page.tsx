"use client"

import { useEffect, useState } from "react"
import { useFirebase } from "@/lib/firebase-context"
import { getUser, getUserEvents } from "@/lib/db"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Trophy, Target } from "lucide-react"

export default function ProfilePage() {
  const { user: firebaseUser } = useFirebase()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState(null)
  const [userEvents, setUserEvents] = useState({ organized: [], joined: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      if (!firebaseUser) return

      try {
        const [profile, events] = await Promise.all([getUser(firebaseUser.uid), getUserEvents(firebaseUser.uid)])

        setUserProfile(
          profile || {
            displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          },
        )
        setUserEvents(events)
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [firebaseUser])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (!firebaseUser || loading) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  const { organized, joined } = userEvents
  const totalEvents = organized.length + joined.length
  const upcomingEvents = [...organized, ...joined].filter(
    (event) => new Date(event.date + " " + event.time) > new Date(),
  ).length

  return (
    <div className="min-h-screen liquid-gradient pb-24">
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/20">
              Back
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/20">
              Logout
            </Button>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Users className="w-12 h-12 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold mb-2">{userProfile?.displayName || "User"}</h1>
            <p className="text-white/80">{userProfile?.email}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="glass-card border-white/20 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">{joined.length}</div>
              <div className="text-sm text-white/70">Events Joined</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">{organized.length}</div>
              <div className="text-sm text-white/70">Organized</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">{upcomingEvents}</div>
              <div className="text-sm text-white/70">Upcoming</div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/70">Join your first event to earn badges!</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalEvents === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/70 mb-4">No events yet</p>
                <p className="text-white/50 text-sm mb-4">Start by joining or creating an event</p>
                <Button onClick={() => router.push("/events")} className="bg-blue-500 hover:bg-blue-600">
                  Explore Events
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {[...organized, ...joined].slice(0, 3).map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{event.title}</h4>
                      <p className="text-white/70 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {event.sport}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
              onClick={() => router.push("/events")}
            >
              <Target className="w-4 h-4 mr-2" />
              View My Events
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
              onClick={() => router.push("/map")}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Find Nearby Events
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
