import { type NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    const adminAuth = getFirebaseAdminAuth();
    if (!adminAuth) {
      throw new Error("Firebase Admin Auth is not initialized");
    }

    // Set session expiration. 5 days as recommended by Firebase.
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

    // Create the session cookie. This will also verify the ID token.
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set cookie policy for session cookie.
    const options = {
      name: "__session",
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax" as const,
    };

    const response = NextResponse.json({ status: "success" });
    response.cookies.set(options);

    return response;

  } catch (error: any) {
    console.error("Login error:", error);

    if (error.code === "auth/id-token-expired" || error.code === "auth/id-token-revoked") {
        return NextResponse.json({ error: "Session expired or revoked. Please sign in again." }, { status: 401 });
    }

    return NextResponse.json({ error: "Authentication failed. Please try again." }, { status: 500 });
  }
}
