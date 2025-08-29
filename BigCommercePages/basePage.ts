import { Page } from '@playwright/test';

// This file represents the base page functionality for BigCommerce.

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    console.log(`Navigated to: ${url}`);
  }

  async waitForElement(locator: string): Promise<void> {
    await this.page.waitForSelector(locator);
    console.log(`Waited for element: ${locator}`);
  }

  async clickElement(locator: string): Promise<void> {
    await this.page.click(locator);
    console.log(`Clicked on element: ${locator}`);
  }

  async enterText(locator: string, text: string): Promise<void> {
    await this.page.fill(locator, text);
    console.log(`Entered text: ${text} into element: ${locator}`);
  }

  async verifyPageTitle(expectedTitle: string): Promise<void> {
    const actualTitle = await this.page.title();
    if (actualTitle !== expectedTitle) {
      throw new Error(`Page title mismatch. Expected: ${expectedTitle}, Found: ${actualTitle}`);
    }
    console.log(`Page title verified: ${expectedTitle}`);
  }

  async logout(): Promise<void> {
    const logoutButtonLocator = "//button[@id='logout']"; // Example locator
    const logoutButton = this.page.locator(logoutButtonLocator);
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      console.log("Logged out from BigCommerce");
    }
  }

  async isElementVisible(locator: string): Promise<boolean> {
    return await this.page.isVisible(locator);
  }

  async getElementText(locator: string): Promise<string> {
    return await this.page.textContent(locator) || '';
  }

  async selectDropdownOption(locator: string, option: string): Promise<void> {
    await this.page.selectOption(locator, { label: option });
  }

  async scrollToElement(locator: string): Promise<void> {
    await this.page.locator(locator).scrollIntoViewIfNeeded();
  }

  async takeScreenshot(fileName: string): Promise<void> {
    await this.page.screenshot({ path: fileName });
  }

  async expandSideMenuOption(locator: string): Promise<void> {
    const element = this.page.locator(locator);
    const classAttribute = await element.getAttribute('class');
    if (classAttribute && classAttribute.includes('collapsed')) {
      await element.click();
    }
  }

  async collapseSideMenuOption(locator: string): Promise<void> {
    const element = this.page.locator(locator);
    const classAttribute = await element.getAttribute('class');
    if (classAttribute && !classAttribute.includes('collapsed')) {
      await element.click();
    }
  }
}