// lib/cron/serendipity.ts
// Handler: Serendipity Agent — Perceive-Reason-Act pipeline.
import 'server-only';

import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import {
  scoreCandidates,
  type AtRiskEvent,
  type CandidateUser,
  type CandidateScore,
} from '@/lib/serendipity-scorer';
import { composeNotification } from '@/lib/serendipity-composer';
import { sendPushToUser } from '@/lib/push-server';
import type { CronResult } from './types';

/**
 * Serendipity Agent cron handler.
 *
 * Query optimizations vs the original:
 * - Events: bounded to date >= today AND date <= today+2,
 *   then filtered in-memory for <48h window (was: full collection scan).
 *   Estimated reads: ~10–30 events per run.
 * - Users: still scans all users because every user is a potential
 *   notification candidate. For the current scale (~100–500 users)
 *   this is acceptable. At >1000 users, switch to a pre-computed
 *   "interested" index.
 */
export async function runSerendipity(): Promise<CronResult> {
  const start = Date.now();
  const errors: string[] = [];
  let processed = 0;

  try {
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error('Database unavailable');

    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const todayStr = now.toISOString().split('T')[0];
    const twoDaysAheadStr = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // BOUNDED query: only events in the 0–2 day window
    const eventsSnap = await adminDb
      .collection('events')
      .where('date', '>=', todayStr)
      .where('date', '<=', twoDaysAheadStr)
      .get();

    const atRiskEvents: AtRiskEvent[] = [];
    const allEvents: { id: string; fillRate: number }[] = [];

    eventsSnap.docs.forEach((doc) => {
      const data = doc.data();
      if (data.isPrivate || data.status === 'archived' || data.status === 'past') return;

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

      allEvents.push({ id: doc.id, fillRate });

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

    const perceiveMs = Date.now() - start;
    const runId = `run_${Date.now()}`;

    if (atRiskEvents.length === 0) {
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
        totalDurationMs: Date.now() - start,
        summary: 'No at-risk events found. All events are healthy.',
      });

      return {
        handler: 'serendipity',
        ok: true,
        processed: 0,
        errors: [],
        durationMs: Date.now() - start,
      };
    }

    // ========== PHASE 2: REASON ==========
    const reasonStart = Date.now();
    const geofire = await import('geofire-common');
    
    const eventScores = new Map<string, CandidateScore[]>();
    let totalCandidatesEvaluated = 0;
    let totalQualified = 0;
    const userFollowing = new Map<string, string[]>();

    for (const event of atRiskEvents) {
      const candidatesMap = new Map<string, CandidateUser>();

      // 1. Query by interest match (if users have favoriteSports array)
      try {
        const interestSnap = await adminDb.collection('users')
          .where('favoriteSports', 'array-contains', event.category)
          .limit(100)
          .get();
        
        interestSnap.docs.forEach((doc) => {
          const data = doc.data();
          candidatesMap.set(doc.id, {
            uid: doc.id,
            displayName: data.displayName || data.name || 'User',
            favoriteSports: data.favoriteSports || data.favoriteCategories || [],
            lastKnownLocation: data.lastKnownLocation
              ? {
                  latitude: data.lastKnownLocation.latitude || data.lastKnownLocation._latitude || 0,
                  longitude: data.lastKnownLocation.longitude || data.lastKnownLocation._longitude || 0,
                }
              : undefined,
            totalRsvps: data.totalRsvps || 0,
            totalCheckIns: data.totalCheckIns || 0,
          });
        });
      } catch (e) {
        console.warn(`Could not query users by interest for event ${event.id}`, e);
      }

      // 2. Query by geohash proximity (25 miles = ~40233 meters)
      if (event.geopoint) {
        try {
          const center = [
            event.geopoint.latitude || (event.geopoint as any)._latitude,
            event.geopoint.longitude || (event.geopoint as any)._longitude
          ] as [number, number];
          const bounds = geofire.geohashQueryBounds(center, 40233);
          
          for (const b of bounds) {
            const geoSnap = await adminDb.collection('users')
              .orderBy('geohash')
              .startAt(b[0])
              .endAt(b[1])
              .limit(50)
              .get();
              
            geoSnap.docs.forEach((doc) => {
              if (!candidatesMap.has(doc.id)) {
                const data = doc.data();
                candidatesMap.set(doc.id, {
                  uid: doc.id,
                  displayName: data.displayName || data.name || 'User',
                  favoriteSports: data.favoriteSports || data.favoriteCategories || [],
                  lastKnownLocation: data.lastKnownLocation
                    ? {
                        latitude: data.lastKnownLocation.latitude || data.lastKnownLocation._latitude || 0,
                        longitude: data.lastKnownLocation.longitude || data.lastKnownLocation._longitude || 0,
                      }
                    : undefined,
                  totalRsvps: data.totalRsvps || 0,
                  totalCheckIns: data.totalCheckIns || 0,
                });
              }
            });
          }
        } catch (e) {
          console.warn(`Could not query users by geohash for event ${event.id}`, e);
        }
      }

      const eventCandidates = Array.from(candidatesMap.values());
      const socialGraph = new Map<string, string[]>();

      for (const user of eventCandidates) {
        if (!userFollowing.has(user.uid)) {
          try {
            const followingSnap = await adminDb
              .collection('users')
              .doc(user.uid)
              .collection('following')
              .get();
            userFollowing.set(
              user.uid,
              followingSnap.docs.map((d) => d.id),
            );
          } catch {
            userFollowing.set(user.uid, []);
          }
        }

        const following = userFollowing.get(user.uid) || [];
        const friendsInEvent = following.filter((fid) =>
          event.players.includes(fid),
        );
        const friendNames = friendsInEvent.map((fid) => {
          const friend = eventCandidates.find((u) => u.uid === fid);
          return friend?.displayName || 'a friend';
        });
        if (friendNames.length > 0) {
          socialGraph.set(user.uid, friendNames);
        }
      }

      totalCandidatesEvaluated += eventCandidates.length;
      const scores = scoreCandidates(eventCandidates, event, socialGraph);
      totalQualified += scores.length;
      eventScores.set(event.id, scores);
    }

    const reasonMs = Date.now() - reasonStart;

    // ========== PHASE 3: ACT ==========
    const actStart = Date.now();
    let notificationsSent = 0;
    const actDetails: Record<string, unknown>[] = [];

    for (const event of atRiskEvents) {
      const scores = eventScores.get(event.id) || [];
      const topCandidates = scores.slice(0, 10);

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

          const notifRef = adminDb
            .collection('users')
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
            processed++;
            
            sendPushToUser(candidate.userId, {
              title: "You might like this event",
              body: composed.message,
              url: `/event/${event.id}`,
              type: "serendipity_nudge"
            }).catch(err => console.error('Push error for serendipity:', err));

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
          const errMsg = error instanceof Error ? error.message : String(error);
          errors.push(`Serendipity dispatch failed for ${candidate.userId}: ${errMsg}`);
          console.error(`Serendipity dispatch error for ${candidate.userId}:`, error);
        }
      }
    }

    const actMs = Date.now() - actStart;
    const totalMs = Date.now() - start;

    // ========== WRITE ACTIVITY LOG ==========
    await adminDb.collection('serendipityLogs').doc(runId).set({
      runId,
      timestamp: new Date().toISOString(),
      perceive: {
        totalEventsScanned: allEvents.length,
        atRiskEvents: atRiskEvents.length,
        events: atRiskEvents.map((e) => ({
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
      summary: `Scanned ${allEvents.length} events → ${atRiskEvents.length} at-risk → ${totalCandidatesEvaluated} candidates → ${totalQualified} qualified → ${notificationsSent} sent in ${totalMs}ms`,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    errors.push(msg);
    console.error('Serendipity handler error:', msg);
  }

  return {
    handler: 'serendipity',
    ok: errors.length === 0,
    processed,
    errors,
    durationMs: Date.now() - start,
  };
}
