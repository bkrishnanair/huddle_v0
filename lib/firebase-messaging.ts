import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { app } from "./firebase";

export const requestNotificationPermission = async (): Promise<string | null> => {
  // 1. Ensure we are in a browser environment
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // 2. Safely check if the browser supports FCM (prevents the HTTP/IP crash)
    const supported = await isSupported();
    if (!supported) {
      console.warn("Firebase Messaging is not supported in this browser context (likely HTTP local IP). Skipping notifications.");
      return null;
    }

    // 3. Ensure the Notification API exists on the window object
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notifications.");
      return null;
    }

    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");
      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      return fcmToken;
    } else {
      console.log("Unable to get permission to notify.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving the FCM token.", error);
    return null;
  }
};