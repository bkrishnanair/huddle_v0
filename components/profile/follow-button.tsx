"use client";

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useAuth } from '@/lib/firebase-context';
import { useRouter } from 'next/navigation';
import { useFollowing } from '@/hooks/use-following';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface FollowButtonProps {
    targetUserId: string;
    targetUserName?: string;
}

export function FollowButton({ targetUserId, targetUserName = "this user" }: FollowButtonProps) {
    const { user } = useAuth();
    const router = useRouter();
    const { followingSet, optimisticToggle } = useFollowing();

    const [isLoading, setIsLoading] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    // Fallback to false if the set isn't loaded yet
    const isFollowing = user ? followingSet.has(targetUserId) : false;

    const handleToggleFollow = useCallback(async (newFollowState: boolean) => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.uid === targetUserId) return; // Can't follow self (UI shouldn't really show this button anyway)

        setIsLoading(true);
        setPopoverOpen(false); // Close popover if an unfollow happened

        // 1. Optimistic UI update instantly
        optimisticToggle(targetUserId, newFollowState);

        try {
            const idToken = await user.getIdToken();
            const res = await fetch(`/api/users/${targetUserId}/follow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`
                },
                body: JSON.stringify({ isFollowing: newFollowState })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to toggle follow status");
            }

            if (newFollowState) {
                toast.success(`Following ${targetUserName}`);
            } else {
                toast.success(`Unfollowed ${targetUserName}`);
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Something went wrong.");
            // Rollback optimistic update on failure
            optimisticToggle(targetUserId, !newFollowState);
        } finally {
            setIsLoading(false);
        }
    }, [user, router, targetUserId, optimisticToggle, targetUserName]);

    // Hide button entirely if it's the current user's own profile
    if (user?.uid === targetUserId) {
        return null;
    }

    if (isFollowing) {
        return (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                        size="sm"
                        variant="secondary"
                        disabled={isLoading}
                        className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all font-semibold"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserCheck className="w-4 h-4 mr-2 text-emerald-400" />}
                        Following
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 glass-surface border-white/10" align="center">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-center text-slate-200 py-1">Unfollow {targetUserName}?</p>
                        <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="flex-1 text-slate-400 hover:text-white" onClick={() => setPopoverOpen(false)}>Cancel</Button>
                            <Button size="sm" variant="destructive" className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold border border-red-500/30" onClick={() => handleToggleFollow(false)}>Unfollow</Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Button
            size="sm"
            onClick={() => handleToggleFollow(true)}
            disabled={isLoading}
            className="rounded-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 text-white shadow-lg border-none transition-all font-bold group"
        >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />}
            Follow
        </Button>
    );
}
