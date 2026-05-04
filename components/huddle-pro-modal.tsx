"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Zap } from "lucide-react"

interface HuddleProModalProps {
  isOpen: boolean
  onClose: () => void
}

const proFeatures = [
  { icon: <Zap className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />, title: "Boost to Top of Map", text: "Your events surface first in Discover and get priority pin placement. More eyeballs, more RSVPs." },
  { icon: <Zap className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />, title: "AI Event Generator", text: "Describe your event in one sentence. Huddle writes the title, description, capacity, and tags. Create in 10 seconds." },
  { icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />, title: "Analytics Dashboard", text: "RSVPs vs. show-ups, peak days, flake rates, capacity trends. Know exactly what's working." },
  { icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />, title: "Scheduled Announcements", text: 'Set reminders that auto-send to your RSVP\'d attendees: "Game starts in 2 hours, Court 3." No more manual texts.' },
  { icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />, title: "Audience Insights", text: "See which members attend the most, who's new, who's dropped off. Build your community with data, not guesses." },
  { icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />, title: "Verified Organizer Badge", text: "A trust signal on your profile and events. Stand out on the map as a credible, established host." },
]

export default function HuddleProModal({ isOpen, onClose }: HuddleProModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-surface border-white/15 text-foreground max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Huddle Pro ✨
          </DialogTitle>
          <DialogDescription className="text-center text-slate-300 text-base mt-2">
            Your community is growing. Now run it like a pro.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto no-scrollbar custom-scrollbar pr-2">
          {proFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
              {feature.icon}
              <div>
                <span className="font-bold text-slate-100">{feature.title}</span> — <span className="text-slate-300 text-sm leading-relaxed">{feature.text}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10 mt-2">
          <div className="text-center">
            <span className="text-white font-bold text-lg tracking-tight">Coming Spring 2026</span>
          </div>
          <p className="text-center text-sm text-emerald-400 font-medium mb-2">Free for founding organizers who join the waitlist today.</p>
          <Button 
            size="lg" 
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold hover:scale-[1.02] transition-transform"
            onClick={() => {
              import("sonner").then(({ toast }) => toast.success("You've been added to the waitlist!"));
              onClose();
            }}
          >
            Join the Waitlist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
