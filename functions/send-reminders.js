const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Get a reference to the Firestore database
const db = admin.firestore();

/**
 * Scheduled Firebase Cloud Function to send push notification reminders for upcoming events.
 * This function runs every 10 minutes.
 */
exports.sendEventReminders = functions.pubsub.schedule("every 10 minutes").onRun(async (context) => {
  console.log("Starting to check for upcoming events...");

  // Calculate the time window for events starting in the next 30-40 minutes
  const now = new Date();
  const startTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
  const endTime = new Date(now.getTime() + 40 * 60 * 1000); // 40 minutes from now

  const eventsRef = db.collection("events");

  try {
    // 1. Query for events within the upcoming time window
    const upcomingEventsSnapshot = await eventsRef
      .where("date", "==", startTime.toISOString().split("T")[0]) // Events happening today
      .get();

    if (upcomingEventsSnapshot.empty) {
      console.log("No events scheduled for today.");
      return null;
    }

    const reminderPromises = [];

    // 2. Iterate through each event and check if it's within the time window
    upcomingEventsSnapshot.forEach((doc) => {
      const event = doc.data();
      const eventTime = new Date(`${event.date}T${event.time}`);

      if (eventTime >= startTime && eventTime <= endTime) {
        console.log(`Found upcoming event: ${event.title}`);
        
        // 3. For each upcoming event, fetch the FCM tokens of all RSVP'd players
        const playerIds = event.players || [];
        if (playerIds.length === 0) {
          console.log(`No players to notify for event: ${event.title}`);
          return;
        }

        const tokensPromise = getFcmTokens(playerIds);
        reminderPromises.push(
          tokensPromise.then((tokens) => {
            if (tokens.length > 0) {
              // 4. Send the push notification
              return sendPushNotification(tokens, event);
            }
            return null;
          })
        );
      }
    });

    await Promise.all(reminderPromises);
    console.log("Finished sending event reminders.");
  } catch (error) {
    console.error("Error sending event reminders:", error);
  }
  return null;
});

/**
 * Fetches the FCM tokens for a given array of user IDs.
 * @param {string[]} userIds The user IDs to fetch tokens for.
 * @returns {Promise<string[]>} A promise that resolves with an array of FCM tokens.
 */
async function getFcmTokens(userIds) {
  const tokens = [];
  const userPromises = userIds.map((userId) => db.collection("users").doc(userId).get());

  const userDocs = await Promise.all(userPromises);

  userDocs.forEach((doc) => {
    if (doc.exists) {
      const userData = doc.data();
      if (userData.fcmTokens && userData.fcmTokens.length > 0) {
        tokens.push(...userData.fcmTokens);
      }
    }
  });
  return tokens;
}

/**
 * Sends a push notification to a given array of FCM tokens.
 * @param {string[]} tokens The FCM tokens to send the notification to.
 * @param {object} event The event data.
 */
async function sendPushNotification(tokens, event) {
  const payload = {
    notification: {
      title: `Reminder: ${event.title}`,
      body: `Your game is starting in 30 minutes at ${event.location}!`,
      click_action: `/events/${event.id}`, // Deep link to the event page
    },
  };

  try {
    console.log(`Sending notification to ${tokens.length} tokens.`);
    await admin.messaging().sendToDevice(tokens, payload);
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}
