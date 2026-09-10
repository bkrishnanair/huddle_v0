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
      <DialogContent className="max-w-md border-line bg-sheet p-6 shadow-overlay rounded-sheet font-body text-ink">
        <DialogHeader className="text-left space-y-2">
          <DialogTitle className="font-display text-xl font-bold text-ink tracking-tight">
            Install Huddle
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-ink-2">
            Add Huddle to your device for fullscreen access, instant loading, and real-time event alerts.
          </DialogDescription>
        </DialogHeader>

        {isIos ? (
          <div className="mt-4 space-y-3">
            <p className="ins-mono text-xs font-medium text-ink-3">
              iOS installation instructions
            </p>
            <div className="space-y-2.5 rounded-control border border-line bg-surface p-4 text-xs leading-relaxed text-ink">
              <div className="flex items-start gap-3">
                <span className="ins-mono font-semibold text-action">01</span>
                <div className="flex-1">
                  <span>Tap the </span>
                  <span className="inline-flex items-center font-semibold text-ink">
                    Share <Share className="mx-1 h-3.5 w-3.5 text-action inline" />
                  </span>
                  <span> button in Safari's toolbar.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-line pt-2.5">
                <span className="ins-mono font-semibold text-action">02</span>
                <div className="flex-1">
                  <span>Scroll down and tap </span>
                  <span className="inline-flex items-center font-semibold text-ink">
                    Add to Home Screen <PlusSquare className="mx-1 h-3.5 w-3.5 text-action inline" />
                  </span>
                  <span>.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-line pt-2.5">
                <span className="ins-mono font-semibold text-action">03</span>
                <div className="flex-1">
                  <span>Tap </span>
                  <span className="font-semibold text-ink">Add</span>
                  <span> in the top-right corner to finish.</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-9 items-center justify-center rounded-control bg-action px-5 text-xs font-semibold text-white transition-colors hover:bg-action-hover"
              >
                Got it
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-control border border-line bg-surface p-4 text-xs leading-relaxed text-ink-2 space-y-2">
              <p>
                Installing Huddle creates a native standalone experience on your home screen or dock without downloading files or visiting an app store.
              </p>
              <ul className="space-y-1 ins-mono text-[11px] text-ink-3">
                <li>· Full-screen native window</li>
                <li>· Instant cached offline loading</li>
                <li>· Optional event reminder push alerts</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-9 items-center justify-center rounded-control border border-line bg-sheet px-4 text-xs font-medium text-ink transition-colors hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNativeInstall}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-control bg-action px-5 text-xs font-semibold text-white transition-colors hover:bg-action-hover"
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
