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
  GeoPoint,
} from "firebase/firestore";
import { db } from "./firebase";
import * as geofire from "geofire-common";

// ... (User Management functions remain the same) ...
export const getUser = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const createUser = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { ...data, createdAt: Timestamp.now() });
};


// Event Management
export const getEvents = async () => {
  try {
    const eventsCol = collection(db, "events");
    const eventSnapshot = await getDocs(eventsCol);
    return eventSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching events from Firestore:", error);
    throw new Error("Failed to retrieve events from the database.");
  }
};

// GEO: New function to create an event with geospatial data.
export const createEvent = async (eventData: any) => {
  try {
    const eventsCol = collection(db, "events");
    const newEventRef = await addDoc(eventsCol, {
      ...eventData,
      createdAt: Timestamp.now(),
    });
    return { id: newEventRef.id, ...eventData };
  } catch (error) {
    console.error("Error creating event in Firestore:", error);
    throw new Error("Failed to save event to the database.");
  }
};


// GEO: New function to query events based on proximity.
export const getNearbyEvents = async (center: [number, number], radiusInM: number) => {
  try {
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];

    for (const b of bounds) {
      const q = query(
        collection(db, "events"),
        orderBy("geohash"),
        where("geohash", ">=", b[0]),
        where("geohash", "<=", b[1])
      );
      promises.push(getDocs(q));
    }

    const snapshots = await Promise.all(promises);
    const matchingDocs = [];

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const lat = doc.get("geopoint").latitude;
        const lng = doc.get("geopoint").longitude;

        const distanceInKm = geofire.distanceBetween([lat, lng], center);
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= radiusInM) {
          matchingDocs.push({ id: doc.id, ...doc.data() });
        }
      }
    }
    return matchingDocs;
  } catch (error) {
    console.error("Error fetching nearby events:", error);
    throw new Error("Failed to query nearby events.");
  }
};


export const getUserEvents = async (userId: string) => {
  // ... (function remains the same) ...
  if (!userId) return [];

  const eventsRef = collection(db, "events");

  // Query for events created by the user
  const createdQuery = query(eventsRef, where("createdBy", "==", userId));

  // Query for events where the user is a player
  const joinedQuery = query(
    eventsRef,
    where("players", "array-contains", userId)
  );

  const [createdSnapshot, joinedSnapshot] = await Promise.all([
    getDocs(createdQuery),
    getDocs(joinedQuery),
  ]);

  const eventsMap = new Map();
  createdSnapshot.docs.forEach((doc) =>
    eventsMap.set(doc.id, { id: doc.id, ...doc.data() })
  );
  joinedSnapshot.docs.forEach((doc) =>
    eventsMap.set(doc.id, { id: doc.id, ...doc.data() })
  );

  return Array.from(eventsMap.values());
};

// ... (Chat and FCM Token functions remain the same) ...
export const saveFcmToken = async (userId: string, token: string) => {
  if (!userId || !token) return;

  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      fcmTokens: arrayUnion(token),
    });
    console.log(`FCM token saved for user: ${userId}`);
  } catch (error) {
    console.error("Error saving FCM token:", error);
  }
};

export const sendMessage = async (
  eventId: string,
  userId: string,
  userName: string,
  message: string
) => {
  const chatRef = collection(db, "events", eventId, "chat");
  await addDoc(chatRef, {
    userId,
    userName,
    message,
    timestamp: Timestamp.now(),
  });
};

export const getChatMessages = async (eventId: string) => {
  const chatRef = collection(db, "events", eventId, "chat");
  const q = query(chatRef, orderBy("timestamp", "asc"));
  const chatSnapshot = await getDocs(q);
  return chatSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
