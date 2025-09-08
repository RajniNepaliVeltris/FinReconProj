import { test, expect, chromium } from '@playwright/test';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { AddOrderPage } from '../../../../pages/BigCommercePages/Orders/addOrderPage';
import orderTestData from '../../../../data/BigCommerceData/orderTestData.json';
import { PerformanceRecorder } from '../../../../utils/PerformanceRecorder';
import { ExcelReader, TestCase } from '../../../../utils/excelReader';

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
    test('Order with Standard product - Fulfillment using Billing Address', async ({ page }, testInfo) => {
        // Add test metadata
        testInfo.annotations.push(
            { type: 'test-type', description: 'E2E' },
            { type: 'feature', description: 'Order Creation' }
        );
        testInfo.setTimeout(testInfo.timeout + 30000);
        const perf = new PerformanceRecorder();
        perf.startFlow('Create Order Flow');
        let html = '';
        let testCase: TestCase | undefined;
        let screenshotPath: string | undefined;
        try {
            const pages = await context.pages();
            const page = pages.length > 0 ? pages[0] : await context.newPage();
            await test.step('Bring page to front', async () => {
                await page.bringToFront();
            });

            testCase = await test.step('Fetch test case data from Excel', async () => {
                testInfo.annotations.push({ type: 'test-data', description: 'Excel Test Case' });
                const excelReader = ExcelReader.getInstance();
                const tc = await excelReader.getTestCase({ scenario: 'Order with Standard product - Fulfillment using Billing Address', sheetName: 'Standard Product' });
                if (!tc) {
                    throw new Error('Test case not found in Excel sheet');
                }
                // Structured logging for test case info
                function logStep(title: string, details?: any) {
                    console.log(`\n=== ${title} ===`);
                    if (details) console.table(details);
                }
                logStep('Test Case Info', {
                    'ID': tc['Test Case ID'],
                    'Scenario': tc['Test Scenario'],
                    'Pre-Condition': tc['Pre-Condition'],
                    'Payment Method': tc['Payment Method'],
                    'Expected Result': tc['Expected Result']
                });
               
            
            const orderData = await test.step('Fetch order data', async () => {
                return orderTestData.testOrders.find(order => order.description === 'Order with Standard product - Fulfillment using Billing Address');
            });
            if (!orderData) {
                throw new Error('Order data not found for description: Order with Standard product - Fulfillment using Billing Address');
            }


            // Fetch test case data from Standard Product sheet
            const homepage = new Homepage(page);
            await test.step('Navigate to Add Order page', async () => {
                await homepage.navigateToSideMenuOption('Orders', 'Add');
                await expect(page).toHaveURL('https://store-5nfoomf2b4.mybigcommerce.com/manage/orders/add-order');
                await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
            });
            perf.start('Navigate to Add Order');
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
                for (const item of tc['Product_Quantity']) {
                    //await addOrderPage.searchAndSelectProduct(item.productName);   
                    await addOrderPage.searchProductWithBrowseCategories(tc['Product_Name'] || '');
                }

                try {
                await page.waitForEvent('dialog', { timeout: 5000 });
                await addOrderPage.ConfirmationOkInDialogue();
            } catch (error) {
                console.log('No confirmation dialog appeared, continuing test...');
            }
            });

            await test.step('Proceed to Fulfillment', async () => {
                await addOrderPage.clickNextButton();
            });
            await test.step('Select Shipping Method', async () => {
                if (tc['Shipping_Method'] !== 'None') {
                    await addOrderPage.selectShippingMethod(tc['Shipping_Method'] || '');
                    await test.step('Set Custom Shipping Details', async () => {
                        const customShippingDetails = {
                            provider: tc['Shipping_Provider'] || '',
                            cost: tc['Shipping_Price']?.toString() || ''
                        };
                        await addOrderPage.setCustomShippingDetails(customShippingDetails);
                    });
                } else {
                    console.log('No shipping method to select as per test data');
                }
            });

            await test.step('Proceed to Payment', async () => {
                await addOrderPage.clickNextButton();
            });
            await test.step('Select Payment Method & Verify Summary', async () => {
                await addOrderPage.selectPaymentMethod(tc['Payment_Category']|| '');
                await addOrderPage.verifyPaymentMethodSelected(tc['Payment_Category'] || '');

                const expectedPaymentDetails = {
                            subtotal: tc['ExpectedPaySum_subtotalAmt']?.toString() || '',
                            shipping: tc['ExpectedPaySum_shippingAmt']?.toString() || '',
                            taxIncludedInTotal: tc['ExpectedPaySum_taxAmt']?.toString() || '',
                            grandTotal: tc['ExpectedPaySum_totalAmt']?.toString() || ''
                        };
                await addOrderPage.verifySummaryDetails(expectedPaymentDetails);
            });
            await test.step('Add Comments & Staff Notes', async () => {
                await addOrderPage.fillComments(tc['Comments'] || 'Default customer comment');
                await addOrderPage.fillStaffNotes(tc['Staff_Notes'] || 'Default staff note');
            });
                screenshotPath = `test-results/screenshots/${tc['Test Case ID']}.png`;
                await page.screenshot({ path: screenshotPath });
                await test.info().attach('screenshot', { path: screenshotPath, contentType: 'image/png' });
                return tc;
            });
        } finally {
            // Print summary table at the end
            if (testCase) {
                console.log('\nTest Summary:');
                console.table([
                    {
                        'Test Case': testCase['Test Case Name'],
                        'Result': 'Passed', // You can set this dynamically
                        'Screenshot': screenshotPath || 'N/A'
                    }
                ]);
            }
            // Optionally, add performance report generation here
        }
    });
});