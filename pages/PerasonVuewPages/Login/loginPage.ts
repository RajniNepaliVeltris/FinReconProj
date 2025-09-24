import { Page, Locator } from '@playwright/test';
import { BasePage } from '../Base/basePage';

export class LoginPage extends BasePage {
  readonly userIdInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly resetButton: Locator;
  readonly forgotPasswordLink: Locator;

  // Default test credentials (do not use for production)
  static readonly DEFAULT_USER = 'PVFRUser1';
  static readonly DEFAULT_PASS = 'PVFRpass1$';

  constructor(page: Page) {
    super(page);

    // Locators based on the screenshot and typical Pearson VUE markup.
    // Adjust selectors if your app uses different attributes.
    this.userIdInput = page.locator('#UserId');
    this.passwordInput = page.locator('#Password');
    this.loginButton = page.locator('//button[@type="submit"]');
    this.resetButton = page.locator('#reset');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot Password"), text=Forgot Password');
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://vue-dv-bpk-web-dev-c0dvdwdqe7dcghcr.eastus-01.azurewebsites.net/JobStatus/Index');
    await this.waitForNetworkIdle();
  }

  async enterUserId(userId: string): Promise<void> {
    await this.enterText(this.userIdInput, userId);
  }

  async enterPassword(password: string): Promise<void> {
    await this.enterText(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginButton, 'Login Button');
  }

  async clickReset(): Promise<void> {
    await this.clickElement(this.resetButton, 'Reset Button');
  }

  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink, 'Forgot Password Link');
  }

  async login(userId: string, password: string): Promise<void> {
    await this.enterUserId(userId);
    await this.enterPassword(password);
    await this.clickLogin();
    await this.waitForNetworkIdle(10000);
  }

  async loginWithDefaults(): Promise<void> {
    await this.login(LoginPage.DEFAULT_USER, LoginPage.DEFAULT_PASS);
  }

  async isLoginButtonVisible(timeout = 5000): Promise<boolean> {
    return this.isElementVisible(this.loginButton, timeout);
  }
}
