
import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './',
  fullyParallel: false,
  workers: 1,

  /*
    webServer tells Playwright:
        "Before running tests, make sure something that serves
        HTTP is running and reachable at this URL."
  */

  webServer: {
    command: 'docker compose -f docker-compose.dev.yml -f docker-compose.e2e.yml up -d --build',
    url: 'http://localhost:5173',
    timeout: 120_000,
    reuseExistingServer: !isCI,
  },

  use: {
    baseURL: 'http://localhost:5173',
    browserName: 'chromium',
    headless: isCI ? true : false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      slowMo: isCI ? 0 : 700,
    },
  },

  outputDir: './test-results',
  globalSetup: './globalSetup.ts',
  globalTeardown: './globalTeardown.ts',
});
