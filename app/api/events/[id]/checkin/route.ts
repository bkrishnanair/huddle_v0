import { type NextRequest, NextResponse } from "next/server";
import { verifySession, SessionVerificationError } from "@/lib/auth-server";
import { checkInPlayer } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifySession(request);
    const { id } = params;
    const { playerId } = await request.json();

    if (!playerId) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
    }

    // Pass the organizer's UID (from the verified session) to the database function
    const updatedEvent = await checkInPlayer(id, playerId, user.uid);

    return NextResponse.json({ event: updatedEvent });
  } catch (error) {
    if (error instanceof SessionVerificationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Handle specific application errors thrown from the database layer
    if (error instanceof Error) {
      if (error.message.includes("Only the event organizer")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      if (error.message.includes("not found") || error.message.includes("not joined")) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }

    console.error("Check-in error:", error);
    return NextResponse.json({ error: "Failed to check in player" }, { status: 500 });
  }
}
