export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getEvents, getNearbyEvents } from "@/lib/db"
import { getFirebaseAdminDb, GeoPoint, Timestamp } from "@/lib/firebase-admin"
import * as geofire from "geofire-common"
import { z } from "zod"

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  category: z.string().min(1, "Category is required"),
  eventType: z.enum(["in-person", "virtual", "hybrid"]).default("in-person"),
  virtualLink: z.string().url("Please enter a valid URL").optional().nullable(),
  icon: z.string().max(2, "Icon must be a single emoji").optional(),
  tags: z.array(z.string()).optional(),
  date: z.string().min(1, "Date is required"),
  endDate: z.string().optional(),
  time: z.string().min(1, "Time is required"),
  endTime: z.string().optional(),
  location: z.string().optional(),
  maxPlayers: z.number().min(1, "At least one player is required"),
  minPlayers: z.number().optional(),
  description: z.string().optional(),
  isBoosted: z.boolean().optional(),
  isPrivate: z.boolean().optional(),
  geopoint: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  questions: z.array(z.string()).optional(),
  pickupPoints: z.array(z.object({
    id: z.string(),
    location: z.string(),
    time: z.string(),
  })).optional(),
  stayUntil: z.string().optional(),
  transitTips: z.string().optional(),
  orgLocation: z.string().optional(),
  orgGeopoint: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  recurrence: z.object({
    type: z.enum(["weekly", "biweekly", "monthly"]),
    endDate: z.string()
  }).optional(),
}).refine(data => {
  // Virtual and hybrid events must have a meeting link
  if ((data.eventType === "virtual" || data.eventType === "hybrid") && !data.virtualLink) return false;
  return true;
}, { message: "Virtual/Hybrid events require a meeting link", path: ["virtualLink"] })
  .refine(data => {
    // In-person and hybrid events must have a physical location
    if (data.eventType !== "virtual" && !data.location) return false;
    return true;
  }, { message: "In-person/Hybrid events require a location", path: ["location"] })
  .refine(data => {
    // In-person and hybrid events must have a geopoint
    if (data.eventType !== "virtual" && !data.geopoint) return false;
    return true;
  }, { message: "In-person/Hybrid events require a geopoint", path: ["geopoint"] });



export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const radius = searchParams.get('radius')
    const groupRecurring = searchParams.get('groupRecurring') === 'true'

    let events: any[];

    if (lat && lon && radius) {
      events = await getNearbyEvents(
        [parseFloat(lat), parseFloat(lon)],
        parseFloat(radius)
      )
    } else {
      events = await getEvents()
    }

    // Filter out private events
    let combinedEvents = events.filter((e: any) => !e.isPrivate)

    // Group recurring events — only return the soonest future instance per series
    if (groupRecurring) {
      combinedEvents = deduplicateRecurring(combinedEvents)
    }

    return NextResponse.json(
      { events: combinedEvents },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

/**
 * Groups events sharing the same `parentEventId`.
 * For each group, returns only the soonest future instance
 * and attaches `recurringCount` (total future instances)
 * and `recurrenceType` (weekly/biweekly/monthly) for UI badges.
 */
function deduplicateRecurring(events: any[]): any[] {
  const now = new Date();
  const recurringGroups = new Map<string, any[]>();
  const standalone: any[] = [];

  for (const event of events) {
    const parentId = event.parentEventId;
    if (parentId) {
      if (!recurringGroups.has(parentId)) {
        recurringGroups.set(parentId, []);
      }
      recurringGroups.get(parentId)!.push(event);
    } else {
      standalone.push(event);
    }
  }

  // For each recurring group, pick the soonest future instance
  for (const [parentId, group] of recurringGroups) {
    // Sort by date ascending
    group.sort((a: any, b: any) => {
      const dateA = a.date || '';
      const dateB = b.date || '';
      return dateA.localeCompare(dateB);
    });

    // Find the soonest instance that hasn't passed yet
    const todayStr = now.toISOString().split('T')[0];
    const futureInstances = group.filter((e: any) => e.date >= todayStr);
    const chosen = futureInstances.length > 0 ? futureInstances[0] : group[group.length - 1];

    // Attach recurring metadata for the UI badge
    const recurrenceType = chosen.recurrence?.type || group[0]?.recurrence?.type || 'weekly';
    chosen.recurringCount = futureInstances.length;
    chosen.recurrenceType = recurrenceType;
    chosen.recurringSeriesTotal = group.length;

    standalone.push(chosen);
  }

  return standalone;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Incoming Payload for POST /api/events:", body)

    const validation = eventSchema.safeParse(body)

    if (!validation.success) {
      console.error("Validation Error:", validation.error.format())
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const { geopoint, recurrence, ...rest } = validation.data

    // Conditionally compute geohash only for events with a physical location
    const geohash = geopoint
      ? geofire.geohashForLocation([geopoint.latitude, geopoint.longitude])
      : null;

    const adminDb = getFirebaseAdminDb()
    if (!adminDb) {
      throw new Error("Database service unavailable")
    }

    // Get user's name for organizerName field
    const userDoc = await adminDb.collection("users").doc(user.uid).get()
    const userData = userDoc.data()
    const organizerName = userData?.name || user.name || user.email?.split("@")[0] || "User"

    // compute recurrence dates
    const dates = [rest.date];
    if (recurrence && recurrence.endDate && recurrence.endDate > rest.date) {
      let currentDate = new Date(`${rest.date}T00:00:00`);
      const endDate = new Date(`${recurrence.endDate}T00:00:00`);
      let maxInstances = 20; // safe limit

      while (currentDate < endDate && dates.length < maxInstances) {
        if (recurrence.type === "weekly") {
          currentDate.setDate(currentDate.getDate() + 7);
        } else if (recurrence.type === "biweekly") {
          currentDate.setDate(currentDate.getDate() + 14);
        } else if (recurrence.type === "monthly") {
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        if (currentDate <= endDate) {
          dates.push(currentDate.toISOString().split("T")[0]);
        }
      }
    }

    const batch = adminDb.batch()
    const parentRef = adminDb.collection("events").doc()
    const parentId = parentRef.id

    const createdEvents = [];

    // Diff in milliseconds for endDate if present
    let endDiff = 0;
    if (rest.endDate) {
      const sDate = new Date(`${rest.date}T00:00:00`).getTime();
      const eDate = new Date(`${rest.endDate}T00:00:00`).getTime();
      endDiff = eDate - sDate;
    }

    for (let i = 0; i < dates.length; i++) {
      const isParent = i === 0;
      const docRef = isParent ? parentRef : adminDb.collection("events").doc();

      const eventDateStr = dates[i];
      let eventEndDateStr = rest.endDate;
      if (!isParent && endDiff > 0) {
        const newSDate = new Date(`${eventDateStr}T00:00:00`).getTime();
        eventEndDateStr = new Date(newSDate + endDiff).toISOString().split("T")[0];
      }

      const newEvent: Record<string, any> = {
        ...rest,
        date: eventDateStr,
        endDate: eventEndDateStr || "",
        title: rest.name,
        sport: rest.category,
        location: rest.location || null,
        eventType: rest.eventType || "in-person",
        virtualLink: rest.virtualLink || null,
        createdBy: user.uid,
        organizerName,
        players: [user.uid],
        currentPlayers: 1,
        createdAt: Timestamp.now(),
        checkInOpen: false,
        parentEventId: dates.length > 1 ? parentId : null,
        recurrence: dates.length > 1 ? recurrence : null,
      }

      if (geopoint) {
        newEvent.geopoint = new GeoPoint(geopoint.latitude, geopoint.longitude);
        newEvent.geohash = geohash;
      }

      if (rest.orgGeopoint) {
        newEvent.orgGeopoint = new GeoPoint(rest.orgGeopoint.latitude, rest.orgGeopoint.longitude);
      }

      batch.set(docRef, newEvent);
      if (isParent) {
        createdEvents.push({ id: parentId, ...newEvent });
      }
    }

    await batch.commit();

    return NextResponse.json({
      message: "Event created successfully",
      event: createdEvents[0],
    })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}