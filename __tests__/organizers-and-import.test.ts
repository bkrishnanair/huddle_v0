import { describe, expect, it } from 'vitest';
import { organizerSchema, publicOrganizer, publicWebsiteSchema } from '@/lib/organizers';
import { publishScheduleSchema, scheduleParseResultSchema } from '@/lib/schedule-import';
import { descriptionEnhancementSchema } from '@/lib/event-description';

const organizer = { name: 'Build club', kind: 'club', about: 'A place to build together and share projects.', area: 'College Park', website: 'https://example.org', published: true };
const event = { title: 'Build night', category: 'Tech', date: '2027-09-23', time: '18:00', endDate: '', endTime: '20:00', location: 'Engineering hall', geopoint: { latitude: 38.99, longitude: -76.94 }, description: 'Bring a project.', capacity: 30 };
const payload = { submissionId: 'a4b6f934-6de4-41c1-a0f7-47063f84c5c3', timezone: 'America/New_York', events: [event] };

describe('organizer publishing boundaries', () => {
  it('does not accept owner or verification fields from the client', () => {
    expect(organizerSchema.safeParse({ ...organizer, ownerId: 'someone-else' }).success).toBe(false);
    expect(organizerSchema.safeParse({ ...organizer, reviewStatus: 'approved' }).success).toBe(false);
  });
  it('projects public fields and derives verification only from the server review', () => {
    const page = publicOrganizer('owner', { ...organizer, reviewStatus: 'pending', verified: true, email: 'private@example.org', reviewedBy: 'admin' });
    expect(page?.verified).toBe(false);
    expect(page).not.toHaveProperty('email');
    expect(page).not.toHaveProperty('reviewedBy');
    expect(publicOrganizer('owner', { ...organizer, reviewStatus: 'approved' })?.verified).toBe(true);
  });
  it.each(['javascript:alert(1)', 'http://example.org', 'https://password@example.org'])('rejects unsafe website %s', website => {
    expect(publicWebsiteSchema.safeParse(website).success).toBe(false);
  });
});

describe('schedule review requirements', () => {
  it('accepts a confirmed in-person schedule', () => expect(publishScheduleSchema.safeParse(payload).success).toBe(true));
  it('lets the model leave unknown facts blank but rejects publishing them', () => {
    const draft = { ...event, date: '', time: '', capacity: null };
    const { geopoint, ...modelDraft } = draft;
    expect(scheduleParseResultSchema.safeParse({ events: [modelDraft] }).success).toBe(true);
    expect(publishScheduleSchema.safeParse({ ...payload, events: [draft] }).success).toBe(false);
  });
  it.each([{ date: '2027-02-30' }, { time: '25:00' }, { category: 'Made up' }, { capacity: null }, { geopoint: undefined }, { geopoint: { latitude: 91, longitude: 0 } }, { endTime: '17:00' }])('rejects unsafe event data %j', changes => {
    expect(publishScheduleSchema.safeParse({ ...payload, events: [{ ...event, ...changes }] }).success).toBe(false);
  });
  it('requires an explicit next-day end date for overnight events', () => {
    expect(publishScheduleSchema.safeParse({ ...payload, events: [{ ...event, endDate: '2027-09-24', endTime: '01:00' }] }).success).toBe(true);
  });
  it('rejects duplicates, missing retry keys and invalid timezones', () => {
    expect(publishScheduleSchema.safeParse({ ...payload, events: [event, event] }).success).toBe(false);
    expect(publishScheduleSchema.safeParse({ ...payload, submissionId: '' }).success).toBe(false);
    expect(publishScheduleSchema.safeParse({ ...payload, timezone: 'Mars/Olympus' }).success).toBe(false);
  });
  it('validates optional AI title, category and icon proposals', () => {
    expect(descriptionEnhancementSchema.safeParse({ enhanced: 'Build with us.', suggestions: { title: 'Build night', category: 'Tech', icon: '💻' } }).success).toBe(true);
    expect(descriptionEnhancementSchema.safeParse({ enhanced: 'Build with us.', suggestions: { category: 'Fake', icon: 'ABC' } }).success).toBe(false);
  });
});
