# Huddle Testing Guide

This document outlines the standard manual testing procedures for the Core Features, explicitly including the newly engineered Social Graph and Serendipity Engine.

## 1. Social Graph (Follow System)
**Goal:** Verify atomic transactions, precise social proof badge injections, and profile metric scaling.

### Test Case A: Following & Unfollowing
1. Log in as **User A**.
2. Navigate to the Discover Feed or Map and click on **User B's** avatar to open their public profile.
3. Click the `Follow` button.
   - *Expected:* The button instantly changes to `Following` (Optimistic UI).
4. Verify the database:
   - Check Firestore `users/{User A ID}/following/{User B ID}` exists.
   - Check Firestore `users/{User B ID}/followers/{User A ID}` exists.
5. Click the `Following` button.
   - *Expected:* A confirmation dialog (`Unfollow User B?`) appears.
6. Confirm the unfollow.
   - *Expected:* Both documents are removed from Firestore atomically.

### Test Case B: Follower Threshold & Onboarding CTA
1. Ensure **User A** has `count` = 0 followers.
2. Navigate to **User A's** own profile (`My Profile`).
   - *Expected:* The Followers stat block explicitly shows `0`. 
   - *Expected:* The glassmorphic "Build your network" CTA panel is visible beneath the stats.
3. Using another account or Firestore directly, add 5 followers to **User A**.
4. Refresh **User A's** profile.
   - *Expected:* The Followers block shows `5`. The "Build your network" CTA panel is no longer visible.

### Test Case C: Social Proof (Event Cards)
1. Ensure **User A** follows **User B**.
2. **User B** joins Event X.
3. **User A** navigates to the Discover Feed.
   - *Expected:* Event X's card displays a distinct `🔥 1 friend attending` badge.
4. **User A** unfollows **User B**.
5. **User A** scrolls the Discover Feed.
   - *Expected:* The badge immediately disappears from Event X's card.

## 2. Serendipity Engine (Targeted Push Notifications)
**Goal:** Verify location tracking debouncing protects Firebase writes, and the RSVP engine properly filters distances and sport interests before fanning out notifications.

### Test Case A: Client-Side Location Debouncing
1. Log in as **User A**. Open the Map View.
2. Ensure you have granted Browser Geolocation permissions.
3. The map will locate you. Open the Network tab in your browser inspection tools.
   - *Expected:* A `POST` request is fired identically to `/api/users/[User A ID]/location`.
4. Without moving, refresh the Map View page.
   - *Expected:* No `POST` request is fired (distance < 500m logic applies).
5. Artificially override the `lastLocationSync_{UID}` string in LocalStorage to coordinates >500 meters away.
6. Refresh the Map View page.
   - *Expected:* The `POST` request is fired again.

### Test Case B: Serendipity Filtering (Interest & Distance)
1. **Setup User A (Follower):**
   - Profile `favoriteSports`: `["Basketball", "Tech"]`
   - Map View `lastKnownLocation`: New York City, NY.
2. **Setup User B (Leader):**
   - Map location: New York City, NY.
3. **Action:** User A follows User B.
4. **Scenario 1 (Valid Filter):** User B creates a "Basketball" event in Brooklyn, NY (within 25 miles). User B joins the event.
   - *Expected:* The API runs. User A's `notifications` subcollection receives a `friend_attending` push notification doc.
5. **Scenario 2 (Invalid Interest):** User B creates a "Soccer" event in Brooklyn, NY. User B joins.
   - *Expected:* User A receives **no** notification. (Their interests do not include Soccer).
6. **Scenario 3 (Invalid Distance):** User B creates a "Basketball" event in Washington DC (200+ miles away). User B joins.
   - *Expected:* User A receives **no** notification. (Event is > 25 miles away).
7. **Scenario 4 (No Filters Set):** User A clears their `favoriteSports` array completely. User B joins a "Learning" event in NYC.
   - *Expected:* User A receives a notification. (Empty array acts as a wildcard).
