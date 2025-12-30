import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/KiboPages/Login/loginPage';

test.describe('Kibo - Login', () => {
  test('should login with env credentials', async ({ page }) => {
    if (!process.env.KIBO_ADMIN_USER || !process.env.KIBO_ADMIN_PASSWORD) {
      throw new Error('KIBO_ADMIN_USER or KIBO_ADMIN_PASSWORD is not set');
    }

    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    // Ensure login form is visible (dynamic)
    const visible = await loginPage.isLoginButtonVisible();
    expect(visible).toBeTruthy();

    // Perform login using env credentials
    await loginPage.login(
      process.env.KIBO_ADMIN_USER,
      process.env.KIBO_ADMIN_PASSWORD
    );

    // Post-login validation
    const url = page.url();
    const title = await page.title();

    console.log(`Landed on page: ${title} (URL: ${url})`);

    expect(url.toLowerCase()).toContain('/admin');
    expect(title.toLowerCase()).toContain('kibo');
  });
});
