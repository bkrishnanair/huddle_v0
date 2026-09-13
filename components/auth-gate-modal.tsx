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
    profile: "Create an account for your profile",
    general: "Make room for a good plan"
  }

  const headline = headlines[triggerContext] || headlines.general

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 sm:p-8 bg-[#0B101B]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary/20 blur-[80px] pointer-events-none -z-10" />
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-5 border border-primary/30 shadow-[0_0_25px_rgba(249,115,22,0.3)]">
            <Sparkles className="w-8 h-8" />
          </div>
          <DialogTitle className="font-display text-2xl font-bold text-white tracking-tight leading-tight">
            {headline}
          </DialogTitle>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Free to join. Your campus, a little closer.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
              <CalendarRange className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">Save your RSVPs</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Never lose track of upcoming games and campus meetups.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">Follow organizers & friends</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Get automatic alerts when your crew joins an event.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">Build attendance reliability</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Keep track of the events you attend and the people you meet.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              onClose()
              router.push("/login")
            }}
            className="w-full h-12 bg-primary hover:bg-orange-400 text-canvas font-semibold text-sm rounded-2xl shadow-glow transition-all active:scale-[0.98]"
          >
            Let’s get you in
          </Button>
          <Button
            onClick={() => {
              onClose()
              if (!window.location.pathname.includes('/map') && !window.location.pathname.includes('/discover')) {
                router.push("/map")
              }
            }}
            variant="ghost"
            className="w-full h-11 text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium rounded-2xl transition-colors"
          >
            Keep exploring
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
