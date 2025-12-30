import { Page, Locator } from '@playwright/test';
import { BasePage } from '../Base/basePage';

export class LoginPage extends BasePage {
  readonly userIdInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly nxtButton: Locator;

  // Default test credentials (do not use for production)
  // static readonly DEFAULT_USER = 'sonali.ghodake@pearson.com';
  // static readonly DEFAULT_PASS = 'Kibopvdevacc@42';

  constructor(page: Page) {
    super(page);

    // Locators based on the screenshot and typical KiBO markup.
    this.userIdInput = page.locator('//input[@id="Email"]');
    this.passwordInput = page.locator('//input[@id="Password"]');
    this.loginButton = page.locator('//input[@type="submit"]');
    this.forgotPasswordLink = page.locator('a.mz-link.forgot-password[href="/login/Password/ForgotPassword"]');
    this.nxtButton = page.locator('//input[@id="buttonSubmit"]');
  }

  async navigate(): Promise<void> {
    if (!process.env.KIBO_ADMIN_URL) {
      throw new Error('KIBO_ADMIN_URL is not defined');
    }

    await this.page.goto(process.env.KIBO_ADMIN_URL);
    await this.waitForNetworkIdle();
  }

  async enterUserId(userId: string): Promise<void> {
    await this.enterText(this.userIdInput, userId);
  }

  async clickNxtbtn(): Promise<void> {
    await this.clickElement(this.nxtButton, 'Next Button');
  }

  async enterPassword(password: string): Promise<void> {
    await this.enterText(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginButton, 'Login Button');
  }

  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink, 'Forgot Password Link');
  }

  async login(userId: string, password: string): Promise<void> {
    await this.enterUserId(userId);
    await this.clickNxtbtn();
    await this.enterPassword(password);
    await this.clickLogin();
    await this.waitForNetworkIdle();
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return this.isElementVisible(this.loginButton);
  } 
}
