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

export type PwaPlatform = "ios" | "mac-safari" | "chromium" | "android" | "other"

// Module-level cache so the captured event persists across component remounts
let cachedDeferredPrompt: BeforeInstallPromptEvent | null = null
let installationConfirmed = false
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
    installationConfirmed = true
    cachedDeferredPrompt = null
    notifyListeners()
  })
}

export function usePwaInstall() {
  const [isMounted, setIsMounted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [hasPrompt, setHasPrompt] = useState(false)
  const [platform, setPlatform] = useState<PwaPlatform>("other")

  const updateState = useCallback(() => {
    if (typeof window === "undefined") return

    // 1. Check standalone display mode (running as installed PWA)
    const standaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    setIsInstalled(Boolean(standaloneMode || installationConfirmed))

    // 2. Platform identification
    const ua = window.navigator.userAgent
    const isIosDevice = (/iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) && !(window as unknown as { MSStream?: unknown }).MSStream
    const isMacSafariDevice =
      /Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua)
    const isAndroidDevice = /Android/.test(ua)
    const isChromiumDevice = /Chrome|Chromium|Edg|OPR/.test(ua) && !isIosDevice

    if (isIosDevice) {
      setPlatform("ios")
    } else if (isMacSafariDevice) {
      setPlatform("mac-safari")
    } else if (isAndroidDevice) {
      setPlatform("android")
    } else if (isChromiumDevice) {
      setPlatform("chromium")
    } else {
      setPlatform("other")
    }

    // 3. Check if deferred prompt exists for Chromium / Edge
    setHasPrompt(Boolean(cachedDeferredPrompt))
  }, [])

  useEffect(() => {
    setIsMounted(true)
    updateState()

    const handlePromptEvent = (e: Event) => {
      e.preventDefault()
      cachedDeferredPrompt = e as BeforeInstallPromptEvent
      updateState()
    }

    window.addEventListener("beforeinstallprompt", handlePromptEvent)
    stateListeners.add(updateState)

    const mediaQuery = window.matchMedia("(display-mode: standalone)")
    const handleMediaChange = () => updateState()
    mediaQuery.addEventListener("change", handleMediaChange)

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePromptEvent)
      stateListeners.delete(updateState)
      mediaQuery.removeEventListener("change", handleMediaChange)
    }
  }, [updateState])

  const promptInstall = useCallback(async (): Promise<"accepted" | "dismissed" | "dialog" | "unavailable"> => {
    if (isInstalled) {
      return "unavailable"
    }

    if (cachedDeferredPrompt) {
      const promptEvent = cachedDeferredPrompt
      // Native install events are single-use, even when dismissed or rejected.
      cachedDeferredPrompt = null
      notifyListeners()
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
        setIsDialogOpen(true)
        return "dialog"
      }
    }

    // If native prompt is not available (iOS, macOS Safari, or Chromium before prompt triggers),
    // open the tailored platform guide dialog
    setIsDialogOpen(true)
    return "dialog"
  }, [isInstalled])

  const downloadShortcut = useCallback(() => {
    if (typeof window === "undefined") return

    const isMac = /Macintosh/.test(window.navigator.userAgent)
    let content: string
    let filename: string
    let mimeType: string

    if (isMac) {
      content = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>URL</key>
  <string>https://huddlemap.live</string>
</dict>
</plist>`
      filename = "Huddle.webloc"
      mimeType = "application/xml"
    } else {
      content = `[InternetShortcut]\r\nURL=https://huddlemap.live\r\nIconIndex=0\r\n`
      filename = "Huddle.url"
      mimeType = "application/x-mswinurl"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  return {
    isMounted,
    isInstalled,
    isIos: platform === "ios",
    platform,
    hasPrompt,
    isInstallable: hasPrompt || platform !== "other",
    isDialogOpen,
    setIsDialogOpen,
    promptInstall,
    downloadShortcut,
  }
}
