# Huddle Deployment Guide

Huddle is a Next.js 15 application designed to be deployed seamlessly on **Vercel** with a **Firebase** backend.

## 1. Prerequisites

Before deploying to Vercel, ensure you possess the following:
*   A Vercel account linked to your GitHub repository.
*   A Google Cloud Platform (GCP) project with the **Google Maps Platform** API activated (specifically: Maps JavaScript API, Places API, and Geocoding API).
*   A **Firebase Project** configured with Authentication, Cloud Firestore, and **Firebase Storage** for event photos.
*   A generated Service Account Private Key from the Firebase Console (Settings > Service Accounts).

---

## 2. Environment Variables

The application relies on a strict set of environment variables to function securely. These must be configured in the Vercel Project Settings > Environment Variables.

### A. Firebase Client SDK (Public)
These keys are exposed to the browser to initialize the Firebase Client SDK (`lib/firebase.ts`).
*   `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase web API key.
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Example: `[project-id].firebaseapp.com`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your GCP/Firebase Project ID.
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Example: `[project-id].firebasestorage.app`. **Crucially, do not include the `gs://` prefix here.**
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: The numeric sender ID.
*   `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase web App ID.

### B. Google Maps Configuration (Public)
These keys power the `@vis.gl/react-google-maps` components in the browser.
*   `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: A GCP API Key with Maps/Places permissions. **Restrict this key in GCP by HTTP Referrers to your production domain.**
*   `NEXT_PUBLIC_GOOGLE_MAPS_STYLE_MAP_ID`: A custom Map ID for the dark cinematic rendering style.

### C. Firebase Admin SDK (Secret - Server Only)
These keys initialize the `firebase-admin` SDK (`lib/firebase-admin.ts`) and MUST NEVER be prefixed with `NEXT_PUBLIC_`.
*   `FIREBASE_PROJECT_ID`: Your GCP/Firebase Project ID.
*   `FIREBASE_CLIENT_EMAIL`: The Service Account email.
*   `FIREBASE_PRIVATE_KEY`: The massive RSA private key string.

---

## 3. Firebase Storage & CORS

To enable the **Event Gallery** photo upload feature, you must configure CORS on your Firebase Storage bucket to allow uploads from your domain.

1.  Create a file named `cors.json`:
    ```json
    [
      {
        "origin": ["http://localhost:3000", "https://your-production-url.vercel.app"],
        "method": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "responseHeader": ["Content-Type", "Authorization", "x-goog-resumable"],
        "maxAgeSeconds": 3600
      }
    ]
    ```
2.  Set the CORS configuration using the `gsutil` tool:
    ```bash
    gsutil cors set cors.json gs://your-project-id.firebasestorage.app
    ```

---

## 4. Deployment Steps

1.  **Push to GitHub:** Ensure your `main` branch is up to date.
2.  **Import to Vercel:** In the Vercel dashboard, import your Huddle repository.
3.  **Configure Build Settings:** Framework Preset should be **Next.js**.
4.  **Add Environment Variables:** Paste all variables from Section 2.
5.  **Deploy:** Click Deploy. Vercel will build the optimized Turbopack bundle.

---

## 5. Vercel Cron Jobs Configuration

Huddle uses Vercel Cron Jobs to automatically broadcast scheduled messages to chat rooms.

This is tracked in the `vercel.json` file at the root:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/cron/scheduled-messages",
      "schedule": "0 0 * * *"
    }
  ]
}
```

*   **Path:** The API route Vercel will execute daily.
*   **Security:** Vercel automatically sends an `Authorization: Bearer <CRON_SECRET>` header. The Next.js API route verifying this request should validate the incoming secret against `process.env.CRON_SECRET`.
