import { Page, Locator } from '@playwright/test';
import { BasePage } from '../Base/basePage';

export class AddOrderPage extends BasePage {
  readonly createNewOrderButton: Locator;
  readonly createNewOrderUATLink: Locator;
  readonly customerSearchInput: Locator;

  private readonly customerResultByIdXPath: string;

  constructor(page: Page) {
    super(page);

    this.createNewOrderButton = page.locator('//*[normalize-space(text())="Create New Order"]');

    this.createNewOrderUATLink = page.locator('//*[contains(@id,"menuitem") and normalize-space(text())="UAT"]');

    this.customerSearchInput = page.locator('//input[@placeholder="Customer Search" and @role="combobox"]');
    
    this.customerResultByIdXPath =
      "//div[contains(@class,'x-boundlist-item')]" +
      "[.//div[contains(@class,'account') and contains(normalize-space(text()), '{CUSTOMER_ID}')]]";
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
    await this.waitForNetworkIdle();
  }

  async createUATOrderWithCustomer(customerId: string): Promise<void> {
    await this.clickElement(this.createNewOrderButton, 'Create New Order');
    await this.clickElement(this.createNewOrderUATLink, 'Create New Order UAT');
    await this.customerSearchInput.fill('');
    await this.enterText(this.customerSearchInput, customerId);

    const customerResult = this.customerResultById(customerId);
    await this.expectVisible(customerResult, `Customer ${customerId}`);
    await this.clickElement(customerResult, `Customer ${customerId}`);
  }

  async isOrderCreationPageLoaded(): Promise<boolean> {
    return this.isElementVisible(this.createNewOrderButton);
  }
}
