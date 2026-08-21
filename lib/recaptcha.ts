// lib/recaptcha.ts
import 'server-only';
import axios from 'axios';

const SITEVERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

/**
 * Verifies a reCAPTCHA token with Google.
 *
 * The secret goes in the POST body, never the query string: URLs are captured
 * by proxy logs, server access logs and error reporting, so a secret in the
 * query string leaks everywhere the request is observed. Google's siteverify
 * accepts both `secret` and `response` as form-encoded body parameters.
 *
 * TODO(deferred): nothing calls this yet and RECAPTCHA_SECRET_KEY is unset, so
 * this path is untested against the live endpoint. Wire it into the signup or
 * RSVP flow, or delete the module.
 */
export async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not set");
    return { success: false, message: "Server configuration error." };
  }

  try {
    const body = new URLSearchParams();
    body.append('secret', secretKey);
    body.append('response', token);

    const response = await axios.post(SITEVERIFY_URL, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  } catch (error) {
    console.error("reCAPTCHA verification request failed:", error);
    return { success: false, message: "Could not verify reCAPTCHA." };
  }
}
