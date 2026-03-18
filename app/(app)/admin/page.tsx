"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/firebase-context"
import { BarChart3, Users, Eye, Calendar, Zap, Archive, Globe, Loader2, ShieldAlert } from "lucide-react"

interface Metrics {
  totalEvents: number;
  totalUsers: number;
  totalViews: number;
  totalRSVPs: number;
  liveEvents: number;
  archivedEvents: number;
  scrapedEvents: number;
  categoryDistribution: { name: string; count: number }[];
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrapeLoading, setScrapeLoading] = useState(false)

  useEffect(() => {
    async function fetchMetrics() {
      if (!user) return;
      try {
        const idToken = await user.getIdToken();
        const res = await fetch('/api/admin/metrics', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) {
          setError(res.status === 401 ? 'Access denied. Admin only.' : 'Failed to load metrics.');
          return;
        }
        const data = await res.json();
        setMetrics(data.metrics);
      } catch {
        setError('Failed to load metrics.');
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [user]);

  const handleScrape = async () => {
    if (!user) return;
    setScrapeLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/scrape/terplink', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      alert(`${data.message || data.error}`);
      // Refresh metrics
      window.location.reload();
    } catch {
      alert('Scrape failed');
    } finally {
      setScrapeLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400">Please sign in to access the admin dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 font-bold">{error}</p>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const statCards = [
    { label: "Total Events", value: metrics.totalEvents, icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Total Users", value: metrics.totalUsers, icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Total Views", value: metrics.totalViews, icon: Eye, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Total RSVPs", value: metrics.totalRSVPs, icon: BarChart3, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Live Now", value: metrics.liveEvents, icon: Zap, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    { label: "Archived", value: metrics.archivedEvents, icon: Archive, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
    { label: "Scraped", value: metrics.scrapedEvents, icon: Globe, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 pb-28">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Platform-wide metrics and controls</p>
          </div>
          <button
            onClick={handleScrape}
            disabled={scrapeLoading}
            className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
          >
            {scrapeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            Import TerpLink
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`${card.bg} ${card.border} border rounded-2xl p-4 backdrop-blur-sm`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${card.color}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{card.label}</span>
                </div>
                <p className={`text-2xl font-black ${card.color}`}>
                  {card.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Category Distribution */}
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Category Distribution</h2>
          <div className="space-y-3">
            {metrics.categoryDistribution.map((cat) => {
              const maxCount = metrics.categoryDistribution[0]?.count || 1;
              const pct = (cat.count / maxCount) * 100;
              return (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white w-28 truncate">{cat.name}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-bold w-8 text-right">{cat.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
