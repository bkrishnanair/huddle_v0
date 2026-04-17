import { MetadataRoute } from 'next';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const adminDb = getFirebaseAdminDb();
  if (!adminDb) return [];

  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch active, future/today events
    const snapshot = await adminDb.collection('events')
      .where('date', '>=', today)
      .limit(1000)
      .get();

    const baseUrl = 'https://huddlemap.live';

    const events: MetadataRoute.Sitemap = snapshot.docs
      .filter((doc) => !doc.data().isPrivate) // Don't index private events
      .map((doc) => {
        const data = doc.data();
        let lastMod = new Date();
        try {
            if (data.createdAt) {
                lastMod = data.createdAt.toDate();
            }
        } catch { } // fallback to now if not a Timestamp

        return {
          url: `${baseUrl}/event/${doc.id}`,
          lastModified: lastMod,
          changeFrequency: 'daily' as const,
          priority: 0.8,
        };
      });

    // Add static routes
    const routes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      ...events,
    ];

    return routes;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [];
  }
}
