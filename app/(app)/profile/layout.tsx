import 'server-only';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Your profile",
  description: "Manage your Huddle profile, interests, and account preferences.",
  robots: { index: false, follow: false },
};

export default function RouteLayout({ children }: { children: ReactNode }) {
  return children;
}
