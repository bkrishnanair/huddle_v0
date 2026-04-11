import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { scoreCandidates, type AtRiskEvent, type CandidateUser, type CandidateScore } from '@/lib/serendipity-scorer';
import { composeNotification } from '@/lib/serendipity-composer';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // allow up to 60s for Vercel

/**
 * Serendipity Agent — Cron Orchestrator
 * 
 * Runs the full Perceive-Reason-Act pipeline:
 * 1. PERCEIVE: Scan events to find at-risk ones (< 50% capacity, within 48h)
 * 2. REASON: Score candidate users with 4-factor model
 * 3. ACT: Compose personalized notifications via Gemini and dispatch
 * 
 * Each run writes a detailed trace log to `serendipityLogs` collection
 * for the admin dashboard Activity Log visualization.
 */
export async function GET(request: NextRequest) {
  // Auth check: Vercel cron sends Authorization header, or use dev query param
  const authHeader = request.headers.get('authorization');
  const devSecret = request.nextUrl.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  if (process.env.NODE_ENV === 'production') {
    if (authHeader !== `Bearer ${cronSecret}` && devSecret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const adminDb = getFirebaseAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: 'DB not available' }, { status: 500 });
  }

  const runId = `run_${Date.now()}`;
  const runStartTime = Date.now();

  // ========== PHASE 1: PERCEIVE ==========
  const perceiveStart = Date.now();
  const now = new Date();
  const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  // Scan all events — filter status in-memory since some events may not have a status field
  const eventsSnap = await adminDb.collection('events')
    .get();

  const atRiskEvents: AtRiskEvent[] = [];
  const allEvents: any[] = [];

  eventsSnap.docs.forEach(doc => {
    const data = doc.data();
    if (data.isPrivate || data.status === 'archived' || data.status === 'past') return;

    // Check if event is within the next 48 hours
    try {
      const eventDateTime = new Date(`${data.date}T${data.time}`);
      if (isNaN(eventDateTime.getTime())) return;
      if (eventDateTime < now || eventDateTime > in48Hours) return;
    } catch {
      return;
    }

    const maxPlayers = data.maxPlayers || 50;
    const currentPlayers = data.currentPlayers || (data.players?.length || 0);
    const fillRate = currentPlayers / maxPlayers;

    allEvents.push({ id: doc.id, ...data, fillRate });

    // At-risk: under 50% capacity
    if (fillRate < 0.5) {
      atRiskEvents.push({
        id: doc.id,
        name: data.name || data.title || 'Untitled',
        category: data.category || data.sport || 'Community',
        date: data.date,
        time: data.time,
        currentPlayers,
        maxPlayers,
        players: data.players || [],
        geopoint: data.geopoint || { latitude: 38.9897, longitude: -76.9378 },
      });
    }
  });

  const perceiveMs = Date.now() - perceiveStart;

  if (atRiskEvents.length === 0) {
    // Log the empty run
    await adminDb.collection('serendipityLogs').doc(runId).set({
      runId,
      timestamp: new Date().toISOString(),
      perceive: {
        totalEventsScanned: allEvents.length,
        atRiskEvents: 0,
        events: [],
        durationMs: perceiveMs,
      },
      reason: { candidatesEvaluated: 0, qualified: 0, durationMs: 0 },
      act: { notificationsSent: 0, durationMs: 0 },
      totalDurationMs: Date.now() - runStartTime,
      summary: 'No at-risk events found. All events are healthy.',
    });

    return NextResponse.json({
      runId,
      status: 'no_action',
      message: 'No at-risk events found',
      eventsScanned: allEvents.length,
    });
  }

  // ========== PHASE 2: REASON ==========
  const reasonStart = Date.now();

  // Fetch all users who could be candidates
  const usersSnap = await adminDb.collection('users').get();
  const allUsers: CandidateUser[] = [];
  const userFollowing = new Map<string, string[]>(); // userId -> [followingIds]

  // Build user profiles + following graph
  for (const doc of usersSnap.docs) {
    const data = doc.data();
    const uid = doc.id;

    allUsers.push({
      uid,
      displayName: data.displayName || data.name || 'User',
      favoriteSports: data.favoriteSports || data.favoriteCategories || [],
      lastKnownLocation: data.lastKnownLocation ? {
        latitude: data.lastKnownLocation.latitude || data.lastKnownLocation._latitude || 0,
        longitude: data.lastKnownLocation.longitude || data.lastKnownLocation._longitude || 0,
      } : undefined,
      totalRsvps: data.totalRsvps || 0,
      totalCheckIns: data.totalCheckIns || 0,
    });
  }

  // Fetch social graph for each at-risk event
  const eventScores = new Map<string, CandidateScore[]>();
  let totalCandidatesEvaluated = 0;
  let totalQualified = 0;

  for (const event of atRiskEvents) {
    // Build social graph: for each user, which of their friends are attending this event?
    const socialGraph = new Map<string, string[]>();

    for (const user of allUsers) {
      // Fetch this user's following list (cached)
      if (!userFollowing.has(user.uid)) {
        try {
          const followingSnap = await adminDb.collection('users').doc(user.uid)
            .collection('following').get();
          userFollowing.set(user.uid, followingSnap.docs.map(d => d.id));
        } catch {
          userFollowing.set(user.uid, []);
        }
      }

      const following = userFollowing.get(user.uid) || [];
      const friendsInEvent = following.filter(fid => event.players.includes(fid));
      const friendNames = friendsInEvent.map(fid => {
        const friend = allUsers.find(u => u.uid === fid);
        return friend?.displayName || 'a friend';
      });
      if (friendNames.length > 0) {
        socialGraph.set(user.uid, friendNames);
      }
    }

    totalCandidatesEvaluated += allUsers.length;
    const scores = scoreCandidates(allUsers, event, socialGraph);
    totalQualified += scores.length;
    eventScores.set(event.id, scores);
  }

  const reasonMs = Date.now() - reasonStart;

  // ========== PHASE 3: ACT ==========
  const actStart = Date.now();
  let notificationsSent = 0;
  const actDetails: any[] = [];

  for (const event of atRiskEvents) {
    const scores = eventScores.get(event.id) || [];
    const topCandidates = scores.slice(0, 10); // Max 10 notifications per event

    for (const candidate of topCandidates) {
      try {
        const spotsLeft = event.maxPlayers - event.currentPlayers;
        const composed = await composeNotification(candidate, {
          id: event.id,
          name: event.name,
          category: event.category,
          date: event.date,
          time: event.time,
          spotsLeft,
        });

        // Write notification to the user's subcollection
        const notifRef = adminDb.collection('users')
          .doc(candidate.userId)
          .collection('notifications')
          .doc();

        await notifRef.set({
          userId: candidate.userId,
          type: 'serendipity_nudge',
          message: composed.message,
          eventId: event.id,
          read: false,
          createdAt: new Date().toISOString(),
          serendipityMeta: {
            score: candidate.score,
            factors: candidate.factors,
            reasons: candidate.reasons,
          },
        });

        notificationsSent++;
        actDetails.push({
          userId: candidate.userId,
          userName: candidate.displayName,
          eventId: event.id,
          eventName: event.name,
          score: candidate.score,
          normalizedScore: Number((candidate.score / 100).toFixed(2)),
          factors: candidate.factors,
          reasons: candidate.reasons,
          message: composed.message,
        });
      } catch (error) {
        console.error(`Failed to compose/dispatch for ${candidate.userId}:`, error);
      }
    }
  }

  const actMs = Date.now() - actStart;
  const totalMs = Date.now() - runStartTime;

  // ========== WRITE ACTIVITY LOG ==========
  const logEntry = {
    runId,
    timestamp: new Date().toISOString(),
    perceive: {
      totalEventsScanned: allEvents.length,
      atRiskEvents: atRiskEvents.length,
      events: atRiskEvents.map(e => ({
        id: e.id,
        name: e.name,
        category: e.category,
        dateTime: `${e.date} ${e.time}`,
        fillRate: Number((e.currentPlayers / e.maxPlayers).toFixed(2)),
        currentPlayers: e.currentPlayers,
        maxPlayers: e.maxPlayers,
        spotsLeft: e.maxPlayers - e.currentPlayers,
      })),
      durationMs: perceiveMs,
    },
    reason: {
      candidatesEvaluated: totalCandidatesEvaluated,
      qualified: totalQualified,
      durationMs: reasonMs,
    },
    act: {
      notificationsSent,
      notifications: actDetails,
      durationMs: actMs,
    },
    totalDurationMs: totalMs,
    summary: `Scanned ${allEvents.length} events → ${atRiskEvents.length} at-risk → ${totalCandidatesEvaluated} candidates evaluated → ${totalQualified} qualified → ${notificationsSent} notifications sent in ${totalMs}ms`,
  };

  await adminDb.collection('serendipityLogs').doc(runId).set(logEntry);

  return NextResponse.json({
    runId,
    status: 'success',
    summary: logEntry.summary,
    perceive: {
      eventsScanned: allEvents.length,
      atRiskFound: atRiskEvents.length,
      durationMs: perceiveMs,
    },
    reason: {
      candidatesEvaluated: totalCandidatesEvaluated,
      qualified: totalQualified,
      durationMs: reasonMs,
    },
    act: {
      notificationsSent,
      durationMs: actMs,
    },
    totalDurationMs: totalMs,
  });
}
