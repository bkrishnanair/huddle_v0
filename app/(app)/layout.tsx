"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useFirebase } from "@/lib/firebase-context"
import BottomNavigation from "@/components/bottom-navigation"
import { FollowingProvider } from "@/hooks/use-following"
import { NotificationBell } from "@/components/notification-bell"
import Link from "next/link"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useFirebase()
  const router = useRouter()
  const pathname = usePathname()
  const isPublicRoute = pathname === "/map" || pathname === "/discover" || pathname === "/login"

  useEffect(() => {
    // Only redirect if they are not loading, not logged in, and NOT on a public route
    if (!loading && !user && !isPublicRoute) {
      router.push("/login")
    }
  }, [user, loading, router, isPublicRoute])

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

  // If there's no user, but they are on a public route, STILL render the layout
  // (which includes the bottom navigation below), so they can navigate public areas.
  if (!user && !isPublicRoute) {
    return null
  }

  return (
    <div className="relative">
      <FollowingProvider>
        {/* Global top header — logo + notification bell */}
        {user && (
          <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-2.5 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
            <Link href="/home" className="flex items-center gap-2">
              <span className="text-lg font-black text-white tracking-tight">Huddle</span>
            </Link>
            <NotificationBell />
          </header>
        )}
        <div className={user ? "pt-12" : ""}>
          {children}
        </div>
        <BottomNavigation />
      </FollowingProvider>
    </div>
  )
}

