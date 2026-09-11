"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Share, PlusSquare, Download } from "lucide-react"
import { usePwaInstall } from "@/hooks/use-pwa-install"

interface InstallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InstallDialog({ open, onOpenChange }: InstallDialogProps) {
  const { isIos, promptInstall } = usePwaInstall()

  const handleNativeInstall = async () => {
    const result = await promptInstall()
    if (result === "accepted") {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-white/10 bg-slate-900/50 backdrop-blur-md p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-3xl font-body text-slate-50">
        <DialogHeader className="text-left space-y-2">
          <DialogTitle className="font-display text-xl font-bold text-slate-50 tracking-tight">
            Install Huddle
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-slate-400">
            Add Huddle to your device for fullscreen access, instant loading, and real-time event alerts.
          </DialogDescription>
        </DialogHeader>

        {isIos ? (
          <div className="mt-4 space-y-3">
            <p className="ins-mono text-xs font-medium text-slate-500">
              iOS installation instructions
            </p>
            <div className="space-y-2.5 rounded-xl border border-white/10 bg-slate-800/50 p-4 text-xs leading-relaxed text-slate-50">
              <div className="flex items-start gap-3">
                <span className="ins-mono font-semibold text-primary">01</span>
                <div className="flex-1">
                  <span>Tap the </span>
                  <span className="inline-flex items-center font-semibold text-slate-50">
                    Share <Share className="mx-1 h-3.5 w-3.5 text-primary inline" />
                  </span>
                  <span> button in Safari's toolbar.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-white/10 pt-2.5">
                <span className="ins-mono font-semibold text-primary">02</span>
                <div className="flex-1">
                  <span>Scroll down and tap </span>
                  <span className="inline-flex items-center font-semibold text-slate-50">
                    Add to Home Screen <PlusSquare className="mx-1 h-3.5 w-3.5 text-primary inline" />
                  </span>
                  <span>.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-white/10 pt-2.5">
                <span className="ins-mono font-semibold text-primary">03</span>
                <div className="flex-1">
                  <span>Tap </span>
                  <span className="font-semibold text-slate-50">Add</span>
                  <span> in the top-right corner to finish.</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-5 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Got it
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4 text-xs leading-relaxed text-slate-400 space-y-2">
              <p>
                Installing Huddle creates a native standalone experience on your home screen or dock without downloading files or visiting an app store.
              </p>
              <ul className="space-y-1 ins-mono text-[11px] text-slate-500">
                <li>· Full-screen native window</li>
                <li>· Instant cached offline loading</li>
                <li>· Optional event reminder push alerts</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-md px-4 text-xs font-medium text-slate-50 transition-colors hover:bg-slate-800/50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNativeInstall}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
              >
                <Download className="h-3.5 w-3.5" />
                Install app
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
