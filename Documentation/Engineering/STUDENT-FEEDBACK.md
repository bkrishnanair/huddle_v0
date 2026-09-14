# Student feedback

Public form: `/feedback`. Entry points: the map/home header (speech-bubble icon
on mobile), landing footer, and Contact page. No sign-in is required.

Students choose a problem, improvement, idea, or other feedback; enter 10–3,000
characters; and optionally provide an email for a reply. Nothing is posted to
public Firestore collections, and account/location data is not attached.

## Email configuration

Uses existing `RESEND_API_KEY` and `RESEND_FROM_EMAIL`. The recipient defaults to
the existing support address, `support@huddlemap.live`. Set server-only
`FEEDBACK_TO_EMAIL` in the deployment environment to use another team inbox.
The student's optional address is `replyTo`, never the sender or recipient.

Plain-text messages avoid rendering user-supplied HTML. Resend errors, missing
configuration, and rate-limit failures return an error rather than false success.
Stable idempotency keys protect retries; Resend retains these keys for 24 hours.
See [Resend idempotency documentation](https://resend.com/docs/dashboard/emails/idempotency-keys).

## Abuse controls and limits

- Strict Zod payload allowlist; 16 KiB streamed body limit; JSON-only browser POSTs.
- Cross-origin browser requests rejected; hidden honeypot drops obvious bots.
- Existing Firestore rate limiter: 30 submissions/hour per hashed network and
  200/hour globally. The network cap is shared by campus NAT users. No raw IP,
  feedback text, or reply email is logged by the route.
- Controls reduce spam but are not bot-proof. If targeted, add provider-level
  WAF/CAPTCHA controls; do not assume an Origin header authenticates a caller.
- Browser prevents double-click submissions, times out after 25 seconds, preserves
  the draft on errors, and provides a mailto fallback. Drafts are not persisted
  to browser storage; navigating away clears them.

## Release check

Unit tests cover payload limits, rate limits, honeypot, provider rejection,
recipient/reply-to separation, retries, and missing configuration. No test email
was sent to a real inbox during implementation. After deployment, send one
clearly labeled test through `/feedback`, confirm delivery to the intended inbox,
and verify Reply uses the optional address. Provider acceptance alone is not
proof of inbox delivery. The support mailbox must actually receive mail; Resend
outbound configuration alone does not create that mailbox.
