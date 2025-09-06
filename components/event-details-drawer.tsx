"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { GameEvent, Rsvp } from "@/lib/types"
import { Users, Calendar, Clock, MapPin } from "lucide-react"

interface EventDetailsDrawerProps {
  event: GameEvent
  isOpen: boolean
  onClose: () => void
  onEventUpdated: (event: GameEvent) => void
}

export default function EventDetailsDrawer({ event, isOpen, onClose, onEventUpdated }: EventDetailsDrawerProps) {
  if (!event) return null;

  const confirmedPlayers = event.rsvps.filter(rsvp => rsvp.status === 'in');

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="glass-surface border-white/15 text-foreground">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold">{event.title}</DrawerTitle>
          <DrawerDescription>{event.description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 space-y-4">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            <span>{confirmedPlayers.length} / {event.maxPlayers} players</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{event.location}</span>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Who's In:</h3>
            <div className="flex flex-wrap gap-2">
              {confirmedPlayers.map((rsvp: Rsvp) => (
                <div key={rsvp.userId || rsvp.guestId} className="bg-primary/20 text-slate-50 px-3 py-1 rounded-full text-sm">
                  {rsvp.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button size="lg">Join Game</Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
