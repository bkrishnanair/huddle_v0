export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { getServerCurrentUser } from "@/lib/auth-server";
import { updateUserLocation } from "@/lib/db";
import { z } from "zod";

const locationSchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: requestedUserId } = await params;
        const currentUser = await getServerCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        if (currentUser.uid !== requestedUserId) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const body = await request.json();
        const validation = locationSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const { latitude, longitude } = validation.data;

        const success = await updateUserLocation(requestedUserId, latitude, longitude);

        if (!success) {
            return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Location updated successfully" });
    } catch (error) {
        console.error("Error updating location:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
