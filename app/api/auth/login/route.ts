import { type NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    // Set session cookie expiration
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    // Create the session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set the cookie in the response
    cookies().set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
      path: "/",
    });
    
    console.log("✅ Session cookie created successfully.");

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("Login error:", {
      code: error.code,
      message: error.message,
    });

    if (error.code === "auth/id-token-expired") {
      return NextResponse.json({ error: "Session expired. Please sign in again." }, { status: 401 });
    }

    if (error.code === "auth/id-token-revoked") {
      return NextResponse.json({ error: "Session revoked. Please sign in again." }, { status: 401 });
    }

    return NextResponse.json({ error: "Authentication failed. Please try again." }, { status: 500 });
  }
}
