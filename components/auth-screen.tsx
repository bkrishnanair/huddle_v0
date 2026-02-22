"use client"

import { useState } from "react"
import { useAuth } from "@/lib/firebase-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth"

import { useRouter } from "next/navigation"

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
  const router = useRouter()

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
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
          Stop Searching, Start Playing.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-500 drop-shadow-sm">Find Your Huddle.</span>
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
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
              className="w-full bg-white/90 text-black hover:bg-white h-11 rounded-xl shadow-lg font-medium"
              disabled={isLoading}
            >
              Continue with Google
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (onLogin) onLogin(null); // Close modal
                router.push('/discover');
              }}
              className="w-full h-11 rounded-xl glass-surface border-white/10 hover:bg-white/10 text-white shadow-lg font-medium"
              disabled={isLoading}
            >
              Continue as Guest
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
                <span className="px-3 bg-slate-900 text-slate-500">Or continue with email</span>
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
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(234,88,12,0.3)] font-bold transition-all"
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
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(234,88,12,0.3)] font-bold transition-all"
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
