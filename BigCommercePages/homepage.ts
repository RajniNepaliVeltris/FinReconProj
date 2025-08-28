import { Locator } from '@playwright/test';

// This file represents the homepage functionality for BigCommerce.

export class Homepage {
  private searchInputLocator: Locator;
  private page: any;

  constructor(page: any) {
    // Initialize homepage elements
    this.page = page;
    this.searchInputLocator = page.locator("//input[@aria-label='Search']");
  }

  private getSideMenuLocator(SideMenuOption: string): Locator {
    // Parameterized function to generate side menu locators
    return this.page.locator(`//li[@role='menuitem']//div[text()='${SideMenuOption}']`);
  }

  private getOrdersSubMenuLocator(subMenuOption: string): Locator {
    // Fixed XPath pattern for Orders submenu locators
    return this.page.locator(`//div[text()='Orders']//..//..//..//a[contains(@href,'/manage/orders${subMenuOption}')]`);
  }

  private async isMenuExpanded(menuName: string): Promise<boolean> {
    const expandButtonLocator = this.page.locator(`//div[text()='${menuName}']//..//..//button[@aria-label='Expand']`);
    return expandButtonLocator.isVisible();
  }

  private async navigateOrdersMenuOptions(subMenuOption: string) {
    const subMenuLocator = this.getOrdersSubMenuLocator(subMenuOption);
    if (await subMenuLocator.isVisible()) {
        await subMenuLocator.click();
        console.log(`Navigated to Orders submenu option: ${subMenuOption}`);
    } else {
        console.error(`Orders submenu option not found: ${subMenuOption}`);
    }
  }

  navigateToHomepage() {
    // Code to navigate to the homepage
  }

  verifySubscriptionActive() {
    // Code to verify the subscription is active
  }

  startAcceptingOrders() {
    // Code to start accepting orders
  }

  customizeDashboard() {
    // Code to customize the dashboard
  }

  async navigateAndVerifyMenuSideMenuOption(pageName: string, subMenuOption?: string) {
    const sideMenuPaths: Record<string, string> = {
        'Orders': 'manage/orders',
        'Products': 'manage/products',
        'Customers': 'manage/customers',
        'Storefront': 'manage/storefront',
        'Marketing': 'manage/marketing',
        'Analytics': 'manage/analytics',
        'Apps': 'manage/apps',
        'Channels': 'manage/channels',
        'Financing': 'manage/financing',
        'Settings': 'manage/settings',
    };

    const expectedUrlContains = sideMenuPaths[pageName];
    if (!expectedUrlContains) {
        console.error(`Invalid page name: ${pageName}`);
        return;
    }

    if (!(await this.isMenuExpanded(pageName))) {
        console.log(`${pageName} menu is collapsed. Expanding...`);
        await this.getSideMenuLocator(pageName).click();
    }

    if (pageName === 'Orders' && subMenuOption) {
        await this.navigateOrdersMenuOptions(subMenuOption);
    } else {
        const sideMenuLocator = this.getSideMenuLocator(pageName);
        if (await sideMenuLocator.isVisible()) {
            await sideMenuLocator.click();
            console.log(`Navigated to ${pageName} menu.`);
        } else {
            console.error(`${pageName} menu not found.`);
            return;
        }
    }

    const currentUrl = await this.page.url();
    if (currentUrl.includes(expectedUrlContains)) {
        console.log(`Successfully navigated to ${pageName}. URL contains: ${expectedUrlContains}`);
    } else {
        console.error(`URL mismatch for ${pageName}. Expected to contain: ${expectedUrlContains}, Found: ${currentUrl}`);
    }
  }

  async navigateAndVerifyOrdersMenuOption(subMenuOption: string) {
    const subMenuPaths: Record<string, string> = {
        'All orders': '',
        'Add': '/add-order',
        'Search': '/search',
        'Export': '/export',
        'Draft orders': '/draft-orders',
        'Shipments': '/view-shipments',
        'Return request': '/view-returns',
        'Gift certificates': '/gift-certificates',
    };

    const expectedUrlContains = subMenuPaths[subMenuOption];
    if (!expectedUrlContains) {
        console.error(`Invalid Orders submenu option: ${subMenuOption}`);
        return;
    }

    if (!(await this.isMenuExpanded('Orders'))) {
        console.log('Orders menu is collapsed. Expanding...');
        await this.getSideMenuLocator('Orders').click();
    }

    const subMenuLocator = this.getOrdersSubMenuLocator(expectedUrlContains);
    if (await subMenuLocator.isVisible()) {
        await subMenuLocator.click();
        console.log(`Navigated to Orders submenu option: ${subMenuOption}`);
    } else {
        console.error(`Orders submenu option not found: ${subMenuOption}`);
        return;
    }

    const currentUrl = await this.page.url();
    if (currentUrl.includes(expectedUrlContains)) {
        console.log(`Successfully navigated to Orders submenu option: ${subMenuOption}. URL contains: ${expectedUrlContains}`);
    } else {
        console.error(`URL mismatch for Orders submenu option: ${subMenuOption}. Expected to contain: ${expectedUrlContains}, Found: ${currentUrl}`);
    }
  }

  search(query: string) {
    // Code to interact with the search input field
    this.searchInputLocator.fill(query);
    console.log(`Searching for: ${query}`);
  }
}