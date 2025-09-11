# Overview

Huddle is a modern, full-stack geospatial social platform for local pickup sports. Built on a serverless architecture using Next.js 15 with the App Router, the application centers around an interactive map where users can discover, create, and join local sports events. The platform features real-time capabilities, social connectivity, gamification elements, and AI-assisted event creation to create an engaging community experience for sports enthusiasts.

**Current Status**: ✅ Production-ready with fully functional Create Event feature including location search, map integration, and real-time event management.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Development Milestones

## 🎯 Create Event Feature - COMPLETE (September 2025)
**Status**: ✅ Production-ready and fully functional

### Key Achievements:
- **Location Search Component**: Fully controlled component with Google Places API integration
- **Interactive Map Integration**: Real-time location selection with map markers and centering  
- **Form Validation**: Complete input validation with smart enable/disable controls
- **API Integration**: Robust event creation with Firestore database storage
- **Performance Optimization**: Fixed hydration issues and added composite indexes
- **Security Hardening**: Implemented proper credential management and authentication

### Technical Implementation Details:
- **LocationSearchInput**: Converted to controlled component with `value`, `onChange`, and `onPlaceSelect` props
- **CreateEventModal**: Unified state management using `center`, `marker`, and `locationText` variables
- **Backend API**: Complete `/api/events` endpoint with Zod validation and geospatial indexing
- **Database Indexes**: Added composite indexes for `hostId+createdAt` and `players+date` queries
- **Authentication**: Session-based auth with Firebase Admin SDK integration

### Resolved Critical Issues:
1. **Location Search Bug**: Fixed Places library loading and autocomplete functionality
2. **State Management**: Implemented unified location state across map and input components
3. **Client/Server Mismatch**: Resolved payload format discrepancies in event creation
4. **Security Vulnerability**: Removed exposed Firebase credentials from codebase
5. **Hydration Errors**: Fixed SSR/client-side rendering mismatches
6. **Database Permissions**: Configured proper Firestore security rules

### User Experience Enhancements:
- **Multi-input Support**: Location search works with mouse, touch, and keyboard navigation
- **Real-time Feedback**: Immediate visual feedback for location selection and form validation
- **Error Handling**: Comprehensive error states and user guidance
- **Mobile Responsiveness**: Touch-friendly interface optimized for all devices

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 15 with App Router and Turbopack for fast development builds
- **Route Structure**: Secure route groups pattern with public routes (`/`) for landing/auth and private routes (`app/(app)/*`) for authenticated users only
- **UI/UX**: Modern "glassmorphism" design system using Tailwind CSS and Shadcn/ui components with a liquid gradient background and glass-surface effects
- **State Management**: React Context API for Firebase authentication state and local component state for UI interactions
- **Real-time Updates**: Firebase Firestore listeners for live chat messages and event updates

## Backend Architecture
- **Database**: Cloud Firestore (NoSQL) with denormalized data structure for performance
- **Authentication**: Firebase Authentication supporting email/password and Google Sign-In
- **Serverless Functions**: Firebase Cloud Functions for AI event generation and scheduled push notifications
- **API Routes**: Next.js API routes for server-side operations using Firebase Admin SDK
- **Security**: Session-based authentication with Firebase session cookies for server-side verification

## Data Storage Design
The database uses a collection-based structure optimized for real-time queries:
- `users` collection: User profiles with subcollections for connections
- `events` collection: Event data with denormalized player arrays and chat subcollections
- Composite indexes configured for efficient geospatial and temporal queries

## Authentication & Authorization
- Client-side authentication handled through Firebase Auth context
- Server-side verification using Firebase Admin SDK with session cookies
- Protected route groups ensuring authenticated access to main application features
- Role-based permissions for event organizers and participants

## Mapping & Location Services
- Google Maps Platform integration with custom styling and advanced markers
- Google Places API for location search and geocoding
- Geospatial queries using GeoFire for proximity-based event discovery
- Location permission handling with fallback manual location entry

# External Dependencies

## Core Services
- **Firebase**: Complete backend-as-a-service including Authentication, Firestore database, Cloud Functions, and Cloud Messaging for push notifications
- **Google Maps Platform**: Maps JavaScript API, Places API, and Geocoding API for location services
- **Vercel**: Frontend hosting and deployment platform with automatic builds from Git

## AI Integration
- **Google Generative AI (Gemini)**: AI-powered event title and description generation through Firebase Cloud Functions

## UI Libraries
- **Shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **TypeScript**: Type safety across the entire application
- **Zod**: Runtime type validation for API endpoints
- **PNPM**: Package manager for efficient dependency management

## Third-Party Integrations
- **Vercel Analytics & Speed Insights**: Performance monitoring and user analytics
- **Sonner**: Toast notification system for user feedback
- **Date-fns**: Date manipulation and formatting utilities