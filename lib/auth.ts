import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"
import { auth } from "./firebase"
import { createUser } from "./db"

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const authInstance = auth()
    if (!authInstance) {
      throw new Error("Firebase Auth is not initialized")
    }

    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password)
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
    const authInstance = auth()
    if (!authInstance) {
      throw new Error("Firebase Auth is not initialized")
    }

    const userCredential = await signInWithEmailAndPassword(authInstance, email, password)
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

export const logOut = async () => {
  try {
    const authInstance = auth()
    if (!authInstance) {
      throw new Error("Firebase Auth is not initialized")
    }

    await signOut(authInstance)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    try {
      const authInstance = auth()
      if (!authInstance) {
        reject(new Error("Firebase Auth is not initialized"))
        return
      }

      const unsubscribe = authInstance.onAuthStateChanged(
        (user) => {
          unsubscribe()
          resolve(user)
        },
        (error) => {
          unsubscribe()
          reject(error)
        },
      )
    } catch (error) {
      reject(error)
    }
  })
}
