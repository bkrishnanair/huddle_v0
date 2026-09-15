/** Prefer specific categories over a broad Social/Club label. */
export function classifyTerpLinkEvent(categories: string[], title: string): string {
  const rules: [string, RegExp][] = [
    ['Music', /\b(music|concert|choir|choral|rehearsal|orchestra|jazz|band)\b/i],
    ['Arts & Culture', /\b(dance|dancing|swing|salsa|art|arts|culture|cultural|theatre|theater|gallery|film)\b/i],
    ['Sports', /\b(sport|sports|athletics|basketball|soccer|volleyball|running|run club|fitness|yoga|workout)\b/i],
    ['Tech', /\b(technology|hackathon|coding|programming|software|robotics|cybersecurity)\b/i],
    ['Outdoors', /\b(hiking|hike|outdoor|outdoors|camping|nature|kayaking)\b/i],
    ['Food & Drink', /\b(food|cooking|dining|baking|potluck|brunch)\b/i],
    ['Learning', /\b(academic|workshop|lecture|study|research|career|seminar)\b/i],
  ];
  for (const text of [categories.join(' '), title]) {
    const match = rules.find(([, pattern]) => pattern.test(text));
    if (match) return match[0];
  }
  return 'Community';
}
