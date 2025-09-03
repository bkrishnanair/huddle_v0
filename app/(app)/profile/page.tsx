"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/firebase-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, LogOut, Settings, UserCircle, Pencil, Zap } from "lucide-react"
import EditProfileModal from "@/components/profile/edit-profile-modal"
import HuddleProModal from "@/components/huddle-pro-modal"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

function ProfileSkeleton() {
    return (
        <div className="min-h-screen liquid-gradient p-4 md:p-6 pb-24 animate-pulse">
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
    <Card className="glass-surface border-none text-center">
        <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-50">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
        </CardContent>
    </Card>
)
export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userStats, setUserStats] = useState({ organized: 0, joined: 0, upcoming: 0 })
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isProModalOpen, setIsProModalOpen] = useState(false)

  const loadUserData = async () => {
      if (!user) return
      setLoading(true)
      try {
        const res = await fetch(`/api/users/${user.uid}/profile`)
        if (res.ok) {
          const data = await res.json()
          setUserProfile(data.profile)
          setUserStats(data.stats)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    if (user) loadUserData()
  }, [user])
  
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
    loadUserData()
  }

  if (authLoading || loading) {
    return <ProfileSkeleton />
  }

  return (
    <>
      <div className="min-h-screen liquid-gradient pb-24">
        <header className="p-4 flex justify-end items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => { /* Open Settings */ }}>
                <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
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
          
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Joined" value={userStats.joined} />
              <StatCard label="Organized" value={userStats.organized} />
              <StatCard label="Upcoming" value={userStats.upcoming} />
            </div>

            <Card className="glass-surface border-white/15">
              <CardHeader>
                <CardTitle className="text-slate-50">About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 whitespace-pre-wrap">{userProfile?.bio || "No bio yet. Click 'Edit Profile' to add one."}</p>
                {userProfile?.favoriteSports && userProfile.favoriteSports.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {userProfile.favoriteSports.map((sport: string) => (
                      <Badge key={sport} variant="secondary">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-surface border-white/15">
                <CardContent className="p-6">
                    <Button className="w-full" onClick={() => setIsProModalOpen(true)}>
                        <Zap className="w-5 h-5 mr-2" />
                        Upgrade to Huddle Pro ✨
                    </Button>
                </CardContent>
            </Card>

            <Card className="glass-surface border-white/15">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">Your trophy case is waiting. Join a game to start collecting!</p>
              </CardContent>
            </Card>
        </div>
      </div>
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
