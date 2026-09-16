"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { logOut, handleGoogleRedirectResult } from "./auth"
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
    if (auth) {
      await logOut();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // FIX: Ensure auth object is not null before setting up the listener.
    if (auth) {
      handleGoogleRedirectResult().catch(err => {
        console.error("Redirect sign-in error:", err);
        setError(err.message || "Google sign-in failed during redirect.");
      });
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          if (user) {
            try {
              const idToken = await user.getIdToken()
              const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
              })
              if (!res.ok) {
                const text = await res.text();
                throw new Error("Session creation failed: " + text);
              }
            } catch (err: any) {
              console.error("Error setting session cookie:", err)
              await logOut()
              setUser(null)
              setError(err.message || "Failed to establish server session.")
              setLoading(false)
              return
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
