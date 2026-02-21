"use client"

import AuthScreen from "@/components/auth-screen"
import { useRouter } from "next/navigation"

export const dynamic = 'force-dynamic';

export default function SignupPage() {
    const router = useRouter()

    const handleLogin = (user: any) => {
        router.push("/map")
    }

    return (
        <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
            <div className="w-full max-w-4xl glass-card rounded-2xl overflow-hidden shadow-2xl">
                <AuthScreen onLogin={handleLogin} />
            </div>
        </div>
    )
}
