import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { FirebaseProvider } from "@/lib/firebase-context"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "@/components/ui/sonner"
import { PWARegister } from "@/components/pwa-register"
import { InstallPrompt } from "@/components/install-prompt"
import { PushPermissionPrompt } from "@/components/push-permission-prompt"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={`${inter.className} tracking-tight`}>
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
