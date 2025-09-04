import { Locator, Page } from '@playwright/test';

// This file represents the base page functionality for BigCommerce.

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    try {
      await this.page.goto(url);
      console.log(`Navigated to: ${url}`);
    } catch (error) {
      console.error(`Failed to navigate to: ${url}`, error);
      throw new Error(`Navigation failed: ${error}`);
    }
  }

  async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      console.log(`Waited for element: ${locator}`);
    } catch (error) {
      console.error(`Element not found within timeout: ${locator}`, error);
      throw new Error(`Wait for element failed: ${error}`);
    }
  }

  async clickElement(locator: Locator, options = { force: false, timeout: 30000 }): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout: options.timeout });
      await locator.click({ force: options.force });
      console.log(`Clicked on element: ${locator}`);
    } catch (error) {
      console.error(`Failed to click element: ${locator}`, error);
      throw new Error(`Click element failed: ${error}`);
    }
  }

  async enterText(locator: Locator, text: string): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      await locator.fill(text);
      console.log(`Entered text: ${text} into element: ${locator}`);
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

  async verifyPageTitle(expectedTitle: string): Promise<void> {
    try {
      const actualTitle = await this.page.title();
      if (actualTitle !== expectedTitle) {
        throw new Error(`Page title mismatch. Expected: ${expectedTitle}, Found: ${actualTitle}`);
      }
      console.log(`Page title verified: ${expectedTitle}`);
    } catch (error) {
      console.error(`Failed to verify page title`, error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const logoutButtonLocator = "//button[@id='logout']"; // Example locator
      const logoutButton = this.page.locator(logoutButtonLocator);
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        console.log("Logged out from BigCommerce");
      } else {
        console.log("Logout button not visible, user might already be logged out");
      }
    } catch (error) {
      console.error(`Failed to logout`, error);
      // Not throwing here as logout failure shouldn't stop test execution
      console.log("Continuing despite logout failure");
    }
  }

  async isElementVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getElementText(locator: Locator): Promise<string> {
    try {
      const text = await locator.textContent() || '';
      return text;
    } catch (error) {
      console.error(`Failed to get text from element: ${locator}`, error);
      return '';
    }
  }

  async selectDropdownOption(locator: Locator, option: string): Promise<void> {
    try {
      await locator.selectOption({ label: option });
      await this.page.waitForTimeout(100); // Wait for the dropdown to update
      console.log(`Selected option: ${option} from dropdown: ${locator}`);
    } catch (error) {
      console.error(`Failed to select dropdown option: ${option} from ${locator}`, error);
      throw new Error(`Select dropdown option failed: ${error}`);
    }
  }

  async scrollToElement(locator: Locator): Promise<void> {
    try {
      await locator.scrollIntoViewIfNeeded();
      console.log(`Scrolled to element: ${locator}`);
    } catch (error) {
      console.error(`Failed to scroll to element: ${locator}`, error);
      throw new Error(`Scroll to element failed: ${error}`);
    }
  }

  async takeScreenshot(fileName: string): Promise<void> {
    try {
      await this.page.screenshot({ path: fileName });
      console.log(`Screenshot saved to: ${fileName}`);
    } catch (error) {
      console.error(`Failed to take screenshot: ${fileName}`, error);
      // Not throwing here as screenshot failure shouldn't stop test execution
      console.log("Continuing despite screenshot failure");
    }
  }

  async expandSideMenuOption(locator: Locator): Promise<void> {
    try {
      await locator.scrollIntoViewIfNeeded();
      const classAttribute = await locator.getAttribute('class');
      if (classAttribute && classAttribute.includes('collapsed')) {
        await locator.click();
        console.log(`Expanded side menu option: ${locator}`);
      } else {
        console.log(`Side menu option already expanded: ${locator}`);
      }
    } catch (error) {
      console.error(`Failed to expand side menu option: ${locator}`, error);
      throw new Error(`Expand side menu option failed: ${error}`);
    }
  }

  async collapseSideMenuOption(locator: Locator): Promise<void> {
    try {
      await locator.scrollIntoViewIfNeeded();
      const classAttribute = await locator.getAttribute('class');
      if (classAttribute && !classAttribute.includes('collapsed')) {
        await locator.click();
        console.log(`Collapsed side menu option: ${locator}`);
      } else {
        console.log(`Side menu option already collapsed: ${locator}`);
      }
    } catch (error) {
      console.error(`Failed to collapse side menu option: ${locator}`, error);
      throw new Error(`Collapse side menu option failed: ${error}`);
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

  async retryOperation(operation: () => Promise<void>, maxAttempts: number = 3, delay: number = 1000): Promise<void> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await operation();
        return; // Success
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt}/${maxAttempts} failed:`, error);
        
        if (attempt < maxAttempts) {
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // If we got here, all attempts failed
    throw new Error(`Operation failed after ${maxAttempts} attempts: ${lastError?.message}`);
  }
}