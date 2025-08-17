// lib/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUser, getUser } from "./db";
import { cookies } from "next/headers";
import { admin } from "./firebase-admin";

const googleProvider = new GoogleAuthProvider();

// --- CLIENT-SIDE AUTH FUNCTIONS ---
// These functions are designed to be called only in the browser.

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await createUser({ uid: user.uid, email: user.email!, name });
  return { uid: user.uid, email: user.email!, name };
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signInWithGoogle = async () => {
  if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const existingUser = await getUser(user.uid);
  if (!existingUser) {
    await createUser({
      uid: user.uid,
      email: user.email!,
      name: user.displayName || user.email!.split("@")[0],
    });
  }
  return user;
};

export const logOut = async () => {
  if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
  await signOut(auth);
};

/**
 * getCurrentUser (Client-Side)
 * Provides a synchronous, immediate check for the current user state in the browser.
 * Best for UI checks and client-side logic.
 */
export const getCurrentUser = (): User | null => {
  if (!auth) return null;
  return auth.currentUser;
};

// --- SERVER-SIDE AUTH FUNCTIONS ---
// These functions are for use in Next.js API Routes and Server Components.

/**
 * getServerCurrentUser (Server-Side)
 * Verifies the session cookie from the incoming request to securely identify the user.
 * This is the correct way to handle authentication on the server.
 */
export const getServerCurrentUser = async () => {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) return null;

  try {
    // Use the Firebase Admin SDK to verify the cookie and get user details.
    const decodedIdToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedIdToken;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
};
