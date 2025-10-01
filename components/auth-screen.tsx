"use client"

import { useState } from "react"
import { useAuth, useFirebase } from "@/lib/firebase-context" // Import useFirebase
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
  const [prefersGoogleSignIn, setPrefersGoogleSignIn] = useState(false)
  const { user } = useAuth()
  const { enterGuestMode } = useFirebase() // Get the function to enter guest mode

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
      if (err.code === 'auth/popup-blocked') {
        setError("Popup blocked. Please enable popups for this site and try again.")
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled. The Google sign-in window was closed.")
      } else {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  // New handler for guest mode
  const handleGuestMode = () => {
    enterGuestMode()
    // We can call onLogin with a guest object if needed, or handle navigation elsewhere
    onLogin({ isGuest: true }) 
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
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
          Stop Searching, Start Playing. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Find Your Huddle.</span>
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
          Discover and join local sports games in real-time. Connect with players, organize events effortlessly, and never miss a moment of the action.
        </p>
      </div>

      <div className="w-full max-w-sm mx-auto">
        {prefersGoogleSignIn ? (
          <div className="space-y-4 pt-6 text-center">
            <h3 className="text-xl font-semibold text-white">Confirm Your Sign-In</h3>
            <p className="text-white/70">Click the button below to open the Google Sign-In window.</p>
            <Button
              onClick={handleGoogleSignIn}
              className="w-full bg-green-500 text-white hover:bg-green-600 text-lg py-6 mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In with Google"}
            </Button>
            <Button
              variant="link"
              onClick={() => setPrefersGoogleSignIn(false)}
              className="w-full text-white/70"
              disabled={isLoading}
            >
              Use a different method
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20 rounded-lg p-1 h-auto">
              <TabsTrigger value="login" className="data-[state=active]:bg-white/20 data-[state=active]:shadow-md text-white">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white/20 data-[state=active]:shadow-md text-white">Sign Up</TabsTrigger>
            </TabsList>
            <div className="pt-6">
              <div className="space-y-4">
                <Button
                  onClick={() => setPrefersGoogleSignIn(true)}
                  className="w-full bg-white/90 text-black hover:bg-white"
                  disabled={isLoading}
                >
                  Continue with Google
                </Button>
                
                {/* New "Continue as Guest" button */}
                <Button
                  onClick={handleGuestMode}
                  className="w-full bg-transparent border border-white/30 text-white hover:bg-white/10"
                  disabled={isLoading}
                >
                  Continue as Guest
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/30" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-white/70">Or continue with email</span></div>
                </div>

                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login" className="text-white/90">Email</Label>
                    <Input id="email-login" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="glass border-white/30 text-white placeholder:text-white/60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login" className="text-white/90">Password</Label>
                    <Input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="glass border-white/30 text-white" />
                  </div>
                  <Button onClick={() => handleAuthAction("login")} disabled={isLoading} className="w-full glass-card hover:glow text-white border-white/30">
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </TabsContent>
                <TabsContent value="signup" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name-signup" className="text-white/90">Name</Label>
                    <Input id="name-signup" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="glass border-white/30 text-white placeholder:text-white/60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="text-white/90">Email</Label>
                    <Input id="email-signup" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="glass border-white/30 text-white placeholder:text-white/60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="text-white/90">Password</Label>
                    <Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="glass border-white/30 text-white" />
                  </div>
                  <Button onClick={() => handleAuthAction("signup")} disabled={isLoading} className="w-full glass-card hover:glow text-white border-white/30">
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        )}
        {error && <p className="text-red-400 text-sm text-center pt-4">{error}</p>}
      </div>
    </div>
  )
}
