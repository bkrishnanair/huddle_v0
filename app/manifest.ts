import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Huddle — Live Campus Event Map',
    short_name: 'Huddle',
    description: 'Find and join live campus events, pickup games, and study groups.',
    start_url: '/map',
    display: 'standalone',
    background_color: '#020617', // tailwind slate-950
    theme_color: '#0D9488', // tailwind teal-600
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
