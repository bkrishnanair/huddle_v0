import 'server-only';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Organizer dashboard",
  description: "Manage your organized events and attendance on Huddle.",
  robots: { index: false, follow: false },
};

export default function RouteLayout({ children }: { children: ReactNode }) {
  return children;
}
