
import { test } from '../../../../utils/baseTest';
import { expect } from '@playwright/test';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { AddOrderPage } from '../../../../pages/BigCommercePages/Orders/addOrderPage';
import { ExcelReader, TestCase } from '../../../../utils/excelReader';
import { TestConfig } from '../../../../utils/testConfig';

const testConfig = TestConfig.getInstance();
const scenarios = testConfig.getScenarios();
const testCaseNames = testConfig.getTestCaseNames();

for (const { scenario, sheetName } of scenarios) {
    for (const testCaseName of testCaseNames) {
        test.describe(scenario, () => {
            test(`Execute: ${testCaseName}`, async ({ baseTest }, testInfo) => {
                testInfo.annotations.push(
                    { type: 'test-type', description: 'E2E' },
                    { type: 'feature', description: 'Order Creation' }
                );
                testInfo.setTimeout(testInfo.timeout + 30000);
                let testCase: TestCase | undefined;
                let screenshotPath: string | undefined;
                const page = await baseTest.getPage();
                await page.bringToFront();
                const excelReader = ExcelReader.getInstance();
                let testResult = 'Passed';
                let executionNotes = '';
                let failedStep = '';
                let currentStep = '';

                try {
                    testCase = await excelReader.fetchTestCaseDataByName(testCaseName, sheetName);
                    // Only execute if Automation is true
                    if (!(await excelReader.checkAutomationAndSkipIfNeeded(testCase, sheetName, testCaseName, test))) {
                        return;
                    }
                    // Only execute if scenario matches
                    if (testCase['Test Scenario'] !== scenario) {
                        test.skip(true, `Test scenario does not match: ${testCase['Test Scenario']} !== ${scenario}`);
                        await excelReader.updateTestResult(sheetName, testCaseName, 'Skipped', 'Scenario does not match');
                        return;
                    }
                    await excelReader.logStep('Executing Test Case', { 'Name': testCaseName, 'Scenario': scenario });
                    const orderData = excelReader.getOrderData(scenario);
                    const homepage = new Homepage(page);
                    currentStep = 'Navigate to Add Order page';
                    await test.step(currentStep, async () => {
                        await homepage.navigateToSideMenuOption('Orders', 'Add');
                        await expect(page).toHaveURL('https://store-5nfoomf2b4.mybigcommerce.com/manage/orders/add-order');
                        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
                    });

                    const addOrderPage = new AddOrderPage(page);

                    currentStep = 'Select Existing Customer';
                    await test.step(currentStep, async () => {
                        await addOrderPage.selectAndFillExistingCustomerDetails(
                            orderData.customer?.email || '',
                            orderData.customer?.existingCustomerAddressCard || ''
                        );
                    });

                    currentStep = 'Add Products';
                    await test.step(currentStep, async () => {
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
                            if (testCase['Payment_Category'] === "Cybersource") {
                                cardDetails = {
                                    cardHolderName: testCase['CS_CardHolderName'] || '',
                                    cardType: testCase['CS_CardType'] || 'Visa',
                                    cardNumber: testCase['CS_CreditCardNo'] || '',
                                    cardExpiry: testCase['CS_CardExpiryDate(JAN-2025)'] || 'Jan-2025',
                                    cardCVC: testCase['CS_CCV2Value'] || '123'
                                };
                                await addOrderPage.fillCybersourceCardDetails(cardDetails);
                            }
                            if (testCase['Discount Applied'] == "Manual Discount") {
                                await addOrderPage.fillManualDiscount(testCase['Manual_Discount']?.toString() || '');
                            }
                            if (testCase['Coupon Applied'] == "Valid Coupon" || testCase['Coupon Applied'] == "Invalid Coupon") {
                                await addOrderPage.applyCoupon(testCase['Coupon_Code']?.toString() || '');
                            } else {
                                console.log('No coupon to apply as per test data');
                            }
                        }
                    });

                    currentStep = 'Verify Payment Summary and Add Comments & Staff Notes';
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
                            screenshotPath = await excelReader.captureAndAttachScreenshot(page, testCase, testInfo);
                        }
                    });
                } catch (err: any) {
                    testResult = 'Failed';
                    failedStep = currentStep;

                    let failureScreenshotPath: string | undefined;
                    failureScreenshotPath = await excelReader.handleTestFailure(sheetName, testCaseName, currentStep, err, page, testCase);

                    throw err; // Re-throw the error to fail the test
                } finally {
                    if (testCase) {
                        await excelReader.logTestSummaryAndRecordResult(testCase, testResult, screenshotPath, executionNotes, sheetName, testCaseName);
                    }
                }
            });
        });
    }
}