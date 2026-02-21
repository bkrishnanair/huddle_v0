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
    return eventSnap.exists() ? { id: eventSnap.id, ...eventSnap.data() } : null
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

export const sendMessage = async (eventId: string, userId: string, displayName: string, message: string) => {
  try {
    const chatRef = collection(db, "events", eventId, "chat")
    await addDoc(chatRef, {
      userId,
      displayName,
      message,
      createdAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error sending message:", error)
    throw new Error("Failed to send message.")
  }
}

export const getChatMessages = async (eventId: string) => {
  try {
    const chatRef = collection(db, "events", eventId, "chat")
    const q = query(chatRef, orderBy("createdAt", "asc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    throw new Error("Failed to retrieve chat messages.")
  }
}

export const checkInPlayer = async (eventId: string, playerId: string, organizerId: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    const eventSnap = await getDoc(eventRef)

    if (!eventSnap.exists()) throw new Error("Event not found")
    if (eventSnap.get("createdBy") !== organizerId) {
      throw new Error("Only the event organizer can check in players")
    }

    await updateDoc(eventRef, {
      [`checkIns.${playerId}`]: true
    })

    const updatedSnap = await getDoc(eventRef)
    return { id: updatedSnap.id, ...updatedSnap.data() }
  } catch (error) {
    console.error("Error checking in player:", error)
    throw (error instanceof Error ? error : new Error("Failed to check in player"))
  }
}

export const getEventWithPlayerDetails = async (eventId: string) => {
  try {
    const event = await getEvent(eventId) as any
    if (!event) return null

    const playerIds = event.players || []
    const playerDetails = await Promise.all(
      playerIds.map(async (uid: string) => {
        const profile = await getUser(uid)
        return { uid, ...profile }
      })
    )

    return { ...event, playerDetails }
  } catch (error) {
    console.error("Error fetching event with player details:", error)
    throw new Error("Failed to retrieve event details.")
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
