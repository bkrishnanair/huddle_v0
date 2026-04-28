"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useAuth } from "@/lib/firebase-context"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { UserCircle, Calendar, Star, Info, BarChart3, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EventCard } from "@/components/events/event-card"
import EventDetailsDrawer from "@/components/event-details-drawer"
import { GameEvent } from "@/lib/types"
import FollowListModal from "@/components/profile/follow-list-modal"
import { FollowButton } from "@/components/follow-button"
import { toast } from "sonner"

function ProfileSkeleton() {
  return (
    <div className="min-h-screen liquid-gradient p-4 md:p-6 pb-[var(--safe-bottom)] animate-pulse">
      <div className="flex flex-col items-center text-center mt-6 space-y-6">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-800" />
          <Skeleton className="h-8 w-48 mb-2 rounded-md bg-slate-700" />
          <Skeleton className="h-5 w-64 rounded-md bg-slate-700" />
          <Skeleton className="h-9 w-32 rounded-md mt-4 bg-slate-700" />
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
          <Skeleton className="h-24 rounded-lg bg-slate-700" />
          <Skeleton className="h-24 rounded-lg bg-slate-700" />
          <Skeleton className="h-24 rounded-lg bg-slate-700" />
        </div>
        <Skeleton className="h-32 rounded-lg bg-slate-700 w-full max-w-4xl" />
      </div>
    </div>
  )
}

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <Card className="glass-surface border-white/10 text-center shadow-2xl hover:scale-105 transition-transform duration-300">
    <CardContent className="p-3 md:p-6">
      <div className="text-2xl md:text-3xl font-extrabold text-slate-50 tracking-tight">{value}</div>
      <div className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-wider md:tracking-widest mt-1 truncate">{label}</div>
    </CardContent>
  </Card>
)

export default function PublicProfilePage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const uid = params.uid as string

  const [userProfile, setUserProfile] = useState<any>(null)
  const [userStats, setUserStats] = useState({ organized: 0, joined: 0, upcoming: 0 })
  const [pastEvents, setPastEvents] = useState<any[]>([])
  const [reliabilityScore, setReliabilityScore] = useState<number | null>(null)
  const [totalTracked, setTotalTracked] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)

  // Follower State
  const [followerCount, setFollowerCount] = useState<number | null>(null)
  const [followingCount, setFollowingCount] = useState<number | null>(null)
  const [followModalOpen, setFollowModalOpen] = useState(false)
  const [followModalType, setFollowModalType] = useState<"followers" | "following">("followers")

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
    if (!uid) return
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${uid}/profile`)
      if (res.ok) {
        const data = await res.json()
        setUserProfile(data.profile)
        setUserStats(data.stats || { organized: 0, joined: 0, upcoming: 0 })
        setReliabilityScore(data.reliabilityScore)
        setTotalTracked(data.totalTracked || 0)

        // Use optimized counts from the API payload
        if (data.followerCount !== undefined) setFollowerCount(data.followerCount)
        if (data.followingCount !== undefined) setFollowingCount(data.followingCount)

        const eventsRes = await fetch(`/api/events/past?userId=${uid}`)
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
      } else {
        toast.error("Profile not found")
        router.push("/map")
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }, [uid, userLocation, router])

  useEffect(() => {
    if (user?.uid === uid) {
        router.replace("/profile")
    } else {
        fetchProfileData()
    }
  }, [uid, user?.uid, fetchProfileData, router])

  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      Sports: "⚽", Music: "🎵", Community: "🤝", Learning: "📚",
      "Food & Drink": "🍕", Tech: "💻", "Arts & Culture": "🎨",
      Outdoors: "🌲", default: "📍"
    }
    return icons[category] || icons.default
  }

  const topCategories = useMemo(() => {
    if (!pastEvents || pastEvents.length === 0) return []
    const counts: { [key: string]: number } = {}
    pastEvents.forEach((event: any) => {
      const cat = event.sport || event.category || "Other"
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, count]) => ({ category, count, icon: getCategoryIcon(category) }))
  }, [pastEvents])

  if (loading) {
    return <ProfileSkeleton />
  }

  if (!userProfile) {
     return <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
        <p className="text-slate-400 font-bold text-lg">Profile not found</p>
     </div>
  }

  return (
    <>
      <div className="min-h-screen liquid-gradient pb-[var(--safe-bottom)] pt-12">
        <div className="px-4 md:px-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4 border-4 border-slate-800">
              <AvatarImage src={userProfile?.photoURL} />
              <AvatarFallback>
                <UserCircle className="w-full h-full text-slate-500" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold text-slate-50">{userProfile?.displayName || "Huddle User"}</h1>

            <div className="mt-3">
                <FollowButton targetUserId={uid} targetUserName={userProfile?.displayName} size="default" className="w-32" />
            </div>

            {/* Followers / Following Row - Better UI */}
            <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-2xl p-1 mt-4 shadow-lg backdrop-blur-md">
              <button
                onClick={() => { setFollowModalType("following"); setFollowModalOpen(true); }}
                className="flex flex-col items-center justify-center min-w-24 px-4 py-2 rounded-xl hover:bg-white/10 transition-all group"
              >
                <span className="text-xl font-black text-slate-50 group-hover:text-primary transition-colors">{followingCount ?? '-'}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 group-hover:text-slate-300 transition-colors">Following</span>
              </button>

              <div className="w-px h-8 bg-white/10 mx-1" />

              <button
                onClick={() => { setFollowModalType("followers"); setFollowModalOpen(true); }}
                className="flex flex-col items-center justify-center min-w-24 px-4 py-2 rounded-xl hover:bg-white/10 transition-all group"
              >
                <span className="text-xl font-black text-slate-50 group-hover:text-primary transition-colors">
                  {followerCount === null ? '-' : followerCount}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 group-hover:text-slate-300 transition-colors">Followers</span>
              </button>
            </div>
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
                <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">{userProfile?.bio || "No bio yet."}</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass-surface border-white/10 shadow-2xl rounded-3xl min-h-[200px]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-xl font-bold w-full">
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-primary" />
                      Reliability Score
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reliabilityScore !== null ? (
                    <>
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-extrabold text-slate-50 tracking-tighter">{reliabilityScore}%</span>
                        <span className="text-slate-500 font-bold mb-1 uppercase tracking-widest text-sm">Attendance</span>
                      </div>
                      <p className="text-slate-400 mt-4">Based on {totalTracked} tracked {totalTracked === 1 ? 'event' : 'events'}.</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 opacity-50">
                      <span className="text-2xl font-bold text-slate-400 tracking-tight">No Data Yet</span>
                      <p className="text-slate-500 text-sm mt-2 text-center">Attend events that use check-in to build reliability.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Most Joined Categories */}
              <Card className="glass-surface border-white/10 shadow-2xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    Top Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {topCategories.length > 0 ? (
                    <div className="space-y-3">
                      {topCategories.map((item, index) => (
                        <div key={item.category} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <p className="font-bold text-slate-200">{item.category}</p>
                            <p className="text-xs text-slate-500">{item.count} {item.count === 1 ? 'event' : 'events'} joined</p>
                          </div>
                          <span className="text-lg font-extrabold text-primary">#{index + 1}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-lg">No events joined yet.</p>
                  )}
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
                  <p className="text-slate-400 text-lg">No past events found.</p>
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
      <FollowListModal
        isOpen={followModalOpen}
        onClose={() => setFollowModalOpen(false)}
        type={followModalType}
        userId={uid}
      />
    </>
  )
}
