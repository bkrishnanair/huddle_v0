"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"

interface FirebaseContextType {
  user: User | null
  loading: boolean
  error: string | null
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  error: null,
})

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    try {
      const authInstance = auth()

      if (!authInstance) {
        console.warn("Firebase Auth not available, using fallback")
        setLoading(false)
        return
      }

      unsubscribe = onAuthStateChanged(
        authInstance,
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
      )
    } catch (error) {
      console.error("Error setting up auth listener:", error)
      setError("Failed to initialize authentication")
      setLoading(false)
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  return <FirebaseContext.Provider value={{ user, loading, error }}>{children}</FirebaseContext.Provider>
}
