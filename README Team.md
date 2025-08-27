Here is a comprehensive overview of the "Huddle" application, designed to get you contributing effectively from day one.

Huddle is a geospatial social platform designed to help users discover, create, and join local pickup sports events. The application is centered around an interactive map where users can find nearby games. Core features include a robust event creation process with precise location pinning, real-time chat for event attendees, and a comprehensive user profile system. The project has recently undergone significant performance and user experience enhancements, making it a scalable and polished V1 product.

Framework: Next.js (v15+) using the App Router
Language: TypeScript
Backend: Firebase (Serverless)
Authentication: Firebase Authentication (Email/Password, Google Sign-In)
Database: Cloud Firestore (NoSQL)
Geospatial: Google Maps Platform & geofire-common library for location-based queries
UI: Tailwind CSS with Shadcn/ui components
Deployment: Vercel (Frontend) & Firebase (Backend)
Package Manager: PNPM
/
├── app/                      # Next.js App Router: Contains all pages and API routes.
│   ├── api/                  # Backend API endpoints.
│   │   ├── events/           # Handles event creation and fetching.
│   │   │   ├── nearby/       # CRITICAL: New endpoint for geospatial queries.
│   │   └── ...               # Other routes for users, chat, etc.
│   └── profile/              # The user profile page component.
├── components/               # All reusable React components.
│   ├── ui/                   # Core UI elements from Shadcn (Button, Card, etc.).
│   ├── events/               # Components specific to the event discovery page.
│   └── ...                   # Other specific components (chat, auth, etc.).
├── lib/                      # Core logic, context, and Firebase utilities.
├── public/                   # Static assets (images, icons).
├── .npmrc                    # NEW: Configuration file for PNPM to handle dependencies correctly.
├── firebase.json             # Firebase project configuration.
├── firestore.rules           # CRITICAL: Security rules for the Firestore database.
├── next.config.mjs           # Next.js framework configuration.
└── package.json              # Project dependencies and scripts.


File Name	Path	Functionality
events-page.tsx	components/events-page.tsx	Core Component. Manages the entire "Discover" experience. Fetches nearby events, handles client-side filtering, and renders the fallback UI if location access is denied.
create-event-modal.tsx	components/create-event-modal.tsx	Overhauled. A modal with an interactive map, draggable marker, and Google Places Autocomplete for creating new events with precise locations.
db.ts	lib/db.ts	Crucial Logic. Contains functions for all Firestore interactions, including the new getNearbyEvents for geospatial queries.
route.ts	app/api/events/nearby/route.ts	New API Endpoint. The backend route that performs the efficient, location-based query for nearby events using geohashing.
route.ts	app/api/events/route.ts	Modified. The POST handler was upgraded to add geohash, GeoPoint, and denormalized organizerName/organizerPhotoURL to new events.
location-search.tsx	components/location-search.tsx	New Component. A reusable input that integrates Google Places Autocomplete for address searching.
manual-location-search.tsx	components/manual-location-search.tsx	New Component. A user-friendly fallback UI that prompts for manual location input if geolocation fails.
auth.ts	lib/auth.ts	Modified. Contains all client-side authentication logic, including the new signInWithGoogle function that handles the popup flow and new user creation.
auth-screen.tsx	components/auth-screen.tsx	Modified. The UI for login/signup, now featuring a "Continue with Google" button.
firestore.rules	/firestore.rules	Security Critical. Defines all security and access rules for the database.
.npmrc	/.npmrc	Deployment Critical. Ensures Vercel's build process correctly handles peer dependency issues with pnpm.
Onboarding: A new user lands on the AuthScreen. They can sign up with email/password or use the new "Continue with Google" button. The logic in lib/auth.ts handles the Firebase call and ensures a new document is created in the users collection in Firestore.
Event Discovery (Location Enabled): The user is directed to the EventsPage. The browser requests location permission. On success, the frontend calls the GET /api/events/nearby endpoint with the user's coordinates. The backend performs an efficient geospatial query and returns only the events within a 50km radius.
Event Discovery (Location Denied): If the user denies permission, the EventsPage renders the ManualLocationSearch component. The user can type a city name, which is then geocoded to coordinates, and the flow proceeds as above.
Client-Side Filtering: The EventsPage stores the fetched events in a master state (allNearbyEvents). When the user interacts with the search bar, sport dropdown, or other filters, a derived state (filteredEvents) is instantly recalculated on the client, providing a fast and responsive UI.
Event Creation: A user clicks "Create Event," opening the CreateEventModal. They use the LocationSearchInput to find a general area, then drag the marker to pinpoint the exact spot. When they submit, the form data, including the marker's final coordinates and the location's name, is sent to POST /api/events. The backend then enriches this data with a geohash and denormalized organizer info before saving it to Firestore.
I've noticed three critical, recent architectural decisions that are vital to understand:

Scalability (Geospatial Queries): The project has moved from a naive "fetch all" approach to a highly scalable one. By calculating and storing a geohash for each event, the backend can now query for events within a specific geographic area without having to check every single document in the database. This is the correct, production-grade way to build a location-aware application.
Performance (Data Denormalization): To speed up the UI, event documents are now created with organizerName and organizerPhotoURL saved directly on them. This is a classic denormalization strategy. It avoids the need for the client to make a second database request to fetch the organizer's profile for every event card it needs to display, significantly reducing latency and database reads.
User Experience (Optimistic UI & Skeletons): The app uses skeleton loaders to provide a better perceived performance while data is being fetched. Additionally, client-side filtering provides an instant response to user input, making the interface feel much faster than if it had to make an API call for every filter change.
1. Setup Environment Variables (CRITICAL): Before you can run the project, you must create a .env.local file in the root directory. You will need to populate it with credentials for both Firebase (from your Firebase project console) and Google Maps Platform. For the Maps API key, ensure you have enabled the Maps JavaScript API, Places API, and Geocoding API.
2. Start at events-page.tsx: This component is now the heart of the application's core user experience. Tracing its logic—from the initial data fetch to the client-side filtering—is the best way to understand how the app works.
3. Review the API Routes: Look at the difference between the old GET /api/events and the new GET /api/events/nearby. Then, examine POST /api/events to see exactly how the geohashing and denormalization are implemented. This will give you a full picture of the client-server interaction.
4. Understand Denormalization Trade-offs: Be aware that the current denormalization approach has a trade-off. If a user updates their name or profile picture, their old information will still be displayed on the events they've created. A future task would be to implement a Firebase Cloud Function to automatically update these events when a user's profile changes.