"use client"

import AuthScreen from "@/components/auth-screen"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md bg-sheet border border-line rounded-sheet shadow-raised p-6 sm:p-8 relative overflow-hidden">
                <AuthScreen
                    onLogin={() => router.push("/map")}
                    onBackToLanding={() => router.push("/")}
                />
            </div>
        </div>
    )
}
