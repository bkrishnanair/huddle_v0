import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

// Debug utility for Firebase configuration
export const debugFirebaseConfig = () => {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✓ Set" : "✗ Missing",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✓ Set" : "✗ Missing",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✓ Set" : "✗ Missing",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✓ Set" : "✗ Missing",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "✓ Set" : "✗ Missing",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✓ Set" : "✗ Missing",
  }

  console.log("🔥 Firebase Configuration Status:", config)
  return config
}

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    console.error("🚨 Missing Firebase environment variables:", missing)
    throw new Error(`Missing Firebase configuration: ${missing.join(", ")}`)
  }

  return true
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let initializationError: string | null = null

// Safe Firebase initialization with comprehensive error handling
const initializeFirebase = () => {
  try {
    // Only initialize on client side
    if (typeof window === "undefined") {
      console.log("🔥 Firebase: Skipping server-side initialization")
      return { app: null, auth: null, db: null }
    }

    // Validate configuration first
    validateFirebaseConfig()

    // Debug configuration status
    debugFirebaseConfig()

    // Initialize Firebase app (singleton pattern)
    if (!app) {
      app = getApps().length ? getApp() : initializeApp(firebaseConfig)
      console.log("🔥 Firebase: App initialized successfully")
    }

    // Initialize Auth
    if (!auth && app) {
      auth = getAuth(app)
      console.log("🔥 Firebase: Auth initialized successfully")
    }

    // Initialize Firestore with proper async handling
    if (!db && app) {
      db = getFirestore(app)

      // Only log success, no environment checks on client
      console.log("🔥 Firebase: Firestore initialized successfully")
    }

    initializationError = null
    return { app, auth, db }
  } catch (error: any) {
    console.error("🚨 Firebase initialization failed:", error)
    initializationError = error.message

    // Return null instances but don't throw - let components handle gracefully
    return { app: null, auth: null, db: null }
  }
}

// Initialize Firebase
const { app: firebaseApp, auth: firebaseAuth, db: firebaseDb } = initializeFirebase()

// Export with null checks and error handling
export const getFirebaseApp = (): FirebaseApp | null => {
  if (initializationError) {
    console.warn("🔥 Firebase: App not available due to initialization error:", initializationError)
  }
  return firebaseApp
}

export const getFirebaseAuth = (): Auth | null => {
  if (initializationError) {
    console.warn("🔥 Firebase: Auth not available due to initialization error:", initializationError)
  }
  return firebaseAuth
}

export const getFirebaseDb = (): Firestore | null => {
  if (initializationError) {
    console.warn("🔥 Firebase: Firestore not available due to initialization error:", initializationError)
  }
  return firebaseDb
}

// Legacy exports for backward compatibility
export { firebaseApp as app, firebaseAuth as auth, firebaseDb as db }

// Health check utility
export const checkFirebaseHealth = async () => {
  const health = {
    app: !!firebaseApp,
    auth: !!firebaseAuth,
    db: !!firebaseDb,
    error: initializationError,
    timestamp: new Date().toISOString(),
  }

  console.log("🔥 Firebase Health Check:", health)
  return health
}
