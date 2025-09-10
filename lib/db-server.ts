// lib/db-server.ts
// THIS FILE IS SERVER-SIDE ONLY.
// It uses the Firebase Admin SDK for all database operations.

import "server-only";
import { getAdminDb } from "./firebase-admin";
import * as geofire from "geofire-common";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const db = getAdminDb();

export const getUser = async (userId: string) => {
  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();
  return userSnap.exists ? userSnap.data() : null;
};

export const createUser = async (userId: string, data: any) => {
  const userRef = db.collection("users").doc(userId);
  await userRef.set({ ...data, createdAt: Timestamp.now() });
};

// CORRECT: This function is now updated to return the newly created event object,
// including its server-generated ID and creation timestamp.
export const createEvent = async (eventData: any) => {
  try {
    const eventsCol = db.collection("events");
    const newEventRef = await eventsCol.add({
      ...eventData,
      createdAt: Timestamp.now(),
    });

    // After creating the event, we fetch it back to get the full document.
    const newEventSnap = await newEventRef.get();
    
    // Return the complete event object, which now includes the Firestore-generated ID.
    return { id: newEventSnap.id, ...newEventSnap.data() };

  } catch (error) {
    console.error("Error creating event in Firestore:", error);
    throw new Error("Failed to save event to the database.");
  }
};

export const getEvents = async () => {
  try {
    const eventsCol = db.collection("events");
    const eventSnapshot = await eventsCol.get();
    return eventSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching events from Firestore:", error);
    throw new Error("Failed to retrieve events from the database.");
  }
};

export const getNearbyEvents = async (center: [number, number], radiusInM: number) => {
    try {
      const bounds = geofire.geohashQueryBounds(center, radiusInM);
      const promises = [];
  
      for (const b of bounds) {
        const q = db.collection("events")
          .orderBy("geohash")
          .startAt(b[0])
          .endAt(b[1]);
        promises.push(q.get());
      }
  
      const snapshots = await Promise.all(promises);
      const matchingDocs: any[] = [];
  
      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const lat = doc.get("latitude");
          const lng = doc.get("longitude");
  
          if (typeof lat === 'number' && typeof lng === 'number') {
            const distanceInKm = geofire.distanceBetween([lat, lng], center);
            const distanceInM = distanceInKm * 1000;
            if (distanceInM <= radiusInM) {
              matchingDocs.push({ id: doc.id, ...doc.data() });
            }
          }
        }
      }
      return matchingDocs;
    } catch (error) {
      console.error("Error fetching nearby events:", error);
      throw new Error("Failed to query nearby events.");
    }
  };

export const getUserOrganizedEvents = async (userId: string) => {
  if (!userId) return [];
  try {
    const eventsRef = db.collection("events");
    const q = eventsRef.where("hostId", "==", userId).orderBy("createdAt", "desc");
    const querySnapshot = await q.get();
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching organized events:", error);
    throw new Error("Failed to fetch organized events.");
  }
};

export const getUserJoinedEvents = async (userId: string) => {
  if (!userId) return [];
  try {
    const eventsRef = db.collection("events");
    const q = eventsRef.where("players", "array-contains", userId).orderBy("date", "asc");
    const querySnapshot = await q.get();
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching joined events:", error);
    throw new Error("Failed to fetch joined events.");
  }
};

export const saveFcmToken = async (userId: string, token: string) => {
    if (!userId || !token) return;
  
    try {
      const userRef = db.collection("users").doc(userId);
      await userRef.update({
        fcmTokens: FieldValue.arrayUnion(token),
      });
      console.log(`FCM token saved for user: ${userId}`);
    } catch (error: any) {
      if (error.code === 5) { // 5 = NOT_FOUND for Firestore Admin SDK
        await db.collection("users").doc(userId).set({ fcmTokens: [token] }, { merge: true });
        console.log(`FCM token saved for new user: ${userId}`);
      } else {
        console.error("Error saving FCM token:", error);
      }
    }
  };
