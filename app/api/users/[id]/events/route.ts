import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { getUserOrganizedEvents, getUserJoinedEvents } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get('type');

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (user.uid !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    let events;
    if (eventType === 'organized') {
      events = await getUserOrganizedEvents(id);
    } else if (eventType === 'joined') {
      events = await getUserJoinedEvents(id);
    } else {
      return NextResponse.json({ error: "Invalid event type specified" }, { status: 400 });
    }

    return NextResponse.json({ events });

  } catch (error) {
    console.error("Error in GET /api/users/[id]/events:", error);
    return NextResponse.json({ error: "Failed to fetch user events" }, { status: 500 });
  }
}