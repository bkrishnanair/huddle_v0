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
    <nav aria-label="Main navigation" className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
      <div className="flex items-center justify-around gap-1 rounded-3xl p-1.5 bg-canvas/90 backdrop-blur-xl border border-white/10 w-full max-w-md pointer-events-auto shadow-2xl">
        <Link href={user ? "/home" : "/"} aria-label="Huddle home" className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-white/5 transition-colors hover:bg-white/10 sm:flex">
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
              aria-current={isActive ? "page" : undefined}
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
                flex min-w-11 flex-1 flex-col items-center justify-center h-14 rounded-2xl
                transition-all duration-200 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400
                ${isActive ? "bg-orange-500/15 text-orange-400" : "text-slate-400 hover:bg-white/5 hover:text-white"}
              `}
            >
              {/* Map tab gets the live badge */}
              {tab.id === "map" ? (
                <div className="relative">
                  <Icon className="w-5 h-5 mb-0.5" />
                  {liveCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-emerald-400 text-canvas text-[10px] font-mono font-bold rounded-full min-w-4 h-4 flex items-center justify-center px-1 leading-none border border-canvas">
                      {liveCount > 9 ? "9+" : liveCount}
                    </span>
                  )}
                </div>
              ) : (
                <Icon className="w-5 h-5 mb-0.5" />
              )}
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
