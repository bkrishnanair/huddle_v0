import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { generateStructured } from '@/lib/gemini';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const searchSchema = z.object({
  query: z.string().min(2, 'Search query is required').max(200),
  userLat: z.number().optional(),
  userLng: z.number().optional(),
});

interface ParsedFilters {
  categories?: string[];
  timeFilter?: 'live' | 'today' | 'this_week' | 'this_weekend' | 'this_month';
  keywords?: string[];
  maxDistance?: number; // in miles
  eventType?: 'in-person' | 'virtual' | 'hybrid';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = searchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { query, userLat, userLng } = validation.data;

    const prompt = `You are a search query parser for a campus event discovery platform called Huddle.

The user typed: "${query}"

Parse this natural language query into structured event filters. Available categories are:
Sports, Music, Community, Learning, Food & Drink, Tech, Arts & Culture, Outdoors

Available time filters: live, today, this_week, this_weekend, this_month

Return a JSON object with these optional fields:
- "categories": array of matching category names (from the list above, case-sensitive)
- "timeFilter": one of the time filter values above, or omit if not specified
- "keywords": array of search keywords to match against event names/descriptions
- "maxDistance": numeric distance in miles if the user mentions proximity, or omit
- "eventType": "in-person", "virtual", or "hybrid" if specified, or omit

Examples:
- "basketball game tonight" → {"categories":["Sports"],"timeFilter":"today","keywords":["basketball"]}
- "free food near me" → {"categories":["Food & Drink"],"keywords":["free"]}
- "something fun this weekend" → {"timeFilter":"this_weekend","keywords":["fun"]}
- "coding workshop" → {"categories":["Tech","Learning"],"keywords":["coding","workshop"]}
- "virtual study group" → {"categories":["Learning"],"eventType":"virtual","keywords":["study"]}

Only return valid JSON, no markdown.`;

    const filters = await generateStructured<ParsedFilters>(prompt);

    return NextResponse.json({ filters });
  } catch (error) {
    console.error('AI search error:', error);
    return NextResponse.json(
      { error: 'AI search failed. Please try a regular search.' },
      { status: 500 }
    );
  }
}
