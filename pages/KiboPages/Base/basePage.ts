import { Locator, Page } from '@playwright/test';

// This file represents the base page functionality for Pearson Vue application.

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

    async clickElement(locator: Locator, locatorName: string, options = { force: false, timeout: 30000 }): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout: options.timeout });
      await locator.click({ force: options.force });
      console.log(`Clicked on element: ${locatorName}`);
    } catch (error) {
      console.log(`Error occurred while clicking element: ${locatorName}`, error);
      console.error(`Failed to click element: ${locatorName}`, error);
      throw new Error(`Click element failed: ${error}`);
    }
  }

   async enterText(locator: Locator, text: string): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      if (await locator.isVisible()) {
        await locator.click();
        if (text) {
          await locator.fill(text);
        } else {
          console.log(`No text provided to enter into element: ${locator}`);
        }
        console.log(`Entered text: ${text} into element: ${locator}`);
      }
    } catch (error) {
      console.error(`Failed to enter text into element: ${locator}`, error);
      throw new Error(`Enter text failed: ${error}`);
    }
  }

   async clearAndEnterText(locator: Locator, text: string): Promise<void> {
    try {
      await locator.click();
      await locator.clear();
      await locator.fill(text);
      console.log(`Cleared and entered text: ${text} into element: ${locator}`);
    } catch (error) {
      console.error(`Failed to clear and enter text: ${locator}`, error);
      throw new Error(`Clear and enter text failed: ${error}`);
    }
  }

  async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
      console.log('Waited for network to be idle');
    } catch (error) {
      console.error('Failed to wait for network idle', error);
      // Not throwing here as this is often just a timeout that shouldn't fail the test
      console.log('Continuing despite network idle timeout');
    }
  }

    async isElementVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch (error) {
      console.log(`Element not visible: ${locator}`, error);
      console.error(`Element not visible: ${locator}`, error);
      return false;
    }
  }
}