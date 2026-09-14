import 'server-only';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Huddle to join events, follow organizers, and manage your plans.",
  robots: { index: false, follow: false },
};

export default function RouteLayout({ children }: { children: ReactNode }) {
  return children;
}
