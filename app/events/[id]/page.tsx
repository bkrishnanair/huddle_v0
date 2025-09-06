"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

function PublicEventPageSkeleton() {
  return (
    <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-lg glass-surface animate-pulse">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2 rounded-md bg-slate-700" />
          <Skeleton className="h-5 w-1/2 rounded-md bg-slate-700" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-full rounded-md bg-slate-700" />
          <Skeleton className="h-6 w-full rounded-md bg-slate-700" />
          <Skeleton className="h-6 w-full rounded-md bg-slate-700" />
          <div className="pt-4">
            <Skeleton className="h-12 w-full rounded-md bg-slate-700" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PublicEventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRsvpd, setHasRsvpd] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${params.id}/public-details`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data.event);
        }
      } catch (error) {
        console.error("Failed to fetch event details", error);
        toast.error("Could not load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params.id]);

  const handleRsvp = async (status: 'in' | 'out') => {
    if (!guestName.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/events/${params.id}/guest-rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: guestName, status }),
      });
      if (res.ok) {
        toast.success(`You're ${status}! Thanks for the RSVP.`);
        setHasRsvpd(true);
        // Here we would show the prompt to sign up
      } else {
        const errorData = await res.json();
        toast.error(`RSVP failed: ${errorData.error}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <PublicEventPageSkeleton />;
  }
  
  if (!event) {
    return (
       <div className="min-h-screen liquid-gradient flex items-center justify-center p-4 text-center">
          <h1 className="text-2xl font-bold text-slate-50">Event not found.</h1>
       </div>
    )
  }

  return (
    <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-lg glass-surface text-foreground">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{event.title}</CardTitle>
          <p className="text-slate-300">Organized by {event.organizerName}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-primary" /><span>{new Date(event.date).toLocaleDateString()} at {event.time}</span></div>
            <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /><span>{event.location}</span></div>
            <div className="flex items-center gap-3"><Users className="w-5 h-5 text-primary" /><span>{event.rsvps.length} / {event.maxPlayers} players confirmed</span></div>
          </div>

          <div className="space-y-4">
            <Input 
              placeholder="Enter your name to RSVP" 
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="h-12 glass-surface"
              disabled={hasRsvpd}
            />
            <div className="flex gap-4">
              <Button size="lg" className="w-full" onClick={() => handleRsvp('in')} disabled={isSubmitting || hasRsvpd}>
                <CheckCircle className="mr-2 w-5 h-5"/> I'm In
              </Button>
              <Button size="lg" variant="secondary" className="w-full" onClick={() => handleRsvp('out')} disabled={isSubmitting || hasRsvpd}>
                <XCircle className="mr-2 w-5 h-5"/> I'm Out
              </Button>
            </div>
          </div>
          
          {hasRsvpd && (
              <div className="mt-6 text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <h3 className="text-lg font-bold text-slate-50">Thanks for your RSVP!</h3>
                  <p className="text-slate-300 mt-1">Create a free account to join the game chat, see who else is playing, and track your stats.</p>
                  <Button className="mt-4" onClick={() => { /* This will eventually link to the main app/signup */ }}>Create Account</Button>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
