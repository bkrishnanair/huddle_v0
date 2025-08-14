"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Users } from "lucide-react"
import { signInWithGoogle } from "@/lib/auth"
import { createUser } from "@/lib/db"

interface AuthScreenProps {
  onLogin: (user: any) => void
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>, isLogin: boolean) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    try {
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import("firebase/auth")
      const { getFirebaseAuth } = await import("@/lib/firebase")

      const auth = getFirebaseAuth()
      if (!auth) {
        throw new Error("Firebase Auth is not initialized")
      }

      let userCredential
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password)
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
        // Create user profile in database for new signups
        await createUser(userCredential.user.uid, {
          email: userCredential.user.email!,
          name: name,
        })
      }

      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: name || userCredential.user.displayName || "User",
      }

      onLogin(user)
    } catch (error: any) {
      console.error("Auth error:", error)

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password")
      } else if (error.code === "auth/email-already-in-use") {
        setError("Email is already registered")
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters")
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.")
      } else {
        setError("Authentication failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError("")

    try {
      const user = await signInWithGoogle()
      onLogin(user)
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      setError(error.message || "Google sign-in failed. Please try again.")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen liquid-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl floating"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl floating"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl floating"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 glass-card rounded-full mb-4 glow floating">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Huddle</h1>
          <p className="text-white/80 drop-shadow">Find and join pickup sports games near you</p>
        </div>

        <Card className="glass-card border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-white">Welcome to Huddle</CardTitle>
            <CardDescription className="text-center text-white/80">
              Sign in to discover games in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full glass hover:glass-card text-white border-white/30 transition-all duration-300 hover:scale-105 bg-transparent"
                variant="outline"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isGoogleLoading ? "Signing in..." : "Continue with Google"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="glass px-2 text-white/80 rounded">Or continue with email</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass border-white/30">
                <TabsTrigger
                  value="login"
                  className="text-white data-[state=active]:glass-card data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-white data-[state=active]:glass-card data-[state=active]:text-white"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={(e) => handleAuth(e, true)} className="space-y-4">
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      required
                      className="w-full glass border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      required
                      className="w-full glass border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  {error && <p className="text-sm text-red-300 text-center bg-red-500/20 rounded p-2">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full glass-card hover:glow text-white border-white/30 transition-all duration-300 hover:scale-105"
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={(e) => handleAuth(e, false)} className="space-y-4">
                  <div>
                    <Input
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      required
                      className="w-full glass border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      required
                      className="w-full glass border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      required
                      className="w-full glass border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  {error && <p className="text-sm text-red-300 text-center bg-red-500/20 rounded p-2">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full glass-card hover:glow text-white border-white/30 transition-all duration-300 hover:scale-105"
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="glass-card rounded-lg p-4 floating hover:scale-105 transition-all duration-300">
            <MapPin className="w-6 h-6 text-white mx-auto mb-2" />
            <p className="text-sm text-white/80">Find games nearby</p>
          </div>
          <div
            className="glass-card rounded-lg p-4 floating hover:scale-105 transition-all duration-300"
            style={{ animationDelay: "2s" }}
          >
            <Users className="w-6 h-6 text-white mx-auto mb-2" />
            <p className="text-sm text-white/80">Join the community</p>
          </div>
        </div>
      </div>
    </div>
  )
}
