// Fallback in-memory database for when Firebase isn't configured
const users: any[] = []
const events: any[] = []
let userIdCounter = 1
let eventIdCounter = 1

export const fallbackCreateUser = async (userData: { email: string; name: string; password: string }) => {
  const existingUser = users.find((user) => user.email === userData.email)
  if (existingUser) {
    throw new Error("User already exists")
  }

  const newUser = {
    id: userIdCounter++,
    uid: `user_${userIdCounter}`,
    ...userData,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  return newUser
}

export const fallbackSignIn = async (email: string, password: string) => {
  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) {
    throw new Error("Invalid credentials")
  }
  return user
}

export const fallbackGetUser = async (uid: string) => {
  return users.find((user) => user.uid === uid) || null
}

export const fallbackCreateEvent = async (eventData: any) => {
  const newEvent = {
    id: eventIdCounter++,
    ...eventData,
    currentPlayers: 1,
    players: [eventData.createdBy],
    createdAt: new Date().toISOString(),
  }

  events.push(newEvent)
  return newEvent
}

export const fallbackGetAllEvents = async () => {
  return events
}

export const fallbackGetEvent = async (eventId: string) => {
  return events.find((event) => event.id === Number.parseInt(eventId)) || null
}

export const fallbackJoinEvent = async (eventId: string, userId: string) => {
  const event = events.find((e) => e.id === Number.parseInt(eventId))
  if (!event) throw new Error("Event not found")

  if (!event.players.includes(userId)) {
    event.players.push(userId)
    event.currentPlayers++
  }

  return event
}

export const fallbackLeaveEvent = async (eventId: string, userId: string) => {
  const event = events.find((e) => e.id === Number.parseInt(eventId))
  if (!event) throw new Error("Event not found")

  event.players = event.players.filter((id: string) => id !== userId)
  event.currentPlayers--

  return event
}
