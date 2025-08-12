"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface CreateEventModalProps {
  user: any
  userLocation: { lat: number; lng: number }
  onClose: () => void
  onEventCreated: (event: any) => void
}

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

export default function CreateEventModal({ user, userLocation, onClose, onEventCreated }: CreateEventModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    location: "",
    date: "",
    time: "",
    maxPlayers: 10,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: userLocation.lat + (Math.random() - 0.5) * 0.01, // Slight random offset
          longitude: userLocation.lng + (Math.random() - 0.5) * 0.01,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        onEventCreated(data.event)
      }
    } catch (error) {
      console.error("Failed to create event:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Get today's date for min date input
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end justify-center z-50 p-4">
      <Card className="w-full max-w-md glass-card border-white/30 rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white">Create New Game</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:glass-card"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event Title */}
            <div>
              <Label htmlFor="title" className="text-white/90">
                Event Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Evening Basketball Run"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                className="glass border-white/30 text-white placeholder:text-white/60"
              />
            </div>

            {/* Sport Type */}
            <div>
              <Label htmlFor="sport" className="text-white/90">
                Sport
              </Label>
              <Select value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                <SelectTrigger className="glass border-white/30 text-white">
                  <SelectValue placeholder="Select a sport" className="text-white/60" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/30">
                  {SPORTS.map((sport) => (
                    <SelectItem key={sport} value={sport} className="text-white hover:glass-card">
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-white/90">
                Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., Central Park Basketball Court"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
                className="glass border-white/30 text-white placeholder:text-white/60"
              />
              <p className="text-xs text-white/60 mt-1">Game will be placed near your current location</p>
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date" className="text-white/90">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                min={today}
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
                className="glass border-white/30 text-white"
              />
            </div>

            {/* Time */}
            <div>
              <Label htmlFor="time" className="text-white/90">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
                className="glass border-white/30 text-white"
              />
            </div>

            {/* Max Players */}
            <div>
              <Label htmlFor="maxPlayers" className="text-white/90">
                Number of Players Needed
              </Label>
              <Select
                value={formData.maxPlayers.toString()}
                onValueChange={(value) => handleInputChange("maxPlayers", Number.parseInt(value))}
              >
                <SelectTrigger className="glass border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/30">
                  {Array.from({ length: 20 }, (_, i) => i + 2).map((num) => (
                    <SelectItem key={num} value={num.toString()} className="text-white hover:glass-card">
                      {num} players
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.title ||
                  !formData.sport ||
                  !formData.location ||
                  !formData.date ||
                  !formData.time
                }
                className="w-full glass-card hover:glow text-white border-white/30 transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                {isLoading ? "Creating Game..." : "Create Game"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
