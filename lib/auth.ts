import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"
import { auth } from "./firebase"
import { createUser } from "./db"

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
    if (!auth) {
      reject(new Error("Firebase Auth is not initialized"))
      return
    }

    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        unsubscribe()
        resolve(user)
      },
      (error) => {
        unsubscribe()
        reject(error)
      },
    )
  })
}
