"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle2, ChevronRight, Speaker, TagIcon, Edit, Clock, Sparkles, Users, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/firebase-context";
import { toast } from "sonner";

export function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Post-Event Reporting State
    const [reportingEventId, setReportingEventId] = useState<string | null>(null);
    const [attendanceCount, setAttendanceCount] = useState("");
    const [reportingStatus, setReportingStatus] = useState<"idle" | "loading" | "success">("idle");
    const [reportMessage, setReportMessage] = useState<string>("");

    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                const idToken = await user.getIdToken();
                const res = await fetch(`/api/users/${user.uid}/notifications`, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data.notifications || []);
                    setUnreadCount(data.notifications?.filter((n: any) => !n.read).length || 0);
                }
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            }
        };

        fetchNotifications();

        // In a real app with FCM, we'd use onMessage here.
        // For this MVP, we'll poll every 30s as a fallback for "real-time" feel without socket.io/FCM
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const markAsRead = async (id: string, isRead: boolean) => {
        if (isRead || !user) return;

        // Optimistic update
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        try {
            const idToken = await user.getIdToken();
            await fetch(`/api/users/${user.uid}/notifications`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ notificationId: id }),
            });
        } catch (err) {
            console.error("Failed to mark notification as read", err);
        }
    };

    const handleReportAttendance = async (e: React.MouseEvent, eventId: string) => {
        e.stopPropagation();
        if (!attendanceCount || isNaN(Number(attendanceCount))) return;
        setReportingStatus("loading");
        try {
            const idToken = await user!.getIdToken();
            const res = await fetch(`/api/events/${eventId}/attendance`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
                body: JSON.stringify({ reportedAttendance: Number(attendanceCount) })
            });
            const data = await res.json();
            if (res.ok) {
                setReportingStatus("success");
                setReportMessage(data.message);
            } else {
                setReportingStatus("idle");
                toast.error(data.error || "Failed to report attendance");
            }
        } catch {
            setReportingStatus("idle");
            toast.error("Something went wrong");
        }
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case "waitlist_promo": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case "event_announcement": return <Speaker className="w-4 h-4 text-amber-500" />;
            case "event_update": return <Edit className="w-4 h-4 text-blue-500" />;
            case "serendipity_nudge": return <Sparkles className="w-4 h-4 text-teal-400" />;
            case "friend_attending": return <Users className="w-4 h-4 text-violet-400" />;
            case "post_event": return <ClipboardList className="w-4 h-4 text-orange-400" />;
            default: return <Bell className="w-4 h-4 text-slate-500" />;
        }
    };

    if (!user) return null;

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-white/10"
                onClick={() => setIsOpen(true)}
            >
                <Bell className="w-5 h-5 text-slate-300" />
                {unreadCount > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full border-2 border-slate-900 border-solid font-black animate-in zoom-in"
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                )}
            </Button>

            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent className="glass-surface border-white/10 text-foreground max-w-lg mx-auto rounded-t-[2rem] max-h-[85vh] flex flex-col focus:outline-none">
                    <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-white/20 shrink-0" />
                    <DrawerHeader className="pb-4 pt-2 shrink-0 border-b border-white/5">
                        <div className="flex justify-between items-center">
                            <DrawerTitle className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                <Bell className="w-5 h-5 text-primary" />
                                Notifications
                            </DrawerTitle>
                        </div>
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-0">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-500 space-y-3">
                                <Bell className="w-8 h-8 opacity-20" />
                                <p className="text-sm font-bold tracking-wide">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        onClick={() => {
                                            markAsRead(n.id, n.read);
                                            if (n.type === 'post_event' && n.eventId && reportingEventId !== n.eventId) {
                                                setReportingEventId(n.eventId);
                                                setReportingStatus("idle");
                                                setAttendanceCount("");
                                            }
                                        }}
                                        className={`p-4 transition-colors cursor-pointer hover:bg-white/5 flex gap-4 ${!n.read ? "bg-primary/5" : ""
                                            }`}
                                    >
                                        <div className="pt-1 shrink-0">
                                            <div className={`p-2 rounded-full ${!n.read ? 'bg-white/10' : 'bg-transparent'}`}>
                                                {getIconForType(n.type)}
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className={`text-sm leading-snug ${!n.read ? "text-white font-bold" : "text-slate-300"}`}>
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                            </div>

                                            {/* Post-Event Reporting Inline UI */}
                                            {n.type === "post_event" && reportingEventId === n.eventId && (
                                                <div className="mt-3 bg-black/40 rounded-lg p-3 border border-white/5 cursor-default" onClick={e => e.stopPropagation()}>
                                                    {reportingStatus === "success" ? (
                                                        <div className="space-y-1.5">
                                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 mx-auto">
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            </div>
                                                            <p className="text-xs text-emerald-400 font-bold leading-relaxed text-center">
                                                                {reportMessage}
                                                            </p>
                                                            <Button 
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setIsOpen(false);
                                                                    setTimeout(() => {
                                                                        window.location.href = `/my-events?cloneEventId=${n.eventId}`;
                                                                    }, 100);
                                                                }}
                                                                className="mt-3 w-full bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400 text-xs font-bold"
                                                            >
                                                                Schedule Again Next Week
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2 text-center">
                                                            <p className="text-xs text-slate-300 font-bold">How many people actually showed up?</p>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={attendanceCount}
                                                                    onChange={(e) => setAttendanceCount(e.target.value)}
                                                                    placeholder="0"
                                                                    className="w-16 bg-slate-900 border border-white/10 rounded-md text-white text-center text-sm focus:outline-none focus:border-primary"
                                                                />
                                                                <Button 
                                                                    size="sm"
                                                                    onClick={(e) => handleReportAttendance(e, n.eventId!)}
                                                                    disabled={!attendanceCount || reportingStatus === 'loading'}
                                                                    className="flex-1 min-w-[80px] h-8 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
                                                                >
                                                                    {reportingStatus === 'loading' ? 'Saving...' : 'Report'}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {!n.read && (
                                            <div className="shrink-0 pt-2">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-white/5 bg-slate-950/20 shrink-0">
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 rounded-xl font-bold uppercase tracking-widest text-xs">
                                Close
                            </Button>
                        </DrawerClose>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
