"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CalendarRange, Sparkles, Trophy, Users } from "lucide-react"
import { useRouter } from "next/navigation"

interface AuthGateModalProps {
  isOpen: boolean
  onClose: () => void
  triggerContext: "events" | "profile" | "general"
}

export function AuthGateModal({ isOpen, onClose, triggerContext }: AuthGateModalProps) {
  const router = useRouter()

  const headlines = {
    events: "Sign in to manage your events",
    profile: "Create an account to build your profile",
    general: "Join Huddle to unlock full access"
  }

  const headline = headlines[triggerContext] || headlines.general

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 sm:p-8 bg-sheet border border-line rounded-sheet shadow-overlay overflow-hidden">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-control bg-action-tint text-action flex items-center justify-center mx-auto mb-3.5 border border-line">
            <Sparkles className="w-6 h-6" />
          </div>
          <DialogTitle className="font-display text-2xl font-bold text-ink tracking-tight leading-tight">
            {headline}
          </DialogTitle>
          <p className="text-xs text-ink-3 mt-1.5">
            Free forever · Takes 10 seconds with Google
          </p>
        </div>

        <div className="space-y-3.5 mb-7">
          <div className="flex items-start gap-3 p-2.5 rounded-control bg-surface/60 border border-line/60">
            <div className="w-7 h-7 rounded-chip bg-live-tint text-live flex items-center justify-center shrink-0 mt-0.5">
              <CalendarRange className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Save your RSVPs</p>
              <p className="text-xs text-ink-2 mt-0.5">Never lose track of upcoming games and campus meetups.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-control bg-surface/60 border border-line/60">
            <div className="w-7 h-7 rounded-chip bg-action-tint text-action flex items-center justify-center shrink-0 mt-0.5">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Follow organizers & friends</p>
              <p className="text-xs text-ink-2 mt-0.5">Get automatic alerts when your crew joins an event.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-control bg-surface/60 border border-line/60">
            <div className="w-7 h-7 rounded-chip bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Build attendance reliability</p>
              <p className="text-xs text-ink-2 mt-0.5">Unlock organizer badges and priority waitlist spots.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Button
            onClick={() => {
              onClose()
              router.push("/login")
            }}
            className="w-full h-11 bg-action hover:bg-action-hover text-white font-medium text-sm rounded-control shadow-sm transition-all active:scale-[0.99]"
          >
            Continue to Sign In
          </Button>
          <Button
            onClick={() => {
              onClose()
              if (!window.location.pathname.includes('/map') && !window.location.pathname.includes('/discover')) {
                router.push("/map")
              }
            }}
            variant="ghost"
            className="w-full h-10 text-ink-3 hover:text-ink hover:bg-surface text-xs font-medium rounded-control"
          >
            Continue browsing without account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
