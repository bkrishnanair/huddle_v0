// lib/db.ts
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc,
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getCountFromServer,
} from "firebase/firestore"
import { db } from "./firebase"
import * as geofire from "geofire-common"
export { db };
import { getUser } from "./db-client";



export const createEvent = async (eventData: any) => {
  try {
    const eventsCol = collection(db, "events")
    const newEventRef = await addDoc(eventsCol, {
      ...eventData,
      createdAt: Timestamp.now(),
    })
    return { id: newEventRef.id, ...eventData }
  } catch (error) {
    console.error("Error creating event in Firestore:", error)
    throw new Error("Failed to save event to the database.")
  }
}

export const getEvents = async () => {
  try {
    const eventsCol = collection(db, "events")
    const eventSnapshot = await getDocs(eventsCol)
    return eventSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching events from Firestore:", error)
    throw new Error("Failed to retrieve events from the database.")
  }
}

export const getNearbyEvents = async (center: [number, number], radiusInM: number) => {
  try {
    const bounds = geofire.geohashQueryBounds(center, radiusInM)
    const promises = []

    for (const b of bounds) {
      const q = query(
        collection(db, "events"),
        orderBy("geohash"),
        where("geohash", ">=", b[0]),
        where("geohash", "<=", b[1]),
      )
      promises.push(getDocs(q))
    }

    const snapshots = await Promise.all(promises)
    const matchingDocs = []

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const lat = doc.get("geopoint").latitude
        const lng = doc.get("geopoint").longitude

        const distanceInKm = geofire.distanceBetween([lat, lng], center)
        const distanceInM = distanceInKm * 1000
        if (distanceInM <= radiusInM) {
          matchingDocs.push({ id: doc.id, ...doc.data() })
        }
      }
    }
    return matchingDocs
  } catch (error) {
    console.error("Error fetching nearby events:", error)
    throw new Error("Failed to query nearby events.")
  }
}



export const getEvent = async (eventId: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    const eventSnap = await getDoc(eventRef)
    if (!eventSnap.exists()) return null;
    const rawData = eventSnap.data();
    return {
      id: eventSnap.id,
      ...rawData,
      geopoint: rawData.geopoint ? {
        latitude: typeof rawData.geopoint.latitude === 'number' ? rawData.geopoint.latitude : rawData.geopoint._latitude,
        longitude: typeof rawData.geopoint.longitude === 'number' ? rawData.geopoint.longitude : rawData.geopoint._longitude
      } : null
    };
  } catch (error) {
    console.error("Error fetching event:", error)
    throw new Error("Failed to retrieve event.")
  }
}

export const joinEvent = async (eventId: string, userId: string) => {
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const { FieldValue } = await import("firebase-admin/firestore");
    const adminDb = getFirebaseAdminDb();

    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const eventRef = adminDb.collection("events").doc(eventId);

    // Run in a transaction to safely increment players and add to array
    await adminDb.runTransaction(async (transaction) => {
      const eventDoc = await transaction.get(eventRef);
      if (!eventDoc.exists) {
        throw new Error("Event does not exist!");
      }

      const currentPlayers = eventDoc.data()?.currentPlayers || 0;

      transaction.update(eventRef, {
        players: FieldValue.arrayUnion(userId),
        currentPlayers: currentPlayers + 1
      });
    });

    const updatedSnap = await eventRef.get();
    return { id: updatedSnap.id, ...updatedSnap.data() };
  } catch (error) {
    console.error("Error joining event:", error);
    throw new Error("Failed to join event.");
  }
}

export const leaveEvent = async (eventId: string, userId: string) => {
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const { FieldValue } = await import("firebase-admin/firestore");
    const adminDb = getFirebaseAdminDb();

    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const eventRef = adminDb.collection("events").doc(eventId);

    // Run in a transaction to safely decrement players and remove from array
    await adminDb.runTransaction(async (transaction) => {
      const eventDoc = await transaction.get(eventRef);
      if (!eventDoc.exists) {
        throw new Error("Event does not exist!");
      }

      const currentPlayers = eventDoc.data()?.currentPlayers || 0;
      const newPlayerCount = Math.max(0, currentPlayers - 1);

      transaction.update(eventRef, {
        players: FieldValue.arrayRemove(userId),
        currentPlayers: newPlayerCount
      });
    });

    const updatedSnap = await eventRef.get();
    return { id: updatedSnap.id, ...updatedSnap.data() };
  } catch (error) {
    console.error("Error leaving event:", error);
    throw new Error("Failed to leave event.");
  }
}

export const sendMessage = async (eventId: string, userId: string, authDisplayName: string, message: string) => {
  try {
    const { getFirebaseAdminDb, Timestamp } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    let finalDisplayName = authDisplayName;

    // Fallback: Check the users collection. Essential for users who haven't updated their Firebase Auth profile but have a Huddle profile.
    if (!finalDisplayName || finalDisplayName === "Anonymous") {
      const userDoc = await adminDb.collection("users").doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        finalDisplayName = userData?.displayName || userData?.name || "Anonymous";
      }
    }

    const chatRef = adminDb.collection("events").doc(eventId).collection("chat");
    await chatRef.add({
      userId,
      userName: finalDisplayName, // Store as userName to match client expectations
      message,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error sending message:", error)
    throw new Error("Failed to send message.")
  }
}

export const getChatMessages = async (eventId: string) => {
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const chatRef = adminDb.collection("events").doc(eventId).collection("chat");
    const snapshot = await chatRef.orderBy("timestamp", "asc").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    throw new Error("Failed to retrieve chat messages.")
  }
}

export const setCheckInStatus = async (eventId: string, organizerId: string, isOpen: boolean) => {
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const eventRef = adminDb.collection("events").doc(eventId);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) throw new Error("Event not found");
    if (eventSnap.data()?.createdBy !== organizerId) {
      throw new Error("Only the event organizer can change check-in status");
    }

    await eventRef.update({
      checkInOpen: isOpen
    });

    const updatedSnap = await eventRef.get();
    return { id: updatedSnap.id, ...updatedSnap.data() };
  } catch (error) {
    console.error("Error toggling check-in status:", error);
    throw (error instanceof Error ? error : new Error("Failed to toggle check-in status"));
  }
}

export const attendeeSelfCheckIn = async (eventId: string, playerId: string) => {
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const eventRef = adminDb.collection("events").doc(eventId);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) throw new Error("Event not found");
    const eventData = eventSnap.data();

    // Organizer can always manually check someone in, but self-check-in requires checkInOpen
    // This method is primarily for self-check-in.
    if (!eventData?.checkInOpen) {
      throw new Error("Check-in is not currently open for this event.");
    }

    if (!eventData?.players?.includes(playerId)) {
      throw new Error("You must be on the RSVP list to check in.");
    }

    await eventRef.update({
      [`checkIns.${playerId}`]: true
    });

    const updatedSnap = await eventRef.get();
    return { id: updatedSnap.id, ...updatedSnap.data() };
  } catch (error) {
    console.error("Error during self check-in:", error);
    throw (error instanceof Error ? error : new Error("Failed to self check-in"));
  }
}

// Keep the manual check-in for Organizers
export const checkInPlayer = async (eventId: string, playerId: string, organizerId: string, status: boolean = true) => {
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const eventRef = adminDb.collection("events").doc(eventId);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) throw new Error("Event not found");
    if (eventSnap.data()?.createdBy !== organizerId) {
      throw new Error("Only the event organizer can check in players");
    }

    await eventRef.update({
      [`checkIns.${playerId}`]: status
    });

    const updatedSnap = await eventRef.get();
    return { id: updatedSnap.id, ...updatedSnap.data() };
  } catch (error) {
    console.error("Error toggling check-in:", error);
    throw (error instanceof Error ? error : new Error("Failed to toggle check-in status"));
  }
}

export const getEventWithPlayerDetails = async (eventId: string) => {
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const eventSnap = await adminDb.collection("events").doc(eventId).get();
    if (!eventSnap.exists) return null;

    const rawData = eventSnap.data() as any;
    const event = {
      id: eventSnap.id,
      ...rawData,
      geopoint: rawData.geopoint ? {
        latitude: typeof rawData.geopoint.latitude === 'number' ? rawData.geopoint.latitude : rawData.geopoint._latitude,
        longitude: typeof rawData.geopoint.longitude === 'number' ? rawData.geopoint.longitude : rawData.geopoint._longitude
      } : null
    } as any;

    const playerIds = event.players || [];
    const playerDetails = await Promise.all(
      playerIds.map(async (uid: string) => {
        const userSnap = await adminDb.collection("users").doc(uid).get();
        return { uid, ...(userSnap.exists ? userSnap.data() : {}) };
      })
    );

    return { ...event, playerDetails };
  } catch (error) {
    console.error("Error fetching event with player details:", error);
    throw new Error("Failed to retrieve event details.");
  }
}

export const getUserOrganizedEvents = async (userId: string) => {
  if (!userId) return []
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const eventsRef = adminDb.collection("events")
    const q = eventsRef.where("createdBy", "==", userId)
    const querySnapshot = await q.get()
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching organized events:", error)
    throw new Error("Failed to fetch organized events.")
  }
}

export const getUserJoinedEvents = async (userId: string) => {
  if (!userId) return []
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const eventsRef = adminDb.collection("events")
    const q = eventsRef.where("players", "array-contains", userId)
    const querySnapshot = await q.get()
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching joined events:", error)
    throw new Error("Failed to fetch joined events.")
  }
}

export const getUserHistoryEvents = async (userId: string) => {
  if (!userId) return []
  try {
    const today = new Date().toISOString().split('T')[0];

    // Fetch both and merge
    const [organized, joined] = await Promise.all([
      getUserOrganizedEvents(userId),
      getUserJoinedEvents(userId)
    ]);

    // Deduplicate (since organizer is sometimes also in players)
    const eventMap = new Map();
    [...organized, ...joined].forEach((ev: any) => {
      // Filter out only past events
      if (ev.date < today) {
        eventMap.set(ev.id, ev);
      }
    });

    // Return sorted by date descending (newest past events first)
    return Array.from(eventMap.values()).sort((a: any, b: any) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error("Error fetching history events:", error);
    throw new Error("Failed to fetch history events.");
  }
}

export const getEventCountsForUser = async (userId: string) => {
  if (!userId) return { organized: 0, joined: 0, upcoming: 0 };
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const eventsRef = adminDb.collection("events");
    const today = new Date().toISOString().split('T')[0];

    const organizedQuery = eventsRef.where("createdBy", "==", userId);
    const joinedQuery = eventsRef.where("players", "array-contains", userId);
    const upcomingQuery = eventsRef
      .where("players", "array-contains", userId)
      .where("date", ">=", today)

    const [organizedSnap, joinedSnap, upcomingSnap] = await Promise.all([
      organizedQuery.count().get(),
      joinedQuery.count().get(),
      upcomingQuery.count().get()
    ]);

    return {
      organized: organizedSnap.data().count,
      joined: joinedSnap.data().count,
      upcoming: upcomingSnap.data().count
    };
  } catch (error) {
    console.error("Error fetching event counts for user:", error);
    return { organized: 0, joined: 0, upcoming: 0 };
  }
};

export const createNotification = async ({
  userId,
  type,
  message,
  eventId
}: {
  userId: string;
  type: "waitlist_promo" | "event_update" | "event_announcement" | "general" | "rsvp_update";
  message: string;
  eventId?: string;
}) => {
  try {
    const { getFirebaseAdminDb, Timestamp } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const userRef = adminDb.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      const userData = userSnap.data();

      // Determine if we should notify based on type and preferences
      let shouldNotify = true;
      if (type === "event_announcement" || type === "event_update") {
        if (userData?.notifyAnnouncements === false) shouldNotify = false;
      } else if (type === "waitlist_promo") {
        if (userData?.notifyPromotions === false) shouldNotify = false;
      } else if (type === "rsvp_update") {
        if (userData?.notifyReminders === false) shouldNotify = false; // Using reminder setting for RSVP updates broadly
      }

      if (!shouldNotify) {
        console.log(`Notification of type ${type} skipped for user ${userId} due to preferences.`);
        return;
      }
    }

    const notificationsRef = userRef.collection("notifications");

    await notificationsRef.add({
      userId,
      type,
      message,
      eventId: eventId || null,
      read: false,
      createdAt: Timestamp.now().toDate().toISOString()
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    // Don't throw for notifications to prevent blocking the main user action
  }
};

export const reportItem = async ({
  reporterId,
  targetId,
  itemType, // "user", "event", "photo"
  reason,
  details
}: {
  reporterId: string;
  targetId: string;
  itemType: "user" | "event" | "photo";
  reason: string;
  details?: string;
}) => {
  try {
    const { getFirebaseAdminDb, Timestamp } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const reportsRef = adminDb.collection("reports");
    await reportsRef.add({
      reporterId,
      targetId,
      itemType,
      reason,
      details: details || null,
      status: "pending", // pending, reviewed, dismissed
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error creating report:", error);
    throw new Error("Failed to submit report");
  }
};

export const toggleUserBlock = async (organizerId: string, targetUserId: string, block: boolean) => {
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const { FieldValue } = await import("firebase-admin/firestore");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const userRef = adminDb.collection("users").doc(organizerId);

    // Ensure document exists
    const docSnap = await userRef.get();
    if (!docSnap.exists) {
      // Create user doc if it somehow doesn't exist
      await userRef.set({ blockedUsers: [] }, { merge: true });
    }

    if (block) {
      await userRef.update({
        blockedUsers: FieldValue.arrayUnion(targetUserId)
      });
    } else {
      await userRef.update({
        blockedUsers: FieldValue.arrayRemove(targetUserId)
      });
    }
  } catch (error) {
    console.error("Error toggling user block:", error);
    throw new Error("Failed to update block list");
  }
};

export const toggleFollowUser = async (followerId: string, targetId: string, isFollowing: boolean) => {
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const { FieldValue, Timestamp } = await import("firebase-admin/firestore");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    if (followerId === targetId) {
      throw new Error("Cannot follow yourself");
    }

    const targetUserRef = adminDb.collection("users").doc(targetId);

    // Check if target has blocked the follower
    const targetSnap = await targetUserRef.get();
    if (targetSnap.exists && targetSnap.data()?.blockedUsers?.includes(followerId)) {
      throw new Error("UNAUTHORIZED_BLOCK");
    }

    const followerFollowingRef = adminDb.collection("users").doc(followerId).collection("following").doc(targetId);
    const targetFollowersRef = targetUserRef.collection("followers").doc(followerId);

    await adminDb.runTransaction(async (transaction) => {
      // It's a simple set/delete, but we use a transaction to ensure both subcollections stay in sync
      if (isFollowing) {
        transaction.set(followerFollowingRef, { followedAt: Timestamp.now() });
        transaction.set(targetFollowersRef, { followedAt: Timestamp.now() });
      } else {
        transaction.delete(followerFollowingRef);
        transaction.delete(targetFollowersRef);
      }
    });

  } catch (error: any) {
    console.error("Error toggling follow status:", error);
    if (error.message === "UNAUTHORIZED_BLOCK") {
      throw error;
    }
    throw new Error("Failed to update follow status");
  }
};

export const getFollowers = async (userId: string) => {
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const followersRef = adminDb.collection("users").doc(userId).collection("followers");
    const snapshot = await followersRef.get();

    if (snapshot.empty) return [];

    const followerIds = snapshot.docs.map(doc => doc.id);

    // Hydrate profile data (Batch lookup using whereIn)
    // Firestore whereIn has a limit of 30, so we chunk it just to be safe
    const hydratedUsers: any[] = [];
    for (let i = 0; i < followerIds.length; i += 30) {
      const chunk = followerIds.slice(i, i + 30);
      const userSnaps = await adminDb.collection("users").where("__name__", "in", chunk).get();
      userSnaps.forEach(doc => {
        hydratedUsers.push({ uid: doc.id, ...doc.data() });
      });
    }

    return hydratedUsers;
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw new Error("Failed to fetch followers");
  }
};

export const getFollowing = async (userId: string) => {
  try {
    const { getFirebaseAdminDb } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error("Firebase Admin not initialized");

    const followingRef = adminDb.collection("users").doc(userId).collection("following");
    const snapshot = await followingRef.get();

    if (snapshot.empty) return [];

    const followingIds = snapshot.docs.map(doc => doc.id);

    // Hydrate profile data
    const hydratedUsers: any[] = [];
    for (let i = 0; i < followingIds.length; i += 30) {
      const chunk = followingIds.slice(i, i + 30);
      const userSnaps = await adminDb.collection("users").where("__name__", "in", chunk).get();
      userSnaps.forEach(doc => {
        hydratedUsers.push({ uid: doc.id, ...doc.data() });
      });
    }

    return hydratedUsers;
  } catch (error) {
    console.error("Error fetching following:", error);
    throw new Error("Failed to fetch following");
  }
};

export const updateUserLocation = async (userId: string, latitude: number, longitude: number) => {
  try {
    const { getFirebaseAdminDb, GeoPoint } = await import("@/lib/firebase-admin");
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) return false;

    // geohash allows for efficient radius querying
    const geohash = geofire.geohashForLocation([latitude, longitude]);

    await adminDb.collection("users").doc(userId).update({
      lastKnownLocation: new GeoPoint(latitude, longitude),
      geohash: geohash,
      locationUpdatedAt: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error("Error updating user location:", error);
    return false;
  }
};
