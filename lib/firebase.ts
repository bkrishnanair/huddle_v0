import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDHH8xowb0z2kFi14MzY0iWTG-Nwp0EL90",
  authDomain: "huddle-dca59.firebaseapp.com",
  projectId: "huddle-dca59",
  storageBucket: "huddle-dca59.firebasestorage.app",
  messagingSenderId: "167280397242",
  appId: "1:167280397242:web:dc99d87a60a0dba0f9ab83",
}

// Initialize Firebase app
let app
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
} catch (error) {
  console.error("Error initializing Firebase app:", error)
  throw error
}

// Initialize Firebase services with error handling
let auth
let db

try {
  auth = getAuth(app)
  db = getFirestore(app)
} catch (error) {
  console.error("Error initializing Firebase services:", error)
  throw error
}

export { auth, db }
export default app
