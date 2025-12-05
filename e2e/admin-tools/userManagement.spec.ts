



import { test, expect } from '@playwright/test';
import { ADMIN_TOOLS_PAGE_URL, AUTH_PAGE_URL, HOME_PAGE_URL, USER_MANAGEMENT_PAGE_URL } from '../constants';

test.describe('Filtering in user management page', () => {
  test('User can log in successfully', async ({ page }) => {

    // Login as superadmin
    await page.goto(AUTH_PAGE_URL);
    await expect(page.getByTestId('login-username')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
    await page.getByTestId('login-username').fill('superadmin');
    await page.getByTestId('login-password').fill('password');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(HOME_PAGE_URL);

    // Navigate to user management page
    await expect(page.getByTestId('user-avatar')).toBeVisible();
    await page.getByTestId('user-avatar').click();
    await expect(page.getByTestId('adminTools-menu-item')).toBeVisible();
    await page.getByTestId('adminTools-menu-item').click();

    // Close the mui backdrop. It interferes with the clicks on the page.
    await expect(page.locator('.MuiBackdrop-invisible')).toBeVisible();
    await page.locator('.MuiBackdrop-invisible').click();

    await expect(page).toHaveURL(ADMIN_TOOLS_PAGE_URL);

    await expect(page.getByTestId('user-management-card')).toBeVisible();
    await page.getByTestId('user-management-card').click();
    await expect(page).toHaveURL(USER_MANAGEMENT_PAGE_URL);
    
    const sortOrderSelect = page.getByTestId('sort-order-select');
    await expect(sortOrderSelect.locator('.MuiSelect-select')).toHaveText('Descending');
    sortOrderSelect.click();

    await page.getByRole('option', { name: 'Ascending' }).click();
    await expect(sortOrderSelect.locator('.MuiSelect-select')).toHaveText('Ascending');
  });
});
