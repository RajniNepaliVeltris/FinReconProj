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

test.describe('Order Database Verification Tests', () => {
    test('Database Connection and Schema Check', async ({}, testInfo: TestInfo) => {
        testInfo.annotations.push(
            { type: 'test-type', description: 'DB Setup' },
            { type: 'feature', description: 'Database Connectivity' }
        );

        try {
            console.log('Checking database connection and query loading...');

            // Test basic database connectivity with a simple query
            const connection = await getBigCConnection();
            const testResult = await connection.request().query('SELECT 1 as TestConnection');
            console.log('Database connection successful:', testResult.recordset[0]);

            expect(testResult.recordset[0].TestConnection).toBe(1);

            // Check that queries are loaded
            const queryManager = QueryManager.getInstance();
            const availableQueries = queryManager.listQueries();
            console.log('Available queries:', availableQueries);

            expect(availableQueries.length).toBeGreaterThan(0);
            expect(availableQueries).toContain('comprehensive-order-details');
            console.log('Query manager loaded successfully');

        } catch (error: any) {
            console.error('Database connection or query loading failed:', error);
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
                        testCase = await excelReader.fetchTestCaseDataByName(testCaseName, sheetName);

                        // Only execute if Automation is true
                        if (!(await excelReader.checkAutomationAndSkipIfNeeded(testCase, sheetName, testCaseName, test))) {
                            return;
                        }

                        await excelReader.logStep('Verifying Order in Database', { 'Test Case': testCaseName, 'Scenario': scenario });

                        const orderId = testCase['BigC_OrderId'];
                        if (!orderId || orderId.trim() === '') {
                            throw new Error('BigC_OrderId not found in Excel sheet. Ensure the order has been created first.');
                        }

                        const verificationResult = await verifyOrderInDatabase(orderId);

                        if (verificationResult.error) {
                            throw new Error(`Database verification failed: ${verificationResult.error}`);
                        }

                        expect(verificationResult.exists).toBe(true);

                        if (verificationResult.details && verificationResult.details.length > 0) {
                            console.log(`Order ${orderId} found with ${verificationResult.details.length} detail records`);

                            const firstDetail = verificationResult.details[0];
                            // Diagnostic logging: show both available properties and types
                            console.log('First detail record (raw):', firstDetail);
                            console.log('Available keys on firstDetail:', Object.keys(firstDetail));

                            const dbEntityOrderId = firstDetail.EntityOrderId ?? firstDetail.entityorderid ?? firstDetail.OrderNumber ?? firstDetail.OrderId ?? firstDetail.OrderNumber;
                            console.log('dbEntityOrderId (raw):', dbEntityOrderId, 'type:', typeof dbEntityOrderId);
                            console.log('expected orderId (raw):', orderId, 'type:', typeof orderId);

                            // Coerce both sides to string for a safe, type-insensitive comparison
                            expect(String(dbEntityOrderId)).toBe(String(orderId));

                            console.log('Order details from database:', firstDetail);
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

                        // Initialize database connection
                        const connection = await getBigCConnection();

                        // Query the database for BIGC Order ID results
                        const bigCResult = await connection.request().query(
                            `SELECT * FROM [Order] WHERE OrderNumber = '${bigOrderId}'`
                        );

                        if (!bigCResult.recordset || bigCResult.recordset.length === 0) {
                            throw new Error(`No data found for BIGC Order ID: ${bigOrderId}`);
                        }

                        const bigCData = bigCResult.recordset[0];
                        console.log('BIGC Order Data:', bigCData);

                        // Query the database for Kibo Order ID results
                        const kiboResult = await connection.request().query(
                            `SELECT * FROM [KiboOrder] WHERE OrderNumber = '${kiboOrderId}'`
                        );

                        if (!kiboResult.recordset || kiboResult.recordset.length === 0) {
                            throw new Error(`No data found for Kibo Order ID: ${kiboOrderId}`);
                        }

                        const kiboData = kiboResult.recordset[0];
                        console.log('Kibo Order Data:', kiboData);

                        // Compare BIGC and Kibo data values
                        expect(bigCData.Total).toEqual(kiboData.Total);
                        expect(bigCData.CustomerName).toEqual(kiboData.CustomerName);
                        expect(bigCData.Status).toEqual(kiboData.Status);

                        console.log('BIGC and Kibo Order data values match successfully.');

                        dbExecutionNotes = `Order ${orderId} successfully verified in BigCommerce database. Found ${verificationResult.details?.length || 0} detail records.`;

                    } catch (err: any) {
                        dbTestResult = 'Failed';
                        failedStep = 'Database Verification';

                        dbExecutionNotes = `Failed to verify order in database: ${err.message}`;

                        await excelReader.handleTestFailure(sheetName, testCaseName, failedStep, err, undefined, testCase, 'db');

                        throw err;
                    } finally {
                        if (testCase) {
                            await excelReader.logTestSummaryAndRecordResult(testCase, dbTestResult, undefined, dbExecutionNotes, sheetName, testCaseName, 'db');
                        }
                    }
                });
            }
        });
    }

    test('Execute and Verify Order Query from SQL File', async ({}) => {
        const connection = await getBigCConnection();

        // Fetch the query from the QueryManager
        const queryManager = QueryManager.getInstance();
        const query = queryManager.getQuery('fetch-order-by-entityorderid');

        if (!query) {
            throw new Error('Query not found: fetch-order-by-entityorderid');
        }

        // Replace the parameter in the query
        const entityOrderId = 440599;
        const formattedQuery = query.replace('@EntityOrderId', entityOrderId.toString());

        // Execute the query
        const result = await connection.request().query(formattedQuery);

        // Verify the results
        expect(result.recordset).toBeDefined();
        expect(result.recordset.length).toBeGreaterThan(0);

        const orderData = result.recordset[0];
        console.log('Order Data:', orderData);

        // Add specific assertions based on expected values
        expect(orderData.OrderId).toBeDefined();
        expect(orderData.OrderNumber).toBeDefined();
        expect(orderData.Total).toBeGreaterThan(0);
    });

    test('Execute and Verify Order Attributes Query from SQL File', async ({}) => {
        const connection = await getBigCConnection();

        // Fetch the query from the QueryManager
        const queryManager = QueryManager.getInstance();
        const query = queryManager.getQuery('fetch-order-attributes-by-entityorderid');

        if (!query) {
            throw new Error('Query not found: fetch-order-attributes-by-entityorderid');
        }

        // Replace the parameter in the query
        const entityOrderId = 440599;
        const formattedQuery = query.replace('@EntityOrderId', entityOrderId.toString());

        // Execute the query
        const result = await connection.request().query(formattedQuery);

        // Verify the results
        expect(result.recordset).toBeDefined();
        expect(result.recordset.length).toBeGreaterThan(0);

        const attributeData = result.recordset;
        console.log('Order Attributes Data:', attributeData);

        // Add specific assertions based on expected values
        attributeData.forEach(attribute => {
            expect(attribute.FullyQualifiedName).toBeDefined();
            expect(attribute.Values).toBeDefined();
        });
    });

    test('Execute and Verify Billing and Fulfillment Info Queries from SQL File', async ({}) => {
        const connection = await getBigCConnection();

        // Fetch the billing info query from the QueryManager
        const queryManager = QueryManager.getInstance();
        const billingQuery = queryManager.getQuery('fetch-billing-info-by-entityorderid');

        if (!billingQuery) {
            throw new Error('Query not found: fetch-billing-info-by-entityorderid');
        }

        // Replace the parameter in the billing query
        const entityOrderId = 440599;
        const formattedBillingQuery = billingQuery.replace('@EntityOrderId', entityOrderId.toString());

        // Execute the billing info query
        const billingResult = await connection.request().query(formattedBillingQuery);

        // Verify the billing info results
        expect(billingResult.recordset).toBeDefined();
        expect(billingResult.recordset.length).toBeGreaterThan(0);

        const billingData = billingResult.recordset;
        console.log('Billing Info Data:', billingData);

        // Fetch the fulfillment info query from the QueryManager
        const fulfillmentQuery = queryManager.getQuery('fetch-fulfillment-info-by-entityorderid');

        if (!fulfillmentQuery) {
            throw new Error('Query not found: fetch-fulfillment-info-by-entityorderid');
        }

        // Replace the parameter in the fulfillment query
        const formattedFulfillmentQuery = fulfillmentQuery.replace('@EntityOrderId', entityOrderId.toString());

        // Execute the fulfillment info query
        const fulfillmentResult = await connection.request().query(formattedFulfillmentQuery);

        // Verify the fulfillment info results
        expect(fulfillmentResult.recordset).toBeDefined();
        expect(fulfillmentResult.recordset.length).toBeGreaterThan(0);

        const fulfillmentData = fulfillmentResult.recordset;
        console.log('Fulfillment Info Data:', fulfillmentData);

        // Add specific assertions based on expected values
        billingData.forEach(billing => {
            expect(billing.entityorderid).toBe(entityOrderId);
        });

        fulfillmentData.forEach(fulfillment => {
            expect(fulfillment.entityorderid).toBe(entityOrderId);
        });
    });

    test('Compare Results for KIBO and BigC Order IDs', async ({}) => {
        const connection = await getBigCConnection();
        const excelReader = ExcelReader.getInstance();

        // Fetch test case data from Excel
        const sheetName = 'Custom Product'; // Replace with the actual sheet name
        const testCaseName = 'Order Comparison Test'; // Replace with the actual test case name
        const testCase = await excelReader.fetchTestCaseDataByName(testCaseName, sheetName);

        if (!testCase) {
            throw new Error(`Test case '${testCaseName}' not found in Excel sheet '${sheetName}'`);
        }

        const kiboOrderId = String(testCase['KIBOOrderId']);
        const bigCOrderId = String(testCase['BIGOrderId']);

        if (!kiboOrderId || !bigCOrderId) {
            throw new Error('Both KIBOOrderId and BIGOrderId must be provided in the Excel sheet.');
        }

        // Fetch the query from the QueryManager
        const queryManager = QueryManager.getInstance();
        const query = queryManager.getQuery('fetch-order-by-entityorderid');

        if (!query) {
            throw new Error('Query not found: fetch-order-by-entityorderid');
        }

        // Execute the query for KIBO Order ID
        const kiboQuery = query.replace('@EntityOrderId', kiboOrderId);
        const kiboResult = await connection.request().query(kiboQuery);

        // Execute the query for BigC Order ID
        const bigCQuery = query.replace('@EntityOrderId', bigCOrderId);
        const bigCResult = await connection.request().query(bigCQuery);

        // Verify the results
        expect(kiboResult.recordset).toBeDefined();
        expect(bigCResult.recordset).toBeDefined();
        expect(kiboResult.recordset.length).toBeGreaterThan(0);
        expect(bigCResult.recordset.length).toBeGreaterThan(0);

        const kiboData = kiboResult.recordset[0];
        const bigCData = bigCResult.recordset[0];

        console.log('KIBO Order Data:', kiboData);
        console.log('BigC Order Data:', bigCData);

        // Compare specific fields
        expect(kiboData.Total).toEqual(bigCData.Total);
        expect(kiboData.CustomerName).toEqual(bigCData.CustomerName);
        expect(kiboData.Status).toEqual(bigCData.Status);
    });
});
