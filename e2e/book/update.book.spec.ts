import { test, expect } from '@playwright/test';

import { AUTH_PAGE_URL, HOME_PAGE_URL } from '../constants';

test.describe('Update Book Page', () => {
  test('Admin can update book successfully', async ({ page }) => {
    await page.goto(AUTH_PAGE_URL);

    // Login as an admin
    await expect(page.getByTestId('login-username')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();

    await page.getByTestId('login-username').fill('admin_zulu');
    await page.getByTestId('login-password').fill('password');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(HOME_PAGE_URL);

    // Navigate to admin tools page
    await page.getByTestId('user-avatar').click();
    await page.getByTestId('adminTools-menu-item').click();
    await page.keyboard.press('Escape'); // Close the backdrop

    // Navigate to update book page.
    await page.getByTestId('book-management-card').click();
    await page.getByTestId('book-card-zone-one').click(); // Select the book with title 'Zone One'
    await page.getByTestId('edit-book-icon').click();


    // Verify form fields are visible
    const titleInput = page.getByTestId('title-field');
    const synopsisInput = page.getByTestId('synopsis-field');
    const languageSelect = page.locator('#single-autocomplete-language-select');
    const pagesInput = page.getByTestId('pages-field');
    const priceInput = page.getByTestId('price-field');
    const yearPublishedInput = page.getByTestId('year-published-field');
    const authorsInput = page.locator('#multi-value-input-create-book-authors-input');
    const tagsInput = page.locator('#multi-autocomplete-book-tags-input');
    const submitButton = page.getByTestId('update-book-submit');
    
    await expect(titleInput).toBeVisible();
    await expect(synopsisInput).toBeVisible();
    await expect(languageSelect).toBeVisible();
    await expect(pagesInput).toBeVisible();
    await expect(priceInput).toBeVisible();
    await expect(yearPublishedInput).toBeVisible();
    await expect(authorsInput).toBeVisible();
    await expect(tagsInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    await titleInput.fill('Zone One – Updated');
    await synopsisInput.fill('Updated synopsis for Zone One.');
    await pagesInput.fill('320');
    await priceInput.fill('24.99');
    await yearPublishedInput.fill('2024');

    await languageSelect.click();
    await page.getByRole('listbox').getByText('Korean').click();
    await page.keyboard.press('Escape');

    await authorsInput.fill('Humayun Ahmed');
    await page.keyboard.press('Enter');

    await expect(page.getByText('Humayun Ahmed')).toBeVisible();


    // Select some tags for the book
    await tagsInput.click();
    await tagsInput.fill('Dystopian');

    await page.getByRole('option', { name: 'Dystopian' }).click();

    await tagsInput.fill('Horror');
    await page.getByRole('option', { name: 'Horror' }).click();

    await page.keyboard.press('Escape');


    // Remove the "literary" tag by clicking the cross icon
    const literaryChip = page.locator('.MuiChip-root', {
        has: page.locator('.MuiChip-label', { hasText: 'literary' }),
    });
    await literaryChip.locator('svg[data-testid="CancelIcon"]').click();
    await expect(page.locator('.MuiChip-label', { hasText: 'literary' })).toHaveCount(0);

    await submitButton.click();


    // Update is successful and redirected to the book details page
    await expect(page).toHaveURL(/\/books\/\d+$/);

    await expect(
        page.getByText('Book updated successfully.')
    ).toBeVisible();

    await expect(
        page.getByRole('heading', { name: 'Zone One – Updated' })
    ).toBeVisible();
  });
});
