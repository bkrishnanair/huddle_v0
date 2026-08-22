import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, IBM_Plex_Mono, Bricolage_Grotesque } from "next/font/google"
import "./globals.css"
import { FirebaseProvider } from "@/lib/firebase-context"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "@/components/ui/sonner"
import { PWARegister } from "@/components/pwa-register"
import { InstallPrompt } from "@/components/install-prompt"
import { PushPermissionPrompt } from "@/components/push-permission-prompt"

// Body voice. `variable` exposes --font-inter to the Instrument token layer;
// `className` is kept so existing surfaces render exactly as before.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

// Numeral voice — times, distances, counts, show rates (CLAUDE.md). Loaded as
// a variable only: nothing applies it globally, so no existing surface changes.
// Bricolage Grotesque is deliberately NOT loaded here. It is display type used
// only by the marketing landing page, and the app routes already sit near
// 400 kB First Load JS. It is declared at the landing route instead.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono",
})

// Display voice — marketing headlines only (landing page). Declared here because
// next/font cannot be called from a "use client" module and app/page.tsx is one.
// Declaring it costs nothing on app routes: next/font emits an @font-face rule,
// and a browser never downloads a face no rendered element actually uses.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Huddle - Find Pickup Sports Games",
  description: "Find and join pickup sports games in your local community",
  generator: 'v.dev',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Huddle",
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0D9488",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plexMono.variable} ${bricolage.variable} ${inter.className} tracking-tight`}>
        <FirebaseProvider>
          <PWARegister />
          <InstallPrompt />
          <PushPermissionPrompt />
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </FirebaseProvider>
      </body>
    </html>
  )
}
