"use client"

import React from "react"
import Link from "next/link"
import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 px-4 text-center">
      <div className="bg-slate-900/50 p-6 rounded-full border border-slate-800 mb-6">
        <WifiOff className="w-12 h-12 text-slate-400" />
      </div>
      
      <h1 className="text-2xl font-bold text-white mb-2">You're Offline</h1>
      
      <p className="text-slate-400 max-w-md mb-8">
        It looks like you've lost your internet connection. Huddle requires an active connection to view live events and maps.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button 
          onClick={() => typeof window !== 'undefined' && window.location.reload()}
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
