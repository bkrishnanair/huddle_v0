"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCircle, Trophy } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface PublicProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

const StatCard = ({ label, value }: { label: string; value: number }) => (
    <Card className="glass-surface border-none text-center">
        <CardContent className="p-3">
            <div className="text-xl font-bold text-slate-50">{value}</div>
            <div className="text-xs text-slate-400">{label}</div>
        </CardContent>
    </Card>
)

const ProfileContentSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        <div className="flex flex-col items-center text-center">
            <Skeleton className="w-24 h-24 rounded-full mb-4" />
            <Skeleton className="h-7 w-48 mb-2 rounded-md" />
            <Skeleton className="h-5 w-64 rounded-md" />
        </div>
        <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
        </div>
        <Skeleton className="h-24 rounded-lg" />
    </div>
);

export default function PublicProfileModal({ isOpen, onClose, userId }: PublicProfileModalProps) {
    // In a real app, you would fetch the user's profile data here based on the userId
    const userProfile = {
        displayName: "Jane Doe",
        photoURL: "",
        email: "jane.doe@example.com",
        bio: "Loves playing basketball and soccer on weekends.",
        favoriteSports: ["Basketball", "Soccer"],
    };
    const userStats = {
        joined: 28,
        organized: 5,
        upcoming: 2,
    };
    const isLoading = false; // This would be managed by your data fetching state

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-surface border-white/15 text-foreground">
        <DialogHeader>
          <DialogTitle>Player Profile</DialogTitle>
        </DialogHeader>
        {isLoading ? (
            <ProfileContentSkeleton />
        ) : (
            <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4 border-4 border-slate-800">
                        <AvatarImage src={userProfile?.photoURL} />
                        <AvatarFallback>
                            <UserCircle className="w-full h-full text-slate-500" />
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold text-slate-50">{userProfile?.displayName}</h1>
                    <p className="text-slate-400">{userProfile?.email}</p>
                </div>
            
                <div className="grid grid-cols-3 gap-4">
                    <StatCard label="Joined" value={userStats.joined} />
                    <StatCard label="Organized" value={userStats.organized} />
                    <StatCard label="Upcoming" value={userStats.upcoming} />
                </div>

                <Card className="glass-surface border-none">
                  <CardContent className="p-4">
                    <p className="text-slate-300 whitespace-pre-wrap">{userProfile?.bio || "No bio provided."}</p>
                    {userProfile?.favoriteSports && userProfile.favoriteSports.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {userProfile.favoriteSports.map((sport: string) => (
                          <Badge key={sport} variant="secondary">{sport}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
            </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
