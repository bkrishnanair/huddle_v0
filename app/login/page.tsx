"use client"

import AuthScreen from "@/components/auth-screen"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-surface border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
                <AuthScreen
                    onLogin={() => router.push("/discover")}
                />
            </div>
        </div>
    )
}
