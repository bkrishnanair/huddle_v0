"use client"

import { useRouter } from "next/navigation"
import { useFirebase } from "@/lib/firebase-context"
import { Button } from "@/components/ui/button"
import { LockIcon } from "lucide-react"

interface GuestPromptProps {
  title?: string
  message?: string
}

export default function GuestPrompt({ 
  title = "Sign In Required",
  message = "This feature is only available to registered users. Create an account or sign in to access this page."
}: GuestPromptProps) {
  const { exitGuestMode } = useFirebase()
  const router = useRouter()

  const handleSignIn = () => {
    exitGuestMode()
    router.push("/")
  }

  return (
    <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <LockIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            {title}
          </h2>
          <p className="text-white/70 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleSignIn}
            className="w-full bg-white text-black hover:bg-white/90 font-semibold"
          >
            Login or Create Account
          </Button>
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="w-full text-white hover:bg-white/10"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
