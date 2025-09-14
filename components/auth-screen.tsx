"use client"

import { useState } from "react"
import { useAuth } from "@/lib/firebase-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth"

interface AuthScreenProps {
  onLogin: (user?: any) => void
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
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
      await signInWithGoogle()
      // Redirect is handled by the browser and our LoginPage, so no need to call onLogin here.
    } catch (err: any) {
      setError(err.message)
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
    <div className="p-6 glass-card rounded-2xl border border-white/20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Find Your Huddle
        </h2>
        <p className="text-md text-white/80">
          Login or create an account to get started.
        </p>
      </div>

      <Tabs defaultValue="login" className="w-full">
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
              {isLoading ? 'Redirecting...' : 'Continue with Google'}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900/10 px-2 text-white/70 backdrop-blur-sm">Or continue with email</span>
              </div>
            </div>

            <TabsContent value="login" className="space-y-4 m-0">
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
                className="w-full bg-blue-600 hover:bg-blue-500 text-white"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 m-0">
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
                className="w-full bg-blue-600 hover:bg-blue-500 text-white"
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
