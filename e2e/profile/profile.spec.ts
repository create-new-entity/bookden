



import { test, expect } from '@playwright/test';
import { AUTH_PAGE_URL, HOME_PAGE_URL, PROFILE_PAGE_URL } from '../constants';

test.describe('Profile page', () => {
  test('User can update profile successfully', async ({ page }) => {

    /*
        1. Go to login page -> Enter credentials
        2. Landing on home page -> Click on user avatar -> Click on profile menu item
     */
    await page.goto('/auth');
    await expect(page.getByTestId('login-username')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
    await page.getByTestId('login-username').fill('zoe_kendall');
    await page.getByTestId('login-password').fill('password');
    await page.getByTestId('login-submit').click();

    // Successfully logged in and redirected to home page
    await expect(page).toHaveURL(HOME_PAGE_URL);
    await page.getByTestId('user-avatar').click();
    await page.getByTestId('profile-menu-item').click();

    // Close the mui backdrop. It interferes with the clicks on the page.
    await expect(page.locator('.MuiBackdrop-invisible')).toBeVisible();
    await page.locator('.MuiBackdrop-invisible').click();

    // Profile page should be visible
    await expect(page).toHaveURL(PROFILE_PAGE_URL);
    await expect(page.getByTestId('profile-avatar')).toBeVisible();
    await expect(page.getByTestId('username-field')).toBeVisible();
    await expect(page.getByTestId('email-field')).toBeVisible();
    await expect(page.getByTestId('new-password-field')).toBeVisible();
    await expect(page.getByTestId('confirm-password-field')).toBeVisible();
    await expect(page.getByTestId('delete-profile-button')).toBeVisible();
    await expect(page.getByTestId('submit-button')).toBeVisible();


    // Update profile data and submit
    await page.getByTestId('username-field').fill('zoe_kendall_updated');
    await page.getByTestId('email-field').fill('zoe_kendall_updated@gmail.com');
    await page.getByTestId('new-password-field').fill('new_password');
    await page.getByTestId('confirm-password-field').fill('new_password');
    await expect(page.getByTestId('submit-button')).toBeEnabled();
    await page.getByTestId('submit-button').click();


    // Successfully updated profile data and redirected to home page
    await expect(page).toHaveURL(HOME_PAGE_URL);

    // Logout and redirect to login page
    await expect(page.getByTestId('user-avatar')).toBeVisible();
    await page.getByTestId('user-avatar').click();
    await page.getByTestId('logout-menu-item').click();

    // Successfully logged out and redirected to login page
    await expect(page).toHaveURL(AUTH_PAGE_URL);
    await expect(page.getByTestId('login-username')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
    await page.getByTestId('login-username').fill('zoe_kendall_updated');
    await page.getByTestId('login-password').fill('new_password');
    await page.getByTestId('login-submit').click();

    // Successfully logged in with updated profile data and redirected to home page
    await expect(page).toHaveURL(HOME_PAGE_URL);
  });
});
