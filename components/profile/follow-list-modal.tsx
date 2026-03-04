"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/firebase-context"
import { FollowButton } from "./follow-button"

interface FollowListModalProps {
    isOpen: boolean
    onClose: () => void
    type: "followers" | "following"
    userId: string
}

export default function FollowListModal({ isOpen, onClose, type, userId }: FollowListModalProps) {
    const { user } = useAuth()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isOpen || !userId || !user) return

        const fetchUsers = async () => {
            setLoading(true)
            try {
                const idToken = await user.getIdToken()
                const res = await fetch(`/api/users/${userId}/${type}`, {
                    headers: {
                        "Authorization": `Bearer ${idToken}`
                    }
                })
                if (res.ok) {
                    const data = await res.json()
                    setUsers(data[type] || [])
                }
            } catch (error) {
                console.error(`Error fetching ${type}:`, error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [isOpen, userId, type, user])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md glass-surface border-white/15 text-foreground max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="capitalize">{type}</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            No {type} yet.
                        </div>
                    ) : (
                        users.map((profile) => (
                            <div key={profile.uid} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10 border border-slate-700">
                                        <AvatarImage src={profile.photoURL} />
                                        <AvatarFallback>
                                            <UserCircle className="w-full h-full text-slate-500" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-slate-200 text-sm">{profile.displayName}</p>
                                    </div>
                                </div>
                                <FollowButton targetUserId={profile.uid} targetUserName={profile.displayName} />
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
