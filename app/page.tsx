"use client"

import { useEffect, useState } from "react"
import { useFirebase } from "@/lib/firebase-context"
import { getUser } from "@/lib/db"
import AuthScreen from "@/components/auth-screen"
import MapView from "@/components/map-view"

export default function Home() {
  const { user: firebaseUser, loading: authLoading, error: authError } = useFirebase()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserProfile = async () => {
      if (firebaseUser) {
        try {
          const userProfile = await getUser(firebaseUser.uid)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: userProfile?.name || "User",
          })
        } catch (error) {
          console.error("Error fetching user profile:", error)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: "User",
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    if (!authLoading) {
      loadUserProfile()
    }
  }, [firebaseUser, authLoading])

  if (authError) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-800 mb-4">Firebase Error</h1>
          <p className="text-red-600 mb-6">{authError}</p>
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-red-800 mb-2">Troubleshooting:</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Check that Authentication is enabled in Firebase Console</li>
              <li>• Check that Firestore is enabled in Firebase Console</li>
              <li>• Verify your Firebase project configuration</li>
              <li>• Try refreshing the page</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to Firebase...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen onLogin={setUser} />
  }

  return <MapView user={user} onLogout={() => setUser(null)} />
}
