import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/PerasonVuewPages/Login/loginPage';

test.describe('Pearson VUE - Login', () => {
  test('should login with default credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    // Ensure login form is visible
    const visible = await loginPage.isLoginButtonVisible(5000);
    expect(visible).toBeTruthy();

    // Perform login
    await loginPage.loginWithDefaults();

    // After login, one would normally assert an element on the landing/dashboard page.
    // For example, check that a logout button (if present) becomes visible.
    // We'll wait a short while for navigation to complete.
    await page.waitForLoadState('networkidle');

    // Example expectation: page title contains "Welcome" (adjust to your app)
    const title = await page.title();
    expect(title.toLowerCase()).toContain('welcome');
  });
});
