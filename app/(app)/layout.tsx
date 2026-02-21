"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useFirebase } from "@/lib/firebase-context"
import BottomNavigation from "@/components/bottom-navigation"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useFirebase()
  const router = useRouter()
  const pathname = usePathname()
  const isPublicRoute = pathname === "/map"

  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      router.push("/")
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

  if (!user) {
    if (isPublicRoute) {
      return <div className="relative">{children}</div>
    }
    return null
  }

  return (
    <div className="relative">
      {children}
      <BottomNavigation />
    </div>
  )
}
