"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useFirebase } from "@/lib/firebase-context"
import BottomNavigation from "@/components/bottom-navigation"
import { FollowingProvider } from "@/hooks/use-following"
import { NotificationBell } from "@/components/notification-bell"
import Link from "next/link"
import { AuthGateModal } from "@/components/auth-gate-modal"
import { HuddleLogo } from "@/components/huddle-logo"
import { ThemeProvider } from "next-themes"
import { APIProvider } from "@vis.gl/react-google-maps"
import { TopNavbar } from "@/components/top-navbar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useFirebase()
  const router = useRouter()
  const pathname = usePathname()
  
  const [showAuthGate, setShowAuthGate] = useState(false)
  const isPublicRoute = pathname === "/map" || pathname === "/discover" || pathname === "/login"
  const showTopNav = pathname === "/map" || pathname === "/home" || pathname === "/"

  useEffect(() => {
    // Intercept redirect for unauthenticated users visiting protected routes
    if (!loading && !user && !isPublicRoute) {
      if (!showAuthGate) {
        setShowAuthGate(true)
      }
    } else {
      setShowAuthGate(false)
    }
  }, [user, loading, isPublicRoute, showAuthGate])

  if (loading) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // If there's no user, but they are on a protected route, we STILL render the layout
  // (which includes the bottom navigation below), so they can navigate public areas.
  // The AuthGateModal will overlay it.

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  return (
    <div className="relative">
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <APIProvider apiKey={mapsApiKey} libraries={['geometry', 'places']}>
          <FollowingProvider>
            {/* Global top header — refined design with search and theme */}
            {showTopNav && <TopNavbar />}
            <div className={showTopNav ? "pt-16" : ""}>
              {children}
            </div>
        <BottomNavigation />
        {showAuthGate && (
          <AuthGateModal 
            isOpen={showAuthGate} 
            onClose={() => setShowAuthGate(false)} 
            triggerContext={pathname?.includes("/my-events") ? "events" : pathname?.includes("/profile") ? "profile" : "general"}
          />
        )}
          </FollowingProvider>
        </APIProvider>
      </ThemeProvider>
    </div>
  )
}

