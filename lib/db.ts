import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"

// Helper function to check if Firestore is available
const checkFirestore = () => {
  if (!db) {
    throw new Error("Firestore is not initialized")
  }
}

// User operations
export const createUser = async (userData: {
  email: string
  name: string
  uid: string
}) => {
  try {
    checkFirestore()
    const userRef = doc(db, "users", userData.uid)
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
    })
    return userData
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const getUser = async (uid: string) => {
  try {
    checkFirestore()
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() }
    }
    return null
  } catch (error) {
    console.error("Error getting user:", error)
    throw error
  }
}

// Event operations
export const createEvent = async (eventData: {
  title: string
  sport: string
  location: string
  latitude: number
  longitude: number
  date: string
  time: string
  maxPlayers: number
  createdBy: string
}) => {
  try {
    checkFirestore()
    const eventRef = await addDoc(collection(db, "events"), {
      ...eventData,
      currentPlayers: 1,
      players: [eventData.createdBy],
      createdAt: serverTimestamp(),
    })

    const eventDoc = await getDoc(eventRef)
    return { id: eventDoc.id, ...eventDoc.data() }
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

export const getAllEvents = async () => {
  try {
    checkFirestore()
    const eventsRef = collection(db, "events")
    const querySnapshot = await getDocs(eventsRef)

    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return events
  } catch (error) {
    console.error("Error getting events:", error)
    throw error
  }
}

export const getEvent = async (eventId: string) => {
  try {
    checkFirestore()
    const eventRef = doc(db, "events", eventId)
    const eventSnap = await getDoc(eventRef)

    if (eventSnap.exists()) {
      return { id: eventSnap.id, ...eventSnap.data() }
    }
    return null
  } catch (error) {
    console.error("Error getting event:", error)
    throw error
  }
}

export const joinEvent = async (eventId: string, userId: string) => {
  try {
    checkFirestore()
    const eventRef = doc(db, "events", eventId)

    await updateDoc(eventRef, {
      players: arrayUnion(userId),
      currentPlayers: increment(1),
    })

    const updatedEvent = await getEvent(eventId)
    return updatedEvent
  } catch (error) {
    console.error("Error joining event:", error)
    throw error
  }
}

export const leaveEvent = async (eventId: string, userId: string) => {
  try {
    checkFirestore()
    const eventRef = doc(db, "events", eventId)

    await updateDoc(eventRef, {
      players: arrayRemove(userId),
      currentPlayers: increment(-1),
    })

    const updatedEvent = await getEvent(eventId)
    return updatedEvent
  } catch (error) {
    console.error("Error leaving event:", error)
    throw error
  }
}
