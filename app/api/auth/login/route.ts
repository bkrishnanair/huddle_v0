import { type NextRequest, NextResponse } from "next/server";
// CORRECT: Import the specific getter function for the auth service.
import { getAdminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idToken = authorization.split("Bearer ")[1];
  if (!idToken) {
    return NextResponse.json({ error: "ID token is required" }, { status: 400 });
  }

  try {
    // Set session expiration to 14 days.
    const expiresIn = 60 * 60 * 24 * 14 * 1000;
    // CORRECT: Get the auth service instance to create the session cookie.
    const adminAuth = getAdminAuth();
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json(
      { message: "Session created successfully" },
      { status: 200 }
    );

    response.cookies.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Authentication failed. Please try again." }, { status: 500 });
  }
}
