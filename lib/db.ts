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

// Helper function to check if Firestore is not initialized
const checkFirestore = () => {
  if (!db) {
    throw new Error("Firestore is not initialized")
  }
  return db
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
    console.log("[v0] getAllEvents: Starting function...")
    const dbInstance = checkFirestore()
    console.log("[v0] getAllEvents: Firestore check passed, db instance:", !!dbInstance)

    const eventsRef = collection(dbInstance, "events")
    console.log("[v0] getAllEvents: Created events collection reference")

    console.log("[v0] getAllEvents: Calling getDocs...")
    const querySnapshot = await getDocs(eventsRef)
    console.log("[v0] getAllEvents: getDocs completed, docs count:", querySnapshot.docs.length)

    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log("[v0] getAllEvents: Mapped events, returning:", events.length, "events")
    return events
  } catch (error) {
    console.error("[v0] getAllEvents: Error occurred:", error)
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

export const getUserJoinedEvents = async (userId: string) => {
  try {
    const dbInstance = checkFirestore()
    const eventsRef = collection(dbInstance, "events")
    const querySnapshot = await getDocs(eventsRef)

    const joinedEvents = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((event: any) => event.players?.includes(userId) && event.createdBy !== userId)

    return joinedEvents
  } catch (error) {
    console.error("Error getting user joined events:", error)
    throw error
  }
}

export const getUserOrganizedEvents = async (userId: string) => {
  try {
    const dbInstance = checkFirestore()
    const eventsRef = collection(dbInstance, "events")
    const querySnapshot = await getDocs(eventsRef)

    const organizedEvents = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((event: any) => event.createdBy === userId)

    return organizedEvents
  } catch (error) {
    console.error("Error getting user organized events:", error)
    throw error
  }
}

export const getEvents = getAllEvents

// Added real-time chat functionality for events
export const sendMessage = async (eventId: string, userId: string, userName: string, message: string) => {
  try {
    const dbInstance = checkFirestore()
    const chatRef = collection(dbInstance, "events", eventId, "chat")

    await addDoc(chatRef, {
      userId,
      userName,
      message,
      timestamp: serverTimestamp(),
    })

    return true
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

export const getChatMessages = async (eventId: string) => {
  try {
    const dbInstance = checkFirestore()
    const chatRef = collection(dbInstance, "events", eventId, "chat")
    const querySnapshot = await getDocs(chatRef)

    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Sort by timestamp
    return messages.sort((a: any, b: any) => {
      if (!a.timestamp || !b.timestamp) return 0
      return a.timestamp.seconds - b.timestamp.seconds
    })
  } catch (error) {
    console.error("Error getting chat messages:", error)
    throw error
  }
}
