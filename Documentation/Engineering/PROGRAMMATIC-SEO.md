# Programmatic SEO

Implemented from `3185387` on `codex/programmatic-seo`. No Firestore data-model,
rule, index, or map-engine changes are required.

## Crawl path

- `/` includes a server-rendered footer link to `/directory`.
- `/directory` is statically generated and links to eight category pages using
  standard anchors. The category names/slugs live in `lib/seo/categories.ts`.
- `/directory/[category]` renders semantic event lists, headings, dates, organizer
  names, and links to canonical `/event/[id]` pages. Unknown categories return 404.
- `/event/[id]` renders public event details and script-safe Event JSON-LD, with a
  link to the existing map flow. Private, ended, invalid, and non-active events
  return 404, including metadata generation. Missing Firebase configuration is
  an availability error, not a false event-not-found result.
- `/sitemap.xml` includes the directory routes and the same filtered event set.
  If Firestore fails, static directory URLs remain available. No fabricated
  `lastModified` dates are emitted.

## Privacy and freshness

`lib/seo/events.ts` is server-only. It checks privacy/status before projecting a
small explicit SEO shape. It never passes rosters, attendee IDs, consented email,
scheduled messages, or virtual meeting credentials to page markup.

Only the content-independent directory index is static. Event-bearing pages use
Node server rendering with `force-dynamic`, not ISR or a persistent data cache.
React `cache()` shares metadata/page reads within a request only. This is
intentional: caching public event text would retain it after an organizer marks
the event private. Previously indexed search results still require a Google
recrawl; use Search Console removals for urgent removal of old search copies.

Discovery reads the existing single-field date index: starts within the previous
seven days through the next 90 days, ordered by date, capped at 1,001 documents.
The first 1,000 are filtered; a truncation notice is shown when the cap is reached.
Already-ended events are removed using the existing timezone-aware engine. This
bounded rolling window is not an archive or a complete catalogue of long-running
events that began more than seven days ago. Before inventory exceeds this cap,
add paginated discovery and sitemap shards; do not silently raise the read budget.

Empty category pages provide a useful empty state and `noindex, follow` until
inventory appears. They remain in the sitemap as discovery URLs, so Search
Console may report them as excluded by `noindex`; this is intentional.

## Structured data accuracy

- Start/end timestamps use `lib/datetime.ts` and include UTC timezone information.
- Unknown end times, prices, performer details, and event images are not invented.
- Valid coordinates and stored organizer/location text are preserved.
- A structured address is emitted only when the existing venue object actually
  contains `address` or `formatted_address`. A room number is not inferred to be
  a street address. Many current records contain only venue names; these may
  still lack Google's required detailed-address data.
- Virtual events use a Schema.org `VirtualLocation` pointing to the public event
  landing page, never the meeting credentials. Google does not support
  virtual-only events in its event rich-result experience.
- JSON-LD escapes script terminators. Descriptions are rendered as text, not HTML.

Valid Schema.org markup does not guarantee Google eligibility or rankings.
Membership-only events may also be ineligible even if the organizer has made
their listing public. Consult Google's
[Event guidelines](https://developers.google.com/search/docs/appearance/structured-data/event).

## Verification completed

- `npm test`: 129 passed across 16 files (21 new SEO tests).
- `npx tsc --noEmit`, `npm run lint`, `npm run preflight`, environment-template
  check, `npm run build`, and `git diff --check`: passed.
- Production prerender manifest confirms `/directory` is static; category pages
  are not persistently cached.
- Googlebot-style HTTP reads of the production build: homepage footer anchor,
  directory/category HTML, canonical event metadata, parseable Event JSON-LD,
  timezone suffixes, coordinates, sitemap category URLs, and 404s verified.
- The community category returned 21 event anchors and 21 semantic time elements
  during the smoke test. No JavaScript or geolocation was needed to read them.
- Privacy transitions, malformed flags, inactive/ended records, JSON-LD escaping,
  missing Firebase, and timezone/overnight cases have automated coverage.

## After deployment

1. Verify the production canonical domain is `https://huddlemap.live` and redirects
   from alternate hostnames resolve to it. Preview deployments should remain
   protected or noindexed by the hosting provider.
2. Submit `https://huddlemap.live/sitemap.xml` in Google Search Console and inspect
   `/directory`, a populated category, and a public event using URL Inspection.
3. Run Google's Rich Results Test on a physical event with a detailed stored
   address. Resolve real data gaps; do not invent address, price, or availability.
4. Monitor indexing, event enhancements, crawl failures, and the discovery cap.
   Search Console verification/submission and deployment were not performed here.
