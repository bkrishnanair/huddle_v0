import { z } from 'zod';

export const organizerIdSchema = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
export const publicWebsiteSchema = z.union([z.literal(''), z.string().url().max(500).refine(value => {
  const url = new URL(value);
  return url.protocol === 'https:' && !url.username && !url.password;
}, 'Use a public HTTPS URL')]);
export const organizerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  kind: z.enum(['club', 'business', 'community']),
  about: z.string().trim().min(20).max(1200),
  area: z.string().trim().min(2).max(120),
  website: publicWebsiteSchema,
  published: z.boolean(),
}).strict();
export type OrganizerInput = z.infer<typeof organizerSchema>;
export type PublicOrganizer = OrganizerInput & { id: string; verified: boolean };

export function publicOrganizer(id: string, data: Record<string, unknown>): PublicOrganizer | null {
  const parsed = organizerSchema.safeParse({ name: data.name, kind: data.kind, about: data.about, area: data.area, website: data.website, published: data.published });
  return parsed.success ? { id, ...parsed.data, verified: data.reviewStatus === 'approved' } : null;
}
