import { z } from 'zod';
import { DIRECTORY_CATEGORIES } from '@/lib/seo/categories';
import { isCalendarDate, isClockTime, isTimeZone } from '@/lib/datetime';

export const SCHEDULE_LIMIT = 20;
export const eventCategorySchema = z.string().refine(value => DIRECTORY_CATEGORIES.some(category => category.name === value), 'Choose a category');
export const scheduleDraftSchema = z.object({
  title: z.string().trim().max(120),
  date: z.string().max(10), time: z.string().max(5),
  endDate: z.string().max(10).default(''), endTime: z.string().max(5).default(''),
  location: z.string().trim().max(500), category: z.string().max(48),
  description: z.string().max(500).default(''),
  capacity: z.number().int().positive().max(10000).nullable(),
}).strict();
export const scheduleParseResultSchema = z.object({ events: z.array(scheduleDraftSchema).max(SCHEDULE_LIMIT) }).strict();
export type ScheduleDraft = z.infer<typeof scheduleDraftSchema> & {
  geopoint?: { latitude: number; longitude: number };
};

export const publishScheduleEventSchema = scheduleDraftSchema.extend({
  title: z.string().trim().min(1, 'Title is required').max(120),
  date: z.string().refine(isCalendarDate, 'Choose a valid date'),
  time: z.string().refine(isClockTime, 'Choose a start time'),
  endDate: z.string().refine(value => !value || isCalendarDate(value), 'Choose a valid end date'),
  endTime: z.string().refine(value => !value || isClockTime(value), 'Choose a valid end time'),
  location: z.string().trim().min(1, 'Choose a venue').max(500),
  category: eventCategorySchema,
  capacity: z.number().int().positive('Enter the confirmed capacity').max(10000),
  geopoint: z.object({ latitude: z.number().finite().min(-90).max(90), longitude: z.number().finite().min(-180).max(180) }).strict(),
}).refine(value => !value.endDate || value.endDate >= value.date, { message: 'End date must not precede the start date', path: ['endDate'] })
  .refine(value => !value.endTime || (value.endDate && value.endDate > value.date) || value.endTime > value.time,
    { message: 'For overnight events, enter the next day as the end date', path: ['endTime'] });

export const publishScheduleSchema = z.object({
  submissionId: z.string().uuid(),
  timezone: z.string().max(80).refine(isTimeZone, 'Choose a valid timezone'),
  events: z.array(publishScheduleEventSchema).min(1).max(SCHEDULE_LIMIT),
}).strict().refine(value => {
  const identities = value.events.map(event => JSON.stringify([event.title.toLowerCase(), event.date, event.time, event.location.toLowerCase()]));
  return new Set(identities).size === identities.length;
}, { message: 'Remove duplicate events before publishing', path: ['events'] });
