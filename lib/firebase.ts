"use client"

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const validateConfig = () => {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
  const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key as keyof typeof firebaseConfig])

  if (missingKeys.length > 0) {
    throw new Error(`Missing Firebase configuration: ${missingKeys.join(", ")}`)
  }
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

const initializeFirebase = () => {
  if (typeof window === "undefined") {
    // Don't initialize on server side
    return null
  }

  try {
    validateConfig()

    // Initialize app if not already done
    if (!app) {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    }

    return app
  } catch (error) {
    console.error("Error initializing Firebase app:", error)
    throw error
  }
}

const getAuthInstance = (): Auth => {
  if (!auth) {
    const firebaseApp = initializeFirebase()
    if (!firebaseApp) {
      throw new Error("Firebase app not initialized - running on server side")
    }
    auth = getAuth(firebaseApp)
  }
  return auth
}

const getDbInstance = (): Firestore => {
  if (!db) {
    const firebaseApp = initializeFirebase()
    if (!firebaseApp) {
      throw new Error("Firebase app not initialized - running on server side")
    }
    db = getFirestore(firebaseApp)
  }
  return db
}

export { getAuthInstance as auth, getDbInstance as db }
export default initializeFirebase
