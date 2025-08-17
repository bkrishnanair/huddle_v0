"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

// Props definition for the component
interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: any) => void;
}

// List of available sports
const SPORTS = [
  "Basketball", "Soccer", "Tennis", "Cricket", "Baseball", "Volleyball", 
  "Football", "Hockey", "Badminton", "Table Tennis"
];

export default function CreateEventModal({ isOpen, onClose, onEventCreated }: CreateEventModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    location: "",
    date: "",
    time: "",
    maxPlayers: 10,
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sport) {
      // It's good practice to validate required fields
      alert("Please select a sport.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        onEventCreated(data.event);
        onClose(); // Close modal on success
      } else {
        // Handle server-side errors
        const errorData = await response.json();
        console.error("Failed to create event:", errorData.error);
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Client-side error creating event:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generic handler for form input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Return null if the modal is not supposed to be open
  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    // FIX: Main container now uses flexbox to perfectly center the modal
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md glass-card border-none rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <CardHeader className="pb-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white">Create New Game</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* FIX: Form content is wrapped in a ScrollArea to enable scrolling on smaller screens */}
        <ScrollArea className="flex-grow">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white/90">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Evening Basketball Run"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  className="glass border-white/30 text-white placeholder:text-white/60"
                />
              </div>

              <div>
                <Label htmlFor="sport" className="text-white/90">Sport</Label>
                <Select required value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                  <SelectTrigger className="glass border-white/30 text-white"><SelectValue placeholder="Select a sport" /></SelectTrigger>
                  <SelectContent className="glass-card"><SelectItem value="" disabled>Select a sport</SelectItem>{SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className="text-white/90">Location</Label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-white/90">Date</Label>
                  <Input id="date" type="date" min={today} value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} required className="glass border-white/30 text-white" />
                </div>
                {/* FIX: Added a dedicated time input field */}
                <div>
                  <Label htmlFor="time" className="text-white/90">Time</Label>
                  <Input id="time" type="time" value={formData.time} onChange={(e) => handleInputChange("time", e.target.value)} required className="glass border-white/30 text-white" />
                </div>
              </div>

              <div>
                <Label htmlFor="maxPlayers" className="text-white/90">Number of Players Needed</Label>
                <Select value={String(formData.maxPlayers)} onValueChange={(v) => handleInputChange("maxPlayers", Number(v))}>
                  <SelectTrigger className="glass border-white/30 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="glass-card">{Array.from({ length: 20 }, (_, i) => i + 2).map(n => <SelectItem key={n} value={String(n)}>{n} players</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={isLoading} className="w-full glass-card hover:glow text-white border-white/30">
                  {isLoading ? "Creating Game..." : "Create Game"}
                </Button>
              </div>
            </form>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
