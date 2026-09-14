import 'server-only';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "You are offline",
  description: "Reconnect to browse the latest events on Huddle.",
  robots: { index: false, follow: false },
};

export default function RouteLayout({ children }: { children: ReactNode }) {
  return children;
}
