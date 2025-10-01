"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFirebase } from "@/lib/firebase-context"
import BottomNavigation from "@/components/bottom-navigation"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, isGuest } = useFirebase()
  const router = useRouter()

  useEffect(() => {
    // This simple check is now reliable because isGuest is persisted.
    if (!loading && !user && !isGuest) {
      router.push("/")
    }
  }, [user, loading, isGuest, router])

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

  if (!user && !isGuest) {
    return null
  }

  return (
    <div className="relative">
      {children}
      <BottomNavigation />
    </div>
  )
}
