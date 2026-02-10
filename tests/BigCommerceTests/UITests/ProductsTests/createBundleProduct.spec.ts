
import { test } from '../../../../utils/baseTest';
import { expect } from '@playwright/test';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { ExcelReader, TestCase } from '../../../../utils/excelReader';
import { TestConfig } from '../../../../utils/testConfig';
import { AddProductPage } from '../../../../pages/BigCommercePages/Products/addProductPage';

const testConfig = TestConfig.getInstance();
const scenarios = testConfig.getScenarios().filter(s => s.scenario === 'Create Bundle Product');

test.describe('Bundle Product Tests', () => {
    for (const { scenario, sheetName, testCases } of scenarios) {
        test.describe(scenario, () => {
            for (const testCaseName of testCases) {
                test(`Execute: ${testCaseName}`, async ({ baseTest }, testInfo) => {
                    testInfo.annotations.push(
                        { type: 'test-type', description: 'E2E' },
                        { type: 'feature', description: 'Product Creation' }
                    );
                    testInfo.setTimeout(testInfo.timeout + 30000);

                    const page = await baseTest.getPage();
                    await page.bringToFront();
                    const excelReader = ExcelReader.getInstance();
                    let bigcUITestResult = 'Passed';
                    let bigcUIExecutionNotes = '';
                    let failedStep = '';
                    let currentStep = '';
                    let screenshotPath: string | undefined;
                    let testCase: TestCase | undefined = undefined;

                    try {
                        testCase = await excelReader.fetchTestCaseDataByName(testCaseName, sheetName);
                        await excelReader.logStep('Executing Test Case', { 'Name': testCaseName, 'Scenario': scenario });

                        // Step 1: Navigate to Add Product page
                        const homepage = new Homepage(page);
                        currentStep = 'Navigate to Add Product page';
                        await test.step(currentStep, async () => {
                            await homepage.navigateToSideMenuOption('Products', 'Add');
                            await expect(page).toHaveURL(testConfig.getAddProductUrl());
                            await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
                        });

                        // Step 2: Fill Product Details
                        if (!testCase) throw new Error('Test case data not found');
                        const addProductPage = new AddProductPage(page);
                        currentStep = 'Fill Product Details';
                        await test.step(currentStep, async () => {
                            if (!testCase) throw new Error('Test case data not found');
                            await addProductPage.fillProduct(testCase);
                        });

                        // Step 3: Validate Product Creation (by SKU)
                        currentStep = 'Validate Product Creation';
                        await test.step(currentStep, async () => {
                            if (!testCase) throw new Error('Test case data not found');
                            const sku = String(testCase.sku ?? testCase['Product_SKU'] ?? '').trim();
                            if (!sku) throw new Error('SKU not found in test case data');

                            const homepage = new Homepage(page);
                            console.log(' Navigating to All Products page to validate SKU...');

                            // Navigate to All Products
                            await homepage.navigateToSideMenuOption('Products', 'All Products');
                            await page.waitForLoadState('domcontentloaded');
                            await expect(page).toHaveURL(/\/manage\/products/);

                            console.log(`Searching for product SKU: ${sku}`);
                            await addProductPage.verifyProductExistsBySKU(sku);

                            console.log(`Product with SKU "${sku}" verified successfully in All Products list.`);
                        });

                        // Step 4: Capture Screenshot
                        currentStep = 'Capture Screenshot';
                        await test.step(currentStep, async () => {
                            if (testCase) {
                                screenshotPath = await excelReader.captureAndAttachScreenshot(page, testCase, testInfo);
                            }
                        });

                        // Step 5: Record Test Result
                        currentStep = 'Record Test Result';
                        await test.step(currentStep, async () => {
                            if (testCase) {
                                await excelReader.updateBigCProductTestResultWithExpected(
                                    sheetName,
                                    testCaseName,
                                    screenshotPath,
                                    bigcUITestResult,
                                    bigcUIExecutionNotes
                                );
                            }
                        });

                    } catch (err) {
                        bigcUITestResult = 'Failed';
                        failedStep = currentStep;
                        bigcUIExecutionNotes = `Error in step: ${currentStep}\n${err instanceof Error ? err.message : String(err)}`;
                        if (testCase) {
                            screenshotPath = await excelReader.handleTestFailure(
                                sheetName,
                                testCaseName,
                                failedStep,
                                err,
                                page,
                                testCase,
                                'bigcUI'
                            );
                        }
                        throw err;
                    } finally {
                        if (testCase) {
                            await excelReader.logTestSummaryAndRecordResult(
                                testCase,
                                bigcUITestResult,
                                screenshotPath,
                                bigcUIExecutionNotes,
                                sheetName,
                                testCaseName,
                                'bigcUI'
                            );
                        }
                    }
                });
            }
        });
    }
});