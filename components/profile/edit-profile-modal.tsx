"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { MultiSelect } from "@/components/ui/multi-select"
import { Switch } from "@/components/ui/switch"

const CATEGORIES = [
  "Sports",
  "Music",
  "Community",
  "Learning",
  "Food & Drink",
  "Tech",
  "Arts & Culture",
  "Outdoors",
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
    interests: Array.isArray(userProfile?.favoriteSports) ? userProfile.favoriteSports : [],
    notifyAnnouncements: userProfile?.notifyAnnouncements ?? true,
    notifyPromotions: userProfile?.notifyPromotions ?? true,
    notifyReminders: userProfile?.notifyReminders ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.interests.length > 5) {
      toast.error("You can select up to 5 interests.")
      return
    }
    setIsLoading(true)
    try {
      const { getAuth } = await import("firebase/auth")
      const currentUser = getAuth().currentUser
      const idToken = currentUser ? await currentUser.getIdToken() : ""

      const response = await fetch("/api/users/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          displayName: formData.displayName,
          bio: formData.bio,
          favoriteSports: formData.interests,
          notifyAnnouncements: formData.notifyAnnouncements,
          notifyPromotions: formData.notifyPromotions,
          notifyReminders: formData.notifyReminders,
        }),
        credentials: 'include'
      })

      if (response.ok) {
        toast.success("Profile updated successfully!")
        onProfileUpdate()
      } else {
        const errorData = await response.json()
        const errorMessage = typeof errorData.error === 'object' ? JSON.stringify(errorData.error) : errorData.error;
        toast.error(`Failed to update profile: ${errorMessage}`)
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md glass-card border-none rounded-2xl shadow-2xl relative">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Edit Profile</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-xs font-black uppercase tracking-widest text-slate-400">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required
                className="glass border-white/20 text-white h-11 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="bio" className="text-xs font-black uppercase tracking-widest text-slate-400">
                  About Me
                </Label>
                <span className="text-[10px] text-slate-500 font-bold">{formData.bio.length}/160</span>
              </div>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                maxLength={160}
                className="glass border-white/20 text-white min-h-[100px] focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="interests" className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Interests
                </Label>
                <span className="text-[10px] text-slate-500 font-bold">{formData.interests.length}/5</span>
              </div>
              <MultiSelect
                options={CATEGORIES.map((s) => ({ value: s, label: s }))}
                value={formData.interests}
                onChange={(value) => {
                  if (value.length <= 5) {
                    setFormData({ ...formData, interests: value })
                  } else {
                    toast.warning("Check: Max 5 interests reached.", { duration: 1500 })
                  }
                }}
                placeholder="Select your interests"
                className="glass border-white/20 text-white min-h-[44px]"
              />
            </div>

            <div className="space-y-4 pt-2 border-t border-white/10 mt-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Notification Preferences</Label>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-slate-200">Event Announcements</Label>
                  <p className="text-[10px] text-slate-500">Messages and updates from organizers.</p>
                </div>
                <Switch
                  checked={formData.notifyAnnouncements}
                  onCheckedChange={(checked) => setFormData({ ...formData, notifyAnnouncements: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-slate-200">Waitlist & Promotions</Label>
                  <p className="text-[10px] text-slate-500">Alerts when you get off the waitlist.</p>
                </div>
                <Switch
                  checked={formData.notifyPromotions}
                  onCheckedChange={(checked) => setFormData({ ...formData, notifyPromotions: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-slate-200">Event Reminders</Label>
                  <p className="text-[10px] text-slate-500">Upcoming event reminders and check-ins.</p>
                </div>
                <Switch
                  checked={formData.notifyReminders}
                  onCheckedChange={(checked) => setFormData({ ...formData, notifyReminders: checked })}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Profiles
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
