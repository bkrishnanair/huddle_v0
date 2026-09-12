"use client"

import AuthScreen from "@/components/auth-screen"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()

    return (
        <div className="min-h-dvh bg-canvas bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08),transparent_60%)] flex items-center justify-center px-4 py-8 sm:p-6">
            <div className="w-full max-w-md bg-panel/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
                <AuthScreen
                    onLogin={() => router.push("/map")}
                    onBackToLanding={() => router.push("/")}
                />
            </div>
        </div>
    )
}
