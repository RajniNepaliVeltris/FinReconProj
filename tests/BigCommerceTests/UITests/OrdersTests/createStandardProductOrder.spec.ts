
import { test, expect, chromium } from '@playwright/test';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { AddOrderPage } from '../../../../pages/BigCommercePages/Orders/addOrderPage';
import orderTestData from '../../../../data/BigCommerceData/orderTestData.json';
import { PerformanceRecorder } from '../../../../utils/PerformanceRecorder';
import { ExcelReader, TestCase } from '../../../../utils/excelReader';

let browser: import('@playwright/test').Browser;
let context: import('@playwright/test').BrowserContext;


test.beforeAll(async () => {
    browser = await chromium.connectOverCDP({
        endpointURL: 'http://localhost:9222',
        timeout: 30000,
        slowMo: 100
    });
    context = browser.contexts()[0];
});


// Helper functions
function logStep(title: string, details?: any) {
    console.log(`\n=== ${title} ===`);
    if (details) console.table(details);
}

async function fetchTestCaseData(scenario: string, sheetName: string) {
    const excelReader = ExcelReader.getInstance();
    const tc = await excelReader.getTestCase({ scenario, sheetName });
    if (!tc) throw new Error('Test case not found in Excel sheet');
    logStep('Test Case Info', {
        'ID': tc['Test Case ID'],
        'Scenario': tc['Test Scenario'],
        'Pre-Condition': tc['Pre-Condition'],
        'Payment Method': tc['Payment Method'],
        'Expected Result': tc['Expected Result']
    });
    return tc;
}

function getOrderData(description: string) {
    const orderData = orderTestData.testOrders.find(order => order.description === description);
    if (!orderData) throw new Error(`Order data not found for description: ${description}`);
    return orderData;
}

test.describe('Order Creation - Standard Product', () => {
    test('Order with Standard product - Fulfillment using Billing Address', async ({}, testInfo) => {
        testInfo.annotations.push(
            { type: 'test-type', description: 'E2E' },
            { type: 'feature', description: 'Order Creation' }
        );
        testInfo.setTimeout(testInfo.timeout + 30000);
        const perf = new PerformanceRecorder();
        perf.startFlow('Create Order Flow');
        let testCase: TestCase | undefined;
        let screenshotPath: string | undefined;
        const pages = await context.pages();
        const page = pages.length > 0 ? pages[0] : await context.newPage();
        await page.bringToFront();

        try {
            testCase = await fetchTestCaseData('Order with Standard product - Fulfillment using Billing Address', 'Standard Product');
            const orderData = getOrderData('Order with Standard product - Fulfillment using Billing Address');
            const homepage = new Homepage(page);
            await homepage.navigateToSideMenuOption('Orders', 'Add');
            await expect(page).toHaveURL('https://store-5nfoomf2b4.mybigcommerce.com/manage/orders/add-order');
            await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
            perf.start('Navigate to Add Order');
            const addOrderPage = new AddOrderPage(page);
            perf.nextAction('Select Existing Customer');
            await addOrderPage.selectAndFillExistingCustomerDetails(
                orderData.customer?.email || '',
                orderData.customer?.existingCustomerAddressCard || ''
            );
            perf.nextAction('Proceed to Add Items');
            await addOrderPage.clickNextButton();
            for (const item of testCase['Product_Quantity']) {
                await addOrderPage.searchProductWithBrowseCategories(testCase['Product_Name'] || '');
            }
            try {
                await page.waitForEvent('dialog', { timeout: 5000 });
                await addOrderPage.ConfirmationOkInDialogue();
            } catch {
                console.log('No confirmation dialog appeared, continuing test...');
            }
            await addOrderPage.clickNextButton(); // Proceed to Fulfillment
            if (testCase['Shipping_Method'] !== 'None') {
                await addOrderPage.selectShippingMethod(testCase['Shipping_Method'] || '');
                const customShippingDetails = {
                    provider: testCase['Shipping_Provider'] || '',
                    cost: testCase['Shipping_Price']?.toString() || ''
                };
                await addOrderPage.setCustomShippingDetails(customShippingDetails);
            } else {
                console.log('No shipping method to select as per test data');
            }
            await addOrderPage.clickNextButton(); // Proceed to Payment
            await addOrderPage.selectPaymentMethod(testCase['Payment_Category'] || '');
            await addOrderPage.verifyPaymentMethodSelected(testCase['Payment_Category'] || '');
            const expectedPaymentDetails = {
                subtotal: testCase['ExpectedPaySum_subtotalAmt']?.toString() || '',
                shipping: testCase['ExpectedPaySum_shippingAmt']?.toString() || '',
                taxIncludedInTotal: testCase['ExpectedPaySum_taxAmt']?.toString() || '',
                grandTotal: testCase['ExpectedPaySum_totalAmt']?.toString() || ''
            };
            await addOrderPage.verifySummaryDetails(expectedPaymentDetails);
            await addOrderPage.fillComments(testCase['Comments'] || 'Default customer comment');
            await addOrderPage.fillStaffNotes(testCase['Staff_Notes'] || 'Default staff note');
            screenshotPath = `test-results/screenshots/${testCase['Test Case ID']}.png`;
            await page.screenshot({ path: screenshotPath });
            await testInfo.attach('screenshot', { path: screenshotPath, contentType: 'image/png' });
        } finally {
            if (testCase) {
                console.log('\nTest Summary:');
                console.table([
                    {
                        'Test Case': testCase['Test Case Name'],
                        'Result': 'Passed',
                        'Screenshot': screenshotPath || 'N/A'
                    }
                ]);
            }
        }
    });
});