import { defineConfig, configDefaults } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  // Mirror the `@/*` path alias from tsconfig.json so tests import modules the
  // same way the app does.
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
      // `server-only` throws on import outside a React Server Component, which
      // makes any module carrying it untestable — and CLAUDE.md requires it at
      // the top of every server module, so removing it is not an option.
      //
      // Stubbing it here affects the test runner only. The real guarantee is
      // enforced by the Next bundler at build time and by the
      // `grep -rn "firebase-admin" components/ hooks/` check, neither of which
      // this alias touches.
      'server-only': fileURLToPath(new URL('./__tests__/stubs/server-only.ts', import.meta.url)),
    },
  },
  test: {
    passWithNoTests: false,
    // scripts/test-rules.mjs is a standalone Firestore-emulator harness, not a
    // vitest suite — it needs a running emulator and must not gate the build.
    exclude: [...configDefaults.exclude, 'scripts/**', '__tests__/integration/**'],
  },
});
