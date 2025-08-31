// lib/recaptcha.ts
import axios from 'axios';

export async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not set");
    return { success: false, message: "Server configuration error." };
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );
    return response.data;
  } catch (error) {
    console.error("reCAPTCHA verification request failed:", error);
    return { success: false, message: "Could not verify reCAPTCHA." };
  }
}
