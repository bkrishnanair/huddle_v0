// lib/firebase-admin.ts
import * as admin from "firebase-admin";

// This file is for SERVER-SIDE use only. It uses the Admin SDK.

// Securely parse the service account key from environment variables.
// This prevents sensitive credentials from being hardcoded in the source code.
const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Replaces escaped newlines
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Check if the admin app has already been initialized to prevent errors.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    // Provide a more helpful error message if initialization fails.
    console.error("Firebase Admin initialization error:", `[${error.code}] ${error.message}`);
  }
}

// Export the initialized admin instance for use in other server-side files.
export { admin };
