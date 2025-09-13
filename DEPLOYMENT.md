# Deployment Guide

This document outlines the steps to deploy the Huddle application to Vercel.

## Vercel Deployment

### Prerequisites
- Vercel account
- Firebase project
- Google Maps API key

### Steps
1.  **Link Repository**: Connect your Git repository to a new Vercel project.
2.  **Configure Build**: Vercel should auto-detect Next.js. No special build commands needed.
3.  **Environment Variables**: 
    - `NEXT_PUBLIC_FIREBASE_CONFIG`: Your Firebase web app config object (as a JSON string).
    - `FIREBASE_ADMIN_SDK_CONFIG`: Your Firebase admin service account JSON (as a JSON string).
    - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API key.
    - `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`: Your Google Maps Map ID for custom styling.
    - `NEXT_PUBLIC_GOOGLE_MAPS_STYLE_MAP_ID`: (Optional) A specific Map ID for a themed style (e.g., dark mode).

### Firebase Setup
- **Authentication**: Enable Email/Password and Google sign-in providers.
- **Firestore**: Set up your database rules.
- **Service Account**: Generate a private key for the Admin SDK.

### Google Cloud Setup
- **APIs**: Enable "Maps JavaScript API" and "Places API".
- **API Key Restrictions**: 
    - **Application restrictions**: Add your Vercel deployment URLs (`*.vercel.app`, `your-domain.com`).
    - **API restrictions**: Restrict the key to only the enabled map APIs.

## Local Development
To run the app locally, create a `.env.local` file in the root of the project with the same environment variables listed above.

Example `.env.local`:
```
NEXT_PUBLIC_FIREBASE_CONFIG='{"apiKey": "...", "authDomain": "...", ...}'
FIREBASE_ADMIN_SDK_CONFIG='{"type": "service_account", "project_id": "...", ...}'
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY='AIzaSy...'
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID='yourMapId...'
NEXT_PUBLIC_GOOGLE_MAPS_STYLE_MAP_ID='yourStyleMapId...'
```
- Run `pnpm install`
- Run `pnpm dev`

## Troubleshooting
- **Firebase errors**: Check that environment variables are correctly set and formatted as JSON strings.
- **Google Maps not loading**: Verify the `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly in your environment.
- **Authentication issues**: Ensure your production domain is authorized in Firebase Auth settings.
- **Build failures**: Check Next.js configuration and dependencies.
- **Maps config errors**: Ensure the user is authenticated before the map tries to load.

