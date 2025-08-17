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

// ... (existing user and event management functions) ...

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

// ... (existing chat management functions) ...
