import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from "firebase/auth"
import { auth } from "./firebase"
import { createUser, getUser } from "./db"

const googleProvider = new GoogleAuthProvider()

export const getAuth = async (): Promise<User | null> => {
  try {
    return await getCurrentUser()
  } catch (error) {
    console.error("Error getting auth:", error)
    return null
  }
}

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    if (!auth) {
      throw new Error("Firebase Auth is not initialized")
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create user document in Firestore
    await createUser({
      uid: user.uid,
      email: user.email!,
      name,
    })

    return {
      uid: user.uid,
      email: user.email!,
      name,
    }
  } catch (error: any) {
    console.error("Error signing up:", error)
    throw new Error(error.message)
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  try {
    if (!auth) {
      throw new Error("Firebase Auth is not initialized")
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    return {
      uid: user.uid,
      email: user.email!,
    }
  } catch (error: any) {
    console.error("Error signing in:", error)
    throw new Error(error.message)
  }
}

export const signInWithGoogle = async () => {
  try {
    if (!auth) {
      throw new Error("Firebase Auth is not initialized")
    }

    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Check if user already exists in Firestore
    const existingUser = await getUser(user.uid)

    // If user doesn't exist, create a new user document
    if (!existingUser) {
      await createUser({
        uid: user.uid,
        email: user.email!,
        name: user.displayName || user.email!.split("@")[0],
      })
    }

    return {
      uid: user.uid,
      email: user.email!,
      name: user.displayName || existingUser?.name || user.email!.split("@")[0],
    }
  } catch (error: any) {
    console.error("Error signing in with Google:", error)
    throw new Error(error.message)
  }
}

export const logOut = async () => {
  try {
    if (!auth) {
      throw new Error("Firebase Auth is not initialized")
    }

    await signOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    try {
      if (!auth) {
        resolve(null)
        return
      }

      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        unsubscribe()
        resolve(null)
      }, 5000)

      const unsubscribe = auth.onAuthStateChanged(
        (user) => {
          clearTimeout(timeout)
          unsubscribe()
          resolve(user)
        },
        (error) => {
          clearTimeout(timeout)
          unsubscribe()
          console.error("Auth state error:", error)
          resolve(null)
        },
      )
    } catch (error) {
      console.error("getCurrentUser error:", error)
      resolve(null)
    }
  })
}
