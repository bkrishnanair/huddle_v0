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
  const { user, loading } = useFirebase()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

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

  if (!user) {
    return null
  }

  return (
    <div className="relative">
      {children}
      <BottomNavigation />
    </div>
  )
}
