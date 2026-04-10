import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getServerCurrentUser } from '@/lib/auth-server';
import { generateStructured } from '@/lib/gemini';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const parseScheduleSchema = z.object({
  rawText: z.string().min(10, 'Schedule text must be at least 10 characters'),
});

interface ParsedEvent {
  title: string;
  date: string;    // YYYY-MM-DD
  time: string;    // HH:mm
  endTime?: string;
  location: string;
  category: string;
  description: string;
  capacity: number;
}

/**
 * POST /api/ai/parse-schedule
 * 
 * Uses Gemini to parse raw schedule text (pasted by organizers)
 * into structured event data for bulk creation.
 */
export async function POST(request: NextRequest) {
  const user = await getServerCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();
  const validation = parseScheduleSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const { rawText } = validation.data;

  const systemPrompt = `You are a campus event schedule parser. Extract structured event data from the raw text.

Rules:
- Return a JSON object with a single key "events" containing an array of event objects.
- Each event must have: title (string), date (YYYY-MM-DD), time (HH:mm, 24-hour format), endTime (HH:mm, optional), location (string), category (one of: Sports, Music, Community, Learning, Food & Drink, Tech, Arts & Culture, Outdoors), description (brief, max 200 chars), capacity (number, default 50 if not specified).
- If the year is ambiguous, assume ${new Date().getFullYear()}.
- If multiple events share the same title but different dates, create separate entries for each.
- For weekly recurring patterns (e.g. "every Monday"), generate the next 8 occurrences.
- If no time is specified, default to 18:00.
- If no location is specified, use "TBD".
- Be generous with category inference from context clues.`;

  try {
    const result = await generateStructured<{ events: ParsedEvent[] }>(
      `Parse this schedule:\n\n${rawText}`,
      systemPrompt,
      { maxOutputTokens: 4096, temperature: 0.3 }
    );

    const events = result.events || [];

    return NextResponse.json({
      events,
      count: events.length,
    });
  } catch (error) {
    console.error('Schedule parsing failed:', error);
    return NextResponse.json({ error: 'Failed to parse schedule. Please try again.' }, { status: 500 });
  }
}
