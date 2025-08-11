"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Users } from "lucide-react"

interface AuthScreenProps {
  onLogin: (user: any) => void
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
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
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup"
      const body = isLogin ? { email, password } : { email, password, name }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        onLogin(data.user)
      } else {
        setError(data.error || "Authentication failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Huddle</h1>
          <p className="text-gray-600">Find and join pickup sports games near you</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome to Huddle</CardTitle>
            <CardDescription className="text-center">Sign in to discover games in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={(e) => handleAuth(e, true)} className="space-y-4">
                  <div>
                    <Input name="email" type="email" placeholder="Email" required className="w-full" />
                  </div>
                  <div>
                    <Input name="password" type="password" placeholder="Password" required className="w-full" />
                  </div>
                  {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={(e) => handleAuth(e, false)} className="space-y-4">
                  <div>
                    <Input name="name" type="text" placeholder="Full Name" required className="w-full" />
                  </div>
                  <div>
                    <Input name="email" type="email" placeholder="Email" required className="w-full" />
                  </div>
                  <div>
                    <Input name="password" type="password" placeholder="Password" required className="w-full" />
                  </div>
                  {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/50 rounded-lg p-4">
            <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Find games nearby</p>
          </div>
          <div className="bg-white/50 rounded-lg p-4">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Join the community</p>
          </div>
        </div>
      </div>
    </div>
  )
}
