"use client"

import { useState } from "react"
import { useAuth } from "@/lib/firebase-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Mail } from "lucide-react"

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
  const [showVerifyBanner, setShowVerifyBanner] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleAuthAction = async (action: "login" | "signup") => {
    setIsLoading(true)
    setError(null)
    try {
      let authUser
      if (action === "signup") {
        authUser = await signUpWithEmail(email, password, name)
        setShowVerifyBanner(true)
      } else {
        authUser = await signInWithEmail(email, password)
      }
      onLogin(authUser)
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const authUser = await signInWithGoogle()
      onLogin(authUser)
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.")
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return (
      <div className="p-8 text-center bg-slate-900 rounded-sheet border border-white/10">
        <Loader2 className="w-6 h-6 animate-spin text-teal-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-white">You are already signed in. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="w-full p-8">
      {/* Back button if landing callback provided */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to map
        </button>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-control bg-teal-500/20 text-teal-400 font-black text-lg mb-3">
          H
        </div>
        <h2 className="font-display text-2xl font-bold text-white tracking-tight">
          Welcome to Huddle
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          The live map for campus events and pickup games
        </p>
      </div>

      {showVerifyBanner && (
        <div className="mb-5 bg-emerald-500/20 border border-emerald-500/25 rounded-chip p-3.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold text-xs mb-1">
            <Mail className="w-3.5 h-3.5" /> Check your email
          </div>
          <p className="text-xs text-slate-300">
            We sent a verification link to <span className="font-semibold text-white">{email}</span>.
          </p>
        </div>
      )}

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-white/10 rounded-control p-1 h-auto mb-5">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-400 text-xs font-medium rounded-chip py-2 transition-all"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-400 text-xs font-medium rounded-chip py-2 transition-all"
          >
            Create Account
          </TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          {/* Google Sign In */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            variant="outline"
            className="w-full h-11 border-white/10 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-control shadow-sm transition-all flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[11px] font-mono uppercase tracking-wider">
              <span className="px-3 bg-slate-900 text-slate-400">or continue with email</span>
            </div>
          </div>

          {/* Login Tab Form */}
          <TabsContent value="login" className="space-y-3.5 mt-0">
            <div className="space-y-1.5">
              <Label htmlFor="email-login" className="text-xs font-medium text-slate-300">
                Email address
              </Label>
              <Input
                id="email-login"
                type="email"
                placeholder="student@umd.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 bg-paper border-white/10 text-white placeholder:text-white-4 text-sm rounded-chip focus:border-action focus:ring-1 focus:ring-action/20"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password-login" className="text-xs font-medium text-slate-300">
                  Password
                </Label>
              </div>
              <Input
                id="password-login"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 bg-paper border-white/10 text-white placeholder:text-white-4 text-sm rounded-chip focus:border-action focus:ring-1 focus:ring-action/20"
              />
            </div>
            <Button
              type="button"
              onClick={() => handleAuthAction("login")}
              disabled={isLoading || !email || !password}
              className="w-full h-11 rounded-control bg-teal-600 hover:bg-teal-500 text-white text-white font-medium text-sm shadow-sm transition-all active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </TabsContent>

          {/* Sign Up Tab Form */}
          <TabsContent value="signup" className="space-y-3.5 mt-0">
            <div className="space-y-1.5">
              <Label htmlFor="name-signup" className="text-xs font-medium text-slate-300">
                Your Name
              </Label>
              <Input
                id="name-signup"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 bg-paper border-white/10 text-white placeholder:text-white-4 text-sm rounded-chip focus:border-action focus:ring-1 focus:ring-action/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email-signup" className="text-xs font-medium text-slate-300">
                Email address
              </Label>
              <Input
                id="email-signup"
                type="email"
                placeholder="student@umd.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 bg-paper border-white/10 text-white placeholder:text-white-4 text-sm rounded-chip focus:border-action focus:ring-1 focus:ring-action/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password-signup" className="text-xs font-medium text-slate-300">
                Password
              </Label>
              <Input
                id="password-signup"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 bg-paper border-white/10 text-white placeholder:text-white-4 text-sm rounded-chip focus:border-action focus:ring-1 focus:ring-action/20"
              />
            </div>
            <Button
              type="button"
              onClick={() => handleAuthAction("signup")}
              disabled={isLoading || !email || !password}
              className="w-full h-11 rounded-control bg-teal-600 hover:bg-teal-500 text-white text-white font-medium text-sm shadow-sm transition-all active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </TabsContent>

          {/* Guest fallback button */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              if (onLogin) onLogin(null);
              router.push('/map');
            }}
            disabled={isLoading}
            className="w-full h-10 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium rounded-control"
          >
            Continue as Guest without signing in
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-chip p-3 text-center">
              {error}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
