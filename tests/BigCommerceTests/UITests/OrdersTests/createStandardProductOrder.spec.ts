
import { test } from '../../../../utils/baseTest';
import { expect } from '@playwright/test';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { AddOrderPage } from '../../../../pages/BigCommercePages/Orders/addOrderPage';
import { ExcelReader, TestCase } from '../../../../utils/excelReader';
import { TestConfig, Address } from '../../../../utils/testConfig';
import { AllOrdersPage } from '../../../../pages/BigCommercePages/Orders/allOrdersPage';

const testConfig = TestConfig.getInstance();
const scenarios = testConfig.getScenarios().filter(s => s.scenario.includes('Standard product'));

test.describe('Standard Product Order Tests', () => {
    for (const { scenario, sheetName, testCases } of scenarios) {
        test.describe(scenario, () => {
            for (const testCaseName of testCases) {
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
                let bigcUITestResult = 'Passed';
                let bigcUIExecutionNotes = '';
                let failedStep = '';
                let currentStep = '';

                try {
                    testCase = await excelReader.fetchTestCaseDataByName(testCaseName, sheetName, testConfig.productOrderExcelFilePath);

                    // Only execute if Automation is true
                    if (!(await excelReader.checkAutomationAndSkipIfNeeded(testCase, sheetName, testCaseName, test))) {
                        return;
                    }
                    await excelReader.logStep('Executing Test Case', { 'Name': testCaseName, 'Scenario': scenario });
                    const orderData = excelReader.getOrderData(scenario);
                    const homepage = new Homepage(page);
                    currentStep = 'Navigate to Add Order page';
                    await test.step(currentStep, async () => {
                        await homepage.navigateToSideMenuOption('Orders', 'Add');
                        await expect(page).toHaveURL(testConfig.getAddOrderUrl());
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

                        //Only call this method fillSingleShippingAddress if Scenario contains "Fulfillment using New Single Address"
                        if (scenario.includes("Fulfillment using New Single Address")) {
                            if (testCase) {
                                const defaultAddress = testConfig.getDefaultAddress();
                                const address: Address = {
                                    firstName: orderData.address?.firstName || defaultAddress.firstName,
                                    lastName: orderData.address?.lastName || defaultAddress.lastName,
                                    companyName: orderData.address?.companyName || defaultAddress.companyName,
                                    phoneNumber: orderData.address?.phoneNumber || defaultAddress.phoneNumber,
                                    streetAddressLine1: orderData.address?.streetAddressLine1 || defaultAddress.streetAddressLine1,
                                    streetAddressLine2: orderData.address?.streetAddressLine2 || defaultAddress.streetAddressLine2,
                                    city: orderData.address?.city || defaultAddress.city,
                                    state: orderData.address?.state || defaultAddress.state,
                                    country: orderData.address?.country || defaultAddress.country,
                                    zip: orderData.address?.zip || defaultAddress.zip,
                                    poNumber: orderData.address?.PO || defaultAddress.poNumber,
                                    taxID: orderData.address?.taxID || defaultAddress.taxID,
                                    saveaddressCheckbox: orderData.address?.saveToAddressBook || defaultAddress.saveaddressCheckbox
                                };
                                await addOrderPage.fillSingleShippingAddress(address);
                            }
                        }
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
                            if (testCase['Discount Applied'] == "Manual Discount") {
                                await addOrderPage.fillManualDiscount(testCase['Manual_Discount']?.toString() || '');
                            }
                            if (testCase['Coupon Applied'] == "Valid Coupon" || testCase['Coupon Applied'] == "Invalid Coupon") {
                                await addOrderPage.applyCoupon(testCase['Coupon_Code']?.toString() || '');
                            } else {
                                console.log('No coupon to apply as per test data');
                            }
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
                    currentStep = 'Place Order';
                    await test.step(currentStep, async () => {
                        await addOrderPage.placeOrder();
                    });

                    currentStep = 'Verify Order Creation in All Orders Page';
                    await test.step(currentStep, async () => {
                        const allOrdersPage = new AllOrdersPage(page);
                        
                        //await expect(page).toHaveURL(testConfig.getAllOrdersUrl());
                        const orderId = await allOrdersPage.getOrderIdAlertSuccess();
                        console.log('Created Order ID:', orderId);
                        expect(orderId).toBeTruthy();
                        if (!orderId) throw new Error('Order ID not found');
                        // Write the orderId back to Excel
                        await excelReader.updateOrderId(sheetName, testCaseName, orderId);
                    });

                } catch (err: any) {
                    bigcUITestResult = 'Failed';
                    failedStep = currentStep;

                    let failureScreenshotPath: string | undefined;
                    failureScreenshotPath = await excelReader.handleTestFailure(sheetName, testCaseName, currentStep, err, page, testCase, 'bigcUI');

                    throw err; // Re-throw the error to fail the test
                } finally {
                    if (testCase) {
                         await excelReader.logTestSummaryAndRecordResult(testCase, bigcUITestResult, screenshotPath, bigcUIExecutionNotes, sheetName, testCaseName, 'bigcUI');
                    }
                }
                });
            }
        });
    }
});