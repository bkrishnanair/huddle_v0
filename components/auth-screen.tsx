"use client"

import { useState } from "react"
import { useAuth } from "@/lib/firebase-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth"

interface AuthScreenProps {
  onLogin: (user: any) => void
  onBackToLanding?: () => void
}

export default function AuthScreen({ onLogin, onBackToLanding }: AuthScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleAuthAction = async (action: "login" | "signup") => {
    setIsLoading(true)
    setError(null)
    try {
      let user
      if (action === "signup") {
        user = await signUpWithEmail(email, password, name)
      } else {
        user = await signInWithEmail(email, password)
      }
      onLogin(user)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const user = await signInWithGoogle()
      onLogin(user)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
        <p>You are already logged in. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
          Stop Searching, Start Playing. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Find Your Huddle.</span>
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
          Discover and join local sports games in real-time. Connect with players, organize events effortlessly, and never miss a moment of the action.
        </p>
      </div>

      <Tabs defaultValue="login" className="w-full max-w-sm mx-auto">
        <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20 rounded-lg p-1 h-auto">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-white/20 data-[state=active]:shadow-md text-white"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="data-[state=active]:bg-white/20 data-[state=active]:shadow-md text-white"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        <div className="pt-6">
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full bg-white/90 text-black hover:bg-white"
              disabled={isLoading}
            >
              Continue with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-white/70">Or continue with email</span>
              </div>
            </div>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login" className="text-white/90">
                  Email
                </Label>
                <Input
                  id="email-login"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login" className="text-white/90">
                  Password
                </Label>
                <Input
                  id="password-login"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass border-white/30 text-white"
                />
              </div>
              <Button
                onClick={() => handleAuthAction("login")}
                disabled={isLoading}
                className="w-full glass-card hover:glow text-white border-white/30"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name-signup" className="text-white/90">
                  Name
                </Label>
                <Input
                  id="name-signup"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup" className="text-white/90">
                  Email
                </Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup" className="text-white/90">
                  Password
                </Label>
                <Input
                  id="password-signup"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass border-white/30 text-white"
                />
              </div>
              <Button
                onClick={() => handleAuthAction("signup")}
                disabled={isLoading}
                className="w-full glass-card hover:glow text-white border-white/30"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </TabsContent>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          </div>
        </div>
      </Tabs>
    </div>
  )
}
