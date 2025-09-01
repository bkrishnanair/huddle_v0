// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Export the AI feature
exports.generateEventCopy = require('./generateEventCopy').generateEventCopy;

// Export the scheduled function for sending event reminders
exports.sendEventReminders = require('./send-reminders').sendEventReminders;
