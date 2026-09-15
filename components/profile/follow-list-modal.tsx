"use client"

import Link from 'next/link'
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
import { FollowButton } from "@/components/follow-button"
import { Button } from "@/components/ui/button"

interface FollowProfile { uid: string; displayName: string; photoURL?: string }

interface FollowListModalProps {
    isOpen: boolean
    onClose: () => void
    type: "followers" | "following"
    userId: string
}

export default function FollowListModal({ isOpen, onClose, type, userId }: FollowListModalProps) {
    const { user } = useAuth()
    const [users, setUsers] = useState<FollowProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [retry, setRetry] = useState(0)

    useEffect(() => {
        if (!isOpen || !userId || !user) return
        const controller = new AbortController()

        const fetchUsers = async () => {
            setLoading(true)
            setError(false)
            setUsers([])
            try {
                const idToken = await user.getIdToken()
                if (controller.signal.aborted) return
                const res = await fetch(`/api/users/${userId}/${type}`, {
                    signal: controller.signal,
                    headers: {
                        "Authorization": `Bearer ${idToken}`
                    }
                })
                if (!res.ok) throw new Error('Unable to load people')
                const data = await res.json()
                if (!controller.signal.aborted) setUsers(data[type] || [])
            } catch {
                if (!controller.signal.aborted) setError(true)
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        fetchUsers()
        return () => controller.abort()
    }, [isOpen, userId, type, user, retry])

    return (
        <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose() }}>
            <DialogContent className="sm:max-w-md glass-surface border-white/15 text-foreground max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="capitalize">{type}</DialogTitle>
                </DialogHeader>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2 mt-4 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-6 space-y-3" role="alert">
                            <p className="text-slate-400">Couldn’t load {type}. Please try again.</p>
                            <Button variant="outline" className="min-h-11" onClick={() => setRetry(value => value + 1)}>Try again</Button>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            No {type} yet.
                        </div>
                    ) : (
                        users.map((profile) => (
                            <div key={profile.uid} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                <Link href={`/profile/${encodeURIComponent(profile.uid)}`} onClick={onClose} className="flex min-w-0 flex-1 items-center gap-3">
                                    <Avatar className="w-10 h-10 border border-slate-700">
                                        <AvatarImage src={profile.photoURL} />
                                        <AvatarFallback>
                                            <UserCircle className="w-full h-full text-slate-500" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="truncate font-bold text-slate-200 text-sm">{profile.displayName}</p>
                                    </div>
                                </Link>
                                <FollowButton targetUserId={profile.uid} targetUserName={profile.displayName} />
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
