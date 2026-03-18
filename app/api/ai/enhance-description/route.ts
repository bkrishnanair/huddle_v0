import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getServerCurrentUser } from '@/lib/auth-server';
import { generateStructured } from '@/lib/gemini';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const enhanceSchema = z.object({
  rawText: z.string().min(1, 'Description text is required').max(500),
  category: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
});

interface EnhanceResult {
  enhanced: string;
  suggestions?: {
    transitTip?: string;
    suggestedQuestions?: string[];
  };
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = enhanceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { rawText, category, location, date, time } = validation.data;

    const prompt = `You are a friendly event description writer for a university campus event platform called Huddle.

Given this rough event description, rewrite it to be more engaging, concise, and inviting. Keep it under 200 characters. Use a warm, casual tone that appeals to college students.

Event details:
- Raw description: "${rawText}"
${category ? `- Category: ${category}` : ''}
${location ? `- Location: ${location}` : ''}
${date ? `- Date: ${date}` : ''}
${time ? `- Time: ${time}` : ''}

Return a JSON object with:
- "enhanced": the improved description (string, max 200 chars)
- "suggestions": an object with:
  - "transitTip": a helpful transit/getting-there tip for this location (string or null)
  - "suggestedQuestions": 1-2 useful RSVP questions for attendees (array of strings, max 2)

Only return valid JSON, no markdown.`;

    const result = await generateStructured<EnhanceResult>(prompt);

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI enhance error:', error);
    return NextResponse.json(
      { error: 'AI enhancement failed. Please try again.' },
      { status: 500 }
    );
  }
}
