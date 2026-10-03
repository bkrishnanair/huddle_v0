"use client";
import { Button } from '@/components/ui/button';
export default function OrganizerError({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-xl space-y-4 px-5 py-12 text-white"><h1 className="text-xl font-bold">Organizer pages are temporarily unavailable</h1><p>Your events and RSVPs have not changed.</p><Button onClick={reset}>Try again</Button></main>;
}
