const { onCall } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const functions = require("firebase-functions");

// Initialize the Gemini client with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateEventCopy = onCall(async (request) => {
  // 1. Authentication Check: Ensure the user is logged in.
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to use this feature."
    );
  }

  // 2. Data Validation: Ensure all required data is present.
  const { sport, locationName, timeOfDay } = request.data;
  if (!sport || !locationName || !timeOfDay) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields: sport, locationName, or timeOfDay."
    );
  }

  // 3. Construct the Prompt for Gemini
  const prompt = `You are an assistant for a sports app called Huddle. Generate 3 catchy and exciting options for a pickup game title and a short, friendly description. The game is for ${sport} and is happening at ${locationName} in the ${timeOfDay}. For cricket, use terms like 'sixes' or 'wickets'. For basketball, use terms like 'hoops' or 'showdown'. The tone should be fun and welcoming. Return the response as a valid JSON array of objects, where each object has a 'title' and a 'description' key. Do not include any markdown formatting.`;

  try {
    // 4. Call the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();
    
    // Clean the response to ensure it's valid JSON
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // 5. Parse and Return the JSON Response
    const suggestions = JSON.parse(text);
    return { suggestions };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while generating suggestions."
    );
  }
});
