

import { test, expect } from '@playwright/test';
import { AUTH_PAGE_URL, HOME_PAGE_URL } from '../constants';

test.describe('Authentication Page', () => {
  test('User can log in successfully', async ({ page }) => {
    await page.goto(AUTH_PAGE_URL);

    await expect(page.getByTestId('login-username')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();

    await page.getByTestId('login-username').fill('zoe_kendall');
    await page.getByTestId('login-password').fill('password');

    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(HOME_PAGE_URL);
  });
});
