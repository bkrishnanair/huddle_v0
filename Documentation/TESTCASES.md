# Huddle Test Cases

This document outlines the core functional test cases for the Huddle application to ensure stability across major features and components.

## TC-01: Authentication & User Accounts
| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate to `/login` and enter valid standard credentials | User is successfully authenticated and redirected to `/discover` | |
| 2 | Click "Continue with Google" on Login page | Google OAuth popup appears, user selects account, and successfully redirects to `/discover` | |
| 3 | Navigate to `/register` and create a new account | Account is created in Firebase Auth, and user profile is initialized in Firestore database | |
| 4 | Click "Logout" from the Profile dropdown menu | Secure session cookie is deleted, user is signed out of Firebase, and redirected back to `/login` | |

## TC-02: Event Discovery & Map Rendering
| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate to `/discover` and view list of events | Event cards render properly with titles, times, distances, and category tags | |
| 2 | Click on a category filter (e.g., "Sports") | The list shrinks to only show events matching the selected category | |
| 3 | Adjust the distance slider (e.g., "10 Miles") | Events further than 10 miles are filtered out | |
| 4 | Navigate to `/map` | Google Maps canvas loads with the standard Light Theme | |
| 5 | Hover over an event pin on the map | The pin dynamically scales and immediately shows a floating tooltip with event name and time | |

## TC-03: Event Creation Flow
| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Click "Create Event" FAB | The `CreateEventModal` drawer opens, prompting for details | |
| 2 | Fill out event details (Name, Date, Location, Time, End Time) and Submit | The UI shows a success Toast notification, and the event appears in the database | |
| 3 | Use the "AI Suggest" button within Create Event | Form automatically populates with a creatively generated event name and description, and matches the correct category | |
| 4 | Unauthenticated User clicks "Create Event" on `/map` | System intercepts the request, shows an error toast, and dynamically redirects the user to `/login` | |

## TC-04: My Events Management
| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate to `/my-events` | Page loads successfully without a 500 error or redirect loop | |
| 2 | Click the "Upcoming" / "Past" sub-tab toggles under "Joined" | The display list toggles cleanly between filtered arrays based on the `.filter(isUpcoming)` logic | |
| 3 | Click the "Hosted" tab | Displays all events created by the logged-in user | |
| 4 | Use the Search Bar on `my-events` | The displayed grids actively filter based on title, description, and location substring matches | |

## TC-05: Real-time Check-ins and Event Details
| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Click "View Details" on an upcoming event | The Event Details Drawer slides open on mobile/desktop, rendering a high-res Unsplash cover image matching the sport/category | |
| 2 | Click the "Join Event" button | User UUID is appended to the event's `players` array in Firestore, `currentPlayers` integer increments by 1 | |
| 3 | Click the "Check-In" button when GPS is within 1 mile of event | Verification succeeds, checking the user into the real-time Geolocation pool | |
| 4 | Close the drawer | The active listing updates on the map/discover list to reflect the newly joined status or incremented player count | |
