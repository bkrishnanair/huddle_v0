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
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  // 1. Try Session Cookie first
  if (sessionCookie) {
    try {
      if (adminAuth) {
        return await adminAuth.verifySessionCookie(sessionCookie, true);
      }
    } catch (error) {
      console.warn("Session cookie verification failed, falling back to Bearer token");
    }
  }

  // 2. Fallback to Authorization Header (Bearer Token)
  try {
    const headersList = await import("next/headers").then(mod => mod.headers());
    const authHeader = (await headersList).get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
      const idToken = authHeader.split("Bearer ")[1];
      if (adminAuth) {
        return await adminAuth.verifyIdToken(idToken);
      }
    }
  } catch (error) {
    console.error("Bearer token verification failed:", error);
  }

  return null;
};
