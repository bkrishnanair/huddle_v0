import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    // No vitest suites exist yet. CI must stay green until the first one lands.
    passWithNoTests: true,
    // scripts/test-rules.mjs is a standalone Firestore-emulator harness, not a
    // vitest suite — it needs a running emulator and must not gate the build.
    exclude: [...configDefaults.exclude, 'scripts/**'],
  },
});
