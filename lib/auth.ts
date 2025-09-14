// lib/auth.ts
// This file contains authentication logic that is safe to run on the CLIENT-SIDE.
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUser, getUser } from "./db";

const googleProvider = new GoogleAuthProvider();

// These functions are designed to be called only in the browser.

export const signUpWithEmail = async (email: string, password:string, name: string) => {
  if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await createUser(user.uid, { email: user.email!, name });
  return { uid: user.uid, email: user.email!, name };
};

export const signInWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

// SOCIAL LOGIN: This function INITIATES the redirect flow.
export const signInWithGoogle = async () => {
  if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
  await signInWithRedirect(auth, googleProvider);
};

// This function HANDLES the result after the user is redirected back to the app.
export const handleGoogleRedirectResult = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
    const result = await getRedirectResult(auth);
    if (result) {
        const user = result.user;
        const userProfile = await getUser(user.uid);
        if (!userProfile) {
            await createUser(user.uid, {
                email: user.email!,
                name: user.displayName || user.email?.split('@')[0] || 'New User',
                photoURL: user.photoURL || null,
            });
        }
        return user;
    }
    return null;
};

export const logOut = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
    await signOut(auth);
};
