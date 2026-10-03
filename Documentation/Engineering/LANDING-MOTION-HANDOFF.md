# Landing motion — implementation handoff

Branch: `design/landing-motion`, continued from the `feat/android-twa` checkout with all prior uncommitted work preserved. Release preparation began on 2026-10-03; see GitHub PR checks and deployment statuses for the final release outcome.

## Scope

- `components/landing-page.tsx`: editorial hero and copy, scroll-entry transitions, updated organizer story and closing CTA. Existing sign-in callback, map/create-event navigation, install hook/dialog, footer links and funnel event names/placements retained.
- `components/landing/campus-scene.tsx`: inline SVG campus illustration, selectable category examples, animated connecting paths/walkers, and organizer gathering visual. No Maps SDK, media download, event query, animation dependency or fabricated live metrics. Category accents use `getCategoryColor` and readable text uses `getAccentTokens`.
- `components/landing/landing-motion.module.css`: isolated motion choreography and illustration styling. No changes to the actual map, event data, backend, global CSS or Android configuration.

## Motion behavior

- Copy and CTAs render fully without JavaScript; entry animations do not gate visibility.
- Operating-system reduced motion is honored in both CSS and JavaScript and responds to preference changes.
- A visible pause/play control stops illustration motion. Offscreen sections and hidden tabs pause loops via IntersectionObserver and the Page Visibility API; listeners/observers are cleaned up on unmount.
- No requestAnimationFrame loop, auto-changing text, scroll hijacking, autoplay video, WebGL, or new analytics payloads. SVG dashed-path animation does repaint a small path; no frame-rate benchmark was performed.
- Illustrations are explicitly labeled as examples, not real event inventory. Keyboard/touch selection updates an accessible description.

## Verification performed

- Local Next dev server compiled and rendered the landing page.
- Desktop visual inspection and mobile DOM-width inspection at 390 CSS pixels: no document horizontal overflow observed.
- Example selection changed the selected state and description.
- Pause control changed the page's motion state to `off`.
- Sign-in button opened the existing authentication dialog; no login submitted.

Release verification (2026-10-03): lint, TypeScript, all 253 unit tests across 27 files, production build, preflight, and environment-template checks pass locally. Physical-device performance/reduced-motion checks remain outstanding. A local preview is not production readiness. Verify map/create-event/install CTAs plus background-tab behavior on a real device.

## Separate production incident discovered during this work

Read-only investigation of the reported missing events confirmed the public `Huddle Pilot` event (`u93cUIN8CxGqM4aflB0f`) still exists, starts `2026-09-15`, ends `2026-12-31`, but currently has `status: archived`.

- `lib/cron/cleanup.ts` selects by start `date` and archives without checking `endDate`/end time. This is a confirmed code defect consistent with the observed event state; production execution history was not inspected.
- `lib/db.ts:getEvents` only includes start dates from yesterday through the next 90 days, independently dropping older ongoing events from the general feed. The map's geospatial query is a separate path, but its time filter excludes archived events.
- No TerpLink import schedule was found in the repository's cron configuration/dispatcher. The admin button invokes a bounded import of the next 100 listings. External schedules, if any, were not verified.

No cleanup/import was executed, event restored, or production record changed. Recovery needs end-time-aware lifecycle logic, overlap-aware discovery, a scheduled bounded importer, and a reviewed targeted restoration of wrongly archived ongoing events. Do not bulk-unarchive intentionally ended/moderated events. This incident is unrelated to the local-only landing changes and deserves priority before deployment.
