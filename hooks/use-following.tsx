import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useAuth } from '@/lib/firebase-context';

interface FollowingContextType {
    followingIds: string[];
    followingSet: Set<string>;
    loading: boolean;
    refresh: () => Promise<void>;
    optimisticToggle: (targetId: string, isFollowing: boolean) => void;
}

const FollowingContext = createContext<FollowingContextType | null>(null);

export function FollowingProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [followingIds, setFollowingIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    // Fetch only the IDs of the users this user is following
    const fetchFollowingIds = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            const idToken = await user.getIdToken();
            // Use the idsOnly flag to get a raw array instead of hydrated profiles
            const res = await fetch(`/api/users/${user.uid}/following?idsOnly=true`, {
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setFollowingIds(data.followingIds || []);
            }
        } catch (error) {
            console.error("Error fetching following IDs:", error);
        } finally {
            setLoading(false);
            setFetched(true);
        }
    }, [user]);

    // Fetch on mount if user exists
    useEffect(() => {
        if (user && !fetched) {
            fetchFollowingIds();
        } else if (!user) {
            setFollowingIds([]);
            setFetched(false);
        }
    }, [user, fetched, fetchFollowingIds]);

    // Expose an optimistic update method for buttons to use
    const optimisticToggle = useCallback((targetId: string, isFollowing: boolean) => {
        setFollowingIds(prev => {
            if (isFollowing) {
                return Array.from(new Set([...prev, targetId]));
            } else {
                return prev.filter(id => id !== targetId);
            }
        });
    }, []);

    return (
        <FollowingContext.Provider value= {{
        followingIds,
            followingSet: new Set(followingIds), // O(1) lookup set for EventCards
                loading,
                refresh: fetchFollowingIds,
                    optimisticToggle
    }
}>
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
