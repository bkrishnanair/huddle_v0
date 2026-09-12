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
      <div className="min-h-screen bg-[#0B101B] font-body text-white flex items-center justify-center p-6">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <h1 className="font-display text-2xl font-bold text-white">Something went wrong</h1>
          <p className="mt-3 text-[15px] leading-[22px] text-slate-400">
            We could not reach the server. The map should still work — try opening it
            directly, or reload this page.
          </p>
          <p className="ins-mono mt-4 text-[10px] leading-[14px] text-slate-400 break-words">{error}</p>
          <a
            href="/map"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-7 text-[15px] font-semibold text-white transition-colors duration-micro ease-ins hover:bg-primary/90"
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
      <div className="min-h-screen bg-[#0B101B] font-body" aria-busy="true" aria-live="polite">
        <div className="h-16 border-b border-white/10" />
        <div className="mx-auto max-w-[1120px] px-6 py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="h-9 w-4/5 rounded-full bg-white/10" />
              <div className="mt-3 h-9 w-3/5 rounded-full bg-white/10" />
              <div className="mt-6 h-5 w-2/3 rounded-full bg-slate-800/50" />
              <div className="mt-8 h-11 w-44 rounded-xl bg-white/10" />
            </div>
            <div
              className="rounded-3xl border border-white/10 bg-slate-800/50"
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
