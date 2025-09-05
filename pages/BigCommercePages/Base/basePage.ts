import { Locator, Page } from '@playwright/test';
import { error } from 'console';

// This file represents the base page functionality for BigCommerce.

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
      let optionLocator: Locator | null = null;

      // Attempt to select by label
      try {
        await locator.selectOption({ label: value });
        optionLocator = locator.locator(`option[label='${value}'], option:has-text("${value}")`);
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
            optionLocator = locator.locator(`option[value='${value}']`);
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
            optionLocator = locator.locator(`option:nth-child(${index + 1})`);
            console.log(`Selected by index: '${index}'`);
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
            optionLocator = locator.locator(`option:nth-child(${index + 1})`);
            console.log(`Selected by index: '${index}'`);
            selected = true;
          } catch (error1) {
            console.error(`Failed to set dropdown value '${value}':`, error1);
            throw error1;
          }
        }
      }
    } catch (error1) {
    console.error(`Error in setDropdownValue for value '${value}':`, error1);
    throw error1;
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
      //wait locator.click({ force: options.force });
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
        if (await locator.isVisible()) {
          await locator.click();
          await locator.fill(text);
          console.log(`Entered text: ${text} into element: ${locator}`);
        }
      } catch (error1) {
        console.error(`Failed to enter text into element: ${locator}`, error1);
        throw new Error(`Enter text failed: ${error1}`);
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
      console.log(`Element not visible: ${locator}`, error);
      console.error(`Element not visible: ${locator}`, error);
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