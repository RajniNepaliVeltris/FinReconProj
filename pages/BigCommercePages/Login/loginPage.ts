import { expect, Page } from '@playwright/test';
import { BasePage } from './Base/basePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto('https://www.bigcommerce.com/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('#loginButton');
  }

  async verifyLoginSuccess(): Promise<void> {
    await expect(this.page.locator('#dashboard')).toBeVisible();
  }

  async verifyLoginFailure(): Promise<void> {
    await expect(this.page.locator('#errorMessage')).toBeVisible();
  }
}