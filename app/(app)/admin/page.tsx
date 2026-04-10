"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/firebase-context"
import { BarChart3, Users, Eye, Calendar, Zap, Archive, Globe, Loader2, ShieldAlert, Sparkles, Play, ChevronDown, ChevronRight, Brain, Radio, BellRing, Clock, Target } from "lucide-react"

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

interface SerendipityLog {
  runId: string;
  timestamp: string;
  perceive: {
    totalEventsScanned: number;
    atRiskEvents: number;
    events: {
      id: string;
      name: string;
      category: string;
      dateTime: string;
      fillRate: number;
      currentPlayers: number;
      maxPlayers: number;
      spotsLeft: number;
    }[];
    durationMs: number;
  };
  reason: {
    candidatesEvaluated: number;
    qualified: number;
    durationMs: number;
  };
  act: {
    notificationsSent: number;
    notifications: {
      userId: string;
      userName: string;
      eventId: string;
      eventName: string;
      score: number;
      normalizedScore: number;
      factors: { interest: number; proximity: number; social: number; reliability: number };
      reasons: string[];
      message: string;
    }[];
    durationMs: number;
  };
  totalDurationMs: number;
  summary: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrapeLoading, setScrapeLoading] = useState(false)
  const [agentRunning, setAgentRunning] = useState(false)
  const [agentLogs, setAgentLogs] = useState<SerendipityLog[]>([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [expandedLog, setExpandedLog] = useState<string | null>(null)
  const [expandedNotif, setExpandedNotif] = useState<string | null>(null)

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

  // Fetch serendipity logs
  useEffect(() => {
    async function fetchLogs() {
      if (!user) return;
      setLogsLoading(true);
      try {
        const idToken = await user.getIdToken();
        const res = await fetch('/api/admin/serendipity-logs', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAgentLogs(data.logs || []);
        }
      } catch {
        // Silent fail — logs are non-critical
      } finally {
        setLogsLoading(false);
      }
    }
    fetchLogs();
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
      window.location.reload();
    } catch {
      alert('Scrape failed');
    } finally {
      setScrapeLoading(false);
    }
  };

  const handleRunAgent = async () => {
    if (!user) return;
    setAgentRunning(true);
    try {
      const res = await fetch('/api/cron/serendipity?secret=' + (process.env.NEXT_PUBLIC_CRON_SECRET || 'dev'), {
        method: 'GET',
      });
      const data = await res.json();

      if (data.status === 'success' || data.status === 'no_action') {
        // Refresh logs
        const idToken = await user.getIdToken();
        const logsRes = await fetch('/api/admin/serendipity-logs', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setAgentLogs(logsData.logs || []);
          // Auto-expand the latest log
          if (logsData.logs?.[0]) {
            setExpandedLog(logsData.logs[0].runId);
          }
        }
      }
    } catch (e) {
      console.error('Agent run failed:', e);
    } finally {
      setAgentRunning(false);
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAgent}
              disabled={agentRunning}
              className="bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
            >
              {agentRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Run Agent
            </button>
            <button
              onClick={handleScrape}
              disabled={scrapeLoading}
              className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
            >
              {scrapeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              Import TerpLink
            </button>
          </div>
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

        {/* ============ SERENDIPITY ACTIVITY LOG ============ */}
        <div className="bg-slate-900/60 border border-violet-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Serendipity Agent Activity Log</h2>
              <p className="text-xs text-slate-500">Perceive → Reason → Act pipeline trace</p>
            </div>
            {agentRunning && (
              <div className="ml-auto flex items-center gap-2 text-violet-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-bold animate-pulse">Running pipeline...</span>
              </div>
            )}
          </div>

          {logsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
            </div>
          ) : agentLogs.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 font-bold">No agent runs yet</p>
              <p className="text-slate-600 text-sm mt-1">Click &quot;Run Agent&quot; to trigger the Perceive-Reason-Act pipeline</p>
            </div>
          ) : (
            <div className="space-y-3">
              {agentLogs.map((log) => {
                const isExpanded = expandedLog === log.runId;
                const runDate = new Date(log.timestamp);

                return (
                  <div key={log.runId} className="bg-slate-950/60 border border-white/5 rounded-xl overflow-hidden">
                    {/* Log Header */}
                    <button
                      onClick={() => setExpandedLog(isExpanded ? null : log.runId)}
                      className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                      )}

                      {/* Pipeline Phase Badges */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          PERCEIVE {log.perceive.atRiskEvents}
                        </span>
                        <span className="text-slate-600">→</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          REASON {log.reason.qualified}
                        </span>
                        <span className="text-slate-600">→</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          ACT {log.act.notificationsSent}
                        </span>
                      </div>

                      <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-mono">{log.totalDurationMs}ms</span>
                        <span>{runDate.toLocaleString()}</span>
                      </div>
                    </button>

                    {/* Expanded Log Detail */}
                    {isExpanded && (
                      <div className="border-t border-white/5 p-4 space-y-4">
                        {/* PERCEIVE Phase */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Radio className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-blue-400">Phase 1: PERCEIVE</span>
                            <span className="text-[10px] text-slate-600 font-mono ml-auto">{log.perceive.durationMs}ms</span>
                          </div>
                          <p className="text-xs text-slate-400 pl-6">
                            Scanned <span className="text-white font-bold">{log.perceive.totalEventsScanned}</span> events
                            → found <span className="text-red-400 font-bold">{log.perceive.atRiskEvents}</span> at-risk
                          </p>
                          {log.perceive.events.length > 0 && (
                            <div className="pl-6 space-y-1">
                              {log.perceive.events.map(e => (
                                <div key={e.id} className="flex items-center gap-2 text-xs bg-white/5 rounded-lg px-3 py-2">
                                  <span className="text-red-400 font-bold">⚠️</span>
                                  <span className="text-white font-bold">{e.name}</span>
                                  <span className="text-slate-500">{e.category}</span>
                                  <span className="ml-auto text-slate-400">
                                    {e.currentPlayers}/{e.maxPlayers} ({Math.round(e.fillRate * 100)}%)
                                  </span>
                                  <span className="text-orange-400 font-bold">{e.spotsLeft} spots left</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* REASON Phase */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-purple-400">Phase 2: REASON</span>
                            <span className="text-[10px] text-slate-600 font-mono ml-auto">{log.reason.durationMs}ms</span>
                          </div>
                          <p className="text-xs text-slate-400 pl-6">
                            Evaluated <span className="text-white font-bold">{log.reason.candidatesEvaluated}</span> candidates
                            → <span className="text-emerald-400 font-bold">{log.reason.qualified}</span> qualified (score ≥ 40)
                          </p>
                        </div>

                        {/* ACT Phase */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <BellRing className="w-4 h-4 text-orange-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-orange-400">Phase 3: ACT</span>
                            <span className="text-[10px] text-slate-600 font-mono ml-auto">{log.act.durationMs}ms</span>
                          </div>
                          <p className="text-xs text-slate-400 pl-6">
                            Dispatched <span className="text-white font-bold">{log.act.notificationsSent}</span> personalized Gemini-composed notifications
                          </p>

                          {/* Individual notifications */}
                          {log.act.notifications && log.act.notifications.length > 0 && (
                            <div className="pl-6 space-y-2">
                              {log.act.notifications.map((notif, idx) => {
                                const notifKey = `${log.runId}-${idx}`;
                                const isNotifExpanded = expandedNotif === notifKey;
                                return (
                                  <div key={idx} className="bg-white/5 rounded-lg overflow-hidden">
                                    <button
                                      onClick={() => setExpandedNotif(isNotifExpanded ? null : notifKey)}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 transition-colors text-left"
                                    >
                                      {isNotifExpanded ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                                      <span className="text-white font-bold">{notif.userName}</span>
                                      <span className="text-slate-500">→</span>
                                      <span className="text-slate-300">{notif.eventName}</span>
                                      <span className="ml-auto text-violet-400 font-bold font-mono">
                                        {notif.normalizedScore.toFixed(2)}
                                      </span>
                                    </button>
                                    {isNotifExpanded && (
                                      <div className="px-3 pb-3 space-y-2 border-t border-white/5 pt-2">
                                        {/* Score Factors Bar */}
                                        <div className="flex items-center gap-1 h-3 w-full rounded-full overflow-hidden bg-slate-800">
                                          <div className="h-full bg-blue-500 transition-all" style={{ width: `${(notif.factors.interest / 100) * 100}%` }} title="Interest" />
                                          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(notif.factors.proximity / 100) * 100}%` }} title="Proximity" />
                                          <div className="h-full bg-violet-500 transition-all" style={{ width: `${(notif.factors.social / 100) * 100}%` }} title="Social" />
                                          <div className="h-full bg-amber-500 transition-all" style={{ width: `${(notif.factors.reliability / 100) * 100}%` }} title="Reliability" />
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px]">
                                          <span className="text-blue-400">Interest: {notif.factors.interest}</span>
                                          <span className="text-emerald-400">Proximity: {notif.factors.proximity}</span>
                                          <span className="text-violet-400">Social: {notif.factors.social}</span>
                                          <span className="text-amber-400">Reliability: {notif.factors.reliability}</span>
                                        </div>
                                        {/* Reasons */}
                                        <div className="flex flex-wrap gap-1">
                                          {notif.reasons.map((reason, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-300">
                                              {reason}
                                            </span>
                                          ))}
                                        </div>
                                        {/* Composed message */}
                                        <div className="bg-slate-950 border border-teal-500/20 rounded-lg px-3 py-2">
                                          <span className="text-[10px] text-teal-500 font-black uppercase tracking-widest">Gemini-composed notification:</span>
                                          <p className="text-sm text-white mt-1">{notif.message}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Summary */}
                        <div className="pt-2 border-t border-white/5">
                          <p className="text-xs text-slate-500 italic">{log.summary}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
