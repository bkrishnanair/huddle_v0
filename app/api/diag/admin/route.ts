import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

// This route MUST run on the Node.js runtime for the Admin SDK to work.
export const runtime = 'nodejs';

export async function GET() {
  const diagnostics = {
    env: {
      projectId: process.env.FIREBASE_PROJECT_ID ? `SET (ends with ...${process.env.FIREBASE_PROJECT_ID.slice(-4)})` : "NOT SET",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? `SET (first 10: ${process.env.FIREBASE_CLIENT_EMAIL.substring(0, 10)}...)` : "NOT SET",
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? "SET (is present)" : "NOT SET",
    },
    auth: {
      status: "pending",
      data: null as any,
    },
    firestore: {
      status: "pending",
      data: null as any,
    },
  };

  // --- Step 1: Check Auth Service & Credentials ---
  try {
    const adminAuth = getAdminAuth();
    // A simple, low-impact read operation to verify credentials.
    const users = await adminAuth.listUsers(1);
    diagnostics.auth.status = "✅ Success";
    diagnostics.auth.data = {
      message: "Successfully authenticated with Firebase Auth.",
      // Safely show a minimal amount of data to confirm success.
      retrievedUser: users.users.map(u => ({ uid: u.uid, email: u.email })),
    };
  } catch (error: any) {
    diagnostics.auth.status = "❌ Error";
    diagnostics.auth.data = {
      code: error.code || "UNKNOWN_AUTH_ERROR",
      message: error.message,
    };
  }

  // --- Step 2: Check Firestore Service & Permissions ---
  // This step will only run if the Auth check was successful, as a failed auth
  // check indicates a fundamental credential problem.
  if (diagnostics.auth.status === "✅ Success") {
    try {
      const adminDb = getAdminDb();
      // A simple, low-impact read to a non-existent collection is safe and effective.
      const snapshot = await adminDb.collection("huddle_health_check").limit(1).get();
      diagnostics.firestore.status = "✅ Success";
      diagnostics.firestore.data = {
        message: `Successfully connected to Firestore. Read ${snapshot.size} documents from a test collection.`,
      };
    } catch (error: any) {
      diagnostics.firestore.status = "❌ Error";
      diagnostics.firestore.data = {
        code: error.code || "UNKNOWN_FIRESTORE_ERROR",
        message: error.message,
      };
    }
  } else {
    diagnostics.firestore.status = "Skipped";
    diagnostics.firestore.data = {
      message: "Firestore check was skipped because the Auth check failed."
    };
  }

  return NextResponse.json(diagnostics);
}
