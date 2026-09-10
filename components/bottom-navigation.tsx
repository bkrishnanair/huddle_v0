"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MapPin, Calendar, Search, User, Home } from "lucide-react"
import { useFirebase } from "@/lib/firebase-context"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { HuddleLogo } from "./huddle-logo"
import { isEventLive } from "@/lib/utils"

export default function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useFirebase()
  const [liveCount, setLiveCount] = useState(0)

  useEffect(() => {
    async function fetchLiveCount() {
      try {
        // Use UMD campus center + 50km radius as a reasonable default
        const res = await fetch(`/api/events?lat=38.9897&lon=-76.9378&radius=50000`);
        if (!res.ok) return;
        const data = await res.json();
        const count = (data.events || []).filter(isEventLive).length;
        setLiveCount(count);
      } catch {
        // Fail silently — badge just won't show
      }
    }

    fetchLiveCount();
    const interval = setInterval(fetchLiveCount, 5 * 60 * 1000); // every 5 min
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: "home", label: "Home", icon: Home, href: "/home" },
    { id: "map", label: "Map", icon: MapPin, href: "/map" },
    { id: "discover", label: "Discover", icon: Search, href: "/discover" },
    { id: "my-events", label: "My Events", icon: Calendar, href: "/my-events" },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
  ]

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="flex items-center justify-around gap-1.5 rounded-full p-1.5 bg-paper border border-line w-full max-w-md pointer-events-auto shadow-raised">
        <Link href={user ? "/home" : "/"} className="w-9 h-9 bg-surface rounded-full flex items-center justify-center hover:bg-surface-sunk border border-line transition-colors">
          <HuddleLogo />
        </Link>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href

          return (
            <Link
              key={tab.id}
              id={`${tab.id}-button`}
              href={tab.href}
              onClick={(e) => {
                if (!user && (tab.id === "my-events" || tab.id === "profile")) {
                  e.preventDefault()
                  toast.error("Please sign in to access this page", { position: "top-center" })
                  setTimeout(() => {
                    router.push(`/login?return_to=${tab.href}`)
                  }, 1200)
                }
              }}
              className={`
                flex flex-col items-center justify-center w-14 h-14 rounded-2xl
                transition-colors duration-200
                ${isActive ? "bg-surface" : "text-ink-3 hover:bg-surface-sunk"}
              `}
            >
              {/* Map tab gets the live badge */}
              {tab.id === "map" ? (
                <div className="relative">
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-ink" : "text-ink-3"}`} />
                  {liveCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-live text-live-ink text-[10px] font-mono font-bold tracking-mono uppercase rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none shadow-raised border border-live-ink/10">
                      {liveCount > 9 ? "9+" : liveCount}
                    </span>
                  )}
                </div>
              ) : (
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-ink" : "text-ink-3"}`} />
              )}
              <span className={`text-[10px] font-light ${isActive ? "text-ink" : "text-ink-3"}`}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
