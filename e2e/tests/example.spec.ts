

import { test, expect } from '@playwright/test';

test('Authentication page loads', async ({ page }) => {
  await page.goto('http://localhost:5173/auth');
  await expect(page).toHaveTitle(/Authentication/);
});
