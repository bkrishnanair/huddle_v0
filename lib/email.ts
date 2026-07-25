// lib/email.ts
// Server-only module — wraps Resend SDK for transactional email.
import 'server-only';

import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Huddle <onboarding@resend.dev>';

let resend: Resend | null = null;

if (apiKey) {
  resend = new Resend(apiKey);
} else {
  console.warn('⚠️ RESEND_API_KEY is not set — email sending disabled. In-app notifications will still be created.');
}

/**
 * Send a pre-event reminder email to an attendee.
 * Degrades gracefully: if RESEND_API_KEY is missing, logs and returns silently.
 */
export async function sendReminderEmail({
  to,
  eventName,
  eventDate,
  eventTime,
  eventUrl,
}: {
  to: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventUrl: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn(`Email skipped for ${to} — Resend client not initialized.`);
    return { success: false, error: 'RESEND_NOT_CONFIGURED' };
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Reminder: ${eventName} is tomorrow!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1a1a2e; margin-bottom: 8px;">🎯 Don't forget — you're going!</h2>
          <p style="color: #4a4a68; font-size: 16px; line-height: 1.5;">
            <strong>${eventName}</strong> is happening soon.
          </p>
          <table style="margin: 16px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 12px 4px 0; color: #6b7280; font-size: 14px;">📅 Date</td>
              <td style="padding: 4px 0; color: #1a1a2e; font-size: 14px; font-weight: 500;">${eventDate}</td>
            </tr>
            <tr>
              <td style="padding: 4px 12px 4px 0; color: #6b7280; font-size: 14px;">🕐 Time</td>
              <td style="padding: 4px 0; color: #1a1a2e; font-size: 14px; font-weight: 500;">${eventTime}</td>
            </tr>
          </table>
          <a href="${eventUrl}" style="display: inline-block; background: #6366f1; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 8px;">
            View Event Details
          </a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            You're receiving this because you RSVP'd on Huddle. Manage your notification preferences in your profile settings.
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to send reminder email to ${to}:`, message);
    return { success: false, error: message };
  }
}
