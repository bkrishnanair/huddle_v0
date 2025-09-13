// lib/firebase-admin.ts
// This file is for SERVER-SIDE use only. It uses the Admin SDK.
import "server-only";

import { getApps, getApp, initializeApp, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Environment variable validation
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId) {
  console.error("❌ FIREBASE_PROJECT_ID environment variable is missing");
}
if (!clientEmail) {
  console.error("❌ FIREBASE_CLIENT_EMAIL environment variable is missing");
}
if (!privateKey) {
  console.error("❌ FIREBASE_PRIVATE_KEY environment variable is missing");
}

// Fallback configuration for development
const shouldUseFallback = !projectId || !clientEmail || !privateKey;
if (shouldUseFallback) {
  console.warn("⚠️ Firebase Admin credentials missing, using fallback configuration");
}

let adminApp: App;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

try {
  if (shouldUseFallback) {
    // Fallback: Initialize without credentials for development
    console.log("🔧 Initializing Firebase Admin SDK in fallback mode");
    adminApp = getApps().length ? getApp() : initializeApp();
  } else {
    // Production: Initialize with proper service account credentials
    const serviceAccount = {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
    };

    adminApp = getApps().length 
      ? getApp() 
      : initializeApp({
          credential: cert(serviceAccount),
        });
  }

  // Initialize Auth and Firestore services
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
  
  console.log("✅ Firebase Admin SDK initialized successfully");
} catch (error: any) {
  console.error("🚨 Firebase Admin initialization error:", {
    code: error.code,
    message: error.message,
    shouldUseFallback,
    hasProjectId: !!projectId,
    hasClientEmail: !!clientEmail,
    hasPrivateKey: !!privateKey,
  });
}

// Export services
export { adminApp as admin, adminAuth, adminDb };

// Legacy admin export for backward compatibility
export const admin_legacy = {
  auth: () => adminAuth,
  firestore: () => adminDb,
  apps: getApps(),
};

// Helper functions for routes
export const verifyIdToken = async (idToken: string) => {
  if (!adminAuth) {
    throw new Error("Firebase Admin Auth not initialized");
  }
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error: any) {
    console.error("🚨 Token verification failed:", error.message);
    return null;
  }
};

export const getFirebaseAdminDb = () => {
  if (!adminDb) {
    console.error("🚨 Firebase Admin Firestore not initialized");
    return null;
  }
  return adminDb;
};

// Health check function
export const checkAdminSdkHealth = () => {
  return {
    initialized: !!adminApp,
    authAvailable: !!adminAuth,
    firestoreAvailable: !!adminDb,
    credentials: {
      projectId: !!projectId,
      clientEmail: !!clientEmail,
      privateKey: !!privateKey,
    },
    fallbackMode: shouldUseFallback,
  };
};
