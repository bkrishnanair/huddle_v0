// lib/analytics.ts
// Privacy-first, zero-PII client funnel telemetry for Huddle.
"use client"

export type FunnelEvent =
  | { name: 'landing_view' }
  | { name: 'map_view' }
  | { name: 'event_open'; properties: { eventId: string; category?: string; isVirtual?: boolean } }
  | { name: 'rsvp_click'; properties: { eventId: string; category?: string; isFull?: boolean } }
  | { name: 'rsvp_success'; properties: { eventId: string; action: 'join' | 'leave' } }
  | { name: 'check_in'; properties: { eventId: string } };

/**
 * Track a conversion funnel event.
 * Never pass PII (names, emails, phone numbers, notes) into event properties.
 */
export function trackFunnelEvent(event: FunnelEvent): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Log structured event to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 [Funnel Analytics] ${event.name}:`, 'properties' in event ? event.properties : {});
    }

    // 2. Dispatch custom DOM event for extensible analytics integrations (e.g. GA4 / Vercel Analytics / Plausible)
    window.dispatchEvent(
      new CustomEvent('huddle:analytics', {
        detail: {
          event: event.name,
          properties: 'properties' in event ? event.properties : {},
          timestamp: Date.now(),
        },
      })
    );
  } catch (err) {
    // Non-blocking telemetry
    console.debug('Analytics dispatch error:', err);
  }
}
