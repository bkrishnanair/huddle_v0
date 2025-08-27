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
  // Use the more specific createUser function from db.ts
  await createUser(user.uid, { email: user.email!, name });
  return { uid: user.uid, email: user.email!, name };
};

export const signInWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

// SOCIAL LOGIN: This is the new function for handling Google Sign-In.
export const signInWithGoogle = async () => {
  if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
  
  // 1. Trigger the Google Sign-In popup.
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // 2. Check if the user already exists in our Firestore 'users' collection.
  const userProfile = await getUser(user.uid);

  // 3. If the user is new (no profile exists), create a new document for them.
  if (!userProfile) {
    await createUser(user.uid, {
      email: user.email!,
      name: user.displayName || user.email?.split('@')[0] || 'New User',
      photoURL: user.photoURL || null,
    });
  }

  // 4. Return the user object for the application to use.
  return user;
};


export const logOut = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
    await signOut(auth);
};
