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
  const isPublicRoute = pathname === "/map" || pathname === "/discover" || pathname === "/login" || (pathname?.startsWith("/profile/") && pathname !== "/profile")
  const showTopNav = pathname === "/map" || pathname === "/home" || pathname === "/"

  useEffect(() => {
    // Intercept redirect for unauthenticated users visiting protected routes
    if (!loading && !user && !isPublicRoute) {
      setShowAuthGate(true)
    } else {
      setShowAuthGate(false)
    }
  }, [user, loading, isPublicRoute])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden relative">
        {/* Top Navbar Skeleton */}
        <div className="fixed top-4 inset-x-4 max-w-[1800px] mx-auto h-16 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl px-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 animate-pulse" />
            <div className="w-20 h-5 bg-slate-800 rounded-md animate-pulse" />
          </div>
          <div className="hidden md:flex flex-1 max-w-md mx-8 h-9 bg-slate-800/60 rounded-xl animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-800/80 animate-pulse" />
            <div className="w-9 h-9 rounded-xl bg-slate-800/80 animate-pulse" />
          </div>
        </div>

        {/* Center Map/Content Canvas Skeleton */}
        <div className="flex-1 flex flex-col items-center justify-center relative p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-950/20 via-slate-950/80 to-slate-950" />
          <div className="relative z-10 flex flex-col items-center max-w-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4 animate-pulse">
              <div className="w-6 h-6 rounded-full bg-teal-400/40" />
            </div>
            <div className="w-36 h-4 bg-slate-800 rounded-full mb-2 animate-pulse" />
            <div className="w-56 h-3 bg-slate-800/60 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Bottom Nav Skeleton */}
        <div className="fixed bottom-3 inset-x-4 max-w-md mx-auto h-14 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-around px-6 z-50">
          <div className="w-6 h-6 rounded-full bg-slate-800 animate-pulse" />
          <div className="w-6 h-6 rounded-full bg-slate-800 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-teal-500/30 animate-pulse" />
          <div className="w-6 h-6 rounded-full bg-slate-800 animate-pulse" />
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
      <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
        <APIProvider apiKey={mapsApiKey} libraries={['geometry', 'places']}>
          <FollowingProvider>
            {/* Global top header — refined design with search and theme */}
            {showTopNav && <TopNavbar />}
            <div className={showTopNav && pathname !== "/map" ? "pt-[90px]" : ""}>
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

