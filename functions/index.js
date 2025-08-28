// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleAuth } = require("google-auth-library");
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(functions.config().gemini.api_key);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * AI FEATURE: HTTP Callable function to generate event copy.
 * This function is secure and can only be called by authenticated users.
 */
exports.generateEventCopy = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check: Ensure the user is logged in.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to use this feature."
    );
  }

  // 2. Data Validation: Ensure all required data is present.
  const { sport, locationName, timeOfDay } = data;
  if (!sport || !locationName || !timeOfDay) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields: sport, locationName, or timeOfDay."
    );
  }

  // 3. Construct a high-quality prompt for the Gemini model.
  const prompt = `You are an assistant for a sports app called Huddle. Generate 3 catchy and exciting options for a pickup game title and a short, friendly description. The game is for ${sport} and is happening at ${locationName} in the ${timeOfDay}. For cricket, use terms like 'sixes' or 'wickets'. For basketball, use terms like 'hoops' or 'showdown'. The tone should be fun and welcoming. Return the response as a valid JSON array of objects, where each object has a 'title' and a 'description' key. Do not include any markdown formatting.`;

  try {
    // 4. Call the Gemini API.
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // 5. Parse the response and return it to the client.
    // The Gemini API may return the JSON string wrapped in markdown, so we clean it.
    const cleanedText = text.replace(/```json\n|```/g, "").trim();
    const suggestions = JSON.parse(cleanedText);
    
    return { suggestions };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while generating suggestions."
    );
  }
});
