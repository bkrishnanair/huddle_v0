import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Huddle — The Live Campus Event Map',
    short_name: 'Huddle',
    description: 'Find and join live campus events, pickup games, and study groups.',
    start_url: '/map?source=pwa',
    scope: '/',
    id: '/?source=pwa',
    display: 'standalone',
    display_override: ['standalone', 'window-controls-overlay'],
    orientation: 'portrait',
    background_color: '#0B101B', // V2 canvas
    theme_color: '#0B101B', // V2 canvas
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['social', 'events', 'education'],
  };
}
