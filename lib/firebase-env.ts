import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate that all required config values are present
const requiredConfig = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]

const missingConfig = requiredConfig.filter((key) => !firebaseConfig[key as keyof typeof firebaseConfig])

if (missingConfig.length > 0) {
  throw new Error(`Missing Firebase configuration: ${missingConfig.join(", ")}`)
}

// 1. Initialize the Firebase app first
const app = initializeApp(firebaseConfig)

// 2. Then, get the services from that initialized app
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
