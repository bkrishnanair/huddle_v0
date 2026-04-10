"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/firebase-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, TrendingUp, Users, CalendarCheck, Download, BarChart3, AlertCircle, CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { format, subDays, isAfter, parseISO } from "date-fns";
import ScheduleImportModal from "@/components/schedule-import-modal";

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<30 | 60 | 90>(30); // days
    const [showImportModal, setShowImportModal] = useState(false);

    const fetchDashboardData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const idToken = await user.getIdToken();
            const res = await fetch(`/api/users/${user.uid}/dashboard?days=${timeRange}`, {
                headers: {
                    "Authorization": `Bearer ${idToken}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
            } else {
                toast.error("Failed to load dashboard data");
            }
        } catch (error) {
            console.error("Dashboard error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, [user, timeRange]);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        } else if (!authLoading) {
            router.push("/");
        }
    }, [user, authLoading, fetchDashboardData]);

    const handleExportCSV = async () => {
        if (!stats || !stats.events || stats.events.length === 0) {
            toast.error("No data to export");
            return;
        }

        try {
            const headers = ["Event Title", "Date", "Sport", "Max Capacity", "Total RSVPs", "Checked In", "No Shows"];
            const rows = stats.events.map((ev: any) => [
                `"${ev.title.replace(/"/g, '""')}"`,
                ev.date,
                ev.sport,
                ev.maxPlayers,
                ev.currentPlayers,
                ev.checkedInCount || 0,
                (ev.currentPlayers - (ev.checkedInCount || 0))
            ]);

            const csvContent = "data:text/csv;charset=utf-8,"
                + headers.join(",") + "\n"
                + rows.map((e: any[]) => e.join(",")).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `huddle_dashboard_export_${timeRange}days.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Dashboard exported successfully");
        } catch (e) {
            toast.error("Failed to generate CSV");
        }
    };


    if (authLoading || loading) {
        return (
            <div className="min-h-screen liquid-gradient p-4 md:p-6 pb-[var(--safe-bottom)] pt-10">
                <h1 className="text-3xl font-black text-white mb-6">Organizer Studio</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Skeleton className="h-32 rounded-xl bg-slate-800" />
                    <Skeleton className="h-32 rounded-xl bg-slate-800" />
                    <Skeleton className="h-32 rounded-xl bg-slate-800" />
                </div>
                <Skeleton className="h-64 rounded-xl bg-slate-800" />
            </div>
        );
    }

    return (
        <div className="min-h-screen liquid-gradient pb-[var(--safe-bottom)] pt-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            <BarChart3 className="text-primary w-8 h-8" /> Organizer Studio
                        </h1>
                        <p className="text-slate-400 mt-1">Track your community's growth and engagement.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setShowImportModal(true)}
                            className="bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-xl h-10 px-4 gap-2"
                        >
                            <CalendarPlus className="w-4 h-4" />
                            Import Schedule
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-auto bg-slate-900/50 p-1 rounded-xl border border-white/5">
                        {[30, 60, 90].map((days) => (
                            <Button
                                key={days}
                                variant={timeRange === days ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setTimeRange(days as 30 | 60 | 90)}
                                className={`rounded-lg font-bold text-xs ${timeRange === days ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                {days}D
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="glass-surface border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <CalendarCheck className="w-4 h-4 text-blue-400" /> Total Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-white tracking-tighter">{stats?.totalEvents || 0}</div>
                            <p className="text-xs text-slate-500 font-medium mt-1">In the last {timeRange} days</p>
                        </CardContent>
                    </Card>

                    <Card className="glass-surface border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-400" /> Total RSVPs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-white tracking-tighter">{stats?.totalRSVPs || 0}</div>
                            <p className="text-xs text-slate-500 font-medium mt-1">Across all events</p>
                        </CardContent>
                    </Card>

                    <Card className="glass-surface border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-purple-400" /> Show Rate (Avg)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-1">
                                <div className="text-4xl font-extrabold text-white tracking-tighter">{stats?.avgShowRate || 0}%</div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-1">Based on Organizer Check-Ins</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed List and Export */}
                <Card className="glass-surface border-white/10 shadow-2xl overflow-hidden rounded-2xl">
                    <CardHeader className="border-b border-white/5 bg-slate-900/40 flex flex-row items-center justify-between py-4">
                        <div>
                            <CardTitle className="text-lg font-bold text-white">Event Performance</CardTitle>
                            <p className="text-xs text-slate-400 font-medium mt-1">Breakdown of recent events.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleExportCSV} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                            <Download className="w-4 h-4 mr-2" /> Export CSV
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {(!stats?.events || stats.events.length === 0) ? (
                            <div className="p-12 text-center flex flex-col items-center">
                                <AlertCircle className="w-12 h-12 text-slate-600 mb-4" />
                                <p className="text-slate-400 font-medium text-lg">No events organized in this timeframe.</p>
                                <p className="text-slate-500 text-sm mt-2">Go hit the "Create" tab to organize a game!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left align-middle text-slate-300">
                                    <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 font-black tracking-widest">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">Date / Sport</th>
                                            <th scope="col" className="px-6 py-4">Title</th>
                                            <th scope="col" className="px-6 py-4 text-center">RSVPs</th>
                                            <th scope="col" className="px-6 py-4 text-center">Checked In</th>
                                            <th scope="col" className="px-6 py-4 text-center">Show Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {stats.events.map((ev: any) => {
                                            const RSVPs = ev.currentPlayers || 0;
                                            const checkedIn = ev.checkedInCount || 0;
                                            const rate = RSVPs > 0 ? Math.round((checkedIn / RSVPs) * 100) : 0;

                                            return (
                                                <tr key={ev.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-white">{ev.date.includes('/') ? ev.date : format(parseISO(ev.date), 'MMM d')}</div>
                                                        <div className="text-[10px] text-slate-500 uppercase font-black tracking-wider mt-0.5">{ev.sport}</div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate">
                                                        {ev.title}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">
                                                            {RSVPs} <span className="text-slate-500">/ {ev.maxPlayers}</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="font-bold text-emerald-400">{checkedIn}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden shrink-0">
                                                                <div className={`h-full rounded-full ${rate >= 80 ? 'bg-emerald-400' : rate >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${rate}%` }} />
                                                            </div>
                                                            <span className="text-xs font-bold w-8 text-right text-slate-400">{rate}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
            {showImportModal && (
                <ScheduleImportModal
                    isOpen={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    onEventsCreated={fetchDashboardData}
                />
            )}
        </div>
    );
}
