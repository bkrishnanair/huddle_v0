"use client"

import { CalendarPlus, CheckCircle2, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendar';
import type { GameEvent } from '@/lib/types';
import { InviteFriend } from '@/components/events/invite-friend';

interface Props {
  event: GameEvent;
  sharing: boolean;
  onInvite: () => void;
  onDone: () => void;
}

export function RsvpNextSteps({ event, sharing, onInvite, onDone }: Props) {
  const calendarUrl = generateGoogleCalendarUrl(event);
  return (
    <section aria-label="Next steps after joining" className="mx-5 mb-4 rounded-2xl border border-teal-400/30 bg-teal-400/10 p-4">
      <div role="status" className="flex items-center gap-2 font-semibold text-teal-200">
        <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
        You’re going
      </div>
      <p className="mt-1 text-sm text-slate-300">
        {event.isPrivate ? 'Save the details so you’re ready to go.' : 'Want someone to come with you?'}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {!event.isPrivate && (
          <Button type="button" disabled={sharing} onClick={onInvite} className="min-h-11">
            <Share className="mr-2 h-4 w-4" aria-hidden="true" />
            Bring a friend
          </Button>
        )}
        {calendarUrl && <>
          <Button asChild variant="outline" className="min-h-11">
            <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
              <CalendarPlus className="mr-2 h-4 w-4" aria-hidden="true" />Google Calendar
            </a>
          </Button>
          <Button type="button" variant="outline" className="min-h-11" onClick={() => downloadIcsFile(event)}>Apple / Outlook</Button>
        </>}
        <Button type="button" variant="ghost" className="min-h-11" onClick={onDone}>Done</Button>
      </div>
      {!event.isPrivate && <InviteFriend eventId={event.id} />}
    </section>
  );
}
