
import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  use: {
    headless: isCI ? true : false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      slowMo: 2000,
    },
  },
  outputDir: './test-results'
});
