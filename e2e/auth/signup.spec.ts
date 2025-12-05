


import { test, expect } from '@playwright/test';
import { HOME_PAGE_URL } from '../constants';

test.describe('Authentication Page', () => {
  test('User can sign up successfully', async ({ page }) => {
    await page.goto('/auth');

    await page.getByTestId('signup-tab').click();

    await expect(page.getByTestId('signup-username')).toBeVisible();
    await expect(page.getByTestId('signup-email')).toBeVisible();
    await expect(page.getByTestId('signup-password')).toBeVisible();
    await expect(page.getByTestId('signup-confirm-password')).toBeVisible();
    await expect(page.getByTestId('signup-submit')).toBeVisible();

    await page.getByTestId('signup-username').fill('testuser');
    await page.getByTestId('signup-email').fill('testuser@gmail.com');
    await page.getByTestId('signup-password').fill('password');
    await page.getByTestId('signup-confirm-password').fill('password');
    await page.getByTestId('signup-submit').click();

    await expect(page).toHaveURL(HOME_PAGE_URL);
  });
});
