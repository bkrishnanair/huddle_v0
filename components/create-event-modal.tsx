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
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Create New Game</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event Title */}
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="e.g., Evening Basketball Run"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            {/* Sport Type */}
            <div>
              <Label htmlFor="sport">Sport</Label>
              <Select value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a sport" />
                </SelectTrigger>
                <SelectContent>
                  {SPORTS.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Central Park Basketball Court"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Game will be placed near your current location</p>
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                min={today}
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>

            {/* Time */}
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
              />
            </div>

            {/* Max Players */}
            <div>
              <Label htmlFor="maxPlayers">Number of Players Needed</Label>
              <Select
                value={formData.maxPlayers.toString()}
                onValueChange={(value) => handleInputChange("maxPlayers", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => i + 2).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
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
                className="w-full bg-blue-600 hover:bg-blue-700"
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
