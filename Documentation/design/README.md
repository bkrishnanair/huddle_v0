# Instrument — design reference

Reference artboards for the "Instrument" design system, exported from the
Claude Design project **Huddle Landing Redesign**.

- Project: `61f93be0-3ce5-496a-8a06-623cd79f21e9`
- Canvas: https://claude.ai/design/p/61f93be0-3ce5-496a-8a06-623cd79f21e9

## These are reference targets, not source

**Never import, paste, or transpile these files into the app.** They are
canvas artboards: `<x-dc>` templates driven by a `DCLogic` class and rendered
by the canvas runtime (`support.js`). They have no data bindings, no auth
state, and no map integration. Copying them into React would break every
surface.

The workflow is:

1. **Extract the token layer** → `app/globals.css` + `tailwind.config.ts`.
   Done in Block 3. The contract is written up in `TOKENS.md`.
2. **Rebuild each surface natively** against those tokens, one block at a time.
3. **Diff the result against the artboard here** — these files are the
   acceptance criterion, nothing more.

## Files

| File | What it is |
|---|---|
| `TOKENS.md` | The token contract — colour, type, elevation, radius, motion, states |
| `SURFACES.md` | Per-surface build spec for blocks 4–7, read off the artboards |

**The artboard HTML is not vendored here, on purpose.** A `.dc.html` is an
`<x-dc>` template that only renders inside the canvas runtime (`support.js`,
65 kB of generated React plumbing). A local copy would neither render nor
screenshot-diff without vendoring that runtime too, and it would rot silently
the first time someone edits the canvas.

So: **diff visually against the live canvas in a browser**, and treat
`TOKENS.md` + `SURFACES.md` as the checked-in, reviewable contract.

| Artboard | Rebuild target | Block |
|---|---|---|
| `Map View.dc.html` | `components/map-view.tsx` | 4 |
| `Event Drawer.dc.html` | `components/event-details-drawer.tsx` | 5 |
| `Create Event Sheet.dc.html` | `components/create-event-modal.tsx` | 6 |
| `Huddle Landing.dc.html` | `components/landing-page.tsx` | 7 |

## Staleness

These are a snapshot. The canvas is the source of truth and can move under
them. Before starting a surface block, re-read that artboard from the live
project rather than trusting the copy here:

```
DesignSync  method=get_file
            projectId=61f93be0-3ce5-496a-8a06-623cd79f21e9
            path="Map View.dc.html"
```

## Two things the artboards get right that are easy to lose

- **Dark artwork on the landing page is content, not chrome.** The hero map
  embed (`#242f3e`, `#746855`, `#d59563`) and the Organizer Studio recreation
  (`#101037`, `#F78912`) depict the *current* product. They are screenshots in
  spirit. Do not "fix" them to paper tones.
- **Category colours are unchanged.** The landing artboard sources them from
  `getCategoryColor()` in `lib/utils.ts` (`#E74C3C`, `#C0392B`, `#00796B`,
  `#EC407A`, `#9B59B6`, `#3498DB`). Instrument recolours *chrome*, not
  category identity.
