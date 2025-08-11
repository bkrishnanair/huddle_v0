"use client"

import { Button } from "@/components/ui/button"
import { User, LogOut, MapPin, UserCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
          <Link href="/profile">
            <Button variant={pathname === "/profile" ? "default" : "ghost"} size="sm" className="text-sm">
              <UserCircle className="w-4 h-4 mr-1" />
              Profile
            </Button>
          </Link>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{user.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
