import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('displays the CineZone logo', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('CineZone')).toBeVisible();
  });

  test('shows the main navigation links', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeVisible();
  });

  test('has a working link to the Discover page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /discover|découvrir/i }).first().click();
    await expect(page).toHaveURL(/\/discover/);
  });

  test('language switcher is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Français' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'English' })).toBeVisible();
  });
});
