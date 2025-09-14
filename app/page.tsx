"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/firebase-context"
import LandingPage from "@/components/landing-page"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user, loading, error } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/map")
    }
  }, [user, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-white">
        <div className="text-center max-w-md glass-card p-8 rounded-2xl">
          <h1 className="text-2xl font-bold mb-4">Firebase Error</h1>
          <p className="mb-6">{error}</p>
        </div>
      </div>
    )
  }

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Connecting...</p>
        </div>
      </div>
    )
  }

  return <LandingPage onGetStarted={() => router.push('/login')} />
}
