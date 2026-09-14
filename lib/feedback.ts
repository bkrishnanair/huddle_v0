import { z } from 'zod';

export const FEEDBACK_TYPES = {
  problem: 'Report a problem',
  improvement: 'Suggest an improvement',
  idea: 'Share an idea',
  other: 'Something else',
} as const;

export const feedbackSchema = z.object({
  type: z.enum(['problem', 'improvement', 'idea', 'other']),
  message: z.string().trim().min(10, 'Please add a little more detail (at least 10 characters).').max(3000),
  email: z.string().trim().max(254).pipe(z.union([z.string().email(), z.literal('')])),
  website: z.string().max(200).default(''),
  submissionId: z.string().uuid(),
}).strict();

export type Feedback = z.infer<typeof feedbackSchema>;
