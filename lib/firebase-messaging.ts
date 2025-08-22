// lib/firebase-messaging.ts
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "./firebase"; // Assuming 'app' is your initialized Firebase app instance

/**
 * Requests permission from the user to send push notifications.
 * @returns {Promise<string | null>} The FCM token if permission is granted, otherwise null.
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  // Ensure we are in a browser environment before proceeding.
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");
      // Retrieve the FCM token. The VAPID key is automatically sourced from your Firebase config.
      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY, // Add your VAPID key to .env.local
      });
      return fcmToken;
    } else {
      console.log("Unable to get permission to notify.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving the token.", error);
    return null;
  }
};
