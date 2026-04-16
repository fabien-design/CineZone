import { test, expect } from '@playwright/test';

test.describe('Auth page', () => {
  test('navigates to /login when clicking Log In', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /log in|se connecter/i }).first().click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('displays login form by default', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /welcome back|bienvenue/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    // Target the input specifically by id to avoid matching the "Show password" button
    await expect(page.locator('#login-password')).toBeVisible();
  });

  test('switches to register tab', async ({ page }) => {
    await page.goto('/login');
    // Click the first "Sign Up" tab button (not the "Sign up" link below)
    await page.getByRole('button', { name: /sign up|s'inscrire/i }).first().click();
    await expect(page.getByRole('heading', { name: /join cinezone|rejoindre/i })).toBeVisible();
  });

  test('shows inline error on invalid login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.locator('#login-password').fill('wrongpassword');
    await page.locator('form').getByRole('button', { name: /log in|se connecter/i }).click();
    await expect(
      page.getByText(/incorrect|invalide/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('language switch changes page text (from home)', async ({ page }) => {
    // The LanguageSwitcher is in the Navbar, accessible from the home page
    await page.goto('/');
    await page.getByRole('button', { name: 'Français' }).click();
    // Navigate to login to verify translation
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Bienvenue !' })).toBeVisible();
    // Switch back
    await page.goto('/');
    await page.getByRole('button', { name: 'English' }).click();
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Welcome Back!' })).toBeVisible();
  });
});
