// lib/firebase-admin.ts
import * as fbAdmin from 'firebase-admin';
// CORRECT: Import the specific service getters from the 'firebase-admin' package.
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

// This file is for SERVER-SIDE use only. It uses the Admin SDK.

declare global {
  var _firebaseAdminInstance: fbAdmin.app.App | undefined;
}

function initializeFirebaseAdmin(): fbAdmin.app.App {
  if (global._firebaseAdminInstance) {
    return global._firebaseAdminInstance;
  }

  if (fbAdmin.apps.length > 0) {
    const defaultApp = fbAdmin.app();
    global._firebaseAdminInstance = defaultApp;
    return defaultApp;
  }

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
    throw new Error(
      "Firebase Admin SDK credentials are not set in the environment. " +
      "Please check your .env or .env.local file."
    );
  }
  
  console.log(`🚀 Initializing Firebase Admin SDK for project: ${serviceAccount.projectId}`);

  const instance = fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceAccount),
  });
  
  global._firebaseAdminInstance = instance;
  return instance;
}

function getFirebaseAdmin(): fbAdmin.app.App {
  return initializeFirebaseAdmin();
}

/**
 * A getter for the Firebase Admin Auth service.
 * Ensures the SDK is initialized before returning the service.
 */
export function getAdminAuth(): Auth {
  return getAuth(getFirebaseAdmin());
}

/**
 * A getter for the Firestore database instance from the Admin SDK.
 * Ensures the SDK is initialized before returning the service.
 */
export function getAdminDb(): Firestore {
  // CRITICAL FIX: The function was calling itself recursively. It must call `getFirestore`.
  return getFirestore(getFirebaseAdmin());
}

// Re-exporting the original admin namespace for utility types, etc.
export const admin = fbAdmin;
