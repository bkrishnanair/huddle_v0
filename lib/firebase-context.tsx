"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { type User, onAuthStateChanged, signOut } from "firebase/auth"
import { auth, app } from "./firebase"
import { FirebaseApp } from "firebase/app"

// Helper function to safely access sessionStorage
const getInitialGuestState = (): boolean => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("isGuest") === "true"
  }
  return false
}

interface FirebaseContextType {
  user: User | null
  isGuest: boolean
  loading: boolean
  error: string | null
  logout: () => Promise<void>
  enterGuestMode: () => void
  exitGuestMode: () => void
  app: FirebaseApp | null
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  isGuest: false,
  loading: true,
  error: null,
  logout: async () => {},
  enterGuestMode: () => {},
  exitGuestMode: () => {},
  app: null,
})

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}

export const useAuth = useFirebase

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // Initialize state directly from sessionStorage
  const [isGuest, setIsGuest] = useState(getInitialGuestState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const enterGuestMode = () => {
    sessionStorage.setItem("isGuest", "true")
    setIsGuest(true)
    setUser(null)
  }

  const exitGuestMode = () => {
    sessionStorage.removeItem("isGuest")
    setIsGuest(false)
  }

  const logout = useCallback(async () => {
    if (auth) {
      try {
        await signOut(auth)
        setUser(null)
        exitGuestMode() // This will now clear sessionStorage as well
      } catch (error) {
        console.error("Error signing out:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setUser(user)
          if (user) {
            // If a user logs in, they are no longer a guest.
            sessionStorage.removeItem("isGuest")
            setIsGuest(false)
          }
          setLoading(false)
          setError(null)
        },
        (error) => {
          console.error("Auth state change error:", error)
          setError("Authentication error occurred")
          setLoading(false)
        },
      )
      return () => unsubscribe()
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <FirebaseContext.Provider value={{ user, isGuest, loading, error, logout, enterGuestMode, exitGuestMode, app }}>
      {children}
    </FirebaseContext.Provider>
  )
}
