import 'server-only';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Discover local events",
  description: "Browse upcoming campus events, local activities, and organizers on Huddle. Filter by category, time, and distance.",
  alternates: { canonical: '/discover' },
};

export default function RouteLayout({ children }: { children: ReactNode }) {
  return children;
}
