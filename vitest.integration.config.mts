import { defineConfig, configDefaults } from 'vitest/config';
import base from './vitest.config.mts';

export default defineConfig({
  ...base,
  test: { ...base.test, include: ['__tests__/integration/**/*.test.ts'], exclude: [...configDefaults.exclude], testTimeout: 20000, hookTimeout: 20000 },
});
