"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MapPin, Calendar, Search, User } from "lucide-react"
import { useFirebase } from "@/lib/firebase-context"
import { toast } from "sonner"
import { useState, useEffect } from "react"

const HuddleLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary">
    <path d="M4 4V20M20 4V20M4 12H20M12 4V12C12 14.2091 10.2091 16 8 16C5.79086 16 4 14.2091 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Checks if an event is currently happening
function isEventLive(event: any): boolean {
  if (!event.date || !event.time) return false;
  try {
    const start = new Date(`${event.date}T${event.time}`);
    if (isNaN(start.getTime())) return false;
    const now = new Date();
    if (now < start) return false;
    const end = event.endTime
      ? new Date(`${event.date}T${event.endTime}`)
      : new Date(start.getTime() + 3 * 60 * 60 * 1000); // default 3hr
    return now <= end;
  } catch {
    return false;
  }
}

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
    { id: "map", label: "Map", icon: MapPin, href: "/map" },
    { id: "discover", label: "Discover", icon: Search, href: "/discover" },
    { id: "my-events", label: "My Events", icon: Calendar, href: "/my-events" },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
  ]

  return (
    <div className="fixed bottom-4 inset-x-0 z-[60] flex justify-center px-4 pointer-events-none">
      <div className="flex items-center justify-around gap-1.5 rounded-full p-1.5 glass-surface border-white/15 w-full max-w-md pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.6)]">
        <Link href={user ? "/map" : "/"} className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
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
                ${isActive ? "bg-white/10" : "text-slate-400 hover:bg-white/5"}
              `}
            >
              {/* Map tab gets the live badge */}
              {tab.id === "map" ? (
                <div className="relative">
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-primary" : "text-slate-400"}`} />
                  {liveCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none shadow-lg shadow-red-500/40">
                      {liveCount > 9 ? "9+" : liveCount}
                    </span>
                  )}
                </div>
              ) : (
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-primary" : "text-slate-400"}`} />
              )}
              <span className={`text-[10px] font-light ${isActive ? "text-primary" : "text-slate-400"}`}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
