import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // --- Instrument palette (Block 3) ---
        paper: "var(--ins-paper)",
        surface: {
          DEFAULT: "var(--ins-surface)",
          sunk: "var(--ins-surface-sunk)",
          deep: "var(--ins-surface-sunk-2)",
        },
        sheet: "var(--ins-card)",
        ink: {
          DEFAULT: "var(--ins-ink)",
          2: "var(--ins-ink-2)",
          3: "var(--ins-ink-3)",
          4: "var(--ins-ink-4)",
        },
        line: {
          DEFAULT: "var(--ins-line)",
          strong: "var(--ins-line-strong)",
        },
        action: {
          DEFAULT: "var(--ins-accent)",
          hover: "var(--ins-accent-hover)",
          tint: "var(--ins-accent-tint)",
        },
        live: {
          DEFAULT: "var(--ins-live)",
          tint: "var(--ins-live-tint)",
          ink: "var(--ins-live-ink)",
        },
        warn: "var(--ins-warn)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",

        // --- Instrument (Block 3) ---
        // Named by role, not by size, so a surface cannot pick the wrong one.
        chip: "var(--ins-radius-sm)",      //  8px — chips, inputs, badges, toasts
        control: "var(--ins-radius-md)",   // 12px — buttons, cards, search bar
        sheet: "var(--ins-radius-lg)",     // 20px — drawers, sheets, screen shell
      },

      // ======================================================================
      // INSTRUMENT SEMANTIC NAMES (Block 3)
      // Deliberately namespaced away from the shadcn set above (background /
      // foreground / primary / card / accent), which still drives every
      // un-migrated surface. Nothing here changes existing rendering; a surface
      // adopts Instrument by switching to these names when it is rebuilt.
      // ======================================================================
      fontFamily: {
        body: ["var(--ins-font-body)"],
        mono: ["var(--ins-font-mono)"],
        display: ["var(--ins-font-display)"],
      },
      boxShadow: {
        raised: "var(--ins-shadow-raised)",
        overlay: "var(--ins-shadow-overlay)",
      },
      transitionTimingFunction: {
        ins: "var(--ins-ease)",
      },
      transitionDuration: {
        micro: "var(--ins-dur-micro)",
        move: "var(--ins-dur-move)",
        sheet: "var(--ins-dur-sheet)",
      },
      letterSpacing: {
        mono: "var(--ins-mono-tracking)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config