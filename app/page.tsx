"use client"

import { useEffect, useState } from "react"
import { useFirebase } from "@/lib/firebase-context"
import { getUser } from "@/lib/db"
import AuthScreen from "@/components/auth-screen"
import MapView from "@/components/map-view"
import EventsPage from "@/components/events-page"
import ChatPage from "@/components/chat-page"
import BottomNavigation from "@/components/bottom-navigation"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user: firebaseUser, loading: authLoading, error: authError } = useFirebase()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("map")
  const router = useRouter()

  useEffect(() => {
    const loadUserProfile = async () => {
      if (firebaseUser) {
        const optimisticUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        }
        setUser(optimisticUser)
        setLoading(false)

        try {
          const userProfile = await getUser(firebaseUser.uid)
          if (userProfile?.name && userProfile.name !== optimisticUser.name) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userProfile.name,
            })
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
          // Keep the optimistic user data if API call fails
        }
      } else {
        setUser(null)
        setLoading(false)
      }
    }

    if (!authLoading) {
      loadUserProfile()
    }
  }, [firebaseUser, authLoading])

  const handleTabChange = (tab: string) => {
    console.log("[v0] Tab change requested:", tab)
    if (tab === "profile") {
      // Keep profile within the tab system instead of redirecting
      setActiveTab("profile")
    } else {
      setActiveTab(tab)
    }
  }

  const handleSwitchToMap = () => {
    setActiveTab("map")
  }

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

  const renderActiveTab = () => {
    console.log("[v0] Rendering active tab:", activeTab)
    switch (activeTab) {
      case "map":
        return <MapView user={user} onLogout={() => setUser(null)} />
      case "events":
        return <EventsPage user={user} onSwitchToMap={handleSwitchToMap} />
      case "chat":
        return <ChatPage user={user} />
      case "profile":
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
            <div className="glass-card mx-4 mt-4 p-4 rounded-2xl text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
              <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">{user.name?.charAt(0).toUpperCase() || "U"}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 mb-6">{user.email}</p>
              <button
                onClick={() => setUser(null)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        )
      default:
        return <MapView user={user} onLogout={() => setUser(null)} />
    }
  }

  return (
    <div className="relative">
      {renderActiveTab()}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}
