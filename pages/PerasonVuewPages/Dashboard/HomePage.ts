import { Locator, Page } from '@playwright/test';
import { BasePage } from '../Base/basePage';

/**
 * Page object for the Pearson VUE Home/Dashboard page
 * Contains locators and common interactions used by tests
 */
export class HomePage extends BasePage {
  // Locators
  readonly headerLogo: Locator;
  readonly topNav: Locator;
  readonly welcomeHeading: Locator;
  readonly welcomeParagraph: Locator;
  readonly userGreeting: Locator; // e.g., "Welcome, PVFRUser1"
  readonly logoutLink: Locator;
  readonly configurationLink: Locator;
  readonly jobStatusLink: Locator;
  readonly voucherLink: Locator;
  readonly paymentGatewayLink: Locator;
  readonly fxRateLink: Locator;
  readonly reportsLink: Locator;
  readonly customSchemaLink: Locator;
  readonly downloadsLink: Locator;
  readonly manualReturnLink: Locator;


  constructor(page: Page) {
    super(page);

    // Header/logo at top-left
    this.headerLogo = page.locator('header >> text=Pearson | VUE', { hasText: 'Pearson' });

    // Primary top navigation bar (menu items shown in screenshot)
    this.topNav = page.locator('nav, header nav, .navbar, .top-nav');

    // Welcome section
    this.welcomeHeading = page.locator('h1', { hasText: 'Welcome to Pearson Vue' });
    this.welcomeParagraph = page.locator('h1 + p, h1 + div, .welcome, .content p');

    // User greeting shown on top-right (example text: "Welcome, PVFRUser1")
    this.userGreeting = page.locator('text=/Welcome,\s+\w+/');

    // Logout link near the user greeting (scoped to header to avoid accidental matches)
    this.logoutLink = page.locator('header').locator('text=Logout').first();

    // Helper to create DesktopMenu button locator by visible text
    const desktopMenuButton = (name: string) => page.locator(`//div[@id="DesktopMenu"]//button[contains(@class,"dropbtn") and normalize-space(text())="${name}"]`);

    // Initialize named menu locators using helper to reduce duplication
    this.configurationLink = desktopMenuButton('Configuration');
    this.jobStatusLink = desktopMenuButton('Job Status');
    this.voucherLink = desktopMenuButton('Voucher');
    this.paymentGatewayLink = desktopMenuButton('Payment Gateway');
    this.fxRateLink = desktopMenuButton('FX Rate');
    this.reportsLink = desktopMenuButton('Report');
    this.customSchemaLink = desktopMenuButton('Custom Schema');
    this.downloadsLink = desktopMenuButton('Downloads');
    this.manualReturnLink = desktopMenuButton('Manual Return');
}
  /**
   * Clicks a top navigation menu item by visible text.
   * @param name visible text of the menu item
   */
  async clickTopMenu(name: string): Promise<void> {
    const menuItem = this.page.locator(`nav >> text="${name}" , .top-nav >> text="${name}", header >> text="${name}"`);
    await this.clickElement(menuItem, `Top menu: ${name}`);
  }

  /**
   * Returns the heading text from the welcome section
   */
  async getWelcomeHeadingText(): Promise<string> {
    return (await this.getElementText(this.welcomeHeading)).trim();
  }

  /**
   * Returns the welcome paragraph text (first paragraph under the heading)
   */
  async getWelcomeParagraphText(): Promise<string> {
    return (await this.getElementText(this.welcomeParagraph)).trim();
  }

  /**
   * Checks whether a user greeting is visible (indicating logged in state)
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.userGreeting, 3000);
  }

  /**
   * Clicks the logout link/button in the header
   */
  async clickLogout(): Promise<void> {
    await this.clickElement(this.logoutLink, 'Logout link');
  }

  /**
   * Verifies the home page is displayed by checking the welcome heading and user greeting
   */
  async verifyHomePageDisplayed(): Promise<void> {
    await this.waitForElement(this.welcomeHeading, 5000);
    if (!(await this.isUserLoggedIn())) {
      throw new Error('User greeting not visible - home page may not be displayed or user not logged in');
    }
  }

  //Naviaget to the Configuration

}
