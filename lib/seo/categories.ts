/** Public taxonomy only. Safe to import in the marketing footer. */
export const DIRECTORY_CATEGORIES = [
  { slug: 'sports', name: 'Sports', description: 'Find pickup games, recreational sports, and ways to get moving with other students.' },
  { slug: 'music', name: 'Music', description: 'Explore concerts, open mics, rehearsals, and campus music gatherings.' },
  { slug: 'community', name: 'Community', description: 'Meet campus organizations and discover social gatherings, volunteering, and community events.' },
  { slug: 'learning', name: 'Learning', description: 'Find study sessions, talks, workshops, and opportunities to learn together.' },
  { slug: 'food-and-drink', name: 'Food & Drink', description: 'Discover food meetups, campus dining events, and shared meals.' },
  { slug: 'tech', name: 'Tech', description: 'Explore technology meetups, coding events, demos, and student innovation.' },
  { slug: 'arts-and-culture', name: 'Arts & Culture', description: 'Find dance, performances, exhibitions, and cultural events around campus.' },
  { slug: 'outdoors', name: 'Outdoors', description: 'Find outdoor activities and opportunities to explore with other students.' },
] as const;

export const findDirectoryCategory = (slug: string) => DIRECTORY_CATEGORIES.find(category => category.slug === slug);
