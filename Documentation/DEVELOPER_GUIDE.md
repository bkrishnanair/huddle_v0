# Huddle Developer Onboarding Guide

Welcome to the Huddle engineering team! This guide will walk you through setting up your local environment and understanding our stringent coding standards.

---

## 💻 1. Local Setup

Huddle relies on strict package management and specific Node.js versions to ensure Turbopack stability.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.x or later).
*   [PNPM](https://pnpm.io/installation) (We enforce `pnpm` usage implicitly).

### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/bkrishnanair/huddle_v0.git
    cd huddle_v0
    ```

2.  **Environment Variables**
    Create a `.env.local` file with both client and server (Admin SDK) variables.
    *   **Public Key**: `NEXT_PUBLIC_FIREBASE_API_KEY`, etc.
    *   **Secret Keys**: `FIREBASE_PRIVATE_KEY` uses literal `\n` characters.

3.  **Install Dependencies**
    ```bash
    pnpm install
    ```

### 🌍 2. Data Seeding (Interactive Map)

To get a functional map with realistic events for development and testing, use the **UMD Seeding Suite**:

1.  Ensure your `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` are set in `.env.local`.
2.  Run the seeding script:
    ```bash
    npx ts-node scripts/seed_umd.ts
    ```
    *This script is **idempotent**—it will automatically clean up events created by the seed user before generating new ones, preventing duplicates in your Firestore database.*

3.  **Run the Development Server**
    ```bash
    pnpm run dev
    ```
    The application will boot locally on `http://localhost:3000`.

---

## 🎨 3. Coding Standards

> **⚠️ `CLAUDE.md` is the source of truth for design.** Where this section and
> `CLAUDE.md` disagree, `CLAUDE.md` wins. The guidance below described the
> *pre-Instrument* aesthetic and is retained only to explain what you will find
> in existing files.

The target design system is **"Instrument"** — light-first, paper-and-ink. See
`CLAUDE.md` for the full specification.

**Banned in new work:** glassmorphism / `backdrop-blur` · gradients · dark
backgrounds on new surfaces · arbitrary Tailwind values (`p-[13px]`, `z-[60]`,
unlisted hex) · emoji in chrome or copy · any looping animation other than
RadarPing.

### UI Components & Styling
*   **Shadcn UI**: We use `components/ui/*` for all primitive elements.
*   **Tailwind CSS**: Use the semantic tokens defined in `globals.css` and
    `tailwind.config.ts`. Do not introduce raw colour values.
*   **Icons**: We exclusively use [Lucide React](https://lucide.dev/).

**What the existing codebase actually looks like** (migration debt, not a
pattern to copy): `bg-slate-950` and `glass-surface` appear across 26+ files,
and `:root` and `.dark` in `globals.css` currently hold identical dark values —
there is no light palette yet. `animate-ping` is used in `map-pins/live-pin.tsx`;
it is a looping animation and is banned going forward.

### Architectural Rules
Huddle prioritizes structural safety in the serverless environment.

*   **Zero Webpack Leaking**:
    *   Add `"use client"` to the top of any interactive React component.
    *   **Never** import `lib/db.ts` or `firebase-admin` into any `"use client"` component.
*   **Geospatial Interaction**:
    *   When working within `components/map-view.tsx`, respect the `useMemo` and `useCallback` hooks to prevent infinite re-rendering of Google Maps.

---

## 🤝 4. Contribution Workflow

To maintain a clean trunk (`main` branch), follow this Git flow:

### Branch Naming
Always branch off the latest `main`. Prefix your branch name logically:
*   `feature/[description]` (e.g., `feature/profile-badges`)
*   `bugfix/[description]` (e.g., `bugfix/map-flicker`)

### Commit Messages
Write clear, imperative messages:
*   **Good**: `Implement notification polling in Bell component`
*   **Bad**: `styling tweaks` or `wip`

### Pull Requests (PR)
1.  Push your branch.
2.  Open a PR against `main`.
3.  Ensure your code passes the Next.js build: `pnpm run build` locally before pushing.
