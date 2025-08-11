import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { FirebaseProvider } from "@/lib/firebase-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Huddle - Find Pickup Sports Games",
  description: "Find and join pickup sports games in your local community",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>{children}</FirebaseProvider>
      </body>
    </html>
  )
}
