import type { GameEvent } from './types';

export function getEventShareData(event: GameEvent, origin: string, invite = false): ShareData {
  if (invite && event.isPrivate) throw new Error('Private events cannot be invited to publicly.');
  const title = event.name || event.title || 'this event';
  return {
    title: `Huddle: ${title}`,
    text: invite ? `I’m going to ${title}. Want to come with me?` : `Check out ${title} on Huddle.`,
    url: `${origin.replace(/\/$/, '')}/map?eventId=${encodeURIComponent(event.id)}`,
  };
}

/** Invoke from the click handler before any awaits, preserving mobile user activation. */
export async function shareEvent(data: ShareData): Promise<'shared' | 'copied' | 'cancelled'> {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return 'shared';
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return 'cancelled';
      // Unsupported/blocked native sharing can still fall back to a link.
    }
  }
  await navigator.clipboard.writeText(data.url || '');
  return 'copied';
}
