// lib/auth-server.ts
import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth } from "./firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";

/**
 * Verifies the session cookie from the incoming request and returns the decoded user token.
 * Throws an error if the session is invalid or expired.
 * This is the centralized, secure way to protect API Routes.
 *
 * @returns {Promise<DecodedIdToken>} The decoded ID token for the authenticated user.
 * @throws Throws an error with a Firebase Auth error code if verification fails.
 */
export async function verifySession(): Promise<DecodedIdToken> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;

  if (!sessionCookie) {
    // Mimic Firebase Auth error codes for consistency.
    throw { code: "auth/no-session-cookie", message: "Session cookie not found." };
  }

  try {
    const adminAuth = getAdminAuth();
    // The `true` checks for revocation. An error will be thrown if the cookie is invalid.
    const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedIdToken;
  } catch (error: any) {
    // Re-throw the original Firebase error to be caught by the API route handler.
    console.error(`[verifySession] Error verifying session cookie: [${error.code}] ${error.message}`);
    throw error;
  }
}

/**
 * A softer version of session verification that returns null instead of throwing an error.
 * Useful for pages or components that have optional authentication.
 */
export const getServerCurrentUser = async (): Promise<DecodedIdToken | null> => {
  try {
    return await verifySession();
  } catch (error: any) {
    // Ignore specific, expected errors where a user is simply not logged in.
    if (error.code === 'auth/no-session-cookie' || error.code === 'auth/session-cookie-expired') {
      return null;
    }
    // Log unexpected errors.
    console.error("[getServerCurrentUser] Unexpected error during session verification:", error);
    return null;
  }
};
