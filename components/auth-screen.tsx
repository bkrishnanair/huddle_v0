"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/firebase-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth"
import { Loader2 } from "lucide-react"
import type { UserCredential } from "firebase/auth"

interface AuthScreenProps {
  onLogin: (user: any) => void
  onBackToLanding?: () => void
}

export default function AuthScreen({ onLogin, onBackToLanding }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  // This function will be called after a successful Firebase login
  const createSession = async (userCredential: UserCredential) => {
    const idToken = await userCredential.user.getIdToken();
    
    // Call our own backend to create a session cookie
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (res.ok) {
      // If the session was created successfully, call the onLogin prop
      onLogin(userCredential.user);
    } else {
      // If there was an error creating the session, show an error message
      setError("Failed to create a session. Please try again.");
    }
  };
  
  // Auto-login effect
  useEffect(() => {
    // Only trigger in login tab and when both fields are filled
    if (activeTab === 'login' && email && password.length >= 6) {
      // Small delay to allow user to finish typing
      const timer = setTimeout(() => {
        handleAuthAction("login");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [email, password, activeTab]);

  const handleAuthAction = async (action: "login" | "signup") => {
    // Prevent multiple submissions
    if (isLoading) return;

    setIsLoading(true)
    setError(null)
    try {
      let userCredential
      if (action === "signup") {
        userCredential = await signUpWithEmail(email, password, name)
      } else {
        userCredential = await signInWithEmail(email, password)
      }
      await createSession(userCredential); // Create session after login/signup
    } catch (err: any) {
      // Map Firebase error codes to more user-friendly messages
      let message = "An unexpected error occurred.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          message = "Invalid email or password. Please try again.";
      } else if (err.code === 'auth/email-already-in-use') {
          message = "An account with this email already exists.";
      }
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const userCredential = await signInWithGoogle()
      await createSession(userCredential); // Create session after Google sign-in
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    // This state is brief as onLogin should trigger a redirect
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
        <p>You are already logged in. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-50 mb-3 leading-tight drop-shadow-lg">
          Stop Searching, Start Playing.
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed drop-shadow">
          Discover and join local sports games in real-time. Connect with players, organize events effortlessly, and never miss a moment of the action.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-sm mx-auto">
        <TabsList className="grid w-full grid-cols-2 glass-surface p-1 h-auto">
          <TabsTrigger value="login" className="data-[state=active]:bg-white/10 data-[state=active]:shadow-md text-slate-200">
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" className="data-[state=active]:bg-white/10 data-[state=active]:shadow-md text-slate-200">
            Sign Up
          </TabsTrigger>
        </TabsList>

        <div className="pt-6">
          <div className="space-y-4">
            <Button onClick={handleGoogleSignIn} variant="secondary" className="w-full" disabled={isLoading}>
              Continue with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/20" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-400">Or continue with email</span></div>
            </div>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login" className="text-slate-300">Email</Label>
                <Input id="email-login" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-surface"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login" className="text-slate-300">Password</Label>
                <Input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-surface"/>
              </div>
              {/* Manual login button is hidden, but kept for accessibility or if auto-login fails */}
              <Button onClick={() => handleAuthAction("login")} disabled={isLoading} className="w-full sr-only">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
              </Button>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="name-signup" className="text-slate-300">Name</Label>
                 <Input id="name-signup" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="glass-surface"/>
               </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup" className="text-slate-300">Email</Label>
                <Input id="email-signup" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-surface"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup" className="text-slate-300">Password</Label>
                <Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-surface"/>
              </div>
              <Button onClick={() => handleAuthAction("signup")} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
              </Button>
            </TabsContent>
            
            {/* Display loading state or error message */}
            <div className="h-6 text-center">
                {isLoading && <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />}
                {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

          </div>
        </div>
      </Tabs>
    </div>
  )
}
