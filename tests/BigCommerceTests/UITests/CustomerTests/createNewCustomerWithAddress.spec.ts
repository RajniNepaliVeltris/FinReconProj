import { test, expect, chromium } from '@playwright/test';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { AddCustomerPage } from '../../../../pages/BigCommercePages/Customers/addCustomerPage';
import customerTestData from '../../../../data/BigCommerceData/addCustomerData.json';
import { CustomerDetails } from '../../../../pages/BigCommercePages/Customers/customerType';

// Ensure customerTestData is defined and is an array
if (!customerTestData || !Array.isArray(customerTestData)) {
    throw new Error('customerTestData is undefined or not an array. Check the import path and JSON file.');
}

type AddressData = {
    firstName: string;
    lastName: string;
    companyName?: string;
    phone?: string;
    street: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    type: string;
    poNumber?: string;
    taxId?: string;
};
// Type definition for customer data
type CustomerData = {
    description: string;
    originChannel?: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    email: string;
    customerGroup?: string;
    phone?: string;
    storeCredit?: string;
    receiveACSEmails?: string;
    forcePasswordReset?: string;
    taxExemptCode?: string;
    lineOfCredit?: string;
    paymentTerms?: string;
    password: string;
    confirmPassword: string;
    address?: AddressData;
};

let browser: import('@playwright/test').Browser;
let context: import('@playwright/test').BrowserContext;

test.beforeAll(async () => {
    browser = await chromium.connectOverCDP({
        endpointURL: 'http://localhost:9222',
        timeout: 30000,
        slowMo: 100
    });
    const contexts = browser.contexts();
    context = contexts[0];
});

test.afterAll(async () => {
    // Do not close the browser
});

test.describe('Create New Customer With Address', () => {
    if (Array.isArray(customerTestData)) {
        (customerTestData as CustomerData[]).forEach((customerData) => {
            test(customerData.description, async () => {
                const pages = await context.pages();
                const page = pages.length > 0 ? pages[0] : await context.newPage();
                await test.step('Bring page to front', async () => {
                    await page.bringToFront();
                });

                const homepage = new Homepage(page);
                await test.step('Navigate to Add Customer page', async () => {
                    await homepage.navigateToSideMenuOption('Customers', 'Add');
                    await expect(page).toHaveURL('https://store-5nfoomf2b4.mybigcommerce.com/manage/customers/add');
                    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
                });

                const addCustomerPage = new AddCustomerPage(page);
                await test.step('Fill Customer Details', async () => {
                    customerData.email = addCustomerPage.getNextEmail();
                    await addCustomerPage.fillCustomerDetails(customerData as CustomerDetails);
                });

                await test.step('Verify Customer', async () => {
                    await homepage.navigateToSideMenuOption('Customers', 'All Customers');
                    await expect(page).toHaveURL('https://store-5nfoomf2b4.mybigcommerce.com/manage/customers');
                    await addCustomerPage.clickAllCustomers(customerData as CustomerDetails);
                });
            });
        });
    } else {
        test('Customer test data is not available', async () => {
            throw new Error('customerTestData is undefined or not an array. Check the import path and JSON file.');
        });
    }
});