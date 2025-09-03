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
    { icon: <Zap className="w-5 h-5 text-primary" />, text: "Boost your games to the top of the map." },
    { icon: <CheckCircle className="w-5 h-5 text-primary" />, text: "Create recurring weekly or bi-weekly events." },
    { icon: <CheckCircle className="w-5 h-5 text-primary" />, text: "Get advanced analytics on your games." },
    { icon: <CheckCircle className="w-5 h-5 text-primary" />, text: "Priority access to new features and support." },
]

export default function HuddleProModal({ isOpen, onClose }: HuddleProModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-surface border-white/15 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Huddle Pro ✨
          </DialogTitle>
          <DialogDescription className="text-center">
            Unlock exclusive features to take your games to the next level.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {proFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              {feature.icon}
              <p className="text-slate-300">{feature.text}</p>
            </div>
          ))}
        </div>
        <Button size="lg" disabled>
          Coming Soon!
        </Button>
      </DialogContent>
    </Dialog>
  )
}
