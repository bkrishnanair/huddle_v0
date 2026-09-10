"use client"

import { useState, useEffect, useCallback } from "react"

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

// Module-level cache so the captured event persists across component remounts
let cachedDeferredPrompt: BeforeInstallPromptEvent | null = null
const stateListeners = new Set<() => void>()

function notifyListeners() {
  stateListeners.forEach((listener) => listener())
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault()
    cachedDeferredPrompt = e as BeforeInstallPromptEvent
    notifyListeners()
  })

  window.addEventListener("appinstalled", () => {
    cachedDeferredPrompt = null
    notifyListeners()
  })
}

export function usePwaInstall() {
  const [isMounted, setIsMounted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [hasPrompt, setHasPrompt] = useState(false)

  const updateState = useCallback(() => {
    if (typeof window === "undefined") return

    // 1. Check standalone display mode (running as installed PWA)
    const standaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    setIsInstalled(Boolean(standaloneMode))

    // 2. Check if iOS Safari (non-standalone)
    const ua = window.navigator.userAgent
    const iosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream
    setIsIos(Boolean(iosDevice && !standaloneMode))

    // 3. Check if deferred prompt exists for Chromium / Edge
    setHasPrompt(Boolean(cachedDeferredPrompt))
  }, [])

  useEffect(() => {
    setIsMounted(true)
    updateState()

    // Listen to module-level prompt capture changes
    stateListeners.add(updateState)

    // Listen to media query changes if display mode transitions
    const mediaQuery = window.matchMedia("(display-mode: standalone)")
    const handleMediaChange = () => updateState()
    mediaQuery.addEventListener("change", handleMediaChange)

    return () => {
      stateListeners.delete(updateState)
      mediaQuery.removeEventListener("change", handleMediaChange)
    }
  }, [updateState])

  const promptInstall = useCallback(async (): Promise<"accepted" | "dismissed" | "ios" | "unavailable"> => {
    if (isInstalled) {
      return "unavailable"
    }

    if (cachedDeferredPrompt) {
      const promptEvent = cachedDeferredPrompt
      try {
        await promptEvent.prompt()
        const { outcome } = await promptEvent.userChoice
        if (outcome === "accepted") {
          cachedDeferredPrompt = null
          notifyListeners()
          setIsDialogOpen(false)
          return "accepted"
        }
        return "dismissed"
      } catch (err) {
        console.debug("PWA prompt error:", err)
        return "unavailable"
      }
    }

    if (isIos) {
      setIsDialogOpen(true)
      return "ios"
    }

    // Fallback if neither native prompt nor iOS (e.g. desktop non-Chromium or unsupported browser)
    setIsDialogOpen(true)
    return "unavailable"
  }, [isInstalled, isIos])

  return {
    isMounted,
    isInstalled,
    isIos,
    isInstallable: hasPrompt || isIos,
    isDialogOpen,
    setIsDialogOpen,
    promptInstall,
  }
}
