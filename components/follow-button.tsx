"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/firebase-context";
import { db } from "@/lib/firebase";
import { doc, writeBatch, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useFollowing } from "@/hooks/use-following";
import { toast } from "sonner";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

interface FollowButtonProps {
    targetUserId: string;
    targetUserName?: string;
    variant?: "default" | "outline" | "ghost" | "secondary";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export function FollowButton({ targetUserId, targetUserName = "User", variant = "default", size = "sm", className }: FollowButtonProps) {
    const { user } = useAuth();
    const { followingSet, loading: followingLoading } = useFollowing();
    const [isUpdating, setIsUpdating] = useState(false);

    const isFollowing = followingSet.has(targetUserId);

    const toggleFollow = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Sign in to follow users");
            window.dispatchEvent(new CustomEvent('require-auth'));
            return;
        }

        if (user.uid === targetUserId) {
            toast.error("You cannot follow yourself");
            return;
        }

        setIsUpdating(true);
        try {
            const batch = writeBatch(db);
            const followingRef = doc(db, `users/${user.uid}/following/${targetUserId}`);
            const followerRef = doc(db, `users/${targetUserId}/followers/${user.uid}`);

            if (isFollowing) {
                batch.delete(followingRef);
                batch.delete(followerRef);
                await batch.commit();
                toast.success(`Unfollowed ${targetUserName}`);
            } else {
                batch.set(followingRef, { 
                    timestamp: serverTimestamp(),
                    displayName: targetUserName 
                });
                batch.set(followerRef, { 
                    timestamp: serverTimestamp(),
                    displayName: user.displayName || "Unknown User" 
                });
                await batch.commit();
                toast.success(`Following ${targetUserName}`);
            }
        } catch (error) {
            console.error("Follow error:", error);
            toast.error("Failed to update follow status");
        } finally {
            setIsUpdating(false);
        }
    }, [user, targetUserId, isFollowing, db, targetUserName]);

    if (followingLoading || !user) return null;
    if (user.uid === targetUserId) return null;

    return (
        <Button
            variant={isFollowing ? "secondary" : variant}
            size={size}
            onClick={toggleFollow}
            disabled={isUpdating}
            className={`font-bold rounded-full ${isFollowing ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-primary text-white hover:bg-primary/90'} ${className || ''}`}
        >
            {isUpdating ? (
                <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
            ) : isFollowing ? (
                <UserMinus className="w-3 h-3 mr-1.5 shrink-0" />
            ) : (
                <UserPlus className="w-3 h-3 mr-1.5 shrink-0" />
            )}
            {isFollowing ? "Following" : "Follow"}
        </Button>
    );
}
