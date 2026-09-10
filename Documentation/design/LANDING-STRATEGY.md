# Landing strategy — rev 1

Audit of `/` against the fourteen-block landing page framework, plus a phased
plan. Every claim below was verified against `main` at build time on
2026-08-23, not inferred. Commands to reproduce are inline.

Descriptive document. Per CLAUDE.md, this ranks below CLAUDE.md itself and
below `Documentation/design/TOKENS.md` and `SURFACES.md`. It proposes work; it
does not define contracts.

---

## 1. The finding that dominates the rest

The prerendered homepage ships a loading skeleton. Body text, scripts
stripped, is **14 characters**: `Loading Huddle`.

```
$ npx next build                       # / builds as ○ Static
$ python3 -c '...'                     # strip <script>, print body text

BODY TEXT (scripts stripped): 'Loading Huddle'
CHARS:      14
H1 COUNT:   0
H2 COUNT:   0
H3 COUNT:   0
LD+JSON:    0
canonical:  0
og:image:   0     <- twitter:card declares summary_large_image
```

Cause: `app/page.tsx` is `"use client"` and gates the whole page behind
`useAuth()`. `FirebaseProvider` initialises `loading` to `true` and only
clears it inside `useEffect` → `onAuthStateChanged`, which never runs during
prerender. So the server always takes the `if (loading)` branch and emits the
skeleton.

Consequence: no crawler, LLM fetcher, or link-preview bot that does not
execute JavaScript sees the H1, the value proposition, how-it-works, or the
organizer section. The framework is a content architecture; it assumes the
content reaches the reader. Blocks 1–14 are all downstream of block 6.

Reproduce:

```bash
npx next build
python3 - <<'PY'
import re
h = open('.next/server/app/index.html').read()
body = h[h.find('<body'):]
body = re.sub(r'<script.*?</script>', '', body, flags=re.S)
print(repr(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', body)).strip()))
PY
```

---

## 2. The fourteen blocks, scored

Source: `components/landing-page.tsx` (348 lines), the built route manifest
(71 routes), and `.next/server/app/index.html`.

| # | Block | Verdict | What is actually there |
|---|---|---|---|
| 01 | The H1 | Rewrite | "See what's happening around campus. Right now." Good brand line, but a statement rather than the question a student types. Also never reaches the HTML. |
| 02 | The byline | Missing | No named author. Footer reads "Huddle Map, LLC · College Park, MD" and nothing more. |
| 03 | The subheadline | Rewrite | "Live events near you with no app, no account, no missing out." Names the mechanism, not the outcome. |
| 04 | Question sub-headings | Missing | Headings are labels: "How it works", "Run events people actually show up to". None is a question. |
| 05 | The answer block | Missing | No 40–60 word plain-language answer above the fold. Longest above-fold sentence is 11 words. |
| 06 | The build | **Broken** | See section 1. Zero H1/H2/H3 in the HTML. The hero SVG does carry a good `aria-label` — crawlable, if the page rendered. |
| 07 | The problem block | Missing | The page opens on the solution and never names the problem. |
| 08 | The FAQ block | Missing | No FAQ section, no `FAQPage` schema. Highest yield per hour on this list. |
| 09 | The solution block | Close | The 01/02/03 "How it works" is good and correctly sequenced. Needs a question heading and to survive to the HTML. |
| 10 | Schema in the head | Missing | Zero JSON-LD on `/`. `Event` schema already works in `app/event/[id]/page.tsx` — pattern proven, never applied here. |
| 11 | The proof block | Unsafe | Hardcoded `565` events and a hardcoded "2 live now · College Park" chip. Both rot; the chip asserts a live state read from nothing. |
| 12 | The comparison table | Missing | No comparison. Real alternatives are TerpLink, Instagram stories, GroupMe, flyers. |
| 13 | The pricing CTA | **Working** | "Open the map" plus "Free · no signup · works in your browser". Strongest block on the page. Do not touch the copy. |
| 14 | Last-updated stamp | Missing | No visible date, no `dateModified`. |

**8 missing or broken · 4 to rewrite · 2 working.**

---

## 3. Where the framework does not transfer

It is built for a B2B lead-gen page with a buyer, a price and a sales call.
Huddle is a free consumer utility with neither buyer nor price. Applying all
fourteen literally would make the page worse.

- **Block 12 — comparison table.** Keep it, change the axis. A feature-and-pricing
  matrix versus competitors is meaningless. Compare *ways of finding out what is
  on tonight*: Huddle, TerpLink, Instagram stories, GroupMe, flyers. Rows are
  jobs, not features.
- **Block 13 — pricing CTA.** Already solved. There is no plan to sell and no demo
  to book. Do not add pricing.
- **Block 11 — case studies.** Needs data Huddle does not publish yet. Shipping
  invented numbers is worse than shipping none.

### One claim to verify before it becomes proof

The organizer section states: "Every event's show rate is computed from real
check-ins, not RSVPs."

The repo has two check-in routes — `app/api/events/[id]/checkin/route.ts` and
`app/api/events/[id]/check-in/route.ts` — plus
`app/api/events/[id]/attendance/route.ts`, which computes show rate from an
**organizer-reported** count:

```
showRate = Math.min(100, Math.round((reported / rsvps) * 100))
```

Self-check-in does exist (`action: "self_check_in"`), so the claim is
defensible, but the two paths disagree about the source of truth. Settle it
before the number goes on a marketing page.

---

## 4. The landing page is not where search traffic lands

`app/sitemap.ts` submits the homepage plus every future event, capped at 1,000
— roughly **565 indexed event pages against 1 landing page**. A student
searching "what's happening at UMD tonight" is far likelier to hit
`/event/abc123` than `/`.

Those pages already carry `Event` JSON-LD and server-rendered copy. They are
the one part of the funnel shaped the way the framework wants. But they render
in the old dark theme (`bg-slate-950`, `glass-surface`, gradients), so a
visitor arriving from Google sees a different product from the homepage.

Templating the event page pays back ~565× what the same work pays on the
homepage, and the inconsistency between the two is a conversion leak, not only
an aesthetic one.

### Also broken — trust signals

- Footer links `/privacy`, `/terms`, `/contact` all **404**. None appears among
  the 71 built routes.
- No `robots.txt` and no `app/robots.ts`: no crawl directives, no sitemap
  pointer, no AI-crawler policy.
- No `og:image`, yet `twitter:card` declares `summary_large_image`. Every share
  into a group chat renders a blank card.
- No `rel="canonical"` on any route.
- `app/sitemap.ts` returns `[]` silently when the Admin SDK is unavailable, with
  no alert.

### Also broken — conversion path

- The sign-in modal in `app/page.tsx:82` is
  `glass-surface border-white/15 bg-slate-900/80` — dark glassmorphism, both
  banned by CLAUDE.md, and it is the step immediately after the CTA. Paper page,
  navy modal.
- `landing_view` is the only funnel event on the page. No CTA click event
  exists, so landing → map conversion cannot be measured today.

---

## 5. The plan

Effort in rough half-day units. Phase 0 is not optional and not
parallelisable; everything downstream is wasted until it lands.

### Phase 0 — make the page exist (~1.5d, blocks everything)

| Task | Cost |
|---|---|
| Split the auth gate off the landing route. Make `app/page.tsx` a server component rendering `<LandingPage />` statically; move the `useAuth()` branch into a small client island that only swaps the nav's sign-in state. Skeleton and error card stay, behind the content rather than in front of it. | 0.5d |
| Add a render assertion to vitest: build, then assert the prerendered HTML contains the H1 string and at least one `<h2>`. This regression is silent and will recur. | 0.25d |
| Ship `/privacy`, `/terms`, `/contact` as real pages, plus `app/robots.ts` pointing at the sitemap and stating the AI-crawler policy. | 0.5d |
| Add `opengraph-image.tsx` generated from Instrument tokens at the edge, and a canonical URL. | 0.25d |

### Phase 1 — make it answerable (~2d, blocks 1, 3, 4, 5, 8, 10, 14)

| Task | Cost |
|---|---|
| Rewrite the H1 to the query and add the answer block (specimen in section 6). | 0.5d |
| Convert every section heading to a question. "How it works" → "How do I find events near me?". "Run events people actually show up to" → "How do I get people to show up to my event?". | 0.25d |
| Add the FAQ block with `FAQPage` schema — six real questions as `<h3>` with prose answers. | 0.5d |
| Add `Organization` + `WebSite` schema reusing the `app/event/[id]/page.tsx` pattern, and a visible "Updated <date>" in the footer with a matching `dateModified`. | 0.25d |
| Add the problem block above "how it works" — name the problem in the student's words before offering the solution. | 0.5d |

### Phase 2 — make it credible (~2.5d, blocks 2, 11, 12)

| Task | Cost |
|---|---|
| Replace both hardcoded numbers with live counts. The live chip must follow CLAUDE.md: if nothing is live, show "next up today"; never render a zero, never fake a live state. | 0.5d |
| Add the byline — named founder, photo, UMD affiliation, link to a real profile. | 0.25d |
| Build the comparison table on the jobs axis, as a plain `<table>` so it can be quoted. | 0.5d |
| Settle the show-rate source of truth (section 3), then publish a named org's real rate as the proof block. | 1d |
| Migrate `/event/[id]` to Instrument. Highest-traffic organic surface should not be the last dark one. | separate task |

---

## 6. Hero copy, before and after

**Today**

> # See what's happening around campus. Right now.
> Live events near you with no app, no account, no missing out.

No answer block. Longest above-fold sentence: 11 words. None of it reaches the
HTML.

**Proposed**

> # What's happening at UMD right now? Open the live campus map.
> You will know where to be in the next ten minutes. Free, no account.
>
> Huddle is a live map of events happening at the University of Maryland. Open
> huddlemap.live and every event near you appears as a pin — time, place, and
> how many people are going. Free events from student orgs, pickup games, and
> campus programming. No app to download and no account to browse.

Answer block is 53 words; block 5 targets 40–60. "Right now" stays as the
`action`-coloured kicker.

### The six FAQ questions to ship

Each becomes an `<h3>` with a two-to-three sentence answer, mirrored into
`FAQPage` JSON-LD.

1. **What's happening at UMD tonight?** — Open the map and every event starting
   today appears as a pin, sorted by how close it is to you.
2. **Do I need an account to see events?** — No. Browsing needs no account and no
   download. You only sign in to RSVP or to host.
3. **Is Huddle free?** — Yes, for students and organizers. There is no paid tier.
4. **Where do the events come from?** — Campus events from TerpLink are already on
   the map. Student organizers add the rest directly.
5. **How do I list my club's event?** — Create it on the map in about a minute, or
   claim an existing TerpLink event and keep the RSVPs students have already
   made.
6. **Does it work on my phone without an app?** — Yes. Huddle runs in the browser
   and installs to your home screen if you want it there.

---

## 7. Measurement

Today the page fires one event, `landing_view`. Not enough to judge any of the
above.

Add to `lib/analytics.ts`:

- `landing_cta_click` with a `placement` property (hero, nav, organizer band).
  The core conversion event, and it does not exist.
- `landing_section_view` for the FAQ and comparison blocks.
- `landing_faq_expand` with the question, to learn which questions students
  actually have.

The four numbers that decide this:

1. Landing → map rate. The only one that matters, currently unmeasurable.
2. Share-card render rate — trivially zero until `og:image` ships.
3. Indexed pages in Search Console before and after phase 0. Expect the
   homepage to enter the index for the first time.
4. Share of arrivals landing on `/event/[id]` rather than `/`, which decides
   where phase 2 effort goes.

---

## 8. Open calls

Three decisions that are not mine to make.

- **Does the H1 give up the brand line?** Query-matched H1 wins on discovery;
  "See what's happening around campus" wins on voice. The specimen keeps both,
  but the question has to come first for block 1 to hold.
- **Is the byline a person or the LLC?** Block 2 wants a real person with
  credentials. On a campus product that means naming a student publicly. That is
  a privacy decision, not a design one.
- **Which check-in path is authoritative?** Until that is settled, the show-rate
  claim should stay a feature description rather than a headline number.
