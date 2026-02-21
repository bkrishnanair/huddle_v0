"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { type User, onAuthStateChanged, signOut } from "firebase/auth"
import { auth, app } from "./firebase"
import { FirebaseApp } from "firebase/app"

interface FirebaseContextType {
  user: User | null
  loading: boolean
  error: string | null
  logout: () => Promise<void>;
  app: FirebaseApp | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  error: null,
  logout: async () => { },
  app: null
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

  // Define the logout function
  const logout = useCallback(async () => {
    // FIX: Ensure auth object is not null before using it.
    if (auth) {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        await signOut(auth);
        setUser(null);
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
  }, []);

  useEffect(() => {
    // FIX: Ensure auth object is not null before setting up the listener.
    if (auth) {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          if (user) {
            try {
              const idToken = await user.getIdToken()
              await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
              })
            } catch (err) {
              console.error("Error setting session cookie:", err)
            }
          }
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

  const contextValue = useMemo(
    () => ({ user, loading, error, logout, app }),
    [user, loading, error, logout, app]
  );

  return <FirebaseContext.Provider value={contextValue}>{children}</FirebaseContext.Provider>
}
