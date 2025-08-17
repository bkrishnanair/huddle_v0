// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize the Firebase Admin SDK.
// This is necessary for backend access to Firebase services.
admin.initializeApp();

/**
 * A scheduled Cloud Function that runs every 10 minutes.
 * It checks for upcoming events and sends push notifications to RSVP'd users.
 */
exports.sendEventReminders = functions.pubsub.schedule("every 10 minutes").onRun(async (context) => {
  console.log("Running scheduled event reminder function.");

  const now = new Date();
  // Set a time window: check for events starting in the next 25 to 35 minutes.
  // This window prevents sending multiple notifications for the same event.
  const startTime = new Date(now.getTime() + 25 * 60 * 1000); // 25 minutes from now
  const endTime = new Date(now.getTime() + 35 * 60 * 1000); // 35 minutes from now

  const db = admin.firestore();

  try {
    // 1. Query for events starting within our time window.
    const eventsSnapshot = await db.collection("events")
      .where("date", ">=", startTime.toISOString().split('T')[0])
      .where("date", "<=", endTime.toISOString().split('T')[0])
      .get();

    if (eventsSnapshot.empty) {
      console.log("No upcoming events found in the time window.");
      return null;
    }

    const reminderPromises = [];

    // 2. For each upcoming event, process the notifications.
    eventsSnapshot.forEach(doc => {
      const event = doc.data();
      const eventTime = new Date(`${event.date}T${event.time}`);

      // Double-check if the event is truly in our 25-35 minute window.
      if (eventTime >= startTime && eventTime <= endTime && event.players && event.players.length > 0) {
        console.log(`Found upcoming event: ${event.title}`);
        
        // 3. Get the list of RSVP'd user IDs.
        const playerIds = event.players;

        // 4. Look up users to get their FCM tokens.
        const tokensPromise = db.collection("users").where(admin.firestore.FieldPath.documentId(), "in", playerIds).get().then(usersSnapshot => {
          const tokens = [];
          usersSnapshot.forEach(userDoc => {
            const userData = userDoc.data();
            if (userData.fcmTokens && userData.fcmTokens.length > 0) {
              tokens.push(...userData.fcmTokens);
            }
          });
          return tokens;
        });
        
        // 5. Send notifications using the Firebase Admin SDK.
        reminderPromises.push(tokensPromise.then(tokens => {
          if (tokens.length > 0) {
            const message = {
              notification: {
                title: "Event Reminder!",
                body: `Your ${event.sport} game at ${event.location.address} starts in 30 minutes!`,
              },
              tokens: tokens,
            };
            
            console.log(`Sending notification for "${event.title}" to ${tokens.length} users.`);
            return admin.messaging().sendMulticast(message);
          } else {
            return null;
          }
        }));
      }
    });

    await Promise.all(reminderPromises);
    console.log("Event reminder processing finished.");
  } catch (error) {
    console.error("Error sending event reminders:", error);
  }

  return null;
});
