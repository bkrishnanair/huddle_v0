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
  const dbInstance = db()
  if (!dbInstance) {
    throw new Error("Firestore is not initialized")
  }
  return dbInstance
}

// User operations
export const createUser = async (userData: {
  email: string
  name: string
  uid: string
}) => {
  try {
    const dbInstance = checkFirestore()
    const userRef = doc(dbInstance, "users", userData.uid)
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
    const dbInstance = checkFirestore()
    const userRef = doc(dbInstance, "users", uid)
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
    const dbInstance = checkFirestore()
    const eventRef = await addDoc(collection(dbInstance, "events"), {
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
    const dbInstance = checkFirestore()
    const eventsRef = collection(dbInstance, "events")
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
    const dbInstance = checkFirestore()
    const eventRef = doc(dbInstance, "events", eventId)
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
    const dbInstance = checkFirestore()
    const eventRef = doc(dbInstance, "events", eventId)

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
    const dbInstance = checkFirestore()
    const eventRef = doc(dbInstance, "events", eventId)

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
