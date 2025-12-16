import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/KiboPages/Login/loginPage';

test.describe('Kibo - Login', () => {
  test('should login with default credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    // Ensure login form is visible
    const visible = await loginPage.isLoginButtonVisible(5000);
    expect(visible).toBeTruthy();

    // Perform login
    await loginPage.loginWithDefaults();

    await page.waitForLoadState('networkidle');

    // Example expectation: page title contains "Admin Page" (adjust to your app)
    const title = await page.title();
    const url = await page.url();
    console.log(`Landed on page: ${title} (URL: ${url})`);
    expect (url).toContain('/admin'); // Adjust based on actual landing URL
    expect(title.toLowerCase()).toContain('kibo admin');
  });
});
