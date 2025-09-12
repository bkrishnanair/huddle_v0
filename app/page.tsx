"use client"

import { useState } from "react"
import { useAuth } from "@/lib/firebase-context"
import LandingPage from "@/components/landing-page"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import AuthScreen from "@/components/auth-screen"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user, loading, error } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const router = useRouter()

  if (user) {
    router.push("/discover")
    return null
  }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Connecting...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <LandingPage onGetStarted={() => setIsAuthModalOpen(true)} />

      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="glass-surface border-white/15 bg-slate-900/80 max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
          <AuthScreen onLogin={() => setIsAuthModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}