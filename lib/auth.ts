// lib/auth.ts
// This file contains authentication logic that is safe to run on the CLIENT-SIDE.
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

const googleProvider = new GoogleAuthProvider();

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
 */
export const getCurrentUser = (): User | null => {
  if (!auth) return null;
  return auth.currentUser;
};
