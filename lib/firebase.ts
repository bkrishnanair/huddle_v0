
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore, doc, getDoc } from "firebase/firestore";

// Your Firebase config object, pulled from environment variables.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate that all required config values are present.
// This will throw a clear error during the build if a variable is missing.
const requiredConfig = Object.keys(firebaseConfig);
const missingConfig = requiredConfig.filter(
  (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
);

if (missingConfig.length > 0) {
  throw new Error(
    `Missing Firebase configuration variables: ${missingConfig.join(
      ", "
    )}. Please check your Vercel environment variables.`
  );
}

// Initialize Firebase App (Singleton Pattern)
// This prevents re-initialization on hot-reloads in development.
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize and export Firebase services.
// By passing the 'app' object, we ensure they are always linked to the correct instance.
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };

export const checkFirebaseHealth = async () => {
  const health = {
    app: true,
    auth: true,
    db: true,
    error: null,
    timestamp: new Date().toISOString(),
  };

  try {
    // 1. App Health (already initialized, so if we're here, it's ok)
    health.app = !!getApp();

    // 2. Auth Health (check if we can get a user, even if null)
    try {
      getAuth(app);
    } catch (e) {
      health.auth = false;
      throw new Error("Auth service failed to initialize.");
    }

    // 3. Firestore Health (try a simple read)
    try {
      await getDoc(doc(db, "health_check", "test"));
    } catch (e: any) {
      // Allow "permission-denied" as it means the service is running
      if (e.code !== 'permission-denied') {
        health.db = false;
        throw new Error(`Firestore read failed: ${e.message}`);
      }
    }

  } catch (error: any) {
    console.error("Firebase Health Check Failed:", error);
    health.error = error.message;
  }

  return health;
};

export const debugFirebaseConfig = () => {
  console.groupCollapsed("Firebase Config Debug");
  console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log("Auth Domain:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Loaded" : "MISSING!");
  console.groupEnd();
};
