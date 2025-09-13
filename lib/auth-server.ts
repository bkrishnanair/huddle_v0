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
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;

  try {
    if (!adminAuth) {
      console.error("Firebase Admin Auth not initialized");
      return null;
    }
    
    // Use the Firebase Admin SDK to verify the cookie and get user details.
    const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedIdToken;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
};
