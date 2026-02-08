

import { test, expect } from '@playwright/test';
import { AUTH_PAGE_URL, HOME_PAGE_URL } from '../constants';

test.describe('Delete & Restore Book Flow', () => {
  test('Admin can delete and restore a book', async ({ page }) => {
    
    // Log in and navigate to the book management page
    await page.goto(AUTH_PAGE_URL);

    await page.getByTestId('login-username').fill('admin_zulu');
    await page.getByTestId('login-password').fill('password');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(HOME_PAGE_URL);
    await page.getByTestId('user-avatar').click();
    await page.getByTestId('adminTools-menu-item').click();
    await page.keyboard.press('Escape');
    await page.getByTestId('book-management-card').click();
    
    // Search and delete the book named "The Wicked King"
    await page.getByPlaceholder('Search by title or author').fill('The Wicked King');
    await page.keyboard.press('Enter');
    const bookCard = page.getByTestId('book-card-the-wicked-king');
    await expect(bookCard).toBeVisible();
    await page.keyboard.press('Escape');
    await bookCard.getByRole('button', { name: 'Delete Book' }).click();
    await expect(bookCard.getByText('Deleted')).toBeVisible();

    // Navigate to the book details page and go to the update page
    // Verify that all fields are disabled in the update page
    await bookCard.click();
    await page.getByTestId('edit-book-icon').click();
    await expect(page.getByTestId('title-field')).toBeDisabled();
    await expect(page.getByTestId('synopsis-field')).toBeDisabled();
    await expect(page.getByTestId('pages-field')).toBeDisabled();
    await expect(page.getByTestId('price-field')).toBeDisabled();
    await expect(page.getByTestId('year-published-field')).toBeDisabled();
    await expect(page.getByTestId('update-book-submit')).toBeDisabled();

    // Restore the book and navigate to the book management page again
    await page.getByTestId('restore-book-button').click();
    await page.getByTestId('user-avatar').click();
    await page.getByTestId('adminTools-menu-item').click();
    await page.keyboard.press('Escape');
    await page.getByTestId('book-management-card').click();

    // Search for the book named "The Wicked King" again
    // Verify that the deleted chip is gone
    await page.getByPlaceholder('Search by title or author').fill('The Wicked King');
    const restoredBookCard = page.getByTestId('book-card-the-wicked-king');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    await expect(restoredBookCard).toBeVisible();
    await expect(restoredBookCard.getByText('Deleted')).toHaveCount(0);
  });
});
