import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

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
