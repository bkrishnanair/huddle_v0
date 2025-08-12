"use client"
import { MapPin, Calendar, MessageCircle, User } from "lucide-react"

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
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/20 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive ? "bg-blue-500/20 text-blue-600" : "text-gray-600 hover:text-blue-500 hover:bg-blue-50/50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
              <span className={`text-xs font-medium ${isActive ? "text-blue-600" : ""}`}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
