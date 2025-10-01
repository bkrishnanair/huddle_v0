"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/firebase-context"
import LandingPage from "@/components/landing-page"
import AuthScreen from "@/components/auth-screen"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function HomePage() {
  const { user, isGuest, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isAuthModalOpen = searchParams.get("auth") === "true"

  useEffect(() => {
    // This hook redirects users who should not be on the landing page.
    if (!loading && (user || isGuest)) {
      router.push("/discover")
    }
  }, [user, isGuest, loading, router])

  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.push("/")
    }
  }

  const handleLogin = (loggedInUser: any) => {
    // The context sets the state, and the useEffect above handles the redirect.
    // We just close the modal by clearing the URL parameter.
    router.push("/")
  }

  // THIS IS THE DEFINITIVE FIX:
  // Show the loader if:
  // 1. We are doing the initial check (loading is true).
  // 2. The check is done, BUT the user is logged in or a guest (a redirect is imminent).
  // This prevents the LandingPage from rendering for even a single frame.
  if (loading || (!loading && (user || isGuest))) {
    return <div className="min-h-screen liquid-gradient" />
  }

  // This code will now ONLY execute if loading is complete AND the user is not logged in and not a guest.
  return (
    <>
      <LandingPage />
      <Dialog open={isAuthModalOpen} onOpenChange={handleModalOpenChange}>
        <DialogContent className="liquid-gradient border-none p-0 max-w-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>Authentication</DialogTitle>
            <DialogDescription>
              Log in, sign up, or continue as a guest to access Huddle.
            </DialogDescription>
          </DialogHeader>
          <AuthScreen onLogin={handleLogin} />
        </DialogContent>
      </Dialog>
    </>
  )
}
