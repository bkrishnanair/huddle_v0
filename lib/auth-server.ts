// lib/auth-server.ts
// This file contains authentication logic that is ONLY safe to run on the server.
import "server-only"; // Ensures this module is never imported into a client component.

import { cookies, headers } from "next/headers";
import { adminAuth } from "./firebase-admin";

/**
 * getServerCurrentUser (Server-Side)
 * Verifies the session cookie from the incoming request to securely identify the user.
 * This is the correct way to handle authentication in Next.js API Routes and Server Components.
 */
export const getServerCurrentUser = async () => {
  // An explicitly supplied token identifies this request. Never substitute a
  // previous account's session cookie while login/logout synchronization runs.
  const authHeader = (await headers()).get("authorization");
  if (authHeader) {
    const match = authHeader.match(/^Bearer\s+(\S+)$/i);
    if (!match || !adminAuth) return null;
    try {
      return await adminAuth.verifyIdToken(match[1]);
    } catch {
      return null;
    }
  }
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  // Cookie-only requests (including server-rendered pages).
  if (sessionCookie) {
    try {
      if (adminAuth) {
        return await adminAuth.verifySessionCookie(sessionCookie, true);
      }
    } catch (error) {
      console.warn("Session cookie verification failed");
    }
  }

  return null;
};
