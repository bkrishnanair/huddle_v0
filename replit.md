# Huddle - Replit Environment Configuration

## Project Overview
Huddle is a modern full-stack Next.js application for discovering, creating, and joining local pickup sports events. This document outlines the Replit-specific setup and current project state.

## Recent Changes (October 1, 2025)
**Fresh GitHub Import Setup:**
- ✅ Installed all project dependencies with pnpm
- ✅ Configured environment variables (.env.local) with Firebase and Google Maps credentials
- ✅ Updated `next.config.mjs` with proper Replit proxy configuration using wildcard domains (*.replit.dev, *.repl.co)
- ✅ Added experimental serverActions configuration for Next.js 15 compatibility
- ✅ Verified Next.js dev server running on port 5000 with 0.0.0.0 host binding
- ✅ Configured deployment for autoscale with proper build and run commands
- ✅ Application successfully running and accessible in Replit environment

**Previous Changes (September 12, 2025)**
**Environment Setup for Replit:**
- ✅ Migrated from npm to pnpm package manager
- ✅ Configured Next.js dev server for Replit proxy environment
- ✅ Set up development workflow on port 5000 with proper host binding (0.0.0.0)
- ✅ Configured deployment settings for Replit autoscale deployment

**Critical Authentication System Fixes:**
- ✅ Resolved Next.js 15 async cookies() compatibility issues
- ✅ Fixed Firebase Admin SDK initialization with modular imports
- ✅ Implemented complete RSVP functionality with proper authentication
- ✅ Added missing user profile API endpoint (/api/users/[id]/profile)
- ✅ Updated all client-side fetch requests to include credentials for session authentication
- ✅ Resolved all authentication blocking issues - system now fully functional

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
  allowedDevOrigins: ['*.replit.dev', '*.repl.co'],
  experimental: {
    serverActions: {
      allowedOrigins: ['*.replit.dev', '*.repl.co'],
    },
  },
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

## Current Status (October 1, 2025)

### ✅ **FULLY FUNCTIONAL FEATURES**
- **Authentication System**: Complete session management with Next.js 15 compatibility
- **Event Management**: Users can create, discover, join, and leave events
- **RSVP System**: Full implementation with proper UI states and real-time updates
- **User Profiles**: Complete profile management with API endpoints
- **Real-time Chat**: Event-based messaging system working
- **Interactive Maps**: Google Maps integration with event discovery
- **Mobile Responsive**: Touch interactions and mobile UI working
- **Firebase Integration**: Admin SDK and client SDK properly initialized

### 🔧 **MINOR OPTIMIZATION NOTES**
- **Push Notifications**: Requires Firebase environment variables for full functionality
- **Accessibility**: Some dialog components could benefit from enhanced screen reader support
- **Performance**: Event queries optimized for viewport-based loading

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

## Production Readiness
The application is now fully functional and ready for production deployment. All critical authentication and core functionality issues have been resolved.

### To Deploy to Production:
1. **Environment Variables**: Configure Firebase credentials and Google Maps API keys
2. **Domain Setup**: Update `allowedDevOrigins` in next.config.mjs for production domain
3. **Firebase Rules**: Review and update Firestore security rules for production
4. **Analytics**: Vercel Analytics and Speed Insights already configured

### Future Enhancements:
1. Enhanced push notification system with proper FCM setup
2. Advanced accessibility improvements
3. Additional AI-powered features (event description generation)
4. Social features expansion (friend recommendations, event invitations)

## User Preferences
- Prefer editing existing files over creating new ones
- Use existing project structure and coding patterns
- Focus on fixing core functionality before adding new features
- Ensure mobile-responsive design for all components