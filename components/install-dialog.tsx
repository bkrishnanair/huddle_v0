"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Share, PlusSquare, Download, Monitor, Check } from "lucide-react"
import { usePwaInstall } from "@/hooks/use-pwa-install"

interface InstallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InstallDialog({ open, onOpenChange }: InstallDialogProps) {
  const { platform, hasPrompt, promptInstall, downloadShortcut } = usePwaInstall()

  const handleNativeInstall = async () => {
    const result = await promptInstall()
    if (result === "accepted") {
      onOpenChange(false)
    }
  }

  const handleDownloadShortcut = () => {
    downloadShortcut()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-white/10 bg-panel/95 p-6 pt-16 shadow-overlay rounded-3xl font-body text-ink">
        <DialogHeader className="text-left space-y-2">
          <DialogTitle className="font-display text-xl font-bold text-ink tracking-tight">
            Install Huddle
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-ink-2">
            Add Huddle to your device for quick access to campus plans, right from your home screen.
          </DialogDescription>
        </DialogHeader>

        {hasPrompt ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-control border border-line bg-surface p-4 text-xs leading-relaxed text-ink-2 space-y-2">
              <p>
                Your browser supports one-tap installation. Install Huddle directly to your home screen or dock.
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
                className="inline-flex h-11 items-center justify-center rounded-control border border-line bg-sheet px-4 text-xs font-medium text-ink transition-colors hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNativeInstall}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-control bg-action px-5 text-sm font-semibold text-canvas transition-colors hover:bg-action-hover"
              >
                <Download className="h-3.5 w-3.5" />
                Install app
              </button>
            </div>
          </div>
        ) : platform === "ios" ? (
          <div className="mt-4 space-y-3">
            <p className="ins-mono text-xs font-medium text-ink-3">
              iOS Safari instructions
            </p>
            <div className="space-y-2.5 rounded-control border border-line bg-surface p-4 text-xs leading-relaxed text-ink">
              <div className="flex items-start gap-3">
                <span className="ins-mono font-semibold text-action">01</span>
                <div className="flex-1">
                  <span>Tap the </span>
                  <span className="inline-flex items-center font-semibold text-ink">
                    Share <Share className="mx-1 h-3.5 w-3.5 text-action inline" />
                  </span>
                  <span> button in Safari's bottom toolbar.</span>
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
                className="inline-flex h-11 items-center justify-center rounded-control bg-action px-5 text-sm font-semibold text-canvas transition-colors hover:bg-action-hover"
              >
                Got it
              </button>
            </div>
          </div>
        ) : platform === "mac-safari" ? (
          <div className="mt-4 space-y-3">
            <p className="ins-mono text-xs font-medium text-ink-3">
              macOS Safari instructions
            </p>
            <div className="space-y-2.5 rounded-control border border-line bg-surface p-4 text-xs leading-relaxed text-ink">
              <div className="flex items-start gap-3">
                <span className="ins-mono font-semibold text-action">01</span>
                <div className="flex-1">
                  <span>In Safari, click </span>
                  <span className="font-semibold text-ink">File</span>
                  <span> in the top macOS menu bar.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-line pt-2.5">
                <span className="ins-mono font-semibold text-action">02</span>
                <div className="flex-1">
                  <span>Select </span>
                  <span className="font-semibold text-ink">Add to Dock...</span>
                  <span> from the menu.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-line pt-2.5">
                <span className="ins-mono font-semibold text-action">03</span>
                <div className="flex-1">
                  <span>Click </span>
                  <span className="font-semibold text-ink">Add</span>
                  <span> to install Huddle as a standalone Mac app.</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDownloadShortcut}
                className="inline-flex h-11 items-center gap-1.5 rounded-control border border-line bg-sheet px-3 text-xs font-medium text-ink transition-colors hover:bg-surface"
              >
                <Download className="h-3.5 w-3.5 text-ink-3" />
                Download shortcut
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-11 items-center justify-center rounded-control bg-action px-5 text-sm font-semibold text-canvas transition-colors hover:bg-action-hover"
              >
                Got it
              </button>
            </div>
          </div>
        ) : platform === "chromium" ? (
          <div className="mt-4 space-y-3">
            <p className="ins-mono text-xs font-medium text-ink-3">
              Chrome / Edge desktop instructions
            </p>
            <div className="space-y-2.5 rounded-control border border-line bg-surface p-4 text-xs leading-relaxed text-ink">
              <div className="flex items-start gap-3">
                <span className="ins-mono font-semibold text-action">01</span>
                <div className="flex-1">
                  <span>Look for the </span>
                  <span className="font-semibold text-ink">Install icon [⊕]</span>
                  <span> on the right side of your browser's address bar.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-line pt-2.5">
                <span className="ins-mono font-semibold text-action">02</span>
                <div className="flex-1">
                  <span>Or click </span>
                  <span className="font-semibold text-ink">Menu (⋮) &rarr; Save and share &rarr; Install Huddle</span>
                  <span>.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-line pt-2.5">
                <span className="ins-mono font-semibold text-action">03</span>
                <div className="flex-1">
                  <span>Click </span>
                  <span className="font-semibold text-ink">Install</span>
                  <span> to pin Huddle to your Dock or Taskbar.</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDownloadShortcut}
                className="inline-flex h-11 items-center gap-1.5 rounded-control border border-line bg-sheet px-3 text-xs font-medium text-ink transition-colors hover:bg-surface"
              >
                <Download className="h-3.5 w-3.5 text-ink-3" />
                Download shortcut
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-11 items-center justify-center rounded-control bg-action px-5 text-sm font-semibold text-canvas transition-colors hover:bg-action-hover"
              >
                Got it
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="space-y-2.5 rounded-control border border-line bg-surface p-4 text-xs leading-relaxed text-ink">
              <div className="flex items-start gap-3">
                <span className="ins-mono font-semibold text-action">01</span>
                <div className="flex-1">
                  <span>In your browser menu, select </span>
                  <span className="font-semibold text-ink">Add to Home screen</span>
                  <span> or </span>
                  <span className="font-semibold text-ink">Install app</span>
                  <span>.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t border-line pt-2.5">
                <span className="ins-mono font-semibold text-action">02</span>
                <div className="flex-1">
                  <span>Or download a desktop shortcut file below for instant one-click access.</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDownloadShortcut}
                className="inline-flex h-11 items-center gap-1.5 rounded-control border border-line bg-sheet px-3 text-xs font-medium text-ink transition-colors hover:bg-surface"
              >
                <Download className="h-3.5 w-3.5 text-ink-3" />
                Download shortcut
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-11 items-center justify-center rounded-control bg-action px-5 text-sm font-semibold text-canvas transition-colors hover:bg-action-hover"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
