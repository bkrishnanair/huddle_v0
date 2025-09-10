"use client";
import { useEffect } from "react";
import { useAuth } from "@/lib/firebase-context";
import { requestNotificationPermission } from "@/lib/firebase-messaging";
import { toast } from "sonner";

// This is the new client-side function that calls our secure API endpoint.
const saveFcmTokenToServer = async (token: string) => {
  try {
    const response = await fetch('/api/fcm/save-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save FCM token.");
    }

    console.log("FCM token successfully sent to server.");
  } catch (error) {
    console.error("Error sending FCM token to server:", error);
    toast.error("Could not save notification preference.");
  }
};

export function NotificationPermissionHandler() {
  const { user } = useAuth();

  useEffect(() => {
    if ("Notification" in window && user) {
      const handlePermission = async () => {
        try {
          const token = await requestNotificationPermission();
          if (token) {
            console.log("FCM Token received on client:", token);
            await saveFcmTokenToServer(token); // Call the new API function
          }
        } catch (error) {
          console.error("Error handling notification permission:", error);
          // Don't bother the user with a toast for this, as it's often
          // due to them explicitly denying permission.
        }
      };

      handlePermission();
    }
  }, [user]); // Reruns when the user logs in

  return null; // This is a non-visual component
}
