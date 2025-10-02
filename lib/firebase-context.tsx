"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { type User, onAuthStateChanged, signOut } from "firebase/auth"
import { auth, app } from "./firebase"
import { FirebaseApp } from "firebase/app"

const GUEST_MODE_KEY = "huddle_guest_mode"

interface FirebaseContextType {
  user: User | null
  loading: boolean
  error: string | null
  logout: () => Promise<void>;
  app: FirebaseApp | null;
  isGuest: boolean;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  error: null,
  logout: async () => {},
  app: null,
  isGuest: false,
  enterGuestMode: () => {},
  exitGuestMode: () => {},
})

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}

// Alias for useAuth (backward compatibility)
export const useAuth = useFirebase

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Initialize guest mode synchronously from sessionStorage to prevent redirect race condition
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(GUEST_MODE_KEY) === 'true'
    }
    return false
  })

  // Enter guest mode
  const enterGuestMode = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(GUEST_MODE_KEY, 'true')
      setIsGuest(true)
    }
  }, [])

  // Exit guest mode
  const exitGuestMode = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(GUEST_MODE_KEY)
      setIsGuest(false)
    }
  }, [])

  // Define the logout function
  const logout = useCallback(async () => {
    // FIX: Ensure auth object is not null before using it.
    if (auth) {
      try {
        await signOut(auth);
        setUser(null);
        exitGuestMode();
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
  }, [exitGuestMode]);

  useEffect(() => {
    // FIX: Ensure auth object is not null before setting up the listener.
    if (auth) {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setUser(user)
          setLoading(false)
          setError(null)
        },
        (error) => {
          console.error("Auth state change error:", error)
          setError("Authentication error occurred")
          setLoading(false)
        },
      );

      return () => unsubscribe();
    } else {
      // If auth is not available, stop loading and do nothing.
      setLoading(false);
    }
  }, []);

  return <FirebaseContext.Provider value={{ user, loading, error, logout, app, isGuest, enterGuestMode, exitGuestMode }}>{children}</FirebaseContext.Provider>
}
