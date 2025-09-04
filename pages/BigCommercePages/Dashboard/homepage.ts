import { Locator, Page } from '@playwright/test';
import { BasePage } from '../Base/basePage';

// This file represents the homepage functionality for BigCommerce.

export class Homepage extends BasePage {
  private searchInputLocator: Locator;
  private sideMenuLocators: Record<string, Locator>;
  private ordersSubMenuLocators: Record<string, Locator>;
  private productsSubMenuLocators: Record<string, Locator>;
  private customersSubMenuLocators: Record<string, Locator>;
  private storefrontSubMenuLocators: Record<string, Locator>;
  private marketingSubMenuLocators: Record<string, Locator>;
  private analyticsSubMenuLocators: Record<string, Locator>;
  private appsSubMenuLocators: Record<string, Locator>;

  constructor(page: Page) {
    super(page);

    // Define locators at the top
    this.searchInputLocator = page.locator("//input[@aria-label='Search']");

    this.sideMenuLocators = {
      Orders: page.locator("//li[@role='menuitem']//div[text()='Orders']"),
      Products: page.locator("//li[@role='menuitem']//div[text()='Products']"),
      Customers: page.locator("//li[@role='menuitem']//div[text()='Customers']"),
      Storefront: page.locator("//li[@role='menuitem']//div[text()='Storefront']"),
      Marketing: page.locator("//li[@role='menuitem']//div[text()='Marketing']"),
      Analytics: page.locator("//li[@role='menuitem']//div[text()='Analytics']"),
      Apps: page.locator("//li[@role='menuitem']//div[text()='Apps']"),
      Channels: page.locator("//li[@role='menuitem']//div[text()='Channels']"),
      Financing: page.locator("//li[@role='menuitem']//div[text()='Financing']"),
      Settings: page.locator("//li[@role='menuitem']//div[text()='Settings']"),
    };

    this.ordersSubMenuLocators = {
      'All orders': page.locator("//div[text()='Orders']//..//..//..//a[contains(@href,'/manage/orders') and text()='All orders']"),
      Add: page.locator("//div[text()='Orders']//..//..//..//a[contains(@href,'/manage/orders/add-order') and text()='Add']"),
      Search: page.locator("//div[text()='Orders']//..//..//..//a[contains(@href,'/manage/orders/search') and text()='Search']"),
      Export: page.locator("//div[text()='Orders']//..//..//..//a[contains(@href,'/manage/orders/export') and text()='Export']"),
      'Draft orders': page.locator("//div[text()='Orders']//..//..//..//a[contains(@href,'/manage/orders/draft-orders') and text()='Draft orders']"),
      Shipments: page.locator("//div[text()='Orders']//..//..//..//a[contains(@href,'/manage/orders/view-shipments') and text()='Shipments']"),
      'Return request': page.locator("//div[text()='Orders']//..//..//..//a[contains(@href,'/manage/orders/view-returns') and text()='Return request']"),
      'Gift certificates': page.locator("//div[text()='Orders']//..//..//..//a[contains(@href,'/manage/orders/gift-certificates') and text()='Gift certificates']"),
    };

    this.productsSubMenuLocators = {
      'All products': page.locator("//div[text()='Products']//..//..//..//a[contains(@href,'/manage/products') and text()='All products']"),
      Add: page.locator("//div[text()='Products']//..//..//..//a[contains(@href,'/manage/products/add') and text()='Add']"),
      Search: page.locator("//div[text()='Products']//..//..//..//a[contains(@href,'/manage/products/search') and text()='Search']"),
      Export: page.locator("//div[text()='Products']//..//..//..//a[contains(@href,'/manage/products/export') and text()='Export']"),
      Categories: page.locator("//div[text()='Products']//..//..//..//a[contains(@href,'/manage/products/categories') and text()='Categories']"),
      Options: page.locator("//div[text()='Products']//..//..//..//a[contains(@href,'/manage/products/options') and text()='Options']"),
      Reviews: page.locator("//div[text()='Products']//..//..//..//a[contains(@href,'/manage/products/reviews') and text()='Reviews']"),
      Brands: page.locator("//div[text()='Products']//..//..//..//a[contains(@href,'/manage/products/brands') and text()='Brands']"),
      'Export SKUs': page.locator("//div[text()='Products']//..//..//..//a[contains(@href,'/manage/products/export-skus') and text()='Export SKUs']"),
    };

    this.customersSubMenuLocators = {
      'All customers': page.locator("//div[text()='Customers']//..//..//..//a[contains(@href,'/manage/customers') and text()='All customers']"),
      Add: page.locator("//div[text()='Customers']//..//..//..//a[contains(@href,'/manage/customers/add') and text()='Add']"),
      Search: page.locator("//div[text()='Customers']//..//..//..//a[contains(@href,'/manage/customers/search') and text()='Search']"),
      Export: page.locator("//div[text()='Customers']//..//..//..//a[contains(@href,'/manage/customers/export') and text()='Export']"),
    };

    this.storefrontSubMenuLocators = {
      Blog: page.locator("//div[text()='Storefront']//..//..//..//a[contains(@href,'/manage/storefront/blog') and text()='Blog']"),
      'Image manager': page.locator("//div[text()='Storefront']//..//..//..//a[contains(@href,'/manage/storefront/image-manager') and text()='Image manager']"),
    };

    this.marketingSubMenuLocators = {
      Promotions: page.locator("//div[text()='Marketing']//..//..//..//a[contains(@href,'/manage/marketing/promotions') and text()='Promotions']"),
      Banners: page.locator("//div[text()='Marketing']//..//..//..//a[contains(@href,'/manage/marketing/banners') and text()='Banners']"),
      'Abandoned cart emails': page.locator("//div[text()='Marketing']//..//..//..//a[contains(@href,'/manage/marketing/abandoned-cart-emails') and text()='Abandoned cart emails']"),
      'Coupon codes': page.locator("//div[text()='Marketing']//..//..//..//a[contains(@href,'/manage/marketing/coupon-codes') and text()='Coupon codes']"),
      'Email marketing': page.locator("//div[text()='Marketing']//..//..//..//a[contains(@href,'/manage/marketing/email-marketing') and text()='Email marketing']"),
      'Gift certificates': page.locator("//div[text()='Marketing']//..//..//..//a[contains(@href,'/manage/marketing/gift-certificates') and text()='Gift certificates']"),
      'Gift certificate templates': page.locator("//div[text()='Marketing']//..//..//..//a[contains(@href,'/manage/marketing/gift-certificate-templates') and text()='Gift certificate templates']"),
    };

    this.analyticsSubMenuLocators = {
      Overview: page.locator("//div[text()='Analytics']//..//..//..//a[contains(@href,'/manage/analytics/overview') and text()='Overview']"),
      Insights: page.locator("//div[text()='Analytics']//..//..//..//a[contains(@href,'/manage/analytics/insights') and text()='Insights']"),
      'Real time': page.locator("//div[text()='Analytics']//..//..//..//a[contains(@href,'/manage/analytics/real-time') and text()='Real time']"),
      Merchandising: page.locator("//div[text()='Analytics']//..//..//..//a[contains(@href,'/manage/analytics/merchandising') and text()='Merchandising']"),
      Marketing: page.locator("//div[text()='Analytics']//..//..//..//a[contains(@href,'/manage/analytics/marketing') and text()='Marketing']"),
      Orders: page.locator("//div[text()='Analytics']//..//..//..//a[contains(@href,'/manage/analytics/orders') and text()='Orders']"),
      Customers: page.locator("//div[text()='Analytics']//..//..//..//a[contains(@href,'/manage/analytics/customers') and text()='Customers']"),
      'Purchase funnel': page.locator("//div[text()='Analytics']//..//..//..//a[contains(@href,'/manage/analytics/purchase-funnel') and text()='Purchase funnel']"),
      Carts: page.locator("//div[text()='Analytics']//..//..//..//a[contains(@href,'/manage/analytics/carts') and text()='Carts']"),
      'In-Store search': page.locator("//div[text()='Analytics']//..//..//..//a[contains(@href,'/manage/analytics/in-store-search') and text()='In-Store search']"),
      'Sales tax report': page.locator("//div[text()='Analytics']//..//..//..//a[contains(@href,'/manage/analytics/sales-tax-report') and text()='Sales tax report']"),
    };

    this.appsSubMenuLocators = {
      'App marketplace': page.locator("//div[text()='Apps']//..//..//..//a[contains(@href,'/manage/apps/app-marketplace') and text()='App marketplace']"),
      'My apps': page.locator("//div[text()='Apps']//..//..//..//a[contains(@href,'/manage/apps/my-apps') and text()='My apps']"),
      Develop: page.locator("//div[text()='Apps']//..//..//..//a[contains(@href,'/manage/apps/develop') and text()='Develop']"),
    };
  }

  async navigateToHomepage() {
    await this.page.goto('/homepage');
  }

  async search(query: string) {
    await this.searchInputLocator.fill(query);
    console.log(`Searching for: ${query}`);
  }

  async navigateToSideMenuOption(menuName: string, subMenuName: string) {
    const menuLocator = this.sideMenuLocators[menuName];
    if (menuLocator && (await menuLocator.isVisible())) {
      await menuLocator.click();
      console.log(`Navigated to ${menuName} menu.`);
      if (menuName === 'Orders') {
        await this.navigateToOrdersSubMenuOption(subMenuName);
      } else if (menuName === 'Products') {
        await this.navigateToProductsSubMenuOption(subMenuName);
      } else {
        await this.navigateToSubMenuOption(menuName, subMenuName);
      }
    } else {
      console.error(`${menuName} menu not found.`);
    }
  }

  async navigateToOrdersSubMenuOption(subMenuName: string) {
    const subMenuLocator = this.ordersSubMenuLocators[subMenuName];
    if (subMenuLocator && (await subMenuLocator.isVisible())) {
      await subMenuLocator.click();
      console.log(`Navigated to Orders submenu option: ${subMenuName}`);
    } else {
      console.error(`Orders submenu option not found: ${subMenuName}`);
    }
  }

  async navigateToProductsSubMenuOption(subMenuName: string) {
    const subMenuLocator = this.productsSubMenuLocators[subMenuName];
    if (subMenuLocator && (await subMenuLocator.isVisible())) {
      await subMenuLocator.click();
      console.log(`Navigated to Products submenu option: ${subMenuName}`);
    } else {
      console.error(`Products submenu option not found: ${subMenuName}`);
    }
  }

  async navigateToSubMenuOption(menuName: string, subMenuName: string) {
    const subMenuLocators: Record<string, Record<string, Locator>> = {
      Customers: this.customersSubMenuLocators,
      Storefront: this.storefrontSubMenuLocators,
      Marketing: this.marketingSubMenuLocators,
      Analytics: this.analyticsSubMenuLocators,
      Apps: this.appsSubMenuLocators,
    };

    const subMenuLocator = subMenuLocators[menuName]?.[subMenuName];
    if (subMenuLocator && (await subMenuLocator.isVisible())) {
      await subMenuLocator.click();
      console.log(`Navigated to ${menuName} submenu option: ${subMenuName}`);
    } else {
      console.error(`${menuName} submenu option not found: ${subMenuName}`);
    }
  }
}