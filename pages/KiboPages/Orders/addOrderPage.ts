import { Page, Locator } from '@playwright/test';
import { BasePage } from '../Base/basePage';

export class AddOrderPage extends BasePage {
  readonly createNewOrderButton: Locator;
  readonly createNewOrderUATLink: Locator;
  readonly customerSearchInput: Locator;
  readonly customerDropdownItems: Locator;
  // XPath template stored in ONE place (lead-approved style)
  private readonly customerResultByIdXPath: string;

  constructor(page: Page) {
    super(page);

    this.createNewOrderButton = page.locator(
      '//*[normalize-space(text())="Create New Order"]'
    );

    this.createNewOrderUATLink = page.locator(
      '//*[contains(@id,"menuitem") and normalize-space(text())="UAT"]'
    );

    this.customerSearchInput = page.locator(
      '//input[@placeholder="Customer Search" and @role="combobox"]'
    );

    this.customerDropdownItems = page.locator(
      "//div[contains(@class,'x-boundlist-item')]"
    );

    // STRICT text match: Shopper <CustomerId>
    this.customerResultByIdXPath =
      "//div[contains(@class,'x-boundlist-item')]" +
      "//div[contains(@class,'account') and text()='Shopper {CUSTOMER_ID}']";
  }

  // Returns customer result locator by customer ID
  private customerResultById(customerId: string): Locator {
    return this.page.locator(
      this.customerResultByIdXPath.replace('{CUSTOMER_ID}', customerId)
    );
  }

  async navigateToOrders(): Promise<void> {
    if (!process.env.KIBO_ORDERS_URL) {
      throw new Error('KIBO_ORDERS_URL is not defined');
    }

    await this.page.goto(process.env.KIBO_ORDERS_URL);
  }

  async createUATOrderWithCustomer(customerId: string): Promise<void> {
    try {
      await this.clickElement(this.createNewOrderButton, 'Create New Order');
      await this.clickElement(this.createNewOrderUATLink, 'Create New Order UAT');

      // search customer
      await this.enterText(this.customerSearchInput, customerId);
      await this.customerSearchInput.press('ArrowDown');

      // Now existing logic works
      const customerResult = this.customerResultById(customerId);
      await this.expectVisible(customerResult, `Customer Shopper ${customerId}`);
      await this.clickElement(customerResult, `Customer Shopper ${customerId}`);
    } catch (error) {
      console.error(
        `Failed while creating UAT order for customer ${customerId}`,
        error
      );
      throw error;
    }
  }

  async isOrderCreationPageLoaded(): Promise<boolean> {
    return this.isElementVisible(this.createNewOrderButton);
  }
}
