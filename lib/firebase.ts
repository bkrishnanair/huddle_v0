"use client"

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

// Reverted back to Next.js environment variables from Vite
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

const validateConfig = () => {
  if (typeof window === "undefined") {
    return false
  }

  const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
  const missingKeys = requiredKeys.filter((key) => {
    const value = firebaseConfig[key as keyof typeof firebaseConfig]
    return !value || value === "undefined" || value.startsWith("your-")
  })

  if (missingKeys.length > 0) {
    console.error(`Missing or invalid Firebase configuration: ${missingKeys.join(", ")}`)
    console.error("Please check your .env.local file and ensure all Firebase environment variables are set correctly")
    return false
  }
  return true
}

const initializeFirebase = () => {
  if (typeof window === "undefined") {
    return null
  }

  if (app) {
    return app
  }

  try {
    if (!validateConfig()) {
      throw new Error("Invalid Firebase configuration")
    }

    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    return app
  } catch (error) {
    console.error("Error initializing Firebase app:", error)
    return null
  }
}

const getAuthInstance = (): Auth | null => {
  if (typeof window === "undefined") {
    return null
  }

  if (!auth) {
    const firebaseApp = initializeFirebase()
    if (!firebaseApp) {
      return null
    }
    auth = getAuth(firebaseApp)
  }
  return auth
}

const getDbInstance = (): Firestore | null => {
  if (typeof window === "undefined") {
    return null
  }

  if (!db) {
    const firebaseApp = initializeFirebase()
    if (!firebaseApp) {
      return null
    }
    db = getFirestore(firebaseApp)
  }
  return db
}

export { getAuthInstance as auth, getDbInstance as db }
export default initializeFirebase
