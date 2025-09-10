
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

async function fetchTestCaseDataByName(testCaseName: string, sheetName: string) {
    const excelReader = ExcelReader.getInstance();
    const allCases = await excelReader.getAllTestCases(sheetName);
    const tc = allCases.find(tc => tc['Test Case Name'] === testCaseName);
    if (!tc) throw new Error(`Test case '${testCaseName}' not found in Excel sheet '${sheetName}'`);
    logStep('Test Case Info', {
        'ID': tc['Test Case ID'],
        'Name': tc['Test Case Name'],
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



// Allow specifying scenarios to run via environment variable
// Usage: set SCENARIOS="Order with Standard product - Fulfillment using Billing Address:Standard Product,Another Scenario:Sheet Name"
const envScenarios = process.env.SCENARIOS;
let scenarios: { scenario: string, sheetName: string }[] = [];
if (envScenarios) {
    scenarios = envScenarios.split(',').map(pair => {
        const [scenario, sheetName] = pair.split(':');
        return { scenario: scenario.trim(), sheetName: (sheetName || '').trim() };
    });
} else {
    // Default: only run the main scenario
    scenarios = [
        { scenario: 'Order with Standard product - Fulfillment using Billing Address', sheetName: 'Standard Product' }
    ];
}


// Usage: set TESTCASE_NAMES="TC-001,TC-002" (where TC-001 is the Test Case Name in Excel)
const envTestCaseNames = process.env.TESTCASE_NAMES;
let testCaseNames: string[] = [
    //NoCoupon
    'Standard_FulfillmentusingBillingAddress_CashonDelivery_NoDiscount_NoCoupon',
    'Standard_FulfillmentusingBillingAddress_CashonDelivery_ManualDiscount_NoCoupon',
    'Standard_FulfillmentusingBillingAddress_BankDeposit_NoDiscount_NoCoupon',
    'Standard_FulfillmentusingBillingAddress_BankDeposit_ManualDiscount_NoCoupon',
    'Standard_FulfillmentusingBillingAddress_Cybersource_NoDiscount_NoCoupon',
    'Standard_FulfillmentusingBillingAddress_Cybersource_ManualDiscount_NoCoupon',
    'Standard_FulfillmentusingBillingAddress_ManualPayment_NoDiscount_NoCoupon',
    'Standard_FulfillmentusingBillingAddress_ManualPayment_ManualDiscount_NoCoupon'
];
if (envTestCaseNames) {
    testCaseNames = envTestCaseNames.split(',').map(tc => tc.trim());
} else {
    // Default: only run one test case
    testCaseNames = ['Standard_FulfillmentusingBillingAddress_CashonDelivery_NoDiscount_NoCoupon',
        'Standard_FulfillmentusingBillingAddress_CashonDelivery_ManualDiscount_NoCoupon'];
}

for (const { scenario, sheetName } of scenarios) {
    for (const testCaseName of testCaseNames) {
        test.describe(scenario, () => {
            test(`Execute: ${testCaseName}`, async ({ }, testInfo) => {
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
                    testCase = await fetchTestCaseDataByName(testCaseName, sheetName);
                    // Only execute if scenario matches
                    if (testCase['Test Scenario'] !== scenario) {
                        test.skip(true, `Test scenario does not match: ${testCase['Test Scenario']} !== ${scenario}`);
                        return;
                    }
                    else{
                        logStep('Executing Test Case', { 'Name': testCaseName, 'Scenario': scenario });
                    }
                    const orderData = getOrderData(scenario);
                    const homepage = new Homepage(page);
                    await test.step('Navigate to Add Order page', async () => {
                        await homepage.navigateToSideMenuOption('Orders', 'Add');
                        await expect(page).toHaveURL('https://store-5nfoomf2b4.mybigcommerce.com/manage/orders/add-order');
                        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
                        perf.start('Navigate to Add Order');
                    });

                    const addOrderPage = new AddOrderPage(page);

                    await test.step('Select Existing Customer', async () => {
                        perf.nextAction('Select Existing Customer');
                        await addOrderPage.selectAndFillExistingCustomerDetails(
                            orderData.customer?.email || '',
                            orderData.customer?.existingCustomerAddressCard || ''
                        );
                    });

                    await test.step('Add Products', async () => {
                        perf.nextAction('Proceed to Add Items');
                        await addOrderPage.clickNextButton();
                        if (testCase) {
                            for (const item of testCase['Product_Quantity']) {
                                await addOrderPage.searchProductWithBrowseCategories(testCase['Product_Name'] || '');
                            }
                        }
                        try {
                            await page.waitForEvent('dialog', { timeout: 5000 });
                            await addOrderPage.ConfirmationOkInDialogue();
                        } catch {
                            console.log('No confirmation dialog appeared, continuing test...');
                        }
                    });

                    await test.step('Proceed to Fulfillment', async () => {
                        await addOrderPage.clickNextButton();
                        if (testCase && testCase['Shipping_Method'] !== 'None') {
                            await addOrderPage.selectShippingMethod(testCase['Shipping_Method'] || '');
                            const customShippingDetails = {
                                provider: testCase['Shipping_Provider'] || '',
                                cost: testCase['Shipping_Price']?.toString() || ''
                            };
                            await addOrderPage.setCustomShippingDetails(customShippingDetails);
                        } else {
                            console.log('No shipping method to select as per test data');
                        }
                    });

                    await test.step('Proceed to Payment', async () => {
                        await addOrderPage.clickNextButton();
                        if (testCase) {
                            await addOrderPage.selectPaymentMethod(testCase['Payment_Category'] || '');
                            await addOrderPage.verifyPaymentMethodSelected(testCase['Payment_Category'] || '');
                            if (testCase['Discount Applied']== "Manual Discount") {
                                await addOrderPage.fillManualDiscount(testCase['Manual_Discount']?.toString() || '');
                            }
                            if (testCase['Coupon Applied']== "Valid Coupon" || testCase['Coupon Applied']== "Invalid Coupon") {
                                await addOrderPage.applyCoupon(testCase['Coupon_Code']?.toString() || '');
                            }else {
                                console.log('No coupon to apply as per test data');
                            }
                        }

                    });

                    await test.step('Verify Summary and Add Comments', async () => {
                        if (testCase) {
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
                        }
                    });
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
    }
}