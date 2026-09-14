import 'server-only';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Huddle account to join events and connect with your community.",
  robots: { index: false, follow: false },
};

export default function RouteLayout({ children }: { children: ReactNode }) {
  return children;
}
