import 'server-only'
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, IBM_Plex_Mono, Bricolage_Grotesque } from "next/font/google"
import "./globals.css"
import { FirebaseProvider } from "@/lib/firebase-context"
import { SiteAnalytics } from "@/components/site-analytics"
import { Toaster } from "@/components/ui/sonner"
import { PWARegister } from "@/components/pwa-register"
import { InstallPrompt } from "@/components/install-prompt"
import { PushPermissionPrompt } from "@/components/push-permission-prompt"

// Shared body, numeral, and display fonts for landing and app surfaces.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono",
})

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://huddlemap.live'
  ),
  title: {
    default: "Huddle — The Live Map for Campus Events",
    template: "%s | Huddle",
  },
  description: "See what's happening around campus right now. Live events, student meetups, and pickup games near you — no app, no account required.",
  openGraph: {
    title: "Huddle — The Live Map for Campus Events",
    description: "See what's happening around campus right now. Live events, student meetups, and pickup games near you — no app, no account required.",
    url: "https://huddlemap.live",
    siteName: "Huddle",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Huddle — The Live Map for Campus Events",
    description: "See what's happening around campus right now. Live events, student meetups, and pickup games near you — no app, no account required.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Huddle",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B101B",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plexMono.variable} ${bricolage.variable} ${inter.className} antialiased selection:bg-orange-500/30 [&_button]:min-h-11 [&_button]:min-w-11`}>
        <FirebaseProvider>
          <PWARegister />
          <InstallPrompt />
          <PushPermissionPrompt />
          {children}
          <Toaster />
          <SiteAnalytics />
        </FirebaseProvider>
      </body>
    </html>
  )
}
