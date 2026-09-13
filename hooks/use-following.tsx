"use client";

import { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext } from 'react';
import { useAuth } from '@/lib/firebase-context';

interface FollowingContextType {
    followingIds: string[];
    followingSet: Set<string>;
    loading: boolean;
    refresh: () => Promise<void>;
    optimisticToggle: (targetId: string, isFollowing: boolean) => void;
}

const FollowingContext = createContext<FollowingContextType | null>(null);
const EMPTY_IDS: string[] = [];

export function FollowingProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [result, setResult] = useState<{ uid: string; ids: string[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const request = useRef<AbortController | null>(null);
    // Never expose the previous account's follows while the next request loads.
    const followingIds = result && result.uid === user?.uid ? result.ids : EMPTY_IDS;

    // Fetch only the IDs of the users this user is following
    const fetchFollowingIds = useCallback(async () => {
        request.current?.abort();
        if (!user) return;
        const controller = new AbortController();
        request.current = controller;
        setLoading(true);
        try {
            const idToken = await user.getIdToken();
            if (controller.signal.aborted) return;
            // Use the idsOnly flag to get a raw array instead of hydrated profiles
            const res = await fetch(`/api/users/${user.uid}/following?idsOnly=true`, {
                signal: controller.signal,
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                if (!controller.signal.aborted) {
                    setResult({ uid: user.uid, ids: Array.isArray(data.followingIds) ? data.followingIds.filter((id: unknown) => typeof id === 'string') : [] });
                }
            }
        } catch (error) {
            if (!controller.signal.aborted) console.error("Error fetching following IDs:", error);
        } finally {
            if (request.current === controller && !controller.signal.aborted) setLoading(false);
        }
    }, [user]);

    // Refetch per account; cancel outstanding work on account change/unmount.
    useEffect(() => {
        setResult(null);
        setLoading(false);
        void fetchFollowingIds();
        return () => request.current?.abort();
    }, [fetchFollowingIds]);

    // Expose an optimistic update method for buttons to use
    const optimisticToggle = useCallback((targetId: string, isFollowing: boolean) => {
        if (!user) return;
        request.current?.abort();
        setLoading(false);
        setResult(previous => {
            const ids = previous?.uid === user.uid ? previous.ids : EMPTY_IDS;
            return { uid: user.uid, ids: isFollowing ? Array.from(new Set([...ids, targetId])) : ids.filter(id => id !== targetId) };
        });
    }, [user]);

    const followingSet = useMemo(() => new Set(followingIds), [followingIds]);
    const value = useMemo(() => ({ followingIds, followingSet, loading,
        refresh: fetchFollowingIds, optimisticToggle
    }), [followingIds, followingSet, loading, fetchFollowingIds, optimisticToggle]);

    return (
        <FollowingContext.Provider value={value}>
    { children }
    </FollowingContext.Provider>
  );
}

export function useFollowing() {
    const context = useContext(FollowingContext);
    if (!context) {
        // If used outside provider, return default to not break
        return {
            followingIds: [],
            followingSet: new Set<string>(),
            loading: false,
            refresh: async () => { },
            optimisticToggle: () => { }
        };
    }
    return context;
}
