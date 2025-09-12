"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { toast } from "sonner"
import { MultiSelect } from "@/components/ui/multi-select"

const SPORTS = [
  "Basketball",
  "Soccer",
  "Tennis",
  "Cricket",
  "Baseball",
  "Volleyball",
  "Football",
  "Hockey",
  "Badminton",
  "Table Tennis",
]

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userProfile: any
  onProfileUpdate: () => void
}

export default function EditProfileModal({ isOpen, onClose, userProfile, onProfileUpdate }: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || "",
    bio: userProfile?.bio || "",
    favoriteSports: userProfile?.favoriteSports || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: 'include' // <-- Critical fix: ensures session cookies are sent
      })

      if (response.ok) {
        toast.success("Profile updated successfully!")
        onProfileUpdate()
      } else {
        const errorData = await response.json()
        toast.error(`Failed to update profile: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md glass-card border-none rounded-2xl shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="displayName" className="text-white/90">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required
                className="glass border-white/30 text-white"
              />
            </div>
            <div>
              <Label htmlFor="bio" className="text-white/90">
                About Me
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                className="glass border-white/30 text-white"
              />
            </div>
            <div>
              <Label htmlFor="favoriteSports" className="text-white/90">
                Favorite Sports
              </Label>
              <MultiSelect
                options={SPORTS.map((s) => ({ value: s, label: s }))}
                value={formData.favoriteSports}
                onChange={(value) => setFormData({ ...formData, favoriteSports: value })}
                placeholder="Select your favorite sports"
              />
            </div>
            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
