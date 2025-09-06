import { test, expect, chromium } from '@playwright/test';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { AddOrderPage } from '../../../../pages/BigCommercePages/Orders/addOrderPage';
import orderTestData from '../../../../data/BigCommerceData/orderTestData.json';
import { PerformanceRecorder } from '../../../../utils/PerformanceRecorder';

let browser: import('@playwright/test').Browser;
let context: import('@playwright/test').BrowserContext;

test.beforeAll(async () => {
    // Connect to your existing Chrome instance
    browser = await chromium.connectOverCDP({
        endpointURL: 'http://localhost:9222',
        timeout: 30000,
        slowMo: 100 // Add a small delay for debugging
    });
    // Get the existing context
    const contexts = browser.contexts();
    context = contexts[0];
});

test.afterAll(async () => {
    // Don't close the browser since it's your existing instance
});

// Test: Create a new order with Standard Product for an existing customer

test.describe('Order Creation - Standard Product', () => {
    test('should create a new order with a standard product for an existing customer', async () => {
        const perf = new PerformanceRecorder();
        perf.startFlow('Create Order Flow');
        let html = '';
        try {
            const pages = await context.pages();
            const page = pages.length > 0 ? pages[0] : await context.newPage();
            await test.step('Bring page to front', async () => {
                await page.bringToFront();
            });
            perf.start('Navigate to Add Order');

            const orderData = await test.step('Fetch order data', async () => {
                return orderTestData.testOrders.find(order => order.description === 'Existing customer with Standard Product');
            });
            if (!orderData) {
                throw new Error('Order data not found for description: Existing customer with Standard Product');
            }

            const homepage = new Homepage(page);
            await test.step('Navigate to Add Order page', async () => {
                await homepage.navigateToSideMenuOption('Orders', 'Add');
                await expect(page).toHaveURL('https://store-5nfoomf2b4.mybigcommerce.com/manage/orders/add-order');
                await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
            });

             const addOrderPage = new AddOrderPage(page);
                perf.nextAction('Select Existing Customer');
                await test.step('Select Existing Customer', async () => {
                await addOrderPage.selectAndFillExistingCustomerDetails(
                                    orderData.customer?.email || '',
                                    orderData.customer?.existingCustomerAddressCard || ''
                                    );
                 });
                perf.nextAction('Proceed to Add Items');
                await test.step('Proceed to Add Items', async () => {
                    await addOrderPage.clickNextButton();
                });
            await test.step('Add products to order', async () => {
                for (const item of orderData.items) {
                    //await addOrderPage.searchAndSelectProduct(item.productName);   
                    await addOrderPage.searchProductWithBrowseCategories(item.productName || '');
                }

                await addOrderPage.ConfirmationOkInDialogue();
            });

             await test.step('Proceed to Fulfillment', async () => {
                    await addOrderPage.clickNextButton();
                });
                await test.step('Select Shipping Method', async () => {
                    await addOrderPage.selectShippingMethod(orderData.ShippingMethod || '');
                });
                await test.step('Set Custom Shipping Details', async () => {
                    const customShippingDetails = {
                        method: orderData.shipping.method || '',
                        cost: orderData.shipping.price?.toString() || ''
                    };
                    await addOrderPage.setCustomShippingDetails(customShippingDetails);
                });
                await test.step('Proceed to Payment', async () => {
                    await addOrderPage.clickNextButton();
                });
                await test.step('Select Payment Method & Verify Summary', async () => {
                    await addOrderPage.selectPaymentMethod(orderData.payment.paymentCategory || '');
                    await addOrderPage.verifyPaymentMethodSelected(orderData.payment.paymentCategory || '');
                    await addOrderPage.verifySummaryDetails(orderData.expectedPaymentSummary || {});
                });
                await test.step('Add Comments & Staff Notes', async () => {
                    await addOrderPage.fillComments(orderData.comments || 'Default customer comment');
                    await addOrderPage.fillStaffNotes(orderData.staffNotes || 'Default staff note');
                });
            // Optionally, verify confirmation by checking for a success message or navigation
            // Example: await expect(page.locator('text=Order created successfully')).toBeVisible();
        } finally {
            // Optionally, add performance report generation here
        }
    });
});
