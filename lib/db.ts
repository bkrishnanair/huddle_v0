// lib/db.ts
// THIS FILE IS FOR CLIENT-SIDE DATABASE OPERATIONS.
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
} from "firebase/firestore";
import { db } from "./firebase"; // CORRECT: Use the client-side db instance.
import * as geofire from "geofire-common";

// Re-export the database instance for convenience.
export { db };

// These functions are safe to run on the client.

export const getUser = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const createUser = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { ...data, createdAt: Timestamp.now() });
};

// Note: Client-side event creation might be re-enabled later, but for now,
// all event creation is handled by the server-side API.

export const getEvent = async (eventId: string) => {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    return eventSnap.exists() ? { id: eventSnap.id, ...eventSnap.data() } : null;
};
