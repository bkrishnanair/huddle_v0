# Cross-Device PWA & Web Push Verification Matrix (August 2026)

This verification matrix outlines the expected and validated behavior across core platforms for Huddle's PWA install flow and Firebase Cloud Messaging (FCM) Web Push delivery.

| Device Category | Operating System | Browser / Environment | PWA Install Result | Push Permission Result | Push Notification Receipt | Architectural Notes & Platform Constraints |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Android Mobile** | Android 13+ / 14 | Google Chrome (Latest) | ✅ Native `beforeinstallprompt` banner triggered after meaningful engagement (RSVP / 2nd session). | ✅ Contextual prompt displayed post-RSVP; native browser modal grants permission and registers FCM token in Firestore. | ✅ Foreground & background push received with app badge and sound; notification click opens event URL. | Full Web App Manifest V3 and service worker background sync supported natively. |
| **iOS Mobile** | iOS 16.4+ / 17+ | Apple Safari (Installed PWA) | ✅ "Share → Add to Home Screen" contextual guidance card displayed on non-standalone browser sessions. | ✅ Push permission requested via `PushPermissionPrompt` inside the standalone home-screen app; granted successfully. | ✅ Background push notification delivered to iOS Lock Screen and Notification Center via APNs bridge. | **Critical Apple Constraint:** Web Push is ONLY supported on iOS Safari 16.4+ after user adds the site to Home Screen (`display: standalone`). Standard Safari browser tab cannot receive push. |
| **Desktop** | macOS (Sonoma / Sequoia) | Google Chrome (v120+) | ✅ Install icon in address bar + in-app install prompt card available on qualifying session. | ✅ One-click permission grant; token stored under `users/{uid}.fcmTokens` with atomic array union. | ✅ System banner and notification center delivery in foreground and background; auto-closes and navigates on click. | Service worker handles offline cache-first static assets and bypasses `/api/*` routes. |
| **Desktop** | macOS (Sonoma / Sequoia) | Apple Safari (v17+) | ✅ macOS Sonoma "Add to Dock" / File menu install creates native `.app` container. | ✅ Native prompt triggers after RSVP; WebKit Web Push API handshake registers FCM registration token. | ✅ System Notification Center push delivered via Apple Push Notification service (APNs). | Respects user Focus modes and Notification settings in macOS System Settings. |
| **Desktop** | Windows 11 | Microsoft Edge / Chrome | ✅ Native Chromium install banner triggers seamlessly. | ✅ Granted contextually post-RSVP. | ✅ Windows Action Center notification alert with deep-link action button. | High reliability on Chromium service worker background threads. |

---

## Verification Summary & Key Discoveries
1. **iOS Web Push Gate:** iOS Safari does not fire `beforeinstallprompt` and restricts Web Push strictly to standalone installed PWAs. Our iOS detection and share guidance card ensures users are educated on the 2-tap install before attempting push registration.
2. **Permission Guard:** Denying notification permissions in modern browsers is permanent until manually reset in browser settings. Huddle's 30-day dismissal cooldown and contextual post-RSVP timing prevents premature opt-out.
3. **Dead Token Pruning:** All push dispatches automatically check for `messaging/registration-token-not-registered` and invoke `FieldValue.arrayRemove` to prevent stale token buildup across device upgrades.
