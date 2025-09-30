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

// Helper function to fetch order data by order number
async function fetchOrderData(orderNumber: string) {
    const connection = await getBigCConnection();
    const request = connection.request();
    request.input('OrderNumber', orderNumber);
    const result = await request.query('SELECT * FROM [Order] WHERE OrderNumber = @OrderNumber');
    if (!result.recordset || result.recordset.length === 0) {
        throw new Error(`No data found for Order ID: ${orderNumber}`);
    }
    return result.recordset[0];
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
                    let testCase: TestCase | undefined;
                    const excelReader = ExcelReader.getInstance();
                    let dbTestResult = 'Passed';
                    let dbExecutionNotes = '';
                    let failedStep = '';

                    try {
                        const excelReader = ExcelReader.getInstance();
                        testCase = await excelReader.fetchTestCaseDataByName(testCaseName, sheetName);

                        // Only execute if Automation is true
                        if (!(await excelReader.checkAutomationAndSkipIfNeeded(testCase, sheetName, testCaseName, test))) {
                            console.log(`[DB Test Setup] Skipping test case due to automation flag: ${testCaseName}`);
                            await excelReader.logTestSummaryAndRecordResult(testCase, 'Failed', undefined, 'Test skipped: Automation flag is not set to true', sheetName, testCaseName, 'db');
                            throw new Error('Test skipped: Automation flag is not set to true');
                        }

                        await excelReader.logStep('Verifying Order in Database', { 'Test Case': testCaseName, 'Scenario': sheetName });
                        console.log(`[DB Test Setup] Setup complete for test case: ${testCaseName}`);

                        // Check execution criteria for database tests
                        const manualTest = String(testCase['Manual Test'] || '').toLowerCase() === 'true';
                        const bigCOrderId = String(testCase['BigC_OrderId'] || '').trim();
                        const kiboOrderId = String(testCase['KIBO_OrderId'] || '').trim();

                        // Scenario 1: Automation=true, Manual Test=false, both BigC and KIBO Order IDs present
                        const scenario1 = !manualTest && bigCOrderId && kiboOrderId;
                        
                        // Scenario 2: Automation=true, Manual Test=true, BigC Order ID present
                        const scenario2 = manualTest && bigCOrderId;

                        if (!scenario1 && !scenario2) {
                            console.log(`[DB Verification] Skipping test case ${testCaseName}: Does not match execution criteria (Scenario 1: Manual=false + both IDs, or Scenario 2: Manual=true + BigC ID)`);
                            dbTestResult = 'Failed';
                            dbExecutionNotes = 'Test skipped: Does not match execution criteria (Scenario 1: Manual=false + both IDs, or Scenario 2: Manual=true + BigC ID)';
                            throw new Error('Test skipped: Does not match execution criteria');
                        }

                        const orderId = testCase['BigC_OrderId'];
                        if (!orderId || orderId.trim() === '') {
                            throw new Error('BigC_OrderId not found in Excel sheet. Ensure the order has been created first.');
                        }
                        console.log(`[DB Verification] Verifying order ID: ${orderId} for test case: ${testCaseName}`);

                        const verificationResult = await verifyOrderInDatabase(orderId);
                        console.log(`[DB Verification] Verification result: exists=${verificationResult.exists}, details count=${verificationResult.details?.length || 0}`);

                        if (verificationResult.error) {
                            console.error(`[DB Verification] Database verification failed: ${verificationResult.error}`);
                            throw new Error(`Database verification failed: ${verificationResult.error}`);
                        }

                        expect(verificationResult.exists).toBe(true);

                        if (verificationResult.details && verificationResult.details.length > 0) {
                            console.log(`[DB Verification] Order ${orderId} found with ${verificationResult.details.length} detail records`);

                            const firstDetail = verificationResult.details[0];
                            console.log(`[DB Verification] First detail keys: ${Object.keys(firstDetail).join(', ')}`);

                            const dbEntityOrderId = firstDetail.EntityOrderId ?? firstDetail.entityorderid ?? firstDetail.OrderNumber ?? firstDetail.OrderId ?? firstDetail.OrderNumber;
                            console.log(`[DB Verification] Comparing DB EntityOrderId: '${dbEntityOrderId}' (type: ${typeof dbEntityOrderId}) with expected: '${orderId}' (type: ${typeof orderId})`);

                            // Coerce both sides to string for a safe, type-insensitive comparison
                            expect(String(dbEntityOrderId)).toBe(String(orderId));
                            console.log(`[DB Verification] Order ID match confirmed`);
                        }

                        console.log('[DB Verification] Order verification completed successfully.');
                        dbExecutionNotes = `Order ${orderId} successfully verified in BigCommerce database. Found ${verificationResult.details?.length || 0} detail records.`;

                    } catch (err: any) {
                        dbTestResult = 'Failed';
                        failedStep = 'Database Verification';
                        console.error(`[DB Verification] Test failed at step: ${failedStep}, error: ${err.message}`);
                        dbExecutionNotes = `Failed to verify order in database: ${err.message}`;

                        await excelReader.handleTestFailure(sheetName, testCaseName, failedStep, err, undefined, testCase, 'db');

                        throw err;
                    } finally {
                        if (testCase) {
                            console.log(`[DB Verification] Recording test result: ${dbTestResult} for test case: ${testCaseName}`);
                            await excelReader.logTestSummaryAndRecordResult(testCase, dbTestResult, undefined, dbExecutionNotes, sheetName, testCaseName, 'db');
                        }
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
                            testCase = await excelReader.fetchTestCaseDataByName(testCaseName, sheetName);

                            // Only execute if Automation is true
                            if (!(await excelReader.checkAutomationAndSkipIfNeeded(testCase, sheetName, testCaseName, test))) {
                                console.log(`[Comparison Test Setup] Skipping test case due to automation flag: ${testCaseName}`);
                                await excelReader.logTestSummaryAndRecordResult(testCase, 'Failed', undefined, 'Test skipped: Automation flag is not set to true', sheetName, testCaseName, 'db');
                                throw new Error('Test skipped: Automation flag is not set to true');
                            }

                            // Check execution criteria for database tests
                            const manualTest = String(testCase['Manual Test'] || '').toLowerCase() === 'true';
                            const bigCOrderId = String(testCase['BigC_OrderId'] || '').trim();
                            const kiboOrderId = String(testCase['KIBO_OrderId'] || '').trim();

                            // Scenario 1: Automation=true, Manual Test=false, both BigC and KIBO Order IDs present
                            const scenario1 = !manualTest && bigCOrderId && kiboOrderId;
                            
                            // Scenario 2: Automation=true, Manual Test=true, BigC Order ID present
                            const scenario2 = manualTest && bigCOrderId;

                            if (!scenario1 && !scenario2) {
                                console.log(`[Comparison Test] Skipping test case ${testCaseName}: Does not match execution criteria`);
                                await excelReader.logTestSummaryAndRecordResult(testCase, 'Failed', undefined, 'Test skipped: Does not match execution criteria (Scenario 1: Manual=false + both IDs, or Scenario 2: Manual=true + BigC ID)', sheetName, testCaseName, 'db');
                                throw new Error('Test skipped: Does not match execution criteria');
                            }

                            const bigOrderId = bigCOrderId;
                            const kiboOrderIdFinal = kiboOrderId;

                            if (!bigOrderId.trim() || !kiboOrderIdFinal.trim()) {
                                console.log(`[Comparison Test] Skipping test case ${testCaseName}: BigC_OrderId or KIBO_OrderId not present`);
                                await excelReader.logTestSummaryAndRecordResult(testCase, 'Failed', undefined, 'Test skipped: BigC_OrderId or KIBO_OrderId not present in Excel data', sheetName, testCaseName, 'db');
                                throw new Error('Test skipped: BigC_OrderId or KIBO_OrderId not present in Excel data');
                            }

                            console.log(`[Comparison Test] Comparing BigC Order ID: ${bigOrderId} with Kibo Order ID: ${kiboOrderId} for test case: ${testCaseName}`);

                            // Fetch order data using helper function
                            const bigCData = await fetchOrderData(bigOrderId);
                            console.log(`[Comparison Test] Retrieved BigC data: Total=${bigCData.Total}, Status=${bigCData.Status}`);

                            const kiboData = await fetchOrderData(kiboOrderId);
                            console.log(`[Comparison Test] Retrieved Kibo data: Total=${kiboData.Total}, Status=${kiboData.Status}`);

                            // Perform targeted comparison of key fields instead of full object comparison
                            const keyFields = [
                                'OrderNumber', 'EntityOrderId', 'Total', 'Status', 'PaymentStatus', 
                                'FulfillmentStatus', 'SubTotal', 'TaxTotal', 'ShippingTotal',
                                'CustomerAccountId', 'Email', 'SiteId', 'TenantId'
                            ];

                            const differences: string[] = [];
                            let matchCount = 0;
                            let totalFields = 0;

                            for (const field of keyFields) {
                                totalFields++;
                                const bigCValue = bigCData[field];
                                const kiboValue = kiboData[field];
                                
                                if (String(bigCValue) !== String(kiboValue)) {
                                    differences.push(`${field}: BigC=${bigCValue}, Kibo=${kiboValue}`);
                                } else {
                                    matchCount++;
                                }
                            }

                            if (differences.length > 0) {
                                const errorMsg = `Order data mismatch for BigC Order ${bigOrderId} vs Kibo Order ${kiboOrderId}. ` +
                                    `${matchCount}/${totalFields} key fields matched. ` +
                                    `Differences: ${differences.join('; ')}`;
                                throw new Error(errorMsg);
                            }

                            console.log(`[Comparison Test] All key field comparisons passed (${matchCount}/${totalFields} fields matched) for test case: ${testCaseName}`);

                            // Log success in Excel
                            await excelReader.logTestSummaryAndRecordResult(testCase, 'Passed', undefined, `Comparison successful for BigC Order ${bigOrderId} and Kibo Order ${kiboOrderId}`, sheetName, testCaseName, 'db');

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
                    // Test for all SQL queries
                    test(`Execute and Verify All SQL Queries from SQL File: ${testCaseName}`, async ({}, testInfo: TestInfo) => {
                        const excelReader = ExcelReader.getInstance();
                        const testCase = await excelReader.fetchTestCaseDataByName(testCaseName, sheetName);

                        // Only execute if Automation is true
                        if (!(await excelReader.checkAutomationAndSkipIfNeeded(testCase, sheetName, testCaseName, test))) {
                            console.log(`[SQL Test Setup] Skipping test case due to automation flag: ${testCaseName}`);
                            await excelReader.logTestSummaryAndRecordResult(testCase, 'Failed', undefined, 'Test skipped: Automation flag is not set to true', sheetName, testCaseName, 'db');
                            throw new Error('Test skipped: Automation flag is not set to true');
                        }

                        // Check execution criteria for database tests
                        const manualTest = String(testCase['Manual Test'] || '').toLowerCase() === 'true';
                        const bigCOrderId = String(testCase['BigC_OrderId'] || '').trim();
                        const kiboOrderId = String(testCase['KIBO_OrderId'] || '').trim();

                        // Scenario 1: Automation=true, Manual Test=false, both BigC and KIBO Order IDs present
                        const scenario1 = !manualTest && bigCOrderId && kiboOrderId;
                        
                        // Scenario 2: Automation=true, Manual Test=true, BigC Order ID present
                        const scenario2 = manualTest && bigCOrderId;

                        if (!scenario1 && !scenario2) {
                            console.log(`[SQL Test] Skipping test case ${testCaseName}: Does not match execution criteria`);
                            const excelReader = ExcelReader.getInstance();
                            await excelReader.logTestSummaryAndRecordResult(testCase, 'Failed', undefined, 'Test skipped: Does not match execution criteria (Scenario 1: Manual=false + both IDs, or Scenario 2: Manual=true + BigC ID)', sheetName, testCaseName, 'db');
                            throw new Error('Test skipped: Does not match execution criteria');
                        }

                        const orderId = testCase['BigC_OrderId'];
                        if (!orderId || orderId.trim() === '') {
                            console.log(`[SQL Test] Skipping '${testCaseName}' - BigC_OrderId not found.`);
                            const excelReader = ExcelReader.getInstance();
                            await excelReader.logTestSummaryAndRecordResult(testCase, 'Failed', undefined, 'Test skipped: BigC_OrderId not found in Excel sheet', sheetName, testCaseName, 'db');
                            throw new Error('Test skipped: BigC_OrderId not found in Excel sheet');
                        }

                        const queryManager = QueryManager.getInstance();

                        // Test for 'fetch-order-by-entityorderid'
                        console.log(`[SQL Test] Executing 'fetch-order-by-entityorderid' for Order ID: ${orderId}`);
                        const orderResult = await queryManager.executeQuery('fetch-order-by-entityorderid', { OrderNumber: orderId });
                        expect(orderResult).toBeDefined();
                        expect(orderResult.length).toBeGreaterThan(0);
                        expect(String(orderResult[0].OrderNumber)).toBe(String(orderId));
                        console.log(`[SQL Test] Verified 'fetch-order-by-entityorderid' for Order ID: ${orderId}`);

                        // Test for 'fetch-order-attributes-by-entityorderid'
                        console.log(`[SQL Test] Executing 'fetch-order-attributes-by-entityorderid' for Order ID: ${orderId}`);
                        const attributesResult = await queryManager.executeQuery('fetch-order-attributes-by-entityorderid', { EntityOrderId: orderId });
                        expect(attributesResult).toBeDefined();
                        console.log(`[SQL Test] Executed 'fetch-order-attributes-by-entityorderid' for Order ID: ${orderId}. Found ${attributesResult.length} attributes.`);

                        // Billing Info
                        console.log(`[SQL Test] Executing 'fetch-billing-info-by-entityorderid' for Order ID: ${orderId}`);
                        const billingResult = await queryManager.executeQuery('fetch-billing-info-by-entityorderid', { EntityOrderId: orderId });
                        expect(billingResult).toBeDefined();
                        expect(billingResult.length).toBeGreaterThan(0);
                        expect(String(billingResult[0].entityorderid)).toBe(String(orderId));
                        console.log(`[SQL Test] Verified 'fetch-billing-info-by-entityorderid' for Order ID: ${orderId}`);

                        // Fulfillment Info
                        console.log(`[SQL Test] Executing 'fetch-fulfillment-info-by-entityorderid' for Order ID: ${orderId}`);
                        const fulfillmentResult = await queryManager.executeQuery('fetch-fulfillment-info-by-entityorderid', { EntityOrderId: orderId });
                        expect(fulfillmentResult).toBeDefined();
                        expect(fulfillmentResult.length).toBeGreaterThan(0);
                        expect(String(fulfillmentResult[0].entityorderid)).toBe(String(orderId));
                        console.log(`[SQL Test] Verified 'fetch-fulfillment-info-by-entityorderid' for Order ID: ${orderId}`);
                    });
                }
            });
        });
    }
});
