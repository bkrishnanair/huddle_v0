"use client"

import { useState } from "react"
import { useFirebase } from "@/lib/firebase-context"
import LandingPage from "@/components/landing-page"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import AuthScreen from "@/components/auth-screen"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user, loading, error } = useFirebase()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const router = useRouter()

  if (user) {
    router.push("/map")
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center p-4 text-white">
        <div className="text-center max-w-md glass-card p-8 rounded-2xl">
          <h1 className="text-2xl font-bold mb-4">Firebase Error</h1>
          <p className="mb-6">{error}</p>
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

  if (loading) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Connecting...</p>
        </div>
      </div>
    )
  }

  const handleGetStarted = () => {
    setIsAuthModalOpen(true)
  }

  const handleLogin = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <>
      <LandingPage onGetStarted={handleGetStarted} />

      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
          <div className="relative">
            <AuthScreen onLogin={handleLogin} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
