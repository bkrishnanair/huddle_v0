"use client"

import { Button } from "@/components/ui/button"
import { User, LogOut, MapPin, UserCircle, BarChart3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NotificationBell } from "./notification-bell"

interface SharedHeaderProps {
  user: any
  onLogout: () => void
}

export default function SharedHeader({ user, onLogout }: SharedHeaderProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      onLogout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <MapPin className="w-6 h-6 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900">Huddle</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Navigation Links */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Button variant={pathname === "/" ? "default" : "ghost"} size="sm" className="text-sm">
              Map
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant={pathname === "/dashboard" ? "default" : "ghost"} size="sm" className="text-sm">
              <BarChart3 className="w-4 h-4 mr-1" />
              Studio
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant={pathname === "/profile" ? "default" : "ghost"} size="sm" className="text-sm">
              <UserCircle className="w-4 h-4 mr-1" />
              Profile
            </Button>
          </Link>
        </div>

        {/* User Info & Notifications */}
        <div className="flex items-center space-x-2">
          <NotificationBell />
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-black/5 px-3 py-1.5 rounded-full ml-1">
            <User className="w-4 h-4" />
            <span className="font-bold">{user.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-red-600 transition-colors ml-1">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
