# Instrument — per-surface build spec

The structural contract for each surface, read off the Claude Design artboards.
Pair this with `TOKENS.md`. The canvas is the visual source of truth; this file
is what you build against and check off.

Artboards render only inside the canvas (they need the `support.js` runtime), so
**diff visually against the live canvas in a browser**, not against a local copy.

---

## Block 4 — Map view → `components/map-view.tsx`

Screen 390×780, ground `surface`, shell `rounded-sheet`.

**Pins** — all three share a 44×44 hit area regardless of dot size.

| State | Dot | Fill | Ring | Extras |
|---|---|---|---|---|
| Live | 26px | `live` | 2px white | RadarPing behind; mono label below in a white `rounded-chip` pill |
| Upcoming | 22px | `ink` | 2px white | Category icon, white stroke |
| Cluster | 26px min | `ink` | 2px white | Mono count, white text, horizontal padding |

User location: 12px `action` dot, 2px white ring, `shadow-raised`.

**Top chrome** — search 40px, `rounded-control`, `sheet` ground, `shadow-raised`;
placeholder `ink-4`; right side shows a `live` dot plus `{n} LIVE` in mono.

**Chip row** — horizontal scroll, scrollbar hidden, 32px, `rounded-chip`.
Selected `bg-ink`/`text-white`/`border-ink`; unselected
`bg-sheet`/`text-ink-2`/`border-line`. Transition `duration-micro ease-ins`.

**Locate button** — 44×44, `rounded-control`, `sheet`, hover `surface`, bottom
96px / right 16px.

**Bottom nav** — 72px, `paper`, `border-t line`, 5 equal columns. Inactive
`ink-3`, 10px/600. Active `action` with a 32×2 `action` indicator at the top
edge. Centre column is a 34×34 `rounded-control` `action` tile with a white plus.

**Toast** — bottom 88px, centred, `sheet`, `rounded-chip`, `shadow-overlay`,
mono uppercase.

> The current map already clusters and has zoom-tiered pins. This block is a
> **restyle of existing behaviour**, not a rewrite of the map logic. Do not
> touch `useMemo`/`useCallback` in `map-view.tsx` — they prevent Google Maps
> re-render loops.

---

## Block 5 — Event drawer → `components/event-details-drawer.tsx`

Bottom sheet over the map, `sheet` ground, `rounded-sheet` top corners,
`shadow-overlay`. Travel `top` 44% ↔ 12% over `duration-sheet ease-ins`.
Grab handle 36×4, `line`, `rounded-chip`, and it is a real button with an
`aria-label` that flips between Expand / Collapse.

Six stacked sections, each divided by `border-b line`:

1. **Header** — badge row then title. Live → `live-tint` pill with a `live` dot
   and `LIVE NOW`. Not live → `surface` pill reading `TODAY`. Then category ·
   price in mono `ink-3`. Title 22/27, 700, -0.01em.
2. **Logistics** — 2-column grid. Each cell: 15px `ink-3` icon, mono 12/16 `ink`
   primary line, mono 11/16 `ink-3` sub-line. Time, then distance + walk time.
3. **Host trust** — 40px `action-tint` avatar with initials in `action-hover`;
   name 15/22/600 with a `action` verified check; `Organizer · N events hosted`
   in `ink-3`; right-aligned show rate as mono 15/20/600 over a mono 10/14
   `ink-3` `SHOW RATE` label.
4. **Attendance** — overlapping 28px avatars (−8px margin), 2px white rings,
   then `+N`. Beside them: mono `{n} GOING · {cap} CAP`, and a spots line that
   turns `warn` at ≤ 5 left.
5. **About / house rules** — mono `ink-3` section labels; body 15/22 `ink-2`;
   rules as em-dash rows with the dash in `ink-4`.
6. **Sticky action bar** — `border-t line`, `sheet`.
   Not joined → full-width 48px `rounded-control` `action` button reading
   **Join as guest**, hover `action-hover`, active `scale(0.98)`; beneath it a
   mono line `NO ACCOUNT NEEDED · SIGN IN TO SAVE YOUR RSVPS` with `sign in` as
   an `action` link.
   Joined → a `live`-bordered confirmation panel (`You're in · {n} going`) plus
   a bordered **Undo**, and a mono line about checking in on arrival.

> Optimistic join, reconciled by the server. Do not change the `onSnapshot`
> subscription or any RSVP transaction semantics.

---

## Block 6 — Create event sheet → `components/create-event-modal.tsx`

Full-height sheet, `paper` ground.

**Header** — 16/20/600 title, 32×32 `surface` close button with `line` border,
`rounded-chip`, hover `surface-sunk`.

**Title field** — borderless textarea on transparent, 26/32, 700, -0.01em,
placeholder `What are we doing?`. Deliberately not a boxed input: the title is
the headline, not a form field.

**Category** — 3-column grid of 64px tiles, `rounded-control`, icon over label.
Selected `bg-action-tint`/`border-action`/`text-action-hover`;
unselected `bg-sheet`/`border-line`/`text-ink-2`.

**When** — 3 day buttons (`Today` / `Tomorrow` / `Pick a date`), 40px,
`rounded-chip`, mono uppercase, selected `ink`/white. Then two 48px time fields,
`sheet`, `rounded-chip`, mono 14/600.

**Where** — 48px input with a pin icon, then a `Use current location` text
button in `action`.

**Advanced details** — accordion behind a `border-t line`. Collapsed, it shows a
mono `ink-4` summary (`CAPACITY · DESCRIPTION · QUESTIONS`) and a chevron that
rotates 180° over `duration-move`. Inside: capacity stepper (two 36px buttons
either side of a mono 16/600 value, `No cap` at 0), description textarea, and an
`Add a question` button.

**Sticky CTA** — 48px `rounded-control`. Enabled `action`; disabled `ink-4` with
`cursor: default`. Below it a mono hint that states what is missing —
`ADD A TITLE AND A PLACE TO DROP YOUR PIN` — becoming
`GOES LIVE ON THE MAP IMMEDIATELY` when ready. **The CTA never disables
silently.**

**Success overlay** — full-bleed `paper`; 56px `live-tint` circle with a `live`
check; 18/24/600 `"{title}" is on the map`; mono meta line; a bordered
`Back to the form`.

> The real modal also carries recurrence, pickup points, RSVP questions,
> scheduled broadcasts and AI enhance. The artboard shows the **default path**.
> Keep the extra features; move them behind the same Advanced accordion.

---

## Block 7 — Landing → `components/landing-page.tsx`

Max width 1120, 24px gutters. This is the only surface using **Bricolage
Grotesque**, and it must be declared at this route, not in the root layout.

**Nav** — 64px, `paper`, `border-b line`. Wordmark Bricolage 22/700. Right side:
a text link, a bordered `Sign in`, and a filled `action` **Open the map**, both
36px `rounded-chip`.

**Hero** — two columns, collapsing under 400px. h1 Bricolage 40/44 with
`Right now.` in `action`. Sub 15/22 `ink-2`, max 40ch. CTA 44px
`rounded-control` `action`. Beneath it, mono `FREE · NO SIGNUP · WORKS IN YOUR
BROWSER`. Right column is the live map embed with pins, a live chip top-left,
and a click-to-open popover.

**How it works** — mono section label, then 3 columns each with a `border-l
line`, a mono `01`/`02`/`03` in `ink-4`, an 18/24/600 heading and 15/22 `ink-2`
body. Copy is deliberately terse: *Open the map / Tap a pin / Join in two taps*.

**Organizers** — `surface` band with rules top and bottom. h2 Bricolage 32/36.
Three claims separated by `border-t line`, each a mono label over a 15/22 line.
Secondary CTA is bordered, not filled — the map is the primary action.

**Footer** — `paper`, 13/20, `ink-3` and `ink-2` links.

> **Two things not to "fix":** the hero map embed uses the dark Google palette
> (`#242f3e`, `#746855`, `#d59563`) and the Organizer Studio panel uses the dark
> dashboard styling (`#101037`, `#F78912`). Both depict the *current product*.
> They are artwork, not chrome.
