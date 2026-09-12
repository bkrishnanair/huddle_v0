import { z } from 'zod';

const documentId = z.string().min(1).max(256).refine(value => !value.includes('/'), 'Invalid document ID');
export const loginInput = z.object({ idToken: z.string().min(1).max(16000) }).strict();
export const signupInput = z.object({
  email: z.string().email().max(320), password: z.string().min(6).max(4096),
  name: z.string().trim().min(3).max(50),
}).strict();
export const statusInput = z.object({ status: z.enum(['active', 'past']) }).strict();
export const checkinInput = z.object({ playerId: documentId, status: z.boolean().default(true) }).strict();
export const notificationInput = z.object({ notificationId: documentId }).strict();
export const profileUpdateInput = z.object({
  displayName: z.string().trim().min(3).max(50).optional(),
  bio: z.string().max(160).optional(),
  savedQuestions: z.array(z.string().max(500)).max(50).optional(),
  savedTransitTips: z.array(z.string().max(1000)).max(50).optional(),
  notifyAnnouncements: z.boolean().optional(), notifyPromotions: z.boolean().optional(),
  notifyReminders: z.boolean().optional(), onboardingComplete: z.boolean().optional(),
}).strict().refine(value => Object.keys(value).length > 0, 'No fields to update');
