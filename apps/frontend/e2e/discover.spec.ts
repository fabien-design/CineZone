import { test, expect } from '@playwright/test';

test.describe('Discover page', () => {
  test('renders search bar and filters', async ({ page }) => {
    await page.goto('/discover');
    await expect(page.getByRole('main')).toBeVisible();
    // Search input
    const search = page.getByRole('textbox', { name: /search movies|rechercher/i });
    await expect(search).toBeVisible();
  });

  test('updates URL when searching', async ({ page }) => {
    await page.goto('/discover');
    const search = page.getByRole('textbox', { name: /search movies|rechercher/i });
    await search.fill('inception');
    await expect(page).toHaveURL(/q=inception/, { timeout: 2000 });
  });

  test('clear button appears when query is entered', async ({ page }) => {
    await page.goto('/discover');
    const search = page.getByRole('textbox', { name: /search movies|rechercher/i });
    await search.fill('test');
    await expect(page.getByRole('button', { name: /clear search|effacer/i })).toBeVisible();
  });

  test('clear button removes the query', async ({ page }) => {
    await page.goto('/discover');
    const search = page.getByRole('textbox', { name: /search movies|rechercher/i });
    await search.fill('inception');
    await page.getByRole('button', { name: /clear search|effacer/i }).click();
    await expect(search).toHaveValue('');
  });
});
