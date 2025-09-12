import { type NextRequest, NextResponse } from "next/server";
import { verifySession, SessionVerificationError } from "@/lib/auth-server";
import { getUserOrganizedEvents, getUserJoinedEvents } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifySession(request);
    const { id } = params;
    
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get('type');

    if (user.uid !== id) {
      return NextResponse.json({ error: "Unauthorized: You can only view your own events." }, { status: 403 });
    }

    let events;
    if (eventType === 'hosting') {
      events = await getUserOrganizedEvents(id);
    } else if (eventType === 'attending') {
      events = await getUserJoinedEvents(id);
    } else {
      // Return both sets of events if no type is specified, or handle as an error
      // For now, let's treat it as a bad request.
      return NextResponse.json({ error: "Invalid event type specified. Use 'hosting' or 'attending'." }, { status: 400 });
    }

    return NextResponse.json({ events });

  } catch (error) {
    if (error instanceof SessionVerificationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    console.error("Error in GET /api/users/[id]/events:", error);
    return NextResponse.json({ error: "Failed to fetch user events" }, { status: 500 });
  }
}
