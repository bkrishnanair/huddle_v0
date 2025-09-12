// lib/auth-server.ts
// This file contains authentication logic that is ONLY safe to run on the server.
import "server-only";

import { NextRequest } from "next/server";
import { getFirebaseAdminAuth } from "./firebase-admin";

// Custom error class for session verification failures
export class SessionVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SessionVerificationError";
  }
}

/**
 * Verifies the session cookie from an incoming Next.js request.
 *
 * @param req The NextRequest object.
 * @returns The decoded ID token from the verified session cookie.
 * @throws {SessionVerificationError} If the cookie is missing, invalid, or expired.
 */
export const verifySession = async (req: NextRequest) => {
  const sessionCookie = req.cookies.get("__session")?.value;

  if (!sessionCookie) {
    throw new SessionVerificationError("Authentication required: No session cookie found.");
  }

  const adminAuth = getFirebaseAdminAuth();
  if (!adminAuth) {
    // This is a server configuration error, so we throw a generic Error
    throw new Error("Firebase Admin Auth is not initialized.");
  }

  try {
    // Verify the session cookie. `checkRevoked` is true to ensure revoked sessions are rejected.
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedToken;
  } catch (error: any) {
    // Handle specific Firebase auth errors
    if (error.code === 'auth/session-cookie-expired') {
      throw new SessionVerificationError("Session expired. Please sign in again.");
    }
    if (error.code === 'auth/session-cookie-revoked') {
      throw new SessionVerificationError("Session revoked. Please sign in again.");
    }
    // For other errors, throw a generic verification error
    throw new SessionVerificationError("Authentication failed: Invalid session cookie.");
  }
};
