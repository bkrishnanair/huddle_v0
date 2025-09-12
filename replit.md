# Huddle - Replit Environment Configuration

## Project Overview
Huddle is a modern full-stack Next.js application for discovering, creating, and joining local pickup sports events. This document outlines the Replit-specific setup and current project state.

## Recent Changes (September 12, 2025)
**Environment Setup for Replit:**
- ✅ Migrated from npm to pnpm package manager
- ✅ Configured Next.js dev server for Replit proxy environment
- ✅ Updated `next.config.mjs` with `allowedDevOrigins: ['*']` for Replit's dynamic subdomains
- ✅ Set up development workflow on port 5000 with proper host binding (0.0.0.0)
- ✅ Configured deployment settings for Replit autoscale deployment

## Development Setup

### Package Manager
- **Current**: PNPM (required for this project)
- **Installation**: `pnpm install`
- **Development**: `pnpm run dev`

### Environment Configuration
- **Environment File**: `.env.local` (already configured with Firebase/Google Maps keys)
- **Critical Environment Variables**:
  - Firebase Client SDK credentials (NEXT_PUBLIC_FIREBASE_*)
  - Firebase Admin SDK credentials (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
  - Google Maps API key (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
  - Gemini API key (GEMINI_API_KEY)

### Replit-Specific Configuration

#### Next.js Configuration
```javascript
// next.config.mjs
const nextConfig = {
  allowedDevOrigins: ['*'], // Required for Replit proxy environment
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  output: 'standalone'
}
```

#### Development Workflow
- **Name**: Next.js Dev Server
- **Command**: `pnpm run dev --port=5000 --hostname=0.0.0.0`
- **Port**: 5000 (required for Replit)
- **Output Type**: webview

#### Deployment Configuration
- **Target**: autoscale
- **Build**: `corepack enable && pnpm install --frozen-lockfile && pnpm build`
- **Run**: `pnpm start -- -p $PORT -H 0.0.0.0`

## Current Issues (Needs Resolution)

### 🚨 Critical Authentication Issues
- **Status**: BROKEN - Event creation fails with 401 errors
- **Root Cause**: Session cookie authentication not working between client and server
- **Impact**: Users cannot create events or access protected API endpoints
- **Files Affected**: 
  - `components/CreateEventModal.tsx` (missing `credentials: 'include'`)
  - `lib/auth-server.ts` (session verification)
  - `app/api/events/route.ts` (authentication middleware)

### 📱 Mobile Interface Issues
- **Status**: BROKEN - Touch interactions not working
- **Root Cause**: Location selection in create event modal doesn't respond to touch
- **Impact**: Mobile users cannot create events
- **Files Affected**: 
  - `components/location-search.tsx`
  - `components/manual-location-search.tsx`

### 🔧 Firebase Integration Issues
- **Status**: WARNING - Browser compatibility issues
- **Root Cause**: Firebase messaging not supported in current browser environment
- **Impact**: Push notifications may not work
- **Files Affected**: 
  - `lib/firebase-messaging.ts`
  - `components/notification-permission-handler.tsx`

### ♿ Accessibility Issues
- **Status**: WARNING - Screen reader accessibility violations
- **Root Cause**: Missing DialogTitle elements in Radix UI components
- **Impact**: Poor accessibility for screen reader users
- **Files Affected**: Multiple dialog components throughout the app

## Project Structure
```
/
├── app/
│   ├── (app)/           # Protected routes (requires authentication)
│   │   ├── discover/
│   │   ├── map/
│   │   ├── my-events/
│   │   └── profile/
│   ├── api/             # Next.js API routes
│   └── globals.css
├── components/          # React components
├── lib/                 # Utilities and configurations
├── public/              # Static assets
└── functions/           # Firebase Cloud Functions
```

## Technology Stack
- **Framework**: Next.js 15.2.4 with App Router + Turbopack
- **Language**: TypeScript
- **Package Manager**: PNPM
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **Maps**: Google Maps Platform
- **UI**: Tailwind CSS + Shadcn/ui + Radix UI
- **Validation**: Zod
- **Analytics**: Vercel Analytics + Speed Insights

## Development Notes
- The application uses React 19 with special overrides in package.json
- Firebase Admin SDK requires properly formatted FIREBASE_PRIVATE_KEY (multi-line with \n)
- Google Maps integration requires Maps JavaScript API, Places API, and Geocoding API
- The app implements a secure route group architecture with authentication gateways

## Next Steps
1. Fix authentication system (session cookies)
2. Resolve mobile touch interface issues
3. Implement Firebase messaging compatibility checks
4. Address accessibility violations
5. Complete feature implementation (Google Sign-In, AI content generation)

## User Preferences
- Prefer editing existing files over creating new ones
- Use existing project structure and coding patterns
- Focus on fixing core functionality before adding new features
- Ensure mobile-responsive design for all components