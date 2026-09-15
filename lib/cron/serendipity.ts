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
import { canSendRecommendation, isRecommendationEvent } from '@/lib/recommendation-policy';
import { getUpcomingEventWindow, getEventStartUTC } from '@/lib/datetime';
import type { GameEvent } from '@/lib/types';
import type { CronResult } from './types';

/** Bounded event, interest and proximity queries; one nudge per user per day. */
export async function runSerendipity(): Promise<CronResult> {
  const start = Date.now();
  const errors: string[] = [];
  let processed = 0;

  try {
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error('Database unavailable');

    const { now, until: in48Hours, from: todayStr, to: twoDaysAheadStr } = getUpcomingEventWindow();

    // BOUNDED query: only events in the 0–2 day window
    const eventsSnap = await adminDb
      .collection('events')
      .where('date', '>=', todayStr)
      .where('date', '<=', twoDaysAheadStr)
      .limit(100)
      .get();

    const atRiskEvents: AtRiskEvent[] = [];
    const allEvents: { id: string; fillRate: number }[] = [];

    eventsSnap.docs.forEach((doc) => {
      const data = doc.data();
      if (!isRecommendationEvent(data as GameEvent, now)) return;

      const eventDateTime = getEventStartUTC(data as GameEvent);
      if (isNaN(eventDateTime.getTime())) return;
      if (eventDateTime < now || eventDateTime > in48Hours) return;

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
        summary: 'No eligible events in the recommendation window.',
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
    const queryCache = new Map<string, Promise<FirebaseFirestore.QuerySnapshot>>();
    const cached = (key: string, query: FirebaseFirestore.Query) => {
      if (!queryCache.has(key)) queryCache.set(key, query.get());
      return queryCache.get(key)!;
    };

    for (const event of atRiskEvents) {
      const candidatesMap = new Map<string, CandidateUser>();

      // 1. Query by interest match (if users have favoriteSports array)
      try {
        const interestSnap = await cached('interest:' + event.category, adminDb.collection('users')
          .where('favoriteSports', 'array-contains', event.category).limit(100));
        
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
            const geoSnap = await cached('geo:' + b.join(':'), adminDb.collection('users')
              .orderBy('geohash').startAt(b[0]).endAt(b[1]).limit(50));
              
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
              .limit(200)
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
    let pushesSent = 0;
    let pushesFailed = 0;
    const actDetails: Record<string, unknown>[] = [];
    const pushPromises: Promise<any>[] = [];

    for (const event of atRiskEvents) {
      const scores = eventScores.get(event.id) || [];
      const topCandidates = scores.slice(0, 10);

      for (const candidate of topCandidates) {
        if (notificationsSent >= 20) break;
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
            .doc('serendipity_' + event.id);

          const payload = {
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
          };
          const userRef = adminDb.collection('users').doc(candidate.userId);
          const sent = await adminDb.runTransaction(async tx => {
            const [notification, userDoc, eventDoc] = await Promise.all([
              tx.get(notifRef), tx.get(userRef), tx.get(adminDb.collection('events').doc(event.id)),
            ]);
            if (!userDoc.exists || !eventDoc.exists || !canSendRecommendation(
              { ...userDoc.data(), uid: candidate.userId }, eventDoc.data() as GameEvent, notification.exists, now,
            )) return false;
            const organizerId = eventDoc.data()?.createdBy;
            if (!organizerId) return false;
            const organizer = await tx.get(adminDb.collection('users').doc(organizerId));
            if (!organizer.exists || organizer.data()?.blockedUsers?.includes(candidate.userId)) return false;
            tx.create(notifRef, payload);
            tx.update(userRef, { lastSerendipityAt: now.toISOString() });
            return true;
          });
          if (!sent) continue;

          notificationsSent++;
          processed++;
          
          pushPromises.push(
            sendPushToUser(candidate.userId, {
              title: "You might like this event",
              body: composed.message,
              url: `/event/${event.id}`,
              type: "serendipity_nudge"
            })
          );

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

    // Await all push dispatches before serverless function termination
    const pushResults = await Promise.allSettled(pushPromises);
    for (const res of pushResults) {
      if (res.status === 'fulfilled' && (res.value as any)?.successCount > 0) {
        pushesSent++;
      } else if (res.status === 'rejected' || (res.value as any)?.failureCount > 0) {
        pushesFailed++;
      }
    }

    if (pushesFailed > 0) {
      errors.push(`${pushesFailed} serendipity push dispatches failed`);
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
