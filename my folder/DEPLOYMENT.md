# Deployment Guide

This document outlines the steps to deploy the Huddle application to Vercel.

## Vercel Deployment

### Prerequisites
- Vercel account
- Firebase project
- Google Maps API key

### Steps
1.  **Link Repository**: Connect your Git repository to a new Vercel project.
2.  **Configure Build**: Vercel should auto-detect Next.js. The `vercel.json` file is pre-configured with the correct build settings.
3.  **Environment Variables**: 
    - `NEXT_PUBLIC_FIREBASE_CONFIG`: Your Firebase web app config object (as a JSON string).
    - `FIREBASE_ADMIN_SDK_CONFIG`: Your Firebase admin service account JSON (as a JSON string).
    - `GOOGLE_MAPS_API_KEY`: Your Google Maps API key (this is kept private on the server).
    - `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`: Your Google Maps Map ID for the default (light) style.
    - `NEXT_PUBLIC_GOOGLE_MAPS_STYLE_MAP_ID`: Your Google Maps Map ID for the dark mode style.