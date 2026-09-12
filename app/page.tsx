"use client"

import { useState } from "react"
import { useAuth } from "@/lib/firebase-context"
import LandingPage from "@/components/landing-page"
import AuthScreen from "@/components/auth-screen"
import { useRouter } from "next/navigation"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export default function Home() {
  const { user } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const router = useRouter()

  // This is public content: render it on the server even while Firebase Auth
  // initializes. Account-specific actions still resolve through the auth flow.
  return (
    <>
      <LandingPage
        isAuthenticated={!!user}
        onGetStarted={() => {
          if (user) {
            router.push("/map")
          } else {
            setIsAuthModalOpen(true)
          }
        }}
      />

      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="border-white/10 bg-panel/95 sm:max-w-md p-0 gap-0 rounded-3xl overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle>Authentication</DialogTitle>
          </VisuallyHidden>
          <AuthScreen onLogin={() => setIsAuthModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
