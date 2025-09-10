import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerCurrentUser } from "@/lib/auth-server";
import { admin } from "@/lib/firebase-admin";

export async function POST() {
  try {
    // 1. Verify the user's session to get their UID
    const user = await getServerCurrentUser();

    if (user) {
      // 2. Revoke all refresh tokens for the user on the Firebase side.
      // This is a security measure to prevent session reuse.
      await admin.auth().revokeRefreshTokens(user.uid);
    }

    // 3. Create a response object.
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );
    
    // 4. Clear the session cookie by setting its value to empty and maxAge to 0.
    // Ensure the attributes match the ones used during creation.
    response.cookies.set("__session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 0, // Expire the cookie immediately
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
