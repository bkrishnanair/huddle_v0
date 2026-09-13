"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HuddleLogo } from "./huddle-logo"
import { NotificationBell } from "./notification-bell"
import { Sun, Moon, Search, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import LocationSearchInput from "./location-search"
import { Button } from "./ui/button"

export function TopNavbar() {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isAiSearching, setIsAiSearching] = useState(false)

    // Wait until mounted to avoid hydration mismatch with theme
    useEffect(() => {
        setMounted(true)
    }, [])

    const isMapPage = pathname === "/map"
    const showSearch = isMapPage

    const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
        // Dispatch a custom event for the MapView to catch
        window.dispatchEvent(new CustomEvent('huddle-map-search', { detail: { place } }));
    }

    const handleAiSearch = (query: string) => {
        setIsAiSearching(true)
        window.dispatchEvent(new CustomEvent('huddle-map-ai-search', { detail: { query } }));
        // Simulate end of search or listen for finish event
        setTimeout(() => setIsAiSearching(false), 2000)
    }

    return (
        <header className="fixed top-[max(0.75rem,env(safe-area-inset-top))] inset-x-3 max-w-[1800px] mx-auto z-40 h-16 bg-canvas/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl pointer-events-auto transition-colors sm:inset-x-4">
            <div className="h-full px-4 flex items-center justify-between gap-3">
                {/* Logo Section */}
                <Link href="/home" className="flex min-h-11 items-center gap-2.5 shrink-0">
                    <HuddleLogo size={32} />
                    <span className="font-display text-2xl font-bold text-white tracking-tight">huddle<span className="text-orange-400">.</span></span>
                </Link>

                {/* Search Bar Integration (Cross-Platform) */}
                <div className="hidden md:flex flex-1 max-w-4xl px-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
                    {/* Location Search */}
                    <div className="flex-1 min-w-0 relative group">
                        <div className="absolute inset-0 bg-teal-500/10 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative h-11 bg-white/5 rounded-2xl border border-white/10 p-px flex items-center group-focus-within:border-teal-500/70 transition-all">
                            <Search className="w-4 h-4 ml-3 text-slate-400 dark:text-slate-400 group-focus-within:text-teal-500 transition-colors shrink-0" />
                            <div className="flex-1 h-full flex items-center pr-2">
                                <LocationSearchInput
                                    onPlaceSelect={handlePlaceSelect}
                                    onAiSearch={handleAiSearch}
                                    className="bg-transparent !border-0 !ring-0 !outline-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[14px] h-full placeholder:text-slate-500 dark:placeholder:text-slate-400 text-slate-100 font-medium"
                                />
                            </div>
                            {isAiSearching && (
                                <div className="flex items-center gap-1.5 mr-3">
                                    <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Event Text Search */}
                    <div className="flex-1 min-w-0 relative group shrink-0">
                        <div className="absolute inset-0 bg-teal-500/10 rounded-xl blur-xl opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative h-11 bg-white/5 rounded-2xl border border-white/10 p-px flex items-center hover:border-teal-500/50 focus-within:border-teal-500/70 transition-all">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                aria-label="Search events on the map"
                                placeholder="Search events"
                                className="w-full h-full pl-9 pr-3 bg-transparent !border-0 !ring-0 !outline-none text-[14px] text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 font-medium transition-all rounded-xl"
                                onChange={(e) => {
                                    window.dispatchEvent(new CustomEvent('huddle-text-search', { detail: { query: e.target.value } }));
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Items */}
                <div className="flex items-center gap-2 shrink-0">
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            aria-label={theme === 'dark' ? 'Use a light map' : 'Use a dark map'}
                            className="w-11 h-11 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                    )}
                    <NotificationBell />
                </div>
            </div>
        </header>
    )
}
