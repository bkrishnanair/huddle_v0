// app/api/fcm/save-token/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { getServerCurrentUser } from "@/lib/auth-server";
import { saveFcmToken } from "@/lib/db-server"; // Use the server-side db function

export async function POST(request: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: "FCM token is required" }, { status: 400 });
    }

    // Call the server-side function to save the token.
    await saveFcmToken(user.uid, token);

    return NextResponse.json({ message: "Token saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return NextResponse.json({ error: "Failed to save FCM token" }, { status: 500 });
  }
}
