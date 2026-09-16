# Map and admin launch settings

## Map label cleanup (Google Cloud setting)

The live map uses `NEXT_PUBLIC_GOOGLE_MAPS_STYLE_MAP_ID` and Advanced Markers.
Do not remove the Map ID or add a legacy `styles` prop to hide businesses:
Map-ID-based maps use cloud styling instead.

1. In Google Cloud Console → Google Maps Platform → Map Styles, open the style associated with the configured Map ID. Preserve/export the current style before editing.
2. For each light/dark style variant used by the app, hide **Point of interest → Food and drink** and **Point of interest → Retail** labels (text and icons), at all zoom levels. Check for child/zoom overrides that make them visible again.
3. Preserve school/university/library/landmark labels, building geometry, street names and paths. Do not hide the whole Point of interest parent: that would also remove useful campus labels.
4. Preview around Stamp at zoom levels 14–20, then publish and associate with the existing JavaScript Map ID. Google controls which building names are available and displayed; style rules cannot guarantee every campus building has a label.

Cloud JSON rule fragments to merge into the current style's `styles` array, not replace the complete style:

```json
[
  { "id": "pointOfInterest.foodAndDrink", "label": { "visible": false } },
  { "id": "pointOfInterest.retail", "label": { "visible": false } }
]
```

Reference: https://developers.google.com/maps/documentation/javascript/cloud-customization/json-reference

The code change `clickableIcons={false}` only disables Google's built-in place popups. It does not hide labels and does not disable Huddle event markers.

## Single-owner admin access

`lib/admin-auth.ts` compares the verified Firebase UID against the server-only `ADMIN_UID` environment variable. Missing configuration denies everyone. Metrics, agent logs, manual agent runs and TerpLink imports already use this gate.

1. Firebase Console → Authentication → Users → open the owner's exact signed-in account → copy **User UID** (not email).
2. Vercel → project → Settings → Environment Variables → set `ADMIN_UID` to that UID for Production. Set Preview separately only if required. Never prefix it with `NEXT_PUBLIC_`.
3. Redeploy, sign in with that account, and open `/admin`.
4. Verify signed-out requests and a separate non-owner account cannot read metrics/logs or execute imports/agent runs. Do not run destructive or notification-producing actions as a test.

Do not add a client-writable Firestore `isAdmin` flag. The current `/admin` layout does not server-gate the page shell; APIs are the security boundary. A server layout gate can be added separately using the same UID helper after ensuring the owner's session cookie is established.

## Signup decision

Current code supports both Google and email/password. Email signup attempts a Firebase verification email, but login/session creation does not enforce verification. Signup immediately navigates away, so the verification banner is not a reliable verification flow.

Recommendation for the campus pilot: keep discovery open and Google sign-in prominent; do not introduce a university-domain restriction overnight. If adding verified campus status later, validate ownership first and match `umd.edu` or an actual subdomain such as `terpmail.umd.edu`, not an arbitrary string suffix.

No auth provider, email-domain restriction, verification policy, admin configuration or cloud map style was changed in this task. Local dot changes are uncommitted and have not been tested/built, following the user's prior instruction to delegate verification.
