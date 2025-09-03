"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Users, Loader2, UserCircle } from "lucide-react"
import EventChat from "@/components/event-chat"
import PublicProfileModal from "@/components/profile/public-profile-modal"
import { useAuth } from "@/lib/firebase-context"
import { GameEvent, Player } from "@/lib/types"

interface EventDetailsModalProps {
  event: GameEvent;
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated: (updatedEvent: GameEvent) => void;
}

export default function EventDetailsModal({ event, isOpen, onClose, onEventUpdated }: EventDetailsModalProps) {
  const { user } = useAuth()
  const [isRsvpLoading, setIsRsvpLoading] = useState(false)
  const [eventWithDetails, setEventWithDetails] = useState<GameEvent>(event)
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)

  useEffect(() => {
    // Fetch event details logic
  }, [isOpen, event.id])

  if (!isOpen) return null
  
  const handleRsvp = async () => {
    // RSVP logic
  }

  const isFull = eventWithDetails.currentPlayers >= eventWithDetails.maxPlayers;
  const hasJoined = user ? eventWithDetails.players.includes(user.uid) : false;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md glass-surface border-white/15 text-foreground">
            <DialogHeader>
                <DialogTitle>{eventWithDetails.title}</DialogTitle>
                <DialogDescription>
                    <Badge variant="secondary">{eventWithDetails.sport}</Badge>
                </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="players">Players</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-3 text-emerald-400" /><span>{eventWithDetails.location}</span></div>
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-3 text-emerald-400" /><span>{new Date(eventWithDetails.date).toLocaleDateString()}</span></div>
                <div className="flex items-center"><Clock className="w-4 h-4 mr-3 text-emerald-400" /><span>{eventWithDetails.time}</span></div>
                <div className="flex items-center"><Users className="w-4 h-4 mr-3 text-emerald-400" /><span>{eventWithDetails.currentPlayers} / {eventWithDetails.maxPlayers} Players</span></div>
            </TabsContent>
            <TabsContent value="players" className="mt-4 max-h-60 overflow-y-auto no-scrollbar">
                <div className="space-y-3">
                    {eventWithDetails.playerDetails?.map((player: Player) => (
                        <div key={player.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10" onClick={() => setSelectedProfileId(player.id)}>
                            <div className="flex items-center space-x-3">
                                <Avatar className="w-8 h-8"><AvatarImage src={player.photoURL} /><AvatarFallback><UserCircle /></AvatarFallback></Avatar>
                                <p className="text-slate-50 font-medium">{player.displayName}</p>
                            </div>
                            {eventWithDetails.checkedInPlayers?.includes(player.id) && <Badge variant="outline">Checked In</Badge>}
                        </div>
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="chat" className="mt-4"><EventChat eventId={eventWithDetails.id} /></TabsContent>
            </Tabs>
            
            <DialogFooter>
                <Button onClick={handleRsvp} className="w-full" disabled={isRsvpLoading || isFull} variant={hasJoined ? "destructive" : "default"}>
                    {isRsvpLoading ? <Loader2 className="animate-spin" /> : (hasJoined ? "Leave Game" : "Join Game")}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      {selectedProfileId && (
        <PublicProfileModal
          isOpen={!!selectedProfileId}
          onClose={() => setSelectedProfileId(null)}
          userId={selectedProfileId}
        />
      )}
    </>
  )
}
