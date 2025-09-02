// lib/db.ts
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc,
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"
import { db } from "./firebase"
import * as geofire from "geofire-common"

// ... (User Management functions remain the same) ...
export const getUser = async (userId: string) => {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)
  return userSnap.exists() ? userSnap.data() : null
}

export const createUser = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId)
  await setDoc(userRef, { ...data, createdAt: Timestamp.now() })
}

// Event Management
export const getEvents = async () => {
  try {
    const eventsCol = collection(db, "events")
    const eventSnapshot = await getDocs(eventsCol)
    return eventSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching events from Firestore:", error)
    throw new Error("Failed to retrieve events from the database.")
  }
}

// GEO: New function to create an event with geospatial data.
export const createEvent = async (eventData: any) => {
  try {
    const eventsCol = collection(db, "events")
    const newEventRef = await addDoc(eventsCol, {
      ...eventData,
      createdAt: Timestamp.now(),
    })
    return { id: newEventRef.id, ...eventData }
  } catch (error) {
    console.error("Error creating event in Firestore:", error)
    throw new Error("Failed to save event to the database.")
  }
}

// GEO: New function to query events based on proximity.
export const getNearbyEvents = async (center: [number, number], radiusInM: number) => {
  try {
    const bounds = geofire.geohashQueryBounds(center, radiusInM)
    const promises = []

    for (const b of bounds) {
      const q = query(
        collection(db, "events"),
        orderBy("geohash"),
        where("geohash", ">=", b[0]),
        where("geohash", "<=", b[1]),
      )
      promises.push(getDocs(q))
    }

    const snapshots = await Promise.all(promises)
    const matchingDocs = []

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const lat = doc.get("geopoint").latitude
        const lng = doc.get("geopoint").longitude

        const distanceInKm = geofire.distanceBetween([lat, lng], center)
        const distanceInM = distanceInKm * 1000
        if (distanceInM <= radiusInM) {
          matchingDocs.push({ id: doc.id, ...doc.data() })
        }
      }
    }
    return matchingDocs
  } catch (error) {
    console.error("Error fetching nearby events:", error)
    throw new Error("Failed to query nearby events.")
  }
}

export const getEvent = async (eventId: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    const eventSnap = await getDoc(eventRef)
    if (eventSnap.exists()) {
      return { id: eventSnap.id, ...eventSnap.data() }
    }
    return null
  } catch (error) {
    console.error("Error fetching event:", error)
    throw new Error("Failed to retrieve event from the database.")
  }
}

export const joinEvent = async (eventId: string, userId: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    const eventSnap = await getDoc(eventRef)

    if (!eventSnap.exists()) {
      throw new Error("Event not found")
    }

    const eventData = eventSnap.data()
    const currentPlayers = eventData.players || []

    if (currentPlayers.includes(userId)) {
      throw new Error("User already joined this event")
    }

    if (currentPlayers.length >= eventData.maxPlayers) {
      throw new Error("Event is full")
    }

    await updateDoc(eventRef, {
      players: arrayUnion(userId),
      currentPlayers: currentPlayers.length + 1,
    })

    // Return updated event
    const updatedSnap = await getDoc(eventRef)
    return { id: updatedSnap.id, ...updatedSnap.data() }
  } catch (error) {
    console.error("Error joining event:", error)
    throw error
  }
}

export const leaveEvent = async (eventId: string, userId: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    const eventSnap = await getDoc(eventRef)

    if (!eventSnap.exists()) {
      throw new Error("Event not found")
    }

    const eventData = eventSnap.data()
    const currentPlayers = eventData.players || []

    if (!currentPlayers.includes(userId)) {
      throw new Error("User not joined to this event")
    }

    await updateDoc(eventRef, {
      players: arrayRemove(userId),
      currentPlayers: Math.max(0, currentPlayers.length - 1),
    })

    // Return updated event
    const updatedSnap = await getDoc(eventRef)
    return { id: updatedSnap.id, ...updatedSnap.data() }
  } catch (error) {
    console.error("Error leaving event:", error)
    throw error
  }
}

export const getUserOrganizedEvents = async (userId: string) => {
  if (!userId) return []
  try {
    const eventsRef = collection(db, "events")
    const q = query(eventsRef, where("createdBy", "==", userId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching organized events:", error)
    throw new Error("Failed to fetch organized events.")
  }
}

export const getUserJoinedEvents = async (userId: string) => {
  if (!userId) return []
  try {
    const eventsRef = collection(db, "events")
    const q = query(eventsRef, where("players", "array-contains", userId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching joined events:", error)
    throw new Error("Failed to fetch joined events.")
  }
}

export const checkInPlayer = async (eventId: string, playerId: string, organizerId: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    const eventSnap = await getDoc(eventRef)

    if (!eventSnap.exists()) {
      throw new Error("Event not found")
    }

    const eventData = eventSnap.data()

    // Verify that the current user is the organizer
    if (eventData.createdBy !== organizerId) {
      throw new Error("Only the event organizer can check in players")
    }

    // Verify that the player is actually joined to the event
    if (!eventData.players?.includes(playerId)) {
      throw new Error("Player is not joined to this event")
    }

    // Initialize checkedInPlayers array if it doesn't exist
    const checkedInPlayers = eventData.checkedInPlayers || []

    if (checkedInPlayers.includes(playerId)) {
      throw new Error("Player is already checked in")
    }

    await updateDoc(eventRef, {
      checkedInPlayers: arrayUnion(playerId),
    })

    // Return updated event
    const updatedSnap = await getDoc(eventRef)
    return { id: updatedSnap.id, ...updatedSnap.data() }
  } catch (error) {
    console.error("Error checking in player:", error)
    throw error
  }
}

export const getEventWithPlayerDetails = async (eventId: string) => {
  try {
    const event = await getEvent(eventId)
    if (!event) return null

    // Get player details
    const playerDetails = []
    if (event.players && event.players.length > 0) {
      for (const playerId of event.players) {
        const playerData = await getUser(playerId)
        if (playerData) {
          playerDetails.push({
            id: playerId,
            displayName: playerData.displayName || playerData.name || "Anonymous",
            photoURL: playerData.photoURL || null,
          })
        }
      }
    }

    return {
      ...event,
      playerDetails,
      checkedInPlayers: event.checkedInPlayers || [],
    }
  } catch (error) {
    console.error("Error fetching event with player details:", error)
    throw error
  }
}

// ... (Chat and FCM Token functions remain the same) ...
export const saveFcmToken = async (userId: string, token: string) => {
  if (!userId || !token) return

  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      fcmTokens: arrayUnion(token),
    })
    console.log(`FCM token saved for user: ${userId}`)
  } catch (error) {
    console.error("Error saving FCM token:", error)
  }
}

export const sendMessage = async (eventId: string, userId: string, userName: string, message: string) => {
  const chatRef = collection(db, "events", eventId, "chat")
  await addDoc(chatRef, {
    userId,
    userName,
    message,
    timestamp: Timestamp.now(),
  })
}

export const getChatMessages = async (eventId: string) => {
  const chatRef = collection(db, "events", eventId, "chat")
  const q = query(chatRef, orderBy("timestamp", "asc"))
  const chatSnapshot = await getDocs(q)
  return chatSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}