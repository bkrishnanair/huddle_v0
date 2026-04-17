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
    events: "Create an account to see your events",
    profile: "Create an account to build your profile",
    general: "Join Huddle to unlock your experience"
  }

  const headline = headlines[triggerContext] || headlines.general

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-surface border-white/10 sm:max-w-md p-6 bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-violet-500/30 flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-inner">
            <Sparkles className="w-8 h-8 text-primary drop-shadow-md" />
          </div>
          <DialogTitle className="text-2xl font-black text-white tracking-tight leading-tight">
            {headline}
          </DialogTitle>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <CalendarRange className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Save your RSVPs</p>
              <p className="text-xs text-slate-400 mt-0.5">Never lose track of the events you want to attend.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <Users className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Follow organizers</p>
              <p className="text-xs text-slate-400 mt-0.5">Get notified when your friends are going.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <Trophy className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Build reliability</p>
              <p className="text-xs text-slate-400 mt-0.5">Increase your score and unlock priority access.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Takes 10 seconds</p>
              <p className="text-xs text-slate-400 mt-0.5">Sign up instantly with your Google account.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              onClose()
              router.push("/login")
            }}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-[15px] shadow-lg hover:shadow-primary/20 transition-all rounded-xl"
          >
            Sign Up
          </Button>
          <Button
            onClick={() => {
              onClose()
              if (!window.location.pathname.includes('/map') && !window.location.pathname.includes('/discover')) {
                  router.push("/map")
              }
            }}
            variant="ghost"
            className="w-full h-12 text-slate-400 hover:text-white hover:bg-white/5 font-bold text-sm rounded-xl"
          >
            Continue Browsing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
