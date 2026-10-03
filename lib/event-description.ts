import { z } from 'zod';
import { DIRECTORY_CATEGORIES } from '@/lib/seo/categories';

// Shared with the client so generated text is checked before it reaches a draft.
export const descriptionEnhancementSchema = z.object({
  enhanced: z.string().trim().min(1).max(500),
  suggestions: z.object({
    suggestedQuestions: z.array(z.string().trim().min(1).max(160)).max(2).default([]),
    title: z.string().trim().min(1).max(120).optional(),
    category: z.string().refine(value => DIRECTORY_CATEGORIES.some(category => category.name === value)).optional(),
    icon: z.string().max(2).regex(new RegExp('^\\p{Extended_Pictographic}$', 'u')).optional(),
  }).strict().optional(),
}).strict();

export type DescriptionEnhancement = z.infer<typeof descriptionEnhancementSchema>;
