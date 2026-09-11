"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/firebase-context";
import { Button } from "@/components/ui/button";
import { useFollowing } from "@/hooks/use-following";
import { toast } from "sonner";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  targetUserId: string;
  targetUserName?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function FollowButton({
  targetUserId,
  targetUserName = "User",
  variant = "default",
  size = "sm",
  className,
}: FollowButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { followingSet, loading: followingLoading, optimisticToggle } = useFollowing();
  const [isUpdating, setIsUpdating] = useState(false);

  const isFollowing = user ? followingSet.has(targetUserId) : false;

  const toggleFollow = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        toast.error("Sign in to follow users");
        router.push("/login");
        return;
      }

      if (user.uid === targetUserId) {
        toast.error("You cannot follow yourself");
        return;
      }

      const nextState = !isFollowing;
      setIsUpdating(true);

      // Optimistic update
      optimisticToggle(targetUserId, nextState);

      try {
        const idToken = await user.getIdToken();
        const res = await fetch(`/api/users/${targetUserId}/follow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ isFollowing: nextState }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to update follow status");
        }

        if (nextState) {
          toast.success(`Following ${targetUserName}`);
        } else {
          toast.success(`Unfollowed ${targetUserName}`);
        }
      } catch (error: any) {
        console.error("Follow error:", error);
        toast.error(error.message || "Failed to update follow status");
        // Rollback optimistic update
        optimisticToggle(targetUserId, isFollowing);
      } finally {
        setIsUpdating(false);
      }
    },
    [user, targetUserId, isFollowing, optimisticToggle, router, targetUserName]
  );

  if (followingLoading || !user) return null;
  if (user.uid === targetUserId) return null;

  return (
    <Button
      variant={isFollowing ? "secondary" : variant}
      size={size}
      onClick={toggleFollow}
      disabled={isUpdating}
      className={`font-semibold rounded-full ${
        isFollowing
          ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
          : "bg-primary hover:bg-primary/90 text-white"
      } ${className || ""}`}
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
