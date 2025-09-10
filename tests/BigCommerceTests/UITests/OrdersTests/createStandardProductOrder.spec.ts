
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
    testCaseNames = [
                    'Standard_FulfillmentusingBillingAddress_CashonDelivery_NoDiscount_NoCoupon',
                    'Standard_FulfillmentusingBillingAddress_CashonDelivery_ManualDiscount_NoCoupon',
                    'Standard_FulfillmentusingBillingAddress_BankDeposit_NoDiscount_NoCoupon',
                    'Standard_FulfillmentusingBillingAddress_BankDeposit_ManualDiscount_NoCoupon',
                    'Standard_FulfillmentusingBillingAddress_Cybersource_NoDiscount_NoCoupon',
                    'Standard_FulfillmentusingBillingAddress_Cybersource_ManualDiscount_NoCoupon'
                    ];
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
                const excelReader = ExcelReader.getInstance();
                let testResult = 'Passed';
                let executionNotes = '';
                let failedStep = '';
                let currentStep = '';

                try {
                    testCase = await fetchTestCaseDataByName(testCaseName, sheetName);
                    // Only execute if Automation is true
                    const automationValue = String(testCase['Automation']).toLowerCase();
                    if (!(automationValue === 'true')) {
                        test.skip(true, `Automation column is not set to true for this test case.`);
                        await excelReader.updateTestResult(sheetName, testCaseName, 'Skipped', 'Automation column not true');
                        return;
                    }
                    // Only execute if scenario matches
                    if (testCase['Test Scenario'] !== scenario) {
                        test.skip(true, `Test scenario does not match: ${testCase['Test Scenario']} !== ${scenario}`);
                        await excelReader.updateTestResult(sheetName, testCaseName, 'Skipped', 'Scenario does not match');
                        return;
                    }
                    logStep('Executing Test Case', { 'Name': testCaseName, 'Scenario': scenario });
                    const orderData = getOrderData(scenario);
                    const homepage = new Homepage(page);
                    currentStep = 'Navigate to Add Order page';
                    await test.step(currentStep, async () => {
                        await homepage.navigateToSideMenuOption('Orders', 'Add');
                        await expect(page).toHaveURL('https://store-5nfoomf2b4.mybigcommerce.com/manage/orders/add-order');
                        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
                        perf.start('Navigate to Add Order');
                    });

                    const addOrderPage = new AddOrderPage(page);

                    currentStep = 'Select Existing Customer';
                    await test.step(currentStep, async () => {
                        perf.nextAction('Select Existing Customer');
                        await addOrderPage.selectAndFillExistingCustomerDetails(
                            orderData.customer?.email || '',
                            orderData.customer?.existingCustomerAddressCard || ''
                        );
                    });

                    currentStep = 'Add Products';
                    await test.step(currentStep, async () => {
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

                    currentStep = 'Proceed to Fulfillment';
                    await test.step(currentStep, async () => {
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

                    currentStep = 'Proceed to Payment';
                    await test.step(currentStep, async () => {
                        await addOrderPage.clickNextButton();
                        if (testCase) {
                            
                            await addOrderPage.selectPaymentMethod(testCase['Payment_Category'] || '');
                            await addOrderPage.verifyPaymentMethodSelected(testCase['Payment_Category'] || '');
                            let cardDetails: any = undefined;
                            if(testCase['Payment_Category'] === "Cybersource") {
                                cardDetails = {
                                    cardHolderName: testCase['CS_CardHolderName'] || '',
                                    cardType: testCase['CS_CardType'] || 'Visa',
                                    cardNumber: testCase['CS_CreditCardNo'] || '',
                                    cardExpiry: testCase['CS_CardExpiryDate(JAN-2025)'] || 'Jan-2025',
                                    cardCVC: testCase['CS_CCV2Value'] || '123'
                                };
                                await addOrderPage.fillCybersourceCardDetails(cardDetails);
                            }
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

                    currentStep = 'Verify Summary and Add Comments';
                    await test.step(currentStep, async () => {
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
                } catch (err: any) {
                    testResult = 'Failed';
                    failedStep = currentStep;
                    executionNotes = `Step: ${failedStep}, Error: ${err?.message || err}`;
                    console.error(`Test failed at step: ${failedStep}`);
                    await excelReader.updateTestResult(sheetName, testCaseName, testResult, executionNotes);
                    throw err;
                } finally {
                    if (testCase) {
                        console.log('\nTest Summary:');
                        console.table([
                            {
                                'Test Case': testCase['Test Case Name'],
                                'Result': testResult,
                                'Screenshot': screenshotPath || 'N/A',
                                'Execution_Notes': executionNotes
                            }
                        ]);
                        // Only write to Excel if we haven't already written in catch block
                        if (testResult === 'Passed') {
                            await excelReader.updateTestResult(sheetName, testCaseName, 'Passed', 'All steps completed successfully');
                        }
                    }
                }
            });
        });
    }
}