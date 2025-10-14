import { test, expect, chromium } from '@playwright/test';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { AddCustomerPage } from '../../../../pages/BigCommercePages/Customers/addCustomerPage';
import customerTestData from '../../../../data/BigCommerceData/addCustomerData.json';
import { CustomerDetails } from '../../../../pages/BigCommercePages/Customers/customerType';

// Ensure customerTestData is defined and is an array
if (!customerTestData || !Array.isArray(customerTestData)) {
    throw new Error('customerTestData is undefined or not an array. Check the import path and JSON file.');
}


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
        (customerTestData as CustomerDetails[]).forEach((customerData) => {
            test(customerData.description, async () => {
                const pages = await context.pages();
                const page = pages.length > 0 ? pages[0] : await context.newPage();
                await test.step('Bring page to front', async () => {
                    await page.bringToFront();
                });

                const homepage = new Homepage(page);
                await test.step('Navigate to Add Customer page', async () => {
                    await homepage.navigateToSideMenuOption('Customers', 'Add');
                    const url = await page.url();
                    expect(url).toContain('/manage/customers/add');
                });

                const addCustomerPage = new AddCustomerPage(page);
                await test.step('Fill Customer Details', async () => {
                    await addCustomerPage.fillCustomerDetails(customerData as CustomerDetails);
                });

                await test.step('Verify Customer Exists By Email', async () => {
                    await homepage.navigateToSideMenuOption('Customers', 'All customers');
                    const url = await page.url();
                    expect(url).toContain('/manage/customers');
                    await addCustomerPage.verifyCustomerExistsByEmail();
                });
            });
        });
    } else {
        test('Customer test data is not available', async () => {
            throw new Error('customerTestData is undefined or not an array. Check the import path and JSON file.');
        });
    }
});