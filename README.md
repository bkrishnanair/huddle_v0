# Huddle - V1 Stable

Huddle is a modern, full-stack web application designed to help users discover, create, and join local pickup sports events. Centered around an interactive map, it provides a seamless experience for finding nearby games, creating events with precise locations, and engaging with other participants through real-time chat.

This V1 release is feature-complete and stable, showcasing a scalable backend architecture and a polished, user-friendly "glassmorphism" UI.

## Screenshots

| Landing Page 1 | Landing Page 2 | Login/Signup |
| :---: | :---: | :---: |
| ![alt text](Pages/landingpage-1.png) | ![alt text](Pages/landingpage-2.png) | ![alt text](Pages/old/image-5.png) |

| Discover Events | Events Page | Event Search |
| :---: | :---: | :---: |
| ![alt text](Pages/old/image-4.png) | ![alt text](Pages/old/image-1.png) | ![alt text](Pages/old/image-6.png) |

| Create Event | Chat | Profile |
| :---: | :---: | :---: |
| ![alt text](Pages/old/image-7.png) | ![alt text](Pages/old/image-3.png) | ![alt text](Pages/old/image.png) |


## Key Features
*   **AI-Generated Event Details**: Get creative, catchy titles and descriptions for your event with a single click, powered by the Google Gemini API.
*   **Interactive Geospatial Search**: Users can discover events in their vicinity, powered by efficient geospatial queries using geohashing.
*   **Dynamic, Client-Side Filtering**: A fast and responsive UI allows users to instantly filter nearby events by sport, date, time, and availability without re-fetching data.
*   **Advanced Event Creation**: A completely overhauled event creation modal featuring an interactive map, a draggable pin for precise location setting, and Google Places Autocomplete for address searching.
*   **Real-Time Event Chat**: Each event includes a real-time chat for registered participants to coordinate and communicate.
*   **Social Sign-In**: Streamlined user onboarding with support for both traditional email/password and one-click Google Sign-In.
*   **User Profiles**: A dedicated profile page where users can view their organized and joined events.
*   **Modern UI/UX**: A beautiful "glassmorphism" design system built with Tailwind CSS and Shadcn/ui, featuring professional skeleton loading states for a smooth user experience.

## Tech Stack

| Category      | Technology                                                                                             |
| :------------ | :----------------------------------------------------------------------------------------------------- |
| **Framework** | [**Next.js**](https://nextjs.org/) (v15+ with App Router)                                                |
| **Language**  | [**TypeScript**](https://www.typescriptlang.org/)                                                      |
| **Backend**   | [**Firebase**](https://firebase.google.com/) (Serverless: Auth, Firestore, Cloud Functions)              |
| **Generative AI** | [**Google Gemini**](https://ai.google.dev/)                               |
| **Geospatial**| [**Google Maps Platform**](https://developers.google.com/maps) & [**`geofire-common`**](https://github.com/firebase/geofire-js) |
| **Styling**   | [**Tailwind CSS**](https://tailwindcss.com/) & [**Shadcn/ui**](https://ui.shadcn.com/)                   |
| **Deployment**| [**Vercel**](https://vercel.com/) (Frontend) & [**Firebase**](https://firebase.google.com/) (Backend)    |
| **Package Manager**| [**PNPM**](https://pnpm.io/)                                                                           |

---

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing purposes.

### 1. Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18 or later)
*   [PNPM](https://pnpm.io/installation)
*   [Firebase CLI](https://firebase.google.com/docs/cli) (for deploying Cloud Functions)

### 2. Clone the Repository

\`\`\`bash
git clone https://github.com/bkrishnanair/huddle_v0.git
cd huddle_v0
\`\`\`

### 3. Set Up Environment Variables

This project requires API keys from Firebase, Google Cloud, and Google AI to function.


1.  Create a `.env.local` file in the root of the project:
    \`\`\`bash
    touch .env.local
    \`\`\`
2.  Add the following environment variables to the file, replacing the placeholders with your actual project credentials:
    \`\`\`env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

    # Google Maps Configuration
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_google_maps_map_id
    \`\`\`
    > **Note:** For the Google Maps API Key, ensure you have enabled the **Maps JavaScript API**, **Places API**, and **Geocoding API** in your Google Cloud Console.

### 4. Install Dependencies and Run

This project uses `pnpm`. The repository includes an `.npmrc` file to automatically handle peer dependency issues during installation.
This project uses a monorepo-like structure with a separate `functions` directory. You will need to install dependencies in both the root and the `functions` directory.

\`\`\`bash
# Install all project dependencies
pnpm install
# Navigate to the functions directory and install its dependencies
cd functions
pnpm install
cd ..

# Run the development server
pnpm run dev
\`\`\`

The application should now be running on [http://localhost:3000](http://localhost:3000).

---

## Key Architectural Decisions

This project has been architected with performance and scalability in mind. Here are some of the key technical decisions:

*   **Scalability (Geospatial Queries)**: By storing a `geohash` for each event, the backend can efficiently query for events within a specific geographic area without checking every document in the database.
*   **Performance (Data Denormalization)**: Event documents are created with `organizerName` and `organizerPhotoURL` saved directly on them. This classic denormalization strategy avoids extra database requests and significantly reduces latency.
*   **User Experience (Client-Side Filtering & Skeletons)**: The app fetches a list of nearby events and then applies all filters on the client. This provides an instantaneous UI response. Skeleton loaders are used to improve perceived performance during initial data loads.
---
