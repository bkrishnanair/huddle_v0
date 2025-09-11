# Huddle: Internal Technical Documentation (V2)

**Status**: ✅ **Production-Ready** with fully functional Create Event feature

This document provides a comprehensive technical overview of the "Huddle" application, designed for onboarding new developers and serving as a reference for the existing team.

## 🎯 **RECENT MAJOR MILESTONE: Create Event Feature COMPLETE (September 2025)**

### **✅ Key Achievements**
- **🔍 Location Search Component**: Fully controlled component with Google Places API integration
- **🗺️ Interactive Map Integration**: Real-time location selection with map markers and centering  
- **✅ Form Validation**: Complete input validation with smart enable/disable controls
- **⚡ API Integration**: Robust event creation with Firestore database storage
- **🚀 Performance Optimization**: Fixed hydration issues and added composite indexes
- **🛡️ Security Hardening**: Implemented proper credential management and authentication

### **🔧 Critical Issues Resolved**
1. **Location Search Bug**: Fixed Places library loading and autocomplete functionality
2. **State Management**: Implemented unified location state across map and input components  
3. **Client/Server Mismatch**: Resolved payload format discrepancies in event creation
4. **Security Vulnerability**: Removed exposed Firebase credentials from codebase
5. **Hydration Errors**: Fixed SSR/client-side rendering mismatches
6. **Database Permissions**: Configured proper Firestore security rules

### **✨ User Experience Enhancements**
- **Multi-input Support**: Location search works with mouse, touch, and keyboard navigation
- **Real-time Feedback**: Immediate visual feedback for location selection and form validation
- **Error Handling**: Comprehensive error states and user guidance
- **Mobile Responsiveness**: Touch-friendly interface optimized for all devices

## 1. Project Overview & Architecture

Huddle is a geospatial social platform for local pickup sports. The application is built on a modern, serverless architecture designed for scalability, security, and performance.

**Core Architectural Pattern: Secure Route Groups**
The app's foundation is a **secure route group** structure implemented with the Next.js App Router. This is a critical concept for any developer working on the project.

-   **Public Routes (`/`)**: The root of the application is the public-facing landing and authentication page. It has its own simple layout and is the only part of the app accessible to unauthenticated users.
-   **Private Routes (`app/(app)/*`)**: All main application pages (`/map`, `/events`, `/chat`, `/profile`) are located inside a route group folder named `(app)`. This group is governed by a secure layout (`app/(app)/layout.tsx`) that acts as an **authentication gateway**. It automatically verifies the user's session and redirects any unauthenticated requests to the login page, ensuring the application is secure by default.

## 2. Technology Stack

*   **Framework**: Next.js (v15+) using the App Router with **Turbopack**
*   **Language**: TypeScript
*   **Backend**: Firebase (Serverless)
    *   **Authentication**: Firebase Authentication (Email/Password, Google Sign-In)
    *   **Database**: Cloud Firestore (NoSQL)
    *   **Serverless Functions**: Firebase Cloud Functions
*   **Validation**: Zod
*   **Mapping**: Google Maps Platform
*   **UI**: Tailwind CSS with Shadcn/ui components
*   **Deployment**: Vercel (Frontend) & Firebase (Backend)
*   **Package Manager**: PNPM

## 3. Database Schema (Cloud Firestore)

Data is organized into collections of documents. The schema uses denormalization for performance.

#### `users` collection
*   **Document ID**: User's Firebase `uid`.
*   **Description**: Stores public-facing and app-specific user information.
*   **Key Fields**: `uid`, `displayName`, `email`, `fcmTokens: Array<string>`, `bio: string`, `favoriteSports: Array<string>`, `badges: Array<string>`.
*   **Subcollections**:
    *   `connections/{userId}`: Stores connection requests and statuses. Each document represents a connection with another user.

#### `events` collection
*   **Document ID**: Auto-generated.
*   **Description**: Stores all data for a single event.
*   **Key Fields**:
    *   `title`, `sport`, `location`, `latitude`, `longitude`, `date`, `time`
    *   `maxPlayers`, `currentPlayers`
    *   `createdBy`: `uid` of the event organizer.
    *   `players: Array<string>`: An array of `uid`s for all RSVP'd users. (Denormalized for fast lookups)
    *   `checkedInPlayers: Array<string>`: An array of `uid`s for users the organizer has checked in. (Denormalized)
*   **Subcollections**:
    *   `chat/{messageId}`: Stores all messages for the event's real-time chat.

---

## 4. Authentication & Session Management

The app uses a hybrid model that separates client and server-side concerns.

*   **Client-Side (`lib/auth.ts`)**: Contains functions for browser-based auth flows (login, signup, etc.) and a `getCurrentUser` function for synchronous UI checks.
*   **Server-Side (`lib/auth-server.ts`)**: Contains a `getServerCurrentUser` function that **must** be used in all API Routes. It securely verifies a session cookie sent from the client using the Firebase Admin SDK. This is the source of truth for user identity on the backend.
*   **Session State (`lib/firebase-context.tsx`)**: A central React Context provider (`FirebaseProvider`) uses the `onAuthStateChanged` listener to manage the user's session state in the browser, making it available to all components via the `useAuth` hook.

## 5. API Endpoints (Next.js API Routes)

All API routes are located in the `app/api/` directory and are secured with Zod server-side validation.

### **Recent Updates (September 2025)**
- **Updated for Next.js 15 compatibility**: All routes now use `await params` and `await cookies()`
- **Enhanced validation**: Complete Zod schemas with geospatial data validation
- **Improved error handling**: Comprehensive error responses with proper HTTP status codes

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/events` | `GET` | Fetches a list of all events, or nearby events if location data is provided. |
| `/api/events` | `POST` | **Authenticated.** Creates a new single or recurring event. **RECENTLY UPDATED:** Fixed payload validation to accept `{location: {text, lat, lng}, boostEvent}` format. |
| `/api/events/[id]/details` | `GET` | **Authenticated.** Fetches detailed information for a single event, including the profile data of all players. |
| `/api/events/[id]/rsvp` | `POST` | **Authenticated.** Allows a user to RSVP for or leave an event. Awards "first_game" badge. |
| `/api/events/[id]/checkin` | `POST` | **Authenticated & Organizer Only.** Checks a player into an event. |
| `/api/events/[id]/chat` | `POST` | **Authenticated.** Posts a new message to an event's chat. |
| `/api/users/[id]/events`| `GET` | **Authenticated.** Fetches all events a specific user has organized or joined. |
| `/api/users/profile`| `POST` | **Authenticated.** Updates a user's profile (displayName, bio, favoriteSports). |
| `/api/connections/request`| `POST` | **Authenticated.** Sends a connection request to another user. |
| `/api/connections/accept`| `POST` | **Authenticated.** Accepts a pending connection request. |


## 6. Key Feature Implementations

*   **Server-Side Validation**: All critical API endpoints use `zod` schemas to validate incoming data, preventing invalid data from reaching the database.
*   **Global Error Notifications**: The app uses `sonner` to provide users with toast notifications for success and error states on all major actions.
*   **Automated Push Notifications (Cloud Function)**:
    *   A scheduled Cloud Function (`functions/send-reminders.js`) runs every 10 minutes.
    *   It queries for events starting in the near future, retrieves the `fcmTokens` for all RSVP'd users, and sends a reminder notification via Firebase Cloud Messaging.
*   **Gamification (Achievements)**:
    *   The `/api/events/[id]/rsvp` route contains logic to detect when a user joins their first event.
    *   When this occurs, the user's document is updated with a "first_game" badge, which is then displayed on their profile.

## 7. Local Development Setup

1.  **Environment Variables**: Create a `.env.local` file in the project root with the following variables:

```bash
# Firebase Client Configuration (Public - Safe for browser)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Maps Configuration (Public)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id

# Firebase Admin SDK (Private - Server-side only)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----"

# Additional APIs
GEMINI_API_KEY=your_gemini_api_key
```

2.  **Install Dependencies**: This project uses PNPM. You only need to install dependencies in the root directory.
    ```bash
    pnpm install
    ```

3.  **Database Setup** (Firebase):
    ```bash
    # Deploy Firestore security rules
    firebase deploy --only firestore:rules
    
    # Deploy Firestore indexes (required for geospatial queries)
    firebase deploy --only firestore:indexes
    ```

4.  **Run the App**:
    ```bash
    pnpm run dev
    # Open browser to http://localhost:5000
    ```

## 8. Testing the Create Event Feature

### **Complete User Flow**
1. **Navigate to Create Event**: Click "Host Game" button on main interface
2. **Location Search**: 
   - Type location in search input
   - Select from autocomplete suggestions using mouse, keyboard, or touch
   - Verify map centers and marker updates automatically
3. **Event Details**: Fill out sport type, date/time, player limits, and description
4. **Validation**: Observe "Host Game" button enables only when all fields are valid
5. **Submit**: Create event and verify it appears in nearby events list

### **Expected Behavior**
- ✅ Location input shows autocomplete suggestions
- ✅ Map updates with marker positioning in real-time
- ✅ Form validation prevents invalid submissions
- ✅ Event creation succeeds with proper database storage
- ✅ New events appear immediately in discovery interface

## 9. Code Patterns & Implementation Guidelines

### **LocationSearchInput Component** (Recently Updated)
```typescript
// Now uses controlled component pattern
<LocationSearchInput
  value={locationText}
  onChange={setLocationText}
  onPlaceSelect={handlePlaceSelect}
  placeholder="Enter location..."
/>
```

### **CreateEventModal State Management** (Recently Updated)
```typescript
// Unified location state approach
const [center, setCenter] = useState<{lat: number, lng: number}>()
const [marker, setMarker] = useState<{lat: number, lng: number}>()
const [locationText, setLocationText] = useState<string>("")

// Location selection handler
const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
  if (place.geometry?.location) {
    const lat = place.geometry.location.lat()
    const lng = place.geometry.location.lng()
    setCenter({ lat, lng })
    setMarker({ lat, lng })
    setLocationText(place.formatted_address || place.name || "")
  }
}
```

### **API Routes Pattern** (Next.js 15 Compatible)
```typescript
// Always use await for params and cookies in Next.js 15
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const cookieStore = await cookies()
  
  // Validate request with Zod
  const body = await request.json()
  const validatedData = eventSchema.parse(body)
  
  // Authenticate using session cookie
  const user = await getServerCurrentUser(cookieStore)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
  // Process request...
}
```

## 10. Troubleshooting Common Issues

### **Firebase Configuration Errors**
```
Error: Missing Firebase configuration variables
```
**Solution**: Ensure all `NEXT_PUBLIC_FIREBASE_*` variables are set in `.env.local`

### **Location Search Not Working**
```
Error: Places library not loaded
```
**Solution**: Verify Google Maps API key has Places API enabled and `libraries={["places"]}` is in APIProvider

### **Event Creation Fails**
```
Error: Invalid data format (400)
```
**Solution**: Check client payload matches API schema with `location: {text, lat, lng}` structure

### **Database Permission Errors**
```
Error: Missing or insufficient permissions
```
**Solution**: Deploy Firestore security rules using `firebase deploy --only firestore:rules`

## 11. Performance Considerations

- **Database Indexes**: Composite indexes configured for `hostId+createdAt` and `players+date` queries
- **Code Splitting**: Dynamic imports used for map components with `{ssr: false}` to prevent hydration issues
- **Bundle Optimization**: Strategic use of dynamic imports to reduce initial JavaScript bundle size
- **Caching Strategy**: Geospatial queries cached appropriately to reduce Firestore reads
