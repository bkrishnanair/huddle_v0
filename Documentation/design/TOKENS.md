# Instrument — token contract

The shared contract between the Claude Design artboards and the app. Tokens
live in `app/globals.css` (`--ins-*`); semantic names live in
`tailwind.config.ts`. Per CLAUDE.md, that split is the rule.

**Additive on purpose.** The legacy shadcn tokens in `:root` still hold the dark
palette that every un-migrated surface renders against. Instrument is namespaced
alongside them so nothing changes until a surface is rebuilt. Delete the legacy
set only once the last surface has migrated.

## Colour

| Token | Tailwind | Hex | Role |
|---|---|---|---|
| `--ins-paper` | `paper` | `#FCFBF9` | Page ground, bottom nav |
| `--ins-surface` | `surface` | `#F4F2EE` | Recessed surface, map canvas |
| `--ins-surface-sunk` | `surface-sunk` | `#E9E6E0` | Muted fill, buildings |
| `--ins-surface-sunk-2` | `surface-deep` | `#E0DCD4` | Deepest paper fill |
| `--ins-card` | `sheet` | `#FFFFFF` | Elevated card, drawer, sheet |
| `--ins-ink` | `ink` | `#191C1E` | Primary text, active chip fill |
| `--ins-ink-2` | `ink-2` | `#43484D` | Body copy |
| `--ins-ink-3` | `ink-3` | `#767D85` | Meta, mono labels, icon stroke |
| `--ins-ink-4` | `ink-4` | `#A8AEB5` | Placeholder, disabled, dimmed pin |
| `--ins-line` | `line` | `#E9E6E0` | Hairline divider, input border |
| `--ins-line-strong` | `line-strong` | `#DAD6CE` | Emphasised outline |
| `--ins-accent` | `action` | `#1D4FD7` | Primary CTA, links, active nav |
| `--ins-accent-hover` | `action-hover` | `#173FB0` | Hover |
| `--ins-accent-tint` | `action-tint` | `#E4EBFC` | Selected category, avatar ground |
| `--ins-live` | `live` | `#0BA95B` | Live pin, RadarPing, live dot |
| `--ins-live-tint` | `live-tint` | `#DCF5E8` | Live badge ground, parks |
| `--ins-live-ink` | `live-ink` | `#8AAE97` | Muted green map label |
| `--ins-warn` | `warn` | `#B45309` | Scarcity: ≤ 5 spots left |

**Two accents, two jobs.** Blue is *action* — anything you can press. Green is
*liveness* — a fact about the world, never a control. Never use green for a
button or blue for a live state.

Category colours are **not** part of this system. They stay in
`getCategoryColor()` (`lib/utils.ts`) and keep their current values.

## Type

Three voices, no more.

| Voice | Family | Where |
|---|---|---|
| Display | Bricolage Grotesque 700 | Marketing landing only — wordmark, h1, h2 |
| Body | Inter 400–700 | Everything in-app, including in-app headings |
| Numeral | IBM Plex Mono 500/600 | Times, distances, counts, capacities, show rates, all meta labels |

The in-app surfaces use **Inter 700 at -0.01em** for headings, not Bricolage.
Bricolage appears only on the landing artboard. It is therefore declared at the
landing route, never in the root layout — the app routes already sit near
400 kB First Load JS.

Mono is always uppercase, `letter-spacing: 0.04em`, `tabular-nums`. The
`.ins-mono` utility applies all three.

### Scale observed across the artboards

| Use | Size / line | Weight |
|---|---|---|
| Landing h1 | 40 / 44 | Display 700 |
| Landing h2 | 32 / 36 | Display 700 |
| Sheet title input | 26 / 32 | 700, -0.01em |
| Drawer h1 | 22 / 27 | 700, -0.01em |
| Section heading | 18 / 24 | 600 |
| Body | 15 / 22 | 400 |
| Body small | 14 / 20 | 400 |
| Meta | 13 / 18 | 400 |
| Mono lg (stat) | 15 / 20 | 600 |
| Mono md | 12 / 16 | 500 |
| Mono sm | 11 / 16 | 500 |
| Mono xs | 10 / 14 | 500 |

## Elevation

Two levels only.

| Token | Tailwind | Value |
|---|---|---|
| `--ins-shadow-raised` | `shadow-raised` | `0 1px 2px rgba(25,28,30,.06), 0 4px 12px rgba(25,28,30,.06)` |
| `--ins-shadow-overlay` | `shadow-overlay` | `0 8px 32px rgba(25,28,30,.16)` |

Raised = sits on the map (search bar, pin, locate button, card).
Overlay = floats above everything (drawer, sheet, toast, popover).

## Radius

Named by role so a surface cannot pick the wrong one.

| Token | Tailwind | Value | Use |
|---|---|---|---|
| `--ins-radius-sm` | `rounded-chip` | 8px | Chips, inputs, badges, toasts |
| `--ins-radius-md` | `rounded-control` | 12px | Buttons, cards, search bar |
| `--ins-radius-lg` | `rounded-sheet` | 20px | Drawers, sheets, screen shell |

## Motion

One curve: `cubic-bezier(.2, 0, 0, 1)` → `ease-ins`.

| Token | Tailwind | Value | Use |
|---|---|---|---|
| `--ins-dur-micro` | `duration-micro` | 120ms | Hover, press |
| `--ins-dur-move` | `duration-move` | 200ms | Chevron, accordion |
| `--ins-dur-sheet` | `duration-sheet` | 300ms | Drawer travel |

Press feedback is `transform: scale(0.98)` on primary buttons.

### RadarPing

The only looping animation permitted. `.ins-radarping` — 3000ms, infinite,
`scale(1) → scale(2.2)`, `opacity .5 → 0`, holding empty for the last third so
the ring reads as a pulse rather than a strobe. Frozen at `scale(1.6)` under
`prefers-reduced-motion`.

`animate-ping` (Tailwind's default) is **banned** — it is a different, faster,
non-conforming loop and currently appears in `map-pins/live-pin.tsx`.

## Interaction states

Recurring patterns worth copying exactly.

- **Chip, selected:** `bg-ink` / `text-white` / `border-ink`.
  **Unselected:** `bg-sheet` / `text-ink-2` / `border-line`.
- **Category tile, selected:** `bg-action-tint` / `border-action` / `text-action-hover`.
- **Primary button:** 48px, `rounded-control`, `bg-action`, hover `bg-action-hover`,
  active `scale(0.98)`.
- **Disabled CTA:** `bg-ink-4`, `cursor: default` — plus a mono hint line saying
  what is missing. The sheet never disables silently.
- **Focus ring:** `2px solid var(--ins-accent)`, `outline-offset: 2px`. Global.
- **Tap target:** pins are 44×44 hit areas even where the dot is 22–26px.

## Rules the artboards encode

- **Never render a zero.** The drawer shows `{n} spots left`, and turns `warn`
  at ≤ 5. Zero states are replaced by a routing line, not a `0`.
- **Never fake liveness.** Green and RadarPing appear only when the event is
  genuinely running; otherwise the pin is `ink` and the badge reads `Today`.
- **Guest-first.** The drawer CTA is `Join as guest`, with sign-in as a
  secondary mono line beneath. Sign-in is never the wall.
- **Mono carries every number.** If it is a time, a distance, a count, a
  capacity or a percentage, it is mono, uppercase, tabular.
