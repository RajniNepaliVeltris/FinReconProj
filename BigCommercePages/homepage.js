"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Homepage = void 0;
// This file represents the homepage functionality for BigCommerce.
class Homepage {
    constructor(page) {
        // Initialize homepage elements
        this.page = page;
        this.searchInputLocator = page.locator("//input[@aria-label='Search']");
    }
    getSideMenuLocator(SideMenuOption) {
        // Parameterized function to generate side menu locators
        return this.page.locator(`//li[@role='menuitem']//div[text()='${SideMenuOption}']`);
    }
    getOrdersSubMenuLocator(subMenuOption) {
        // Fixed XPath pattern for Orders submenu locators
        return this.page.locator(`//div[text()='Orders']//..//..//..//a[contains(@href,'/manage/orders${subMenuOption}')]`);
    }
    isMenuExpanded(menuName) {
        return __awaiter(this, void 0, void 0, function* () {
            const expandButtonLocator = this.page.locator(`//div[text()='${menuName}']//..//..//button[@aria-label='Expand']`);
            return expandButtonLocator.isVisible();
        });
    }
    navigateOrdersMenuOptions(subMenuOption) {
        return __awaiter(this, void 0, void 0, function* () {
            const subMenuLocator = this.getOrdersSubMenuLocator(subMenuOption);
            if (yield subMenuLocator.isVisible()) {
                yield subMenuLocator.click();
                console.log(`Navigated to Orders submenu option: ${subMenuOption}`);
            }
            else {
                console.error(`Orders submenu option not found: ${subMenuOption}`);
            }
        });
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
    navigateAndVerifyMenuSideMenuOption(pageName, subMenuOption) {
        return __awaiter(this, void 0, void 0, function* () {
            const sideMenuPaths = {
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
            if (!(yield this.isMenuExpanded(pageName))) {
                console.log(`${pageName} menu is collapsed. Expanding...`);
                yield this.getSideMenuLocator(pageName).click();
            }
            if (pageName === 'Orders' && subMenuOption) {
                yield this.navigateOrdersMenuOptions(subMenuOption);
            }
            else {
                const sideMenuLocator = this.getSideMenuLocator(pageName);
                if (yield sideMenuLocator.isVisible()) {
                    yield sideMenuLocator.click();
                    console.log(`Navigated to ${pageName} menu.`);
                }
                else {
                    console.error(`${pageName} menu not found.`);
                    return;
                }
            }
            const currentUrl = yield this.page.url();
            if (currentUrl.includes(expectedUrlContains)) {
                console.log(`Successfully navigated to ${pageName}. URL contains: ${expectedUrlContains}`);
            }
            else {
                console.error(`URL mismatch for ${pageName}. Expected to contain: ${expectedUrlContains}, Found: ${currentUrl}`);
            }
        });
    }
    navigateAndVerifyOrdersMenuOption(subMenuOption) {
        return __awaiter(this, void 0, void 0, function* () {
            const subMenuPaths = {
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
            if (!(yield this.isMenuExpanded('Orders'))) {
                console.log('Orders menu is collapsed. Expanding...');
                yield this.getSideMenuLocator('Orders').click();
            }
            const subMenuLocator = this.getOrdersSubMenuLocator(expectedUrlContains);
            if (yield subMenuLocator.isVisible()) {
                yield subMenuLocator.click();
                console.log(`Navigated to Orders submenu option: ${subMenuOption}`);
            }
            else {
                console.error(`Orders submenu option not found: ${subMenuOption}`);
                return;
            }
            const currentUrl = yield this.page.url();
            if (currentUrl.includes(expectedUrlContains)) {
                console.log(`Successfully navigated to Orders submenu option: ${subMenuOption}. URL contains: ${expectedUrlContains}`);
            }
            else {
                console.error(`URL mismatch for Orders submenu option: ${subMenuOption}. Expected to contain: ${expectedUrlContains}, Found: ${currentUrl}`);
            }
        });
    }
    search(query) {
        // Code to interact with the search input field
        this.searchInputLocator.fill(query);
        console.log(`Searching for: ${query}`);
    }
}
exports.Homepage = Homepage;
