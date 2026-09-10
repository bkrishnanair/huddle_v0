/**
 * Test-only stand-in for the `server-only` package.
 *
 * The real package throws on import outside a React Server Component, so any
 * module that follows CLAUDE.md non-negotiable #1 cannot be imported by vitest.
 * Aliased in vitest.config.mts; never used by the app.
 */
export {};
