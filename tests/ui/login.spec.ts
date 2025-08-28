import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should log in and validate dashboard', async ({ page }) => {
    await page.goto('/login');

    // Fill in login form
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');

    // Validate dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toHaveText('Welcome, testuser!');
  });
});