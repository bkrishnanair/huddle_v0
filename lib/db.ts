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

export const getUser = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const createUser = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { ...data, createdAt: Timestamp.now() });
};

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

export const saveFcmToken = async (userId: string, token: string) => {
  if (!userId || !token) return

  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      fcmTokens: arrayUnion(token),
    })
    console.log(`FCM token saved for user: ${userId}`)
  } catch (error) {
    // Check if the document exists, if not create it
    if ((error as any).code === 'not-found') {
      await setDoc(doc(db, "users", userId), { fcmTokens: [token] }, { merge: true });
      console.log(`FCM token saved for new user: ${userId}`)
    } else {
      console.error("Error saving FCM token:", error)
    }
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
    const eventRef = doc(db, "events", eventId)
    await updateDoc(eventRef, {
      players: arrayUnion(userId),
      currentPlayers: (await getDoc(eventRef)).get("currentPlayers") + 1
    })
    const updatedSnap = await getDoc(eventRef)
    return { id: updatedSnap.id, ...updatedSnap.data() }
  } catch (error) {
    console.error("Error joining event:", error)
    throw new Error("Failed to join event.")
  }
}

export const leaveEvent = async (eventId: string, userId: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    await updateDoc(eventRef, {
      players: arrayRemove(userId),
      currentPlayers: Math.max(0, (await getDoc(eventRef)).get("currentPlayers") - 1)
    })
    const updatedSnap = await getDoc(eventRef)
    return { id: updatedSnap.id, ...updatedSnap.data() }
  } catch (error) {
    console.error("Error leaving event:", error)
    throw new Error("Failed to leave event.")
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
    const eventsRef = collection(db, "events")
    const q = query(eventsRef, where("createdBy", "==", userId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching organized events:", error)
    throw new Error("Failed to fetch organized events.")
  }
}

export const getUserJoinedEvents = async (userId: string) => {
  if (!userId) return []
  try {
    const eventsRef = collection(db, "events")
    const q = query(eventsRef, where("players", "array-contains", userId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching joined events:", error)
    throw new Error("Failed to fetch joined events.")
  }
}

export const getEventCountsForUser = async (userId: string) => {
  if (!userId) return { organized: 0, joined: 0, upcoming: 0 };
  try {
    const eventsRef = collection(db, "events");
    const today = new Date().toISOString().split('T')[0];

    const organizedQuery = query(eventsRef, where("createdBy", "==", userId));
    const joinedQuery = query(eventsRef, where("players", "array-contains", userId));
    const upcomingQuery = query(eventsRef,
      where("players", "array-contains", userId),
      where("date", ">=", today)
    );

    const [organizedSnap, joinedSnap, upcomingSnap] = await Promise.all([
      getCountFromServer(organizedQuery),
      getCountFromServer(joinedQuery),
      getCountFromServer(upcomingQuery)
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
