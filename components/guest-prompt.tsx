"use client"

import { useFirebase } from "@/lib/firebase-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface GuestPromptProps {
  title: string
  message: string
}

export default function GuestPrompt({ title, message }: GuestPromptProps) {
  const { exitGuestMode } = useFirebase()
  const router = useRouter()

  const handleLoginRedirect = () => {
    // Exit guest mode, which will trigger the redirect in the layout
    exitGuestMode()
    // For immediate feedback, we can also push the router here
    router.push("/")
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] text-center p-4">
      <div className="glass-card p-8 rounded-xl max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-white/80 mb-6">{message}</p>
        <Button
          onClick={handleLoginRedirect}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3"
        >
          Login or Create Account
        </Button>
      </div>
    </div>
  )
}
