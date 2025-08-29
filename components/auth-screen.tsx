"use client";

import { useState } from "react";
import { useAuth } from "@/lib/firebase-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth"; // SOCIAL: Import the new function
import { ArrowLeft } from "lucide-react";

interface AuthScreenProps {
  onLogin: (user: any) => void;
  onBackToLanding?: () => void;
}

export default function AuthScreen({ onLogin, onBackToLanding }: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleAuthAction = async (action: 'login' | 'signup') => {
    setIsLoading(true);
    setError(null);
    try {
      let user;
      if (action === 'signup') {
        user = await signUpWithEmail(email, password, name);
      } else {
        user = await signInWithEmail(email, password);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // SOCIAL: This function handles the Google Sign-In button click.
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  if (user) {
    // This case might not be hit if the parent component handles redirection,
    // but it's good practice for component independence.
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
        <p>You are already logged in. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Landing Button */}
        {onBackToLanding && (
          <div className="mb-4">
            <Button 
              variant="ghost" 
              onClick={onBackToLanding}
              className="text-white/70 hover:text-white hover:bg-white/20 rounded-full px-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Landing
            </Button>
          </div>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20 rounded-lg p-1 h-auto">
            <TabsTrigger value="login" className="data-[state=active]:bg-white/20 data-[state=active]:shadow-md">Login</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-white/20 data-[state=active]:shadow-md">Sign Up</TabsTrigger>
          </TabsList>
          <Card className="glass-card border-none mt-4">
            <CardContent className="pt-6">
              {/* SOCIAL: The Google Sign-In button is added here, above the email forms. */}
              <div className="space-y-4">
                <Button onClick={handleGoogleSignIn} className="w-full bg-white/90 text-black hover:bg-white" disabled={isLoading}>
                  {/* A simple Google logo SVG could go here */}
                  Continue with Google
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/30" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-white/70 glass-card-no-bg">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Login Tab */}
                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login" className="text-white/90">Email</Label>
                    <Input id="email-login" type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} className="glass border-white/30 text-white placeholder:text-white/60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login" className="text-white/90">Password</Label>
                    <Input id="password-login" type="password" value={password} onChange={e => setPassword(e.target.value)} className="glass border-white/30 text-white" />
                  </div>
                  <Button onClick={() => handleAuthAction('login')} disabled={isLoading} className="w-full glass-card hover:glow text-white border-white/30">
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </TabsContent>

                {/* Sign Up Tab */}
                <TabsContent value="signup" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name-signup" className="text-white/90">Name</Label>
                    <Input id="name-signup" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="glass border-white/30 text-white placeholder:text-white/60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="text-white/90">Email</Label>
                    <Input id="email-signup" type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} className="glass border-white/30 text-white placeholder:text-white/60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="text-white/90">Password</Label>
                    <Input id="password-signup" type="password" value={password} onChange={e => setPassword(e.target.value)} className="glass border-white/30 text-white" />
                  </div>
                  <Button onClick={() => handleAuthAction('signup')} disabled={isLoading} className="w-full glass-card hover:glow text-white border-white/30">
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </TabsContent>
                
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
