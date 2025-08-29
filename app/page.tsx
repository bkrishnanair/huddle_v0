"use client"

import { useEffect, useState } from "react"
import { useFirebase } from "@/lib/firebase-context"
import { getUser } from "@/lib/db"
import AuthScreen from "@/components/auth-screen"
import LandingPage from "@/components/landing-page"
import MapView from "@/components/map-view"
import EventsPage from "@/components/events-page"
import ChatPage from "@/components/chat-page"
import BottomNavigation from "@/components/bottom-navigation"
import ProfilePage from "@/app/profile/page"

export default function Home() {
  const { user: firebaseUser, loading: authLoading, error: authError } = useFirebase()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("map")
  const [showLandingPage, setShowLandingPage] = useState(true)

  useEffect(() => {
    const loadUserProfile = async () => {
      if (firebaseUser) {
        const optimisticUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          photoURL: firebaseUser.photoURL,
        }
        setUser(optimisticUser)
        
        try {
          const userProfile = await getUser(firebaseUser.uid)
          if (userProfile) {
            setUser({ ...optimisticUser, ...userProfile })
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
        }
      } else {
        setUser(null)
      }
    }
    
    loadUserProfile()
  }, [firebaseUser])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleSwitchToMap = () => {
    setActiveTab("map")
  }

  const handleGetStarted = () => {
    setShowLandingPage(false)
  }

  if (authError) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center p-4 text-white">
        <div className="text-center max-w-md glass-card p-8 rounded-2xl">
          <h1 className="text-2xl font-bold mb-4">Firebase Error</h1>
          <p className="mb-6">{authError}</p>
          <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-left">
            <h3 className="font-semibold mb-2">Troubleshooting:</h3>
            <ul className="text-sm space-y-1">
              <li>• Check your Firebase project configuration.</li>
              <li>• Ensure Authentication and Firestore are enabled.</li>
              <li>• Verify Firestore rules allow access.</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Connecting...</p>
        </div>
      </div>
    )
  }

  if (!user && showLandingPage) {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  if (!user && !showLandingPage) {
    return <AuthScreen onLogin={setUser} onBackToLanding={() => setShowLandingPage(true)} />
  }

  if (user) {
    const renderActiveTab = () => {
      switch (activeTab) {
        case "map":
          return <MapView user={user} onLogout={() => setUser(null)} />
        case "events":
          return <EventsPage user={user} onSwitchToMap={handleSwitchToMap} />
        case "chat":
          return <ChatPage />
        case "profile":
          return <ProfilePage />
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

  return null
}
