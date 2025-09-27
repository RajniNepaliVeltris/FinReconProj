import { Locator, Page } from '@playwright/test';

// This file represents the base page functionality for Pearson Vue application.

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Handles dropdowns that can be either <select> or <input> elements.
   * If locator points to a <select>, selects the option. If <input>, fills the value.
   * @param locator - Locator for the dropdown element
   * @param value - value to select or fill
   */
  async setDropdownValue(locator: Locator, value: string): Promise<void> {
    try {
      const tagName = await locator.evaluate(el => el.tagName.toLowerCase());

      if (tagName === 'select') {
        let selected = false;

        // Attempt to select by label
        try {
          await locator.selectOption({ label: value });
          console.log(`Selected by label: '${value}'`);
          selected = true;
        } catch (error) {
          console.error(`Failed to set dropdown value '${value}':`, error);
          throw error;
        }

        // Attempt to select by value
        if (!selected) {
          try {
            await locator.selectOption({ value });
            console.log(`Selected by value: '${value}'`);
            selected = true;
          } catch (error) {
            console.error(`Failed to set dropdown value '${value}':`, error);
            throw error;
          }
        }

        // Attempt to select by index (if numeric)
        if (!selected && !isNaN(Number(value))) {
          const index = Number(value);
          try {
            await locator.selectOption({ index });
            console.log(`Selected by index: '${index}'`);
            selected = true;
          } catch (error) {
            console.error(`Failed to set dropdown value '${value}':`, error);
            throw error;
          }
        }
      }
    } catch (error) {
      console.log(`Error determining tag name for locator: ${locator}`, error);
      console.error(`Error in setDropdownValue for value '${value}':`, error);
      throw error;
    }
  }

  async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      console.log(`Waited for element: ${locator}`);
    } catch (error) {
      console.log(`Error occurred while waiting for element: ${locator}`, error);
      console.error(`Element not found within timeout: ${locator}`, error);
      throw new Error(`Wait for element failed: ${error}`);
    }
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
      const logoutButtonLocator = "//button[@id='logout']"; // Example locator - adjust for Pearson Vue
      const logoutButton = this.page.locator(logoutButtonLocator);
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        console.log("Logged out from Pearson Vue");
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
      console.log(`Element not visible: ${locator}`, error);
      console.error(`Element not visible: ${locator}`, error);
      return false;
    }
  }

  async getElementText(locator: Locator): Promise<string> {
    try {
      // If the page has been closed, fail fast with a clear message
      try {
        // @ts-ignore - Playwright Page has isClosed()
        if ((this.page as any).isClosed && (this.page as any).isClosed()) {
          throw new Error('Page is already closed');
        }
      } catch (e) {
        // If isClosed check isn't available, continue and let locator.textContent fail below
      }

      const text = await locator.textContent();
      return (text || '');
    } catch (err: any) {
      console.error(`Failed to get text from element: ${locator}`, err);
      // Provide a more actionable error for closed contexts
      if (err && typeof err.message === 'string' && err.message.includes('has been closed')) {
        throw new Error(`Failed to get text because page/context/browser is closed: ${err.message}`);
      }
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

  /**
   * Handles input-based dropdown elements where clicking opens a dropdown menu.
   * Selects an option from the dropdown list based on matching text.
   * @param inputLocator - Locator for the input element that triggers the dropdown
   * @param optionText - Text of the option to select from the dropdown
   * @param dropdownOptionsSelector - CSS selector for the dropdown options (default: 'li, [role="option"]')
   * @param timeout - Maximum time to wait for elements (default: 5000ms)
   */
  async selectFromInputDropdown(
    inputLocator: Locator,
    optionText: string,
    dropdownOptionsSelector: string = 'li, [role="option"]',
    timeout: number = 5000
  ): Promise<void> {
    try {
      // Wait for and click the input to open dropdown
      await this.waitForElement(inputLocator, timeout);
      await this.clickElement(inputLocator, 'Input Dropdown');

      // Wait for dropdown options to be visible
      const dropdownOptions = this.page.locator(dropdownOptionsSelector);
      await dropdownOptions.first().waitFor({ state: 'visible', timeout });

      // Find and click the matching option
      const matchingOption = dropdownOptions.filter({ hasText: optionText }).first();
      await matchingOption.waitFor({ state: 'visible', timeout });
      await matchingOption.click();

      console.log(`Selected "${optionText}" from input dropdown`);
    } catch (error) {
      console.error(`Failed to select "${optionText}" from input dropdown:`, error);
      throw new Error(`Input dropdown selection failed: ${error}`);
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