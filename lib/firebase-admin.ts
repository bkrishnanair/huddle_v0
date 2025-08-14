import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

// Server-side Firebase Admin SDK configuration
let adminApp: App | null = null
let adminAuth: Auth | null = null
let adminDb: Firestore | null = null
let initializationError: string | null = null

const initializeFirebaseAdmin = () => {
  try {
    // Only initialize on server side
    if (typeof window !== "undefined") {
      console.log("🔥 Firebase Admin: Skipping client-side initialization")
      return { app: null, auth: null, db: null }
    }

    // Check if already initialized
    if (adminApp) {
      console.log("🔥 Firebase Admin: Already initialized, reusing instances")
      return { app: adminApp, auth: adminAuth, db: adminDb }
    }

    // Validate required environment variables
    const requiredVars = ["FIREBASE_PROJECT_ID", "FIREBASE_PRIVATE_KEY", "FIREBASE_CLIENT_EMAIL"]
    const missing = requiredVars.filter((varName) => !process.env[varName])

    if (missing.length > 0) {
      throw new Error(`Missing Firebase Admin environment variables: ${missing.join(", ")}`)
    }

    console.log("🔥 Firebase Admin: Initializing with project:", process.env.FIREBASE_PROJECT_ID)

    // Initialize Firebase Admin app
    if (getApps().length === 0) {
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      })
    } else {
      adminApp = getApps()[0]
    }

    // Initialize Admin Auth
    adminAuth = getAuth(adminApp)

    // Initialize Admin Firestore
    adminDb = getFirestore(adminApp)

    console.log("🔥 Firebase Admin: Initialized successfully")
    console.log("🔥 Firebase Admin Services:", {
      app: !!adminApp,
      auth: !!adminAuth,
      firestore: !!adminDb,
    })

    initializationError = null

    return { app: adminApp, auth: adminAuth, db: adminDb }
  } catch (error: any) {
    console.error("🚨 Firebase Admin initialization failed:", error)
    console.error("🚨 Environment check:", {
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    })
    initializationError = error.message
    return { app: null, auth: null, db: null }
  }
}

// Initialize Firebase Admin
const { app: firebaseAdminApp, auth: firebaseAdminAuth, db: firebaseAdminDb } = initializeFirebaseAdmin()

// Export functions with error handling
export const getFirebaseAdminApp = (): App | null => {
  if (initializationError) {
    console.warn("🔥 Firebase Admin: App not available due to initialization error:", initializationError)
  }
  return firebaseAdminApp
}

export const getFirebaseAdminAuth = (): Auth | null => {
  if (initializationError) {
    console.warn("🔥 Firebase Admin: Auth not available due to initialization error:", initializationError)
  }
  return firebaseAdminAuth
}

export const getFirebaseAdminDb = (): Firestore | null => {
  if (initializationError) {
    console.warn("🔥 Firebase Admin: Firestore not available due to initialization error:", initializationError)
  }
  return firebaseAdminDb
}

// Utility function to verify ID tokens
export const verifyIdToken = async (idToken: string) => {
  try {
    const auth = getFirebaseAdminAuth()
    if (!auth) {
      throw new Error("Firebase Admin Auth not initialized")
    }

    console.log("🔍 Verifying ID token...")
    const decodedToken = await auth.verifyIdToken(idToken)
    console.log("✅ Token verified for user:", decodedToken.uid)
    return decodedToken
  } catch (error: any) {
    console.error("🚨 Token verification failed:", error)
    console.error("🚨 Token verification error details:", {
      message: error.message,
      code: error.code,
    })
    throw error
  }
}

export const getAdminUser = async (uid: string) => {
  try {
    const db = getFirebaseAdminDb()
    if (!db) {
      throw new Error("Firebase Admin Firestore not initialized")
    }

    console.log("🔍 Fetching user from Firestore Admin SDK:", uid)
    const userRef = db.collection("users").doc(uid)
    const userDoc = await userRef.get()

    if (userDoc.exists) {
      const userData = { id: userDoc.id, ...userDoc.data() }
      console.log("✅ User found:", userData.name || userData.email)
      return userData
    }

    console.log("⚠️ User not found:", uid)
    return null
  } catch (error: any) {
    console.error("🚨 Error fetching user with Admin SDK:", error)
    throw error
  }
}

export const createAdminUser = async (userData: {
  uid: string
  email: string
  name: string
}) => {
  try {
    const db = getFirebaseAdminDb()
    if (!db) {
      throw new Error("Firebase Admin Firestore not initialized")
    }

    console.log("🔍 Creating user with Admin SDK:", userData.email)
    const userRef = db.collection("users").doc(userData.uid)
    await userRef.set({
      ...userData,
      createdAt: new Date(),
    })

    console.log("✅ User created successfully:", userData.name)
    return userData
  } catch (error: any) {
    console.error("🚨 Error creating user with Admin SDK:", error)
    throw error
  }
}

// Health check for Firebase Admin
export const checkFirebaseAdminHealth = () => {
  const health = {
    app: !!firebaseAdminApp,
    auth: !!firebaseAdminAuth,
    db: !!firebaseAdminDb,
    error: initializationError,
    timestamp: new Date().toISOString(),
  }

  console.log("🔥 Firebase Admin Health Check:", health)
  return health
}
