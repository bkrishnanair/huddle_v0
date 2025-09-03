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

// ... (existing functions)

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

// ... (rest of the file)
