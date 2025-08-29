import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../BigCommercePages/loginPage';
import loginTestData from '../../../../data/loginTestData.json';

type LoginTest = {
  description: string;
  username: string;
  password: string;
  expectedUrl?: string;
  expectedWelcomeText?: string;
  expectedError?: string;
};

test.describe('Login Page', () => {
  (loginTestData.loginTests as LoginTest[]).forEach(({ description, username, password, expectedUrl, expectedWelcomeText, expectedError }) => {
    test(description, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigateToLoginPage();

      await loginPage.login(username, password);

      if (expectedUrl) {
        await expect(page).toHaveURL(expectedUrl);
        
        if (expectedWelcomeText) {
          await expect(page.locator('h1')).toHaveText(expectedWelcomeText);
        }
      }

      if (expectedError) {
        await expect(page.locator('#errorMessage')).toHaveText(expectedError);
      }
    });
  });
});