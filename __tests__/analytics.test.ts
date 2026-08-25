import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackFunnelEvent, type FunnelEvent } from '@/lib/analytics';

describe('Analytics Funnel Telemetry', () => {
  let dispatchedEvents: any[] = [];
  const eventListeners: Record<string, Function[]> = {};

  beforeEach(() => {
    dispatchedEvents = [];
    for (const key of Object.keys(eventListeners)) {
      delete eventListeners[key];
    }

    // Mock minimal DOM window & CustomEvent in Node environment
    (globalThis as any).window = {
      addEventListener: vi.fn((event: string, fn: Function) => {
        eventListeners[event] = eventListeners[event] || [];
        eventListeners[event].push(fn);
      }),
      removeEventListener: vi.fn((event: string, fn: Function) => {
        if (eventListeners[event]) {
          eventListeners[event] = eventListeners[event].filter((l) => l !== fn);
        }
      }),
      dispatchEvent: vi.fn((event: any) => {
        const listeners = eventListeners[event.type] || [];
        listeners.forEach((fn) => fn(event));
        return true;
      }),
    };

    (globalThis as any).CustomEvent = class CustomEvent {
      type: string;
      detail: any;
      constructor(type: string, options?: { detail?: any }) {
        this.type = type;
        this.detail = options?.detail;
      }
    };

    window.addEventListener('huddle:analytics', (e: any) => {
      dispatchedEvents.push(e.detail);
    });
  });

  afterEach(() => {
    delete (globalThis as any).window;
    delete (globalThis as any).CustomEvent;
    vi.restoreAllMocks();
  });

  it('dispatches landing_cta_click with valid placement', () => {
    trackFunnelEvent({
      name: 'landing_cta_click',
      properties: { placement: 'hero' },
    });

    expect(dispatchedEvents).toHaveLength(1);
    expect(dispatchedEvents[0].event).toBe('landing_cta_click');
    expect(dispatchedEvents[0].properties.placement).toBe('hero');
    expect(dispatchedEvents[0].timestamp).toBeTypeOf('number');
  });

  it('dispatches landing_view without throwing', () => {
    trackFunnelEvent({ name: 'landing_view' });
    expect(dispatchedEvents).toHaveLength(1);
    expect(dispatchedEvents[0].event).toBe('landing_view');
  });

  it('dispatches map_view, event_open, rsvp_click, and check_in events', () => {
    const events: FunnelEvent[] = [
      { name: 'map_view' },
      { name: 'event_open', properties: { eventId: 'event_123', category: 'Sports' } },
      { name: 'rsvp_click', properties: { eventId: 'event_123', category: 'Sports', isFull: false } },
      { name: 'rsvp_success', properties: { eventId: 'event_123', action: 'join' } },
      { name: 'check_in', properties: { eventId: 'event_123' } },
    ];

    events.forEach(trackFunnelEvent);

    expect(dispatchedEvents).toHaveLength(5);
    expect(dispatchedEvents.map((e) => e.event)).toEqual([
      'map_view',
      'event_open',
      'rsvp_click',
      'rsvp_success',
      'check_in',
    ]);
  });

  it('does not throw when window dispatch fails', () => {
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(window, 'dispatchEvent').mockImplementationOnce(() => {
      throw new Error('Dispatch failed');
    });

    expect(() => {
      trackFunnelEvent({ name: 'landing_view' });
    }).not.toThrow();
  });

  it('is a safe no-op on the server when window is undefined', () => {
    delete (globalThis as any).window;
    expect(() => {
      trackFunnelEvent({ name: 'landing_view' });
    }).not.toThrow();
  });
});
