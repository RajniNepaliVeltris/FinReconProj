import { test } from '../../../utils/baseTest';
import { expect, TestInfo } from '@playwright/test';
import { ExcelReader, TestCase } from '../../../utils/excelReader';
import { verifyOrderInDatabase, getTableSchema, getBigCConnection } from '../../../utils/db';
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

// Helper function to set up common test data and checks
async function setupTestCase(testCaseName: string, sheetName: string, testInfo: TestInfo): Promise<{ testCase: TestCase; excelReader: ExcelReader } | null> {
    console.log(`[DB Test Setup] Starting setup for test case: ${testCaseName} in sheet: ${sheetName}`);
    const excelReader = ExcelReader.getInstance();
    const testCase = await excelReader.fetchTestCaseDataByName(testCaseName, sheetName);
    console.log(`[DB Test Setup] Fetched test case data: ${Object.keys(testCase).length} fields`);

    // Only execute if Automation is true
    if (!(await excelReader.checkAutomationAndSkipIfNeeded(testCase, sheetName, testCaseName, test))) {
        console.log(`[DB Test Setup] Skipping test case due to automation flag: ${testCaseName}`);
        return null;
    }

    await excelReader.logStep('Verifying Order in Database', { 'Test Case': testCaseName, 'Scenario': sheetName });
    console.log(`[DB Test Setup] Setup complete for test case: ${testCaseName}`);
    return { testCase, excelReader };
}

test.describe('Order Database Verification Tests', () => {
    test('Database Connection and Schema Check', async ({}, testInfo: TestInfo) => {
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
                        const setupResult = await setupTestCase(testCaseName, sheetName, testInfo);
                        if (!setupResult) return;
                        testCase = setupResult.testCase;

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

                        // Fetch BIGOrderId and KiboOrderId from the Excel sheet
                        const bigOrderId = String(testCase['BigC_OrderId']);
                        const kiboOrderId = String(testCase['KIBO_OrderId']);

                        if (!bigOrderId.trim()) {
                            throw new Error('BIGOrderId not found in Excel sheet. Ensure the order has been created first.');
                        }

                        if (!kiboOrderId.trim()) {
                            throw new Error('KiboOrderId not found in Excel sheet. Ensure the order has been created first.');
                        }
                        console.log(`[DB Verification] Comparing BigC Order ID: ${bigOrderId} with Kibo Order ID: ${kiboOrderId}`);

                        // Initialize database connection
                        const connection = await getBigCConnection();
                        console.log(`[DB Verification] Established DB connection for comparison queries`);

                        // Query the database for BIGC Order ID results
                        const bigCResult = await connection.request().query(
                            `SELECT * FROM [Order] WHERE OrderNumber = '${bigOrderId}'`
                        );

                        if (!bigCResult.recordset || bigCResult.recordset.length === 0) {
                            throw new Error(`No data found for BIGC Order ID: ${bigOrderId}`);
                        }

                        const bigCData = bigCResult.recordset[0];
                        console.log(`[DB Verification] Retrieved BigC data: Total=${bigCData.Total}, Status=${bigCData.Status}`);

                        // Query the database for Kibo Order ID results
                        const kiboResult = await connection.request().query(
                            `SELECT * FROM [Order] WHERE OrderNumber = '${kiboOrderId}'`
                        );

                        if (!kiboResult.recordset || kiboResult.recordset.length === 0) {
                            throw new Error(`No data found for Kibo Order ID: ${kiboOrderId}`);
                        }

                        const kiboData = kiboResult.recordset[0];
                        console.log(`[DB Verification] Retrieved Kibo data: Total=${kiboData.Total}, Status=${kiboData.Status}`);

                        // Compare BIGC and Kibo data values
                        expect(bigCData.Total).toEqual(kiboData.Total);
                        expect(bigCData.CustomerName).toEqual(kiboData.CustomerName);
                        expect(bigCData.Status).toEqual(kiboData.Status);

                        console.log('[DB Verification] BigC and Kibo Order data values match successfully.');
                        dbExecutionNotes = `Order ${orderId} successfully verified in BigCommerce database. Found ${verificationResult.details?.length || 0} detail records. Data comparison passed.`;

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
    }

    test('Execute and Verify Order Query from SQL File', async ({}) => {
        const OrderId = 358102;
        //const entityOrderId = testCase['BigC_OrderId'];
        console.log(`[SQL Test] Executing order query for EntityOrderId: ${OrderId}`);

        const connection = await getBigCConnection();
        console.log(`[SQL Test] DB connection established`);

        // Fetch the query from the QueryManager
        const queryManager = QueryManager.getInstance();
        const query = queryManager.getQuery('fetch-order-by-entityorderid');

        if (!query) {
            throw new Error('Query not found: fetch-order-by-entityorderid');
        }

        // Replace the parameter in the query
        let formattedQuery = query;
        if (query.includes('@OrderNumber')) {
            formattedQuery = query.replace(/@OrderNumber/g, OrderId.toString());
        } else {
            formattedQuery = query.replace(/@EntityOrderId/g, OrderId.toString());
        }
        console.log(`[SQL Test] Formatted query ready`);

        // Execute the query
        const result = await connection.request().query(formattedQuery);

        if (!result || !result.recordset) {
            console.error(`[SQL Test] Query result:`, result);
            throw new Error(`[SQL Test] Query did not return any records or result.recordset is undefined`);
        }
        console.log(`[SQL Test] Query executed, records returned: ${result.recordset.length}`);

        // Verify the results
        expect(result.recordset).not.toBeUndefined();
        expect(Array.isArray(result.recordset)).toBe(true);
        expect(result.recordset.length).toBeGreaterThan(0);

        const orderData = result.recordset[0];
        console.log(`[SQL Test] Order Data: OrderId=${orderData?.OrderId}, OrderNumber=${orderData?.OrderNumber}, Total=${orderData?.Total}`);

        // Add specific assertions based on expected values
        expect(orderData?.Id).toBeDefined();
        expect(orderData?.OrderNumber).toBeDefined();
        expect(orderData?.Total).toBeGreaterThan(0);
        console.log(`[SQL Test] Assertions passed`);
    });

    test('Execute and Verify Order Attributes Query from SQL File', async ({}) => {
        const OrderId = 440599;
        console.log(`[SQL Test] Executing order attributes query for EntityOrderId: ${OrderId}`);

        const connection = await getBigCConnection();
        console.log(`[SQL Test] DB connection established`);

        // Fetch the query from the QueryManager
        const queryManager = QueryManager.getInstance();
        const query = queryManager.getQuery('fetch-order-attributes-by-entityorderid');

        if (!query) {
            throw new Error('Query not found: fetch-order-attributes-by-entityorderid');
        }

        // Replace the parameter in the query
        const formattedQuery = query.replace('@EntityOrderId', OrderId.toString());
        console.log(`[SQL Test] Formatted query ready`);

        // Execute the query
        const result = await connection.request().query(formattedQuery);
        console.log(`[SQL Test] Query executed, attributes returned: ${result.recordset.length}`);

        // Verify the results
        expect(result.recordset).toBeDefined();
        expect(result.recordset.length).toBeGreaterThan(0);

        const attributeData = result.recordset;
        console.log(`[SQL Test] Sample attribute: ${attributeData[0]?.FullyQualifiedName} = ${attributeData[0]?.Values}`);

        // Add specific assertions based on expected values
        attributeData.forEach(attribute => {
            expect(attribute.FullyQualifiedName).toBeDefined();
            expect(attribute.Values).toBeDefined();
        });
        console.log(`[SQL Test] All attribute assertions passed`);
    });

    test('Execute and Verify Billing and Fulfillment Info Queries from SQL File', async ({}) => {
        const OrderId = 440599;
        console.log(`[SQL Test] Executing billing and fulfillment queries for EntityOrderId: ${OrderId}`);

        const connection = await getBigCConnection();
        console.log(`[SQL Test] DB connection established`);

        // Fetch the billing info query from the QueryManager
        const queryManager = QueryManager.getInstance();
        const billingQuery = queryManager.getQuery('fetch-billing-info-by-entityorderid');

        if (!billingQuery) {
            throw new Error('Query not found: fetch-billing-info-by-entityorderid');
        }

        // Replace the parameter in the billing query
        const formattedBillingQuery = billingQuery.replace('@EntityOrderId', OrderId.toString());
        console.log(`[SQL Test] Billing query formatted`);

        // Execute the billing info query
        const billingResult = await connection.request().query(formattedBillingQuery);
        console.log(`[SQL Test] Billing query executed, records: ${billingResult.recordset.length}`);

        // Verify the billing info results
        expect(billingResult.recordset).toBeDefined();
        expect(billingResult.recordset.length).toBeGreaterThan(0);

        const billingData = billingResult.recordset;
        console.log(`[SQL Test] Sample billing data: entityorderid=${billingData[0]?.entityorderid}`);

        // Fetch the fulfillment info query from the QueryManager
        const fulfillmentQuery = queryManager.getQuery('fetch-fulfillment-info-by-entityorderid');

        if (!fulfillmentQuery) {
            throw new Error('Query not found: fetch-fulfillment-info-by-entityorderid');
        }

        // Replace the parameter in the fulfillment query
        const formattedFulfillmentQuery = fulfillmentQuery.replace('@EntityOrderId', OrderId.toString());
        console.log(`[SQL Test] Fulfillment query formatted`);

        // Execute the fulfillment info query
        const fulfillmentResult = await connection.request().query(formattedFulfillmentQuery);
        console.log(`[SQL Test] Fulfillment query executed, records: ${fulfillmentResult.recordset.length}`);

        // Verify the fulfillment info results
        expect(fulfillmentResult.recordset).toBeDefined();
        expect(fulfillmentResult.recordset.length).toBeGreaterThan(0);

        const fulfillmentData = fulfillmentResult.recordset;
        console.log(`[SQL Test] Sample fulfillment data: entityorderid=${fulfillmentData[0]?.entityorderid}`);

        // Add specific assertions based on expected values
        billingData.forEach(billing => {
            expect(billing.entityorderid).toBe(OrderId);
        });

        fulfillmentData.forEach(fulfillment => {
            expect(fulfillment.entityorderid).toBe(OrderId);
        });
        console.log(`[SQL Test] Billing and fulfillment assertions passed`);
    });

    for (const { scenario, sheetName, testCases } of scenarios) {
        test.describe(scenario, () => {
            for (const testCaseName of testCases) {
                test(`Compare Results for KIBO and BigC Order IDs: ${testCaseName}`, async ({}) => {
                    const excelReader = ExcelReader.getInstance();
                    let testCase: TestCase | undefined;

                    try {
                        testCase = await excelReader.fetchTestCaseDataByName(testCaseName, sheetName);

                        // Only execute if Automation is true
                        if (!(await excelReader.checkAutomationAndSkipIfNeeded(testCase, sheetName, testCaseName, test))) {
                            return;
                        }

                        const bigOrderId = String(testCase['BigC_OrderId']);
                        const kiboOrderId = String(testCase['KIBO_OrderId']);

                        if (!bigOrderId.trim() || !kiboOrderId.trim()) {
                            console.log(`[Comparison Test] Skipping test case ${testCaseName}: BigC_OrderId or KiboOrderId not present`);
                            return;
                        }

                        console.log(`[Comparison Test] Comparing BigC Order ID: ${bigOrderId} with Kibo Order ID: ${kiboOrderId} for test case: ${testCaseName}`);

                        const connection = await getBigCConnection();
                        console.log(`[Comparison Test] DB connection established`);

                        // Query the database for BIGC Order ID results
                        const bigCResult = await connection.request().query(
                            `SELECT * FROM [Order] WHERE OrderNumber = '${bigOrderId}'`
                        );

                        if (!bigCResult.recordset || bigCResult.recordset.length === 0) {
                            throw new Error(`No data found for BIGC Order ID: ${bigOrderId}`);
                        }

                        const bigCData = bigCResult.recordset[0];
                        console.log(`[Comparison Test] Retrieved BigC data: Total=${bigCData.Total}, Status=${bigCData.Status}`);

                        // Query the database for Kibo Order ID results
                        const kiboResult = await connection.request().query(
                            `SELECT * FROM [Order] WHERE OrderNumber = '${kiboOrderId}'`
                        );

                        if (!kiboResult.recordset || kiboResult.recordset.length === 0) {
                            throw new Error(`No data found for Kibo Order ID: ${kiboOrderId}`);
                        }

                        const kiboData = kiboResult.recordset[0];
                        console.log(`[Comparison Test] Retrieved Kibo data: Total=${kiboData.Total}, Status=${kiboData.Status}`);

                        // Compare BIGC and Kibo data values
                        expect(bigCData.Total).toEqual(kiboData.Total);
                        expect(bigCData.CustomerName).toEqual(kiboData.CustomerName);
                        expect(bigCData.Status).toEqual(kiboData.Status);

                        console.log(`[Comparison Test] All comparisons passed for test case: ${testCaseName}`);

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
    }
});
