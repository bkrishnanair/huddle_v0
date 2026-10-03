# Huddle Android — Trusted Web Activity

This is the Android packaging configuration for the existing Huddle website, not a second frontend or backend. The app opens `https://www.huddlemap.live/map?source=android-twa` through the user's compatible browser. Normal web deployments update its content. Accounts, Firebase, event links and APIs remain shared.

## Status

Groundwork only: configuration, pinned Bubblewrap tooling, domain-association route and unrun tests are implemented. No Android project has been generated, SDK installed, keystore created, binary built, app registered or deployment performed. The package ID and real signing certificates are intentionally not guessed.

The existing web manifest identity is unchanged, so this does not replace or invalidate existing PWA installations. The source parameter is launch attribution only, never an authentication signal. A PWA installation and a Play installation can coexist; test this with pilot users.

## Tracked versus local files

- `android/twa/config.json`: reviewable source of truth for Android settings and versions.
- `scripts/android-twa.mjs`: pinned `@bubblewrap/cli@1.25.0` invocation; no global installation or new web runtime dependency.
- `android/twa/generated/`: ignored generated Gradle/Android source and APK/AAB output. Do not hand-edit it: regeneration can overwrite it.
- `android/twa/signing/`: ignored private upload keystore. Back it up securely outside this repo.
- `app/.well-known/assetlinks.json/route.ts`: public association using deployment environment variables.

There is no second Git repository to push. Android generation/build happens locally when explicitly requested, not during `npm run build` or Vercel deployment. The generator is pinned, but its downloaded SDK/transitive dependencies are not claimed hermetic; retain release artifacts and toolchain information for each published version.

## 1. Confirm your permanent app identity

TODO — registration owner: check Play Console and Firebase for any existing Android app before choosing a package ID. A Firebase Android registration is not itself a Play listing. Reuse the intended identity, not a guessed value from an old conversation. Changing an ID after publication creates a different app.

Set `ANDROID_PACKAGE_ID` in `.env.local` to the confirmed ID. A reverse-domain format such as `live.huddlemap.app` is an example only, not a registered identity. The script refuses to generate without this setting. Set the same value on Vercel before activating domain association. Do not set `ANDROID_SHA256_CERT_FINGERPRINTS` until you have the actual certificates.

## 2. Generate the Android project

From the repository root, with Node 20+ and npm available:

```sh
npm run android:generate
```

This downloads/runs the pinned Bubblewrap CLI through npm, writes a local `twa-manifest.json`, then runs Bubblewrap's `update --skipVersionUpgrade` in the isolated generated directory. The CLI may prompt to install Java/Android tools; review downloads and SDK licenses yourself. No key or Play identity is automatically created by this wrapper.

Settings use Huddle's current 512px and maskable icons, dark colors, portrait orientation, standalone browser display, Custom Tabs fallback and no advertising/billing/location-delegation extras. Notification delegation is enabled, but that does NOT configure or prove web push delivery. Verify FCM/VAPID and physical-device delivery separately.

The live apex domain currently redirects to `www`. The TWA targets `www` directly. Do not add Google's OAuth domains to `additionalTrustedOrigins`; third-party sign-in must retain the browser's normal security UI.

## 3. Create or reuse the upload key

TODO — signing owner: if an upload key already exists, use it rather than replacing it. Securely place it at `android/twa/signing/huddle-upload.keystore` and adjust the alias in `config.json` if necessary, then regenerate. Keep passwords in a password manager.

Only for a NEW app without an existing key, after generation has created the signing directory, run:

```sh
keytool -genkeypair -v -keystore android/twa/signing/huddle-upload.keystore -alias huddle-upload -keyalg RSA -keysize 2048 -validity 10000
```

Enter passwords interactively; do not put them in shell command arguments, source control or Vercel. Use the JDK installed/configured for Bubblewrap if `keytool` is not on your PATH. Back up the key and recovery details. Losing signing credentials affects future releases.

## 4. Build, then upload manually to Play internal testing

```sh
npm run android:build
```

The script requires a successful generation matching the current configuration and an existing keystore. Bubblewrap requests signing passwords interactively. It produces `android/twa/generated/app-release-bundle.aab` for Play and `app-release-signed.apk` for local testing. Nothing is automatically uploaded or published.

Review the generated target SDK against the current Play Console requirement before uploading; a pinned generator does not guarantee future policy compliance. Complete the store's app access, privacy, Data safety, content rating and testing requirements. This tooling does not provide account deletion, moderation compliance or store approval.

## 5. Connect the website to the Play-signed app

TODO — Play/Vercel owner:

1. Enable/configure Play App Signing for the chosen app.
2. Copy SHA-256 from **App integrity → App signing certificate**, not just the upload certificate.
3. Set `ANDROID_SHA256_CERT_FINGERPRINTS` on Vercel and locally. Format: 32 colon-separated hexadecimal bytes; separate multiple certificates with commas for signing-key rotation.
4. Deploy the website with this route and both `ANDROID_*` variables.
5. Run:

```sh
npm run android:verify-links
```

The checker requires HTTP 200, JSON, no redirect, and the matching package/certificate at `https://www.huddlemap.live/.well-known/assetlinks.json`. Empty configuration intentionally returns `[]`; malformed configuration returns 503 with no trusted app. Never upload a private key to this endpoint: certificate fingerprints are public metadata.

For a locally sideloaded APK, the local signing certificate may differ from Play's. Use a dedicated staging setup or intentionally add that certificate if you need production domain verification for local builds; remove unnecessary trust before release. Internal App Sharing may also use another certificate. The decisive release test is an actual **Play internal-track installation**.

The apex `https://huddlemap.live` currently redirects. Verified app links to that host require its own nonredirecting Asset Links response plus matching Android intent filters. This implementation does not claim apex link verification. Use `www` event links for the initial pilot; existing apex links still work on the web. Do not disrupt the site's canonical redirect just to hide this distinction.

## 6. Physical-device release checklist

- Install through Play internal testing, not only a sideloaded APK; confirm verified launch without an unwanted address bar.
- Test map/details, Google sign-in redirect and return, session persistence, RSVP and waitlist, sharing, calendar export, photo upload, keyboard and Android Back.
- Open a `www` event deep link from another app with Huddle both closed and open; inspect the generated intent filters if routing differs. Test apex links separately as described above.
- Deny location/notifications. Manual campus discovery must remain useful. Verify web push foreground/background behavior on the installed app before advertising it.
- Test offline startup/reconnect and slow mobile data; never show a successful RSVP until the server confirms it.
- Test an existing PWA installation alongside the Play app. Check browser/provider fallback and service-worker update prompts after a web deploy.
- Verify Maps referrer restrictions and Firebase authorized domains; TWA uses the web origin, not a new native Firebase login implementation.
- Verify public privacy/support/deletion links and required reporting/blocking flows before submission.

Repository verification (not executed during this implementation):

```sh
npx vitest run __tests__/android-twa.test.ts __tests__/pwa-manifest.test.ts
npx tsc --noEmit
npm run lint
npm run build
npm run preflight
npx vitest run
```

## Future updates: one repository, two release types

| Change | Release action |
| --- | --- |
| Event data | Normal backend/data updates; no Android build |
| React screens, CSS, API fixes | Normal tested Vercel deployment; installed TWA loads the live website, subject to browser/service-worker lifecycle |
| Android icon/name, launch URL, permissions/delegation, SDK/library changes | Edit tracked config/tooling, increment `appVersionCode` and `appVersion`, regenerate, build, test and upload a new AAB |
| Play signing certificate rotation | Publish all required old/new public fingerprints and follow Play's rotation instructions; test affected Android versions |

Ordinary website pushes do not require two repositories or two store submissions. They DO reach Android users too: continue staging and regression testing web deployments. Web-delivered changes must still comply with Play policies. Do not add payments or sensitive permissions without reviewing their implications.

Keep the generator configuration authoritative. If future work needs hand-written Android activities or native plugins, deliberately migrate to tracking the Android project instead of placing custom source in this disposable directory.

References: [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap/tree/main/packages/cli), [Google TWA quick start](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start).
