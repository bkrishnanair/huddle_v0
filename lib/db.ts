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
} from "firebase/firestore";
import { db } from "./firebase";

// User Management
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
    // Re-throw the error to be caught by the API route
    throw new Error("Failed to retrieve events from the database.");
  }
};

export const getUserEvents = async (userId: string) => {
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

/**
 * Saves a new FCM token to a user's document in Firestore.
 * It adds the token to an array to prevent overwriting existing tokens.
 * @param {string} userId - The ID of the user.
 * @param {string} token - The FCM token to save.
 */
export const saveFcmToken = async (userId: string, token: string) => {
  if (!userId || !token) return;

  try {
    const userRef = doc(db, "users", userId);
    // Use arrayUnion to add the new token to the fcmTokens array
    // This safely handles cases where the field doesn't exist yet
    // and prevents duplicate tokens from being added.
    await updateDoc(userRef, {
      fcmTokens: arrayUnion(token),
    });
    console.log(`FCM token saved for user: ${userId}`);
  } catch (error) {
    console.error("Error saving FCM token:", error);
  }
};

// Chat Management
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
