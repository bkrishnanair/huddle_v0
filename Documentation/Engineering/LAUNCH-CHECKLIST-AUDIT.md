# Launch checklist: code evidence and remaining checks

This is a code-level checklist, not a claim that production configuration,
mailbox delivery, legal compliance, or every physical device has been verified.
Changes are on `codex/launch-checklist`, alongside the preserved, uncommitted
student-feedback work. No deployment, dependency installation, rules change,
or event-model change was performed in this pass.

| Checklist item | Finding / action | Evidence |
| --- | --- | --- |
| Custom 404 | Replaced dead-end boilerplate with an H1, map/directory recovery, and a feedback link. | `app/not-found.tsx` |
| Page titles | Added distinct route titles for Discover, Home, events, profiles, admin, dashboard, login, signup, offline. Removed duplicated site suffixes from contact/legal pages. | Route `layout.tsx` files; root title template |
| Page descriptions | Added route-specific descriptions; account and utility routes now use noindex. Existing directory/event metadata remains intact. | Same route layouts; `app/event/[id]/page.tsx` |
| Above-fold CTA | Existing landing hero links directly to the map. | `components/landing-page.tsx` |
| Favicon | Existing SVG, generated icon, Apple icon, and PWA icons. | `app/icon.svg`, `app/icon.tsx`, `app/apple-icon.tsx`, `public/icons/` |
| robots.txt | Existing generated robots route references sitemap. Robots exclusions are not authorisation. | `app/robots.ts` |
| sitemap.xml | Existing public-event and category sitemap; private/ended events excluded. | `app/sitemap.ts`, `lib/seo/events.ts`, SEO tests |
| Open Graph image | Recolored the old paper/blue card to dark/orange/teal; replaced unconditional LIVE badge with location text. | `app/opengraph-image.tsx` |
| Image alt text | Shared avatar image defaults to decorative `alt=""` where nearby text identifies the person; callers can override. Gallery images have numbered labels. Organizer thumbnails are decorative beside their names. | `components/ui/avatar.tsx`, gallery, Discover |
| Mobile breakpoints | Existing responsive layouts and safe-area handling preserved. Not a new device certification. | Dialog primitives, map, bottom navigation |
| Sticky mobile CTA | Existing event drawer keeps RSVP action fixed; mobile map has fixed create/location controls. No global sticky button was added to obscure content. | `components/event-details-drawer.tsx`, map |
| Loading states | Existing auth skeleton, event-card skeletons, map loading, and form sending states. | App layout, event card, map, feedback |
| Form errors | Existing validation/error states, including feedback draft preservation and rate-limit handling. | Feedback route/form/tests; auth/RSVP flows |
| Thank-you page | Feedback renders an accessible success panel after provider acceptance. A separate URL is unnecessary and must not imply a submission succeeded just because someone visited it. | `components/feedback-form.tsx` |
| Privacy policy | Existing page, including feedback disclosure. Its broader factual/legal accuracy still needs owner review. | `app/privacy/page.tsx` |
| Terms | Existing terms page. Existence does not establish legal adequacy. | `app/terms/page.tsx` |
| Cookie banner | Not added solely to tick a box. Inventory services and determine applicable consent requirements; see below. | Firebase session cookie; Maps; Sentry; Vercel analytics |
| Analytics | Existing Vercel Analytics/Speed Insights retained. Added URL query/hash/credential stripping and record-ID redaction to both clients. Funnel events unchanged. | `components/site-analytics.tsx`, `lib/analytics-privacy.ts` |
| Real contact address | Support/clubs email addresses and company/location text exist; functioning inbound mailboxes and address suitability are not proven by code. | `app/contact/page.tsx` |
| Compressed images | Partial only. Gallery/search images now use lazy loading, async decoding, and dimensions. This is NOT compression. Uploaded originals can still be up to 10 MB. | Gallery upload code; `next.config.mjs` retains `images.unoptimized: true` |

## Privacy and image follow-up

Vercel documents aggregate analytics without third-party cookies and supports
URL redaction via `beforeSend`; this pass implements that redaction. See
[Vercel privacy documentation](https://vercel.com/docs/analytics/privacy-policy).
This does not prove that Maps, Firebase, Sentry, or other providers require no
consent. A banner that does not control collection is not a consent system.
Applicable consent requirements depend on actual processing and launch regions;
review the complete provider inventory before declaring compliance. The
[ICO guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/)
illustrates why necessary functionality and optional tracking must be assessed
separately. No legal-compliance certification is implied.

The Vercel URL filter is not a global scrubber for Sentry errors, request logs,
custom-event payloads, or provider referrers. Review those pipelines separately.

For gallery compression, add bounded thumbnail generation with storage/rules
tests and verify orientation, transparency, and existing download URLs. Do not
blindly enable Next's image proxy for token-bearing user uploads or arbitrary
remote hosts. Lazy loading reduces eager work but does not reduce original bytes.

## Verification

- Baseline: 159 tests, TypeScript, ESLint passed.
- Updated: 167 tests across 21 files, TypeScript, ESLint, preflight, production
  build, and whitespace checks passed.
- Eight new regression cases cover metadata, noindex, 404 recovery, and URL
  privacy filtering, including login return paths and sensitive map queries.
- Production-preview HTTP reads confirmed route titles/descriptions, utility
  noindex tags, a 404 response with noindex, and a 1200×630 PNG share image.
  Browser checks verified the 404 at 320×568, its feedback recovery link, and the
  generated share image. The 404 inherits the root brand metadata; its specific
  error message is the page H1 rather than a competing second title tag.
- No user accounts, real feedback messages, RSVPs, or production rules were
  created/modified as part of this audit.

Keep the production/device, dependency, and map-startup caveats in
`MONDAY-LAUNCH-HANDOFF.md`; this checklist does not supersede them.
