"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Calendar, Search, User } from "lucide-react"

const HuddleLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-50">
    <path d="M4 4V20M20 4V20M4 12H20M12 4V12C12 14.2091 10.2091 16 8 16C5.79086 16 4 14.2091 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function BottomNavigation() {
  const pathname = usePathname()

  const tabs = [
    { id: "map", label: "Map", icon: MapPin, href: "/map" },
    { id: "discover", label: "Discover", icon: Search, href: "/discover" },
    { id: "my-events", label: "My Events", icon: Calendar, href: "/my-events" },
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
  ]

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center px-4">
      <div className="flex items-center justify-around gap-2 rounded-full p-2 glass-surface border-white/15 w-full max-w-md">
        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
          <HuddleLogo />
        </div>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`
                flex flex-col items-center justify-center w-16 h-16 rounded-2xl
                transition-colors duration-200
                ${isActive ? "bg-white/10" : "text-slate-400 hover:bg-white/5"}
              `}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
              <span className={`text-xs font-light ${isActive ? "text-slate-50" : "text-slate-400"}`}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
