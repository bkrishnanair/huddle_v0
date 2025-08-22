// components/notification-permission-handler.tsx
"use client";
import { useEffect } from "react";
import { useAuth } from "@/lib/firebase-context";
import { requestNotificationPermission } from "@/lib/firebase-messaging";
import { saveFcmToken } from "@/lib/db";

export function NotificationPermissionHandler() {
  const { user } = useAuth();

  useEffect(() => {
    // Only proceed if we have an authenticated user.
    if (user) {
      const handlePermission = async () => {
        // We'll use local storage to remember if we've already asked for permission.
        // This avoids bothering the user on every single page load.
        const permissionRequested = localStorage.getItem("notificationPermissionRequested");

        if (!permissionRequested) {
          const token = await requestNotificationPermission();
          if (token) {
            // If we get a token, save it to the user's document in Firestore.
            await saveFcmToken(user.uid, token);
          }
          // Mark that we have now requested permission.
          localStorage.setItem("notificationPermissionRequested", "true");
        }
      };

      handlePermission();
    }
  }, [user]);

  // This component does not render anything to the UI.
  return null;
}
