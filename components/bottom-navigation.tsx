"use client"
import { MapPin, Calendar, MessageCircle, User } from "lucide-react"

// Custom Huddle Logo SVG
const HuddleLogo = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-white"
    >
      <path
        d="M4 4V20M20 4V20M4 12H20M12 4V12C12 14.2091 10.2091 16 8 16C5.79086 16 4 14.2091 4 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "map", label: "Map", icon: MapPin },
    { id: "events", label: "Events", icon: Calendar },
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center">
      <div className="flex items-center justify-around gap-2 rounded-full p-2 glass-card shadow-lg w-full max-w-md sm:max-w-lg">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <HuddleLogo />
        </div>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center w-16 h-16 rounded-2xl
                transition-all duration-300 ease-in-out
                ${isActive ? "bg-white/20" : "text-white/70 hover:bg-white/10"}
              `}
            >
              <Icon className="w-6 h-6 mb-1 text-white" />
              <span className="text-xs font-light text-white">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
