"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/firebase-context"
import LandingPage from "@/components/landing-page"
import AuthScreen from "@/components/auth-screen"
import { useRouter } from "next/navigation"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export default function Home() {
  const { user, loading, error } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const router = useRouter()

  // Removed the auto-redirect to '/map' when user is authenticated
  // This allows the user to click the Huddle logo and view the landing page

  // Both states below render on the paper ground so the landing page does not
  // flash dark before it paints. They are also the first thing a brand-new
  // visitor can ever see, so they say something useful rather than "Connecting".
  if (error) {
    return (
      <div className="min-h-screen bg-paper font-body text-ink flex items-center justify-center p-6">
        <div className="max-w-md rounded-sheet border border-line bg-sheet p-8 shadow-raised">
          <h1 className="font-display text-2xl font-bold text-ink">Something went wrong</h1>
          <p className="mt-3 text-[15px] leading-[22px] text-ink-2">
            We could not reach the server. The map should still work — try opening it
            directly, or reload this page.
          </p>
          <p className="ins-mono mt-4 text-[10px] leading-[14px] text-ink-4 break-words">{error}</p>
          <a
            href="/map"
            className="mt-6 inline-flex h-11 items-center rounded-control bg-action px-7 text-[15px] font-semibold text-white transition-colors duration-micro ease-ins hover:bg-action-hover"
          >
            Open the map
          </a>
        </div>
      </div>
    )
  }

  if (loading) {
    // Skeleton of the real hero rather than a spinner: the visitor sees the page
    // taking shape instead of a blank wait, which is the moment 84% of them leave.
    return (
      <div className="min-h-screen bg-paper font-body" aria-busy="true" aria-live="polite">
        <div className="h-16 border-b border-line" />
        <div className="mx-auto max-w-[1120px] px-6 py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="h-9 w-4/5 rounded-chip bg-surface-sunk" />
              <div className="mt-3 h-9 w-3/5 rounded-chip bg-surface-sunk" />
              <div className="mt-6 h-5 w-2/3 rounded-chip bg-surface" />
              <div className="mt-8 h-11 w-44 rounded-control bg-surface-sunk" />
            </div>
            <div
              className="rounded-sheet border border-line bg-surface"
              style={{ aspectRatio: "5 / 4" }}
            />
          </div>
        </div>
        <span className="sr-only">Loading Huddle</span>
      </div>
    )
  }

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
        <DialogContent className="glass-surface border-white/15 bg-slate-900/80 max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>Authentication</DialogTitle>
          </VisuallyHidden>
          <AuthScreen onLogin={() => setIsAuthModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
