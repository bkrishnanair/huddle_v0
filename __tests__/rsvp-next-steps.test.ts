import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateGoogleCalendarUrl, generateIcsContent } from '@/lib/calendar';
import { getEventShareData, shareEvent } from '@/lib/event-sharing';
import type { GameEvent } from '@/lib/types';

const event = {
  id: 'build-night', name: 'Open build night', date: '2026-09-24',
  time: '18:00', endTime: '20:30', timezone: 'America/New_York',
  location: 'Engineering Hall', category: 'Tech',
} as GameEvent;

afterEach(() => vi.unstubAllGlobals());

describe('event invitation sharing', () => {
  it('shares an event link without attaching user identity or roster details', () => {
    expect(getEventShareData(event, 'https://huddlemap.live/', true)).toEqual({
      title: 'Huddle: Open build night',
      text: 'I’m going to Open build night. Want to come with me?',
      url: 'https://huddlemap.live/map?eventId=build-night',
    });
    expect(() => getEventShareData({ ...event, isPrivate: true }, 'https://huddlemap.live', true)).toThrow();
  });
  it('uses native sharing without copying first', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn();
    vi.stubGlobal('navigator', { share, clipboard: { writeText } });
    expect(await shareEvent({ url: 'https://huddlemap.live/map' })).toBe('shared');
    expect(share).toHaveBeenCalledOnce();
    expect(writeText).not.toHaveBeenCalled();
  });
  it('treats dismissing the native share sheet as cancellation', async () => {
    const writeText = vi.fn();
    vi.stubGlobal('navigator', { share: vi.fn().mockRejectedValue(new DOMException('Cancelled', 'AbortError')), clipboard: { writeText } });
    expect(await shareEvent({ url: 'https://huddlemap.live/map' })).toBe('cancelled');
    expect(writeText).not.toHaveBeenCalled();
  });
  it('falls back to copying and surfaces failure for manual link selection', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { share: vi.fn().mockRejectedValue(new Error('Unavailable')), clipboard: { writeText } });
    expect(await shareEvent({ url: 'https://huddlemap.live/map' })).toBe('copied');
    expect(writeText).toHaveBeenCalledWith('https://huddlemap.live/map');
    writeText.mockRejectedValue(new Error('Permission denied'));
    await expect(shareEvent({ url: 'https://huddlemap.live/map' })).rejects.toThrow('Permission denied');
  });
});

describe('event calendar shortcuts', () => {
  it('honors the event timezone and explicit end time in both formats', () => {
    const url = new URL(generateGoogleCalendarUrl(event));
    expect(url.searchParams.get('dates')).toBe('20260924T220000Z/20260925T003000Z');
    const ics = generateIcsContent(event);
    expect(ics).toContain('DTSTART:20260924T220000Z');
    expect(ics).toContain('DTEND:20260925T003000Z');
  });
  it('honors an explicit multi-day ending', () => {
    expect(generateIcsContent({ ...event, endDate: '2026-09-26', endTime: '12:00' })).toContain('DTEND:20260926T160000Z');
  });
  it('escapes event text rather than creating injected calendar properties', () => {
    const ics = generateIcsContent({ ...event, name: 'Build, learn; repeat\nSTATUS:CANCELLED' });
    expect(ics).toContain('SUMMARY:Build\\, learn\\; repeat\\nSTATUS:CANCELLED');
    expect(ics).not.toContain('\r\nSTATUS:CANCELLED');
  });
});
