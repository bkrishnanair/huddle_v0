import { defineConfig, configDefaults } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  // Mirror the `@/*` path alias from tsconfig.json so tests import modules the
  // same way the app does.
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    // No vitest suites exist yet. CI must stay green until the first one lands.
    passWithNoTests: true,
    // scripts/test-rules.mjs is a standalone Firestore-emulator harness, not a
    // vitest suite — it needs a running emulator and must not gate the build.
    exclude: [...configDefaults.exclude, 'scripts/**'],
  },
});
