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
        <header className="fixed top-4 inset-x-4 max-w-[1800px] mx-auto z-[100] h-16 glass-surface border border-foreground/5 dark:border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(0,0,0,0.6)] pointer-events-auto">
            <div className="h-full px-4 flex items-center justify-between gap-4">
                {/* Logo Section */}
                <Link href="/home" className="flex items-center gap-3 shrink-0">
                    <HuddleLogo size={32} />
                    <span className="text-2xl font-black bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent tracking-tighter">Huddle</span>
                </Link>

                {/* Search Bar Integration (Cross-Platform) */}
                <div className="hidden md:flex flex-1 max-w-4xl px-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
                    {/* Location Search */}
                    <div className="flex-1 min-w-0 relative group">
                        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative h-[38px] bg-black/5 dark:bg-slate-900/60 backdrop-blur-2xl rounded-xl border border-black/5 dark:border-white/10 p-[1px] flex items-center group-focus-within:border-primary/50 transition-all">
                            <Search className="w-4 h-4 ml-3 text-slate-500 group-focus-within:text-primary transition-colors shrink-0" />
                            <div className="flex-1 h-full flex items-center pr-2">
                                <LocationSearchInput
                                    onPlaceSelect={handlePlaceSelect}
                                    onAiSearch={handleAiSearch}
                                    className="bg-transparent !border-0 !ring-0 !outline-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[14px] h-full placeholder:text-slate-500 text-foreground"
                                />
                            </div>
                            {isAiSearching && <Loader2 className="w-4 h-4 text-primary animate-spin mr-3" />}
                        </div>
                    </div>

                    {/* Event Text Search */}
                    <div className="flex-1 min-w-0 relative group shrink-0">
                        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative h-[38px] bg-black/5 dark:bg-slate-900/60 backdrop-blur-2xl rounded-xl border border-black/5 dark:border-white/10 p-[1px] flex items-center hover:border-primary/50 focus-within:border-primary/50 transition-all">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search by Event"
                                className="w-full h-full pl-9 pr-3 bg-transparent !border-0 !ring-0 !outline-none text-[14px] text-foreground placeholder:text-slate-500 transition-all rounded-xl"
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
                            className="w-10 h-10 rounded-xl text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
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
