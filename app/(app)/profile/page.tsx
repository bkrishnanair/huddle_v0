"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/lib/firebase-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, LogOut, UserCircle, Pencil, Zap, Calendar, Star, Info } from "lucide-react"
import EditProfileModal from "@/components/profile/edit-profile-modal"
import HuddleProModal from "@/components/huddle-pro-modal"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EventCard } from "@/components/events/event-card"
import EventDetailsDrawer from "@/components/event-details-drawer"
import { GameEvent } from "@/lib/types"

function ProfileSkeleton() {
  return (
    <div className="min-h-screen liquid-gradient p-4 md:p-6 pb-28 animate-pulse">
      <header className="flex justify-end items-center gap-2 mb-6">
        <Skeleton className="h-10 w-10 rounded-lg bg-slate-700" />
        <Skeleton className="h-10 w-10 rounded-lg bg-slate-700" />
      </header>
      <div className="flex flex-col items-center text-center -mt-10 space-y-6">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-800" />
          <Skeleton className="h-8 w-48 mb-2 rounded-md bg-slate-700" />
          <Skeleton className="h-5 w-64 rounded-md bg-slate-700" />
          <Skeleton className="h-9 w-32 rounded-md mt-4 bg-slate-700" />
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          <Skeleton className="h-24 rounded-lg bg-slate-700" />
          <Skeleton className="h-24 rounded-lg bg-slate-700" />
          <Skeleton className="h-24 rounded-lg bg-slate-700" />
        </div>
        <Skeleton className="h-32 rounded-lg bg-slate-700 w-full" />
        <Skeleton className="h-32 rounded-lg bg-slate-700 w-full" />
      </div>
    </div>
  )
}

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <Card className="glass-surface border-white/10 text-center shadow-2xl hover:scale-105 transition-transform duration-300">
    <CardContent className="p-6">
      <div className="text-3xl font-extrabold text-slate-50 tracking-tight">{value}</div>
      <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{label}</div>
    </CardContent>
  </Card>
)
export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userStats, setUserStats] = useState({ organized: 0, joined: 0, upcoming: 0 })
  const [pastEvents, setPastEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isProModalOpen, setIsProModalOpen] = useState(false)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {
        setUserLocation({ lat: 37.7749, lng: -122.4194 })
      }
    )
  }, [])

  const fetchProfileData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const idToken = await user.getIdToken()
      const res = await fetch(`/api/users/${user.uid}/profile`, {
        headers: {
          "Authorization": `Bearer ${idToken}`
        },
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        setUserProfile(data.profile)
        setUserStats(data.stats || { organized: 0, joined: 0, upcoming: 0 })

        const eventsRes = await fetch(`/api/events/past?userId=${user.uid}`, {
          headers: {
            "Authorization": `Bearer ${idToken}`
          },
          credentials: 'include'
        })
        if (eventsRes.ok) {
          let events = (await eventsRes.json()).events || []

          if (userLocation) {
            events = events.map((event: any) => {
              if (event.geopoint) {
                const R = 3958.8;
                const dLat = (event.geopoint.latitude - userLocation.lat) * Math.PI / 180;
                const dLon = (event.geopoint.longitude - userLocation.lng) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(event.geopoint.latitude * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return { ...event, distance: Math.round(R * c * 10) / 10 };
              }
              return event;
            });
          }
          setPastEvents(events)
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }, [user?.uid, userLocation])

  useEffect(() => {
    if (user) fetchProfileData()
  }, [user, fetchProfileData])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success("Logged out successfully")
      router.push("/")
    } catch (error) {
      toast.error("Failed to log out")
    }
  }

  const onProfileUpdate = () => {
    setIsEditModalOpen(false)
    fetchProfileData()
  }

  if (authLoading || loading) {
    return <ProfileSkeleton />
  }

  return (
    <>
      <div className="min-h-screen liquid-gradient pb-28">
        <header className="p-4 flex justify-end items-center gap-3">
          <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl glass-surface border border-rose-500/20 shadow-xl hover:bg-rose-500/10 text-rose-400" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </header>

        <div className="px-4 md:px-6 -mt-10 space-y-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4 border-4 border-slate-800">
              <AvatarImage src={userProfile?.photoURL} />
              <AvatarFallback>
                <UserCircle className="w-full h-full text-slate-500" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold text-slate-50">{userProfile?.displayName || "Huddle User"}</h1>
            <p className="text-slate-400">{userProfile?.email}</p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => setIsEditModalOpen(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
            <StatCard label="Joined" value={userStats?.joined || 0} />
            <StatCard label="Organized" value={userStats?.organized || 0} />
            <StatCard label="Upcoming" value={userStats?.upcoming || 0} />
          </div>

          <div className="max-w-6xl mx-auto w-full space-y-8">
            <Card className="glass-surface border-white/10 shadow-2xl overflow-hidden rounded-3xl">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="text-xl font-bold text-slate-50">About Me</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">{userProfile?.bio || "No bio yet. Click 'Edit Profile' to add one."}</p>
                {userProfile?.favoriteSports && userProfile.favoriteSports.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {userProfile.favoriteSports.map((sport: string) => (
                      <Badge key={sport} className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 font-bold">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-surface border-white/10 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <Button size="lg" className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-extrabold text-lg shadow-xl hover:scale-[1.02] transition-all" onClick={() => setIsProModalOpen(true)}>
                  <Zap className="w-6 h-6 mr-2 fill-current" />
                  Upgrade to Huddle Pro ✨
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass-surface border-white/10 shadow-2xl rounded-3xl min-h-[200px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-lg">Your trophy case is waiting. Join a game to start collecting!</p>
                </CardContent>
              </Card>

              <Card className="glass-surface border-white/10 shadow-2xl rounded-3xl min-h-[200px]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-xl font-bold w-full">
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-primary" />
                      Karma Score
                    </div>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-5 h-5 text-slate-400 hover:text-white transition-colors cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs bg-slate-900 border-white/10 text-slate-200">
                          <p>Karma is earned by organizing successful events and receiving positive feedback from attendees.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-extrabold text-slate-50 tracking-tighter">750</span>
                    <span className="text-slate-500 font-bold mb-1 uppercase tracking-widest text-sm">/ 1000</span>
                  </div>
                  <p className="text-slate-400 mt-4">Top 5% in your local community.</p>
                </CardContent>
              </Card>
            </div>

            <section className="space-y-6 pt-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-7 h-7 text-primary" />
                <h2 className="text-3xl font-bold text-slate-50">Recent Events Attended</h2>
              </div>

              {pastEvents.length === 0 ? (
                <div className="glass-surface border-white/10 p-12 rounded-3xl text-center shadow-2xl">
                  <p className="text-slate-400 text-lg">No past events found. Get out there and join some games!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event: any) => (
                    <EventCard key={event.id} event={event} onSelectEvent={setSelectedEvent} showMapButton={true} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      {selectedEvent && (
        <EventDetailsDrawer
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEventUpdated={(updatedEvent) => {
            setPastEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
          }}
        />
      )}
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userProfile={userProfile}
          onProfileUpdate={onProfileUpdate}
        />
      )}
      <HuddleProModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
    </>
  )
}
