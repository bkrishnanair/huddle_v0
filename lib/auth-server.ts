// lib/auth-server.ts
// This file contains authentication logic that is ONLY safe to run on the server.
import "server-only"; // Ensures this module is never imported into a client component.

import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";

/**
 * getServerCurrentUser (Server-Side)
 * Verifies the session cookie from the incoming request to securely identify the user.
 * This is the correct way to handle authentication in Next.js API Routes and Server Components.
 */
export const getServerCurrentUser = async () => {
  console.log("Attempting to get server-side current user...");

  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) {
    console.warn("Auth check failed: Session cookie not found.");
    return null;
  }

  try {
    if (!adminAuth) {
      // This case should ideally not be hit if firebase-admin is initialized correctly.
      console.error("CRITICAL: Firebase Admin Auth not initialized at time of use.");
      return null;
    }
    
    console.log("Session cookie found. Verifying with Firebase Admin SDK...");
    // Use the Firebase Admin SDK to verify the cookie and get user details.
    const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    console.log("Session cookie verified successfully for UID:", decodedIdToken.uid);
    return decodedIdToken;
  } catch (error: any) {
    // Log the specific error from Firebase Admin
    console.error("Error verifying session cookie with Firebase Admin SDK:", {
      code: error.code,
      message: error.message,
    });
    // The cookie is invalid, expired, or the Admin SDK is misconfigured.
    return null;
  }
};
