import { test } from '../../../utils/baseTest';
import { expect, TestInfo } from '@playwright/test';
import { ExcelReader, TestCase } from '../../../utils/excelReader';
import { verifyOrderInDatabase, getBigCConnection } from '../../../utils/db';
import { QueryManager } from '../../../utils/queryManager';
import { TestConfig } from '../../../utils/testConfig';

/*
 * Manual SSMS Query for Order Verification:
 *
 * 1. Connect to BigCommerce Database in SSMS
 * 2. Replace 'YOUR_ORDER_NUMBER_HERE' with actual order number from Excel
 *
 * -- Quick existence check
 * SELECT COUNT(*) as OrderCount
 * FROM [Order]
 * WHERE OrderNumber = 'YOUR_ORDER_NUMBER_HERE';
 *
 * -- Get basic order info
 * SELECT
 *     OrderNumber,
 *     Status AS OrderStatus,
 *     PaymentStatus,
 *     FulfillmentStatus,
 *     Total,
 *     SubmittedDate,
 *     auditinfoCreateDate AS CreatedDate
 * FROM [Order]
 * WHERE OrderNumber = 'YOUR_ORDER_NUMBER_HERE';
 *
 * -- Run the comprehensive query (see queries/bigcommerce-order-queries.sql)
 * -- Replace @OrderNumber parameter with your order number
 */

const testConfig = TestConfig.getInstance();
const scenarios = testConfig.getScenarios();

// Helper function to fetch order data by order number, using an existing connection
async function fetchOrderData(orderNumber: string, connection: any) {
    const request = connection.request();
    request.input('OrderNumber', orderNumber);
    const result = await request.query('SELECT * FROM [Order] WHERE OrderNumber = @OrderNumber');
    if (!result.recordset || result.recordset.length === 0) {
        throw new Error(`No data found for Order ID: ${orderNumber}`);
    }
    return result.recordset[0];
}

// Helper function to validate test execution scenarios
function validateTestExecutionScenario(testCase: TestCase): { isValid: boolean; reason: string } {
    const manualTest = String(testCase['Manual Test'] || '').toLowerCase() === 'true';
    const bigCOrderId = String(testCase['BigC_OrderId'] || '').trim();
    const kiboOrderId = String(testCase['KIBO_OrderId'] || '').trim();

    console.log(`[Scenario Validation] ===== EXCEL VALUES FETCHED =====`);
    console.log(`[Scenario Validation] Manual Test (raw): '${testCase['Manual Test']}'`);
    console.log(`[Scenario Validation] BigC_OrderId (raw): '${testCase['BigC_OrderId']}'`);
    console.log(`[Scenario Validation] KIBO_OrderId (raw): '${testCase['KIBO_OrderId']}'`);

    console.log(`[Scenario Validation] ===== PROCESSED VALUES =====`);
    console.log(`[Scenario Validation] Manual Test (processed): '${testCase['Manual Test']}' -> ${manualTest} (${manualTest ? 'TRUE' : 'FALSE'})`);
    console.log(`[Scenario Validation] BigC_OrderId (processed): '${testCase['BigC_OrderId']}' -> '${bigCOrderId}' (${bigCOrderId ? 'PRESENT' : 'MISSING'})`);
    console.log(`[Scenario Validation] KIBO_OrderId (processed): '${testCase['KIBO_OrderId']}' -> '${kiboOrderId}' (${kiboOrderId ? 'PRESENT' : 'MISSING'})`);

    console.log(`[Scenario Validation] ===== SCENARIO EVALUATION =====`);

    // Scenario 1: Manual Test=false, both BigC and KIBO Order IDs present
    const scenario1Condition1 = !manualTest;
    const scenario1Condition2 = bigCOrderId;
    const scenario1Condition3 = kiboOrderId;
    const scenario1 = scenario1Condition1 && scenario1Condition2 && scenario1Condition3;

    console.log(`[Scenario Validation] SCENARIO 1: Manual Test=false + BigC_OrderId present + KIBO_OrderId present`);
    console.log(`[Scenario Validation]   - Manual Test=false: ${scenario1Condition1} (${scenario1Condition1 ? 'PASS' : 'FAIL'} - Manual Test is ${manualTest ? 'TRUE' : 'FALSE'})`);
    console.log(`[Scenario Validation]   - BigC_OrderId present: ${scenario1Condition2} (${scenario1Condition2 ? 'PASS' : 'FAIL'} - BigC_OrderId is ${bigCOrderId ? `'${bigCOrderId}'` : 'empty'})`);
    console.log(`[Scenario Validation]   - KIBO_OrderId present: ${scenario1Condition3} (${scenario1Condition3 ? 'PASS' : 'FAIL'} - KIBO_OrderId is ${kiboOrderId ? `'${kiboOrderId}'` : 'empty'})`);
    console.log(`[Scenario Validation]   - SCENARIO 1 RESULT: ${scenario1} (${scenario1 ? 'PASS - Can run BigC vs Kibo comparison' : 'FAIL - Missing required data for comparison'})`);

    // Scenario 2: Manual Test=true, BigC Order ID present
    const scenario2Condition1 = manualTest;
    const scenario2Condition2 = bigCOrderId;
    const scenario2 = scenario2Condition1 && scenario2Condition2;

    console.log(`[Scenario Validation] SCENARIO 2: Manual Test=true + BigC_OrderId present`);
    console.log(`[Scenario Validation]   - Manual Test=true: ${scenario2Condition1} (${scenario2Condition1 ? 'PASS' : 'FAIL'} - Manual Test is ${manualTest ? 'TRUE' : 'FALSE'})`);
    console.log(`[Scenario Validation]   - BigC_OrderId present: ${scenario2Condition2} (${scenario2Condition2 ? 'PASS' : 'FAIL'} - BigC_OrderId is ${bigCOrderId ? `'${bigCOrderId}'` : 'empty'})`);
    console.log(`[Scenario Validation]   - SCENARIO 2 RESULT: ${scenario2} (${scenario2 ? 'PASS - Can run BigC-only verification' : 'FAIL - Missing required data'})`);

    console.log(`[Scenario Validation] ===== FINAL DECISION =====`);
    if (scenario1 || scenario2) {
        console.log(`[Scenario Validation] ✅ EXECUTION ALLOWED: Test meets execution criteria`);
        return { isValid: true, reason: '' };
    }

    console.log(`[Scenario Validation] ❌ EXECUTION BLOCKED: Test does not meet any execution criteria`);

    let explanation = 'Test execution blocked because:\n';
    if (!scenario1 && !scenario2) {
        explanation += '  - Neither Scenario 1 nor Scenario 2 conditions are met\n';
    }
    if (!scenario1) {
        const reasons = [];
        if (manualTest) reasons.push('Manual Test is TRUE (should be FALSE for Scenario 1)');
        if (!bigCOrderId) reasons.push('BigC_OrderId is missing');
        if (!kiboOrderId) reasons.push('KIBO_OrderId is missing');
        explanation += `  - Scenario 1 failed: ${reasons.join(', ')}\n`;
    }
    if (!scenario2) {
        const reasons = [];
        if (!manualTest) reasons.push('Manual Test is FALSE (should be TRUE for Scenario 2)');
        if (!bigCOrderId) reasons.push('BigC_OrderId is missing');
        explanation += `  - Scenario 2 failed: ${reasons.join(', ')}\n`;
    }

    return {
        isValid: false,
        reason: explanation.trim()
    };
}

// Helper function for common test setup and validation
async function setupAndValidateTest(testCaseName: string, sheetName: string, test: any): Promise<TestCase> {
    const excelReader = ExcelReader.getInstance();
    const testCase = await excelReader.fetchTestCaseDataByName(testCaseName, sheetName);

    // Check automation flag
    if (!(await excelReader.checkAutomationAndSkipIfNeeded(testCase, sheetName, testCaseName, test))) {
        const errorMsg = 'Test skipped: Automation flag is not set to true';
        console.log(`[Test Setup] Skipping test case due to automation flag: ${testCaseName}`);
        await excelReader.logTestSummaryAndRecordResult(testCase, 'Failed', undefined, errorMsg, sheetName, testCaseName, 'db');
        throw new Error(errorMsg);
    }

    // Check execution scenario
    const scenarioValidation = validateTestExecutionScenario(testCase);
    if (!scenarioValidation.isValid) {
        const errorMsg = `Test skipped: ${scenarioValidation.reason}`;
        console.log(`[Test Setup] Skipping test case ${testCaseName}: ${scenarioValidation.reason}`);
        await excelReader.logTestSummaryAndRecordResult(testCase, 'Failed', undefined, errorMsg, sheetName, testCaseName, 'db');
        throw new Error(errorMsg);
    }

    return testCase;
}

test.describe('Order Database Verification Tests', () => {
    test('Database Connection and Schema Check', async ({}, testInfo) => {
        testInfo.annotations.push(
            { type: 'test-type', description: 'DB Setup' },
            { type: 'feature', description: 'Database Connectivity' }
        );

        console.log('[DB Setup] Checking database connection and query loading...');
        try {
            // Test basic database connectivity with a simple query
            const connection = await getBigCConnection();
            const testResult = await connection.request().query('SELECT 1 as TestConnection');
            console.log('[DB Setup] Database connection successful:', testResult.recordset[0]);

            expect(testResult.recordset[0].TestConnection).toBe(1);

            // Check that queries are loaded
            const queryManager = QueryManager.getInstance();
            const availableQueries = queryManager.listQueries();
            console.log('[DB Setup] Available queries:', availableQueries.length);

            expect(availableQueries.length).toBeGreaterThan(0);
            expect(availableQueries).toContain('comprehensive-order-details');
            console.log('[DB Setup] Query manager loaded successfully');

        } catch (error: any) {
            console.error('[DB Setup] Database connection or query loading failed:', error.message);
            throw error;
        }
    });

    for (const { scenario, sheetName, testCases } of scenarios) {
        test.describe(scenario, () => {
            // Group: Database Verification
            test.describe('DB Verification', () => {
                for (const testCaseName of testCases) {
                    test(`Verify Order in Database: ${testCaseName}`, async ({}, testInfo: TestInfo) => {
                        testInfo.annotations.push(
                            { type: 'test-type', description: 'DB Verification' },
                            { type: 'feature', description: 'Order Verification' }
                        );
                        testInfo.setTimeout(testInfo.timeout + 30000);

                        const excelReader = ExcelReader.getInstance();
                        let testCase: TestCase | undefined;
                        let dbExecutionNotes = '';

                        try {
                            testCase = await setupAndValidateTest(testCaseName, sheetName, test);
                            await excelReader.logStep('Verifying Order in Database', { 'Test Case': testCaseName, 'Scenario': sheetName });

                            const orderId = testCase['BigC_OrderId'];
                            if (!orderId || orderId.trim() === '') {
                                throw new Error('BigC_OrderId not found in Excel sheet. Ensure the order has been created first.');
                            }

                            console.log(`[DB Verification] Verifying order ID: ${orderId} for test case: ${testCaseName}`);
                            const verificationResult = await verifyOrderInDatabase(orderId);

                            if (verificationResult.error) {
                                throw new Error(`Database verification failed: ${verificationResult.error}`);
                            }

                            expect(verificationResult.exists).toBe(true);

                            if (verificationResult.details && verificationResult.details.length > 0) {
                                const firstDetail = verificationResult.details[0];
                                const dbEntityOrderId = firstDetail.EntityOrderId ?? firstDetail.entityorderid ??
                                    firstDetail.OrderNumber ?? firstDetail.OrderId ?? firstDetail.OrderNumber;

                                expect(String(dbEntityOrderId)).toBe(String(orderId));
                            }

                            dbExecutionNotes = `Order ${orderId} successfully verified in BigCommerce database. Found ${verificationResult.details?.length || 0} detail records.`;
                            console.log('[DB Verification] Order verification completed successfully.');

                            await excelReader.logTestSummaryAndRecordResult(testCase, 'Passed', undefined, dbExecutionNotes, sheetName, testCaseName, 'db');

                        } catch (err: any) {
                            dbExecutionNotes = `Failed to verify order in database: ${err.message}`;
                            console.error(`[DB Verification] Test failed: ${err.message}`);

                            if (testCase) {
                                await excelReader.handleTestFailure(sheetName, testCaseName, 'Database Verification', err, undefined, testCase, 'db');
                            }
                            throw err;
                        }
                    });
                }
            });

            // Group: Comparisons (BigC vs Kibo)
            test.describe('Comparisons', () => {
                for (const testCaseName of testCases) {
                    test(`Compare Results for KIBO and BigC Order IDs: ${testCaseName}`, async ({}) => {
                        const excelReader = ExcelReader.getInstance();
                        let testCase: TestCase | undefined;

                        try {
                            testCase = await setupAndValidateTest(testCaseName, sheetName, test);

                            const bigCOrderId = String(testCase['BigC_OrderId'] || '').trim();
                            const kiboOrderId = String(testCase['KIBO_OrderId'] || '').trim();

                            if (!bigCOrderId || !kiboOrderId) {
                                const errorMsg = 'Test skipped: BigC_OrderId or KIBO_OrderId not present in Excel data';
                                console.log(`[Comparison Test] ${errorMsg} for ${testCaseName}`);
                                await excelReader.logTestSummaryAndRecordResult(testCase, 'Failed', undefined, errorMsg, sheetName, testCaseName, 'db');
                                throw new Error(errorMsg);
                            }

                            console.log(`[Comparison Test] Comparing BigC Order ID: ${bigCOrderId} with Kibo Order ID: ${kiboOrderId} for test case: ${testCaseName}`);

                            // Fetch order data using helper function
                            // Fetch order data using helper function and a shared connection
                            const connection = await getBigCConnection();
                            const [bigCData, kiboData] = await Promise.all([
                                fetchOrderData(bigCOrderId, connection),
                                fetchOrderData(kiboOrderId, connection)
                            ]);
                            console.log(`[Comparison Test] Retrieved BigC data: Total=${bigCData.Total}, Status=${bigCData.Status}`);
                            console.log(`[Comparison Test] Retrieved Kibo data: Total=${kiboData.Total}, Status=${kiboData.Status}`);

                            // Perform targeted comparison of key fields
                            const keyFields = [
                                'OrderNumber', 'EntityOrderId', 'Total', 'Status', 'PaymentStatus',
                                'FulfillmentStatus', 'SubTotal', 'TaxTotal', 'ShippingTotal',
                                'CustomerAccountId', 'Email', 'SiteId', 'TenantId'
                            ];

                            const differences: string[] = [];
                            let matchCount = 0;

                            for (const field of keyFields) {
                                const bigCValue = bigCData[field];
                                const kiboValue = kiboData[field];

                                console.log(`[Comparison Test] Comparing field '${field}': BigC='${bigCValue}' vs Kibo='${kiboValue}'`);

                                if (String(bigCValue) !== String(kiboValue)) {
                                    differences.push(`${field}: BigC=${bigCValue}, Kibo=${kiboValue}`);
                                } else {
                                    matchCount++;
                                }
                            }

                            if (differences.length > 0) {
                                const errorMsg = `Order data mismatch for BigC Order ${bigCOrderId} vs Kibo Order ${kiboOrderId}. ` +
                                    `${matchCount}/${keyFields.length} key fields matched. ` +
                                    `Differences: ${differences.join('; ')}`;
                                throw new Error(errorMsg);
                            }

                            const successMsg = `Comparison successful for BigC Order ${bigCOrderId} and Kibo Order ${kiboOrderId} (${matchCount}/${keyFields.length} fields matched)`;
                            console.log(`[Comparison Test] ${successMsg}`);
                            await excelReader.logTestSummaryAndRecordResult(testCase, 'Passed', undefined, successMsg, sheetName, testCaseName, 'db');

                        } catch (err: any) {
                            console.error(`[Comparison Test] Test failed for ${testCaseName}: ${err.message}`);
                            if (testCase) {
                                await excelReader.handleTestFailure(sheetName, testCaseName, 'Comparison', err, undefined, testCase, 'db');
                            }
                            throw err;
                        }
                    });
                }
            });

            // Group: SQL Query Verification
            test.describe('SQL Query Verification', () => {
                for (const testCaseName of testCases) {
                    test(`Execute and Verify All SQL Queries from SQL File: ${testCaseName}`, async ({}, testInfo: TestInfo) => {
                        const excelReader = ExcelReader.getInstance();
                        let testCase: TestCase | undefined;

                        try {
                            testCase = await setupAndValidateTest(testCaseName, sheetName, test);

                            const orderId = testCase['BigC_OrderId'];
                            if (!orderId || orderId.trim() === '') {
                                const errorMsg = 'Test skipped: BigC_OrderId not found in Excel sheet';
                                console.log(`[SQL Test] ${errorMsg} for ${testCaseName}`);
                                await excelReader.logTestSummaryAndRecordResult(testCase, 'Failed', undefined, errorMsg, sheetName, testCaseName, 'db');
                                throw new Error(errorMsg);
                            }

                            const queryManager = QueryManager.getInstance();
                            const queries = [
                                { name: 'fetch-order-by-entityorderid', params: { OrderNumber: orderId }, validator: (result: any) => {
                                    expect(result.length).toBeGreaterThan(0);
                                    expect(String(result[0].OrderNumber)).toBe(String(orderId));
                                }},
                                { name: 'fetch-order-attributes-by-entityorderid', params: { EntityOrderId: orderId }, validator: (result: any) => {
                                    expect(result).toBeDefined();
                                    console.log(`Executed 'fetch-order-attributes-by-entityorderid' for Order ID: ${orderId}. Found ${result.length} attributes.`);
                                }},
                                { name: 'fetch-billing-info-by-entityorderid', params: { EntityOrderId: orderId }, validator: (result: any) => {
                                    expect(result).toBeDefined();
                                    expect(result.length).toBeGreaterThan(0);
                                    expect(String(result[0].entityorderid)).toBe(String(orderId));
                                }},
                                { name: 'fetch-fulfillment-info-by-entityorderid', params: { EntityOrderId: orderId }, validator: (result: any) => {
                                    expect(result).toBeDefined();
                                    expect(result.length).toBeGreaterThan(0);
                                    expect(String(result[0].entityorderid)).toBe(String(orderId));
                                }}
                            ];

                            for (const query of queries) {
                                console.log(`[SQL Test] Executing '${query.name}' for Order ID: ${orderId}`);
                                const result = await queryManager.executeQuery(query.name, query.params);
                                query.validator(result);
                                console.log(`[SQL Test] Verified '${query.name}' for Order ID: ${orderId}`);
                            }

                            console.log(`[SQL Test] All SQL queries executed successfully for test case: ${testCaseName}`);

                        } catch (err: any) {
                            console.error(`[SQL Test] Test failed for ${testCaseName}: ${err.message}`);
                            if (testCase) {
                                await excelReader.handleTestFailure(sheetName, testCaseName, 'SQL Query Verification', err, undefined, testCase, 'db');
                            }
                            throw err;
                        }
                    });
                }
            });
        });
    }
});
