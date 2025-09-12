import { test } from '../../../utils/baseTest';
import { expect, TestInfo } from '@playwright/test';
import { ExcelReader, TestCase } from '../../../utils/excelReader';
import { TestConfig } from '../../../utils/testConfig';
import { verifyOrderInDatabase, getTableSchema } from '../../../utils/db';
import { QueryManager } from '../../../utils/queryManager';

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
            console.log('Checking database connection, table schema, and query loading...');

            // Check orders table schema
            const schema = await getTableSchema('Order'); // Note: Using 'Order' as the table name from the query
            console.log('Order table schema:', schema);

            expect(schema.length).toBeGreaterThan(0);
            console.log('Database connection successful and Order table exists');

            // Check that queries are loaded
            const queryManager = QueryManager.getInstance();
            const availableQueries = queryManager.listQueries();
            console.log('Available queries:', availableQueries);

            expect(availableQueries.length).toBeGreaterThan(0);
            expect(availableQueries).toContain('comprehensive-order-details');
            console.log('Query manager loaded successfully');

        } catch (error: any) {
            console.error('Database connection, schema check, or query loading failed:', error);
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
                    let testResult = 'Passed';
                    let executionNotes = '';
                    let failedStep = '';

                    try {
                        testCase = await excelReader.fetchTestCaseDataByName(testCaseName, sheetName);

                        // Only execute if Automation is true
                        if (!(await excelReader.checkAutomationAndSkipIfNeeded(testCase, sheetName, testCaseName, test))) {
                            return;
                        }

                        await excelReader.logStep('Verifying Order in Database', { 'Test Case': testCaseName, 'Scenario': scenario });

                        const orderId = testCase['Order_Id'];
                        if (!orderId || orderId.trim() === '') {
                            throw new Error('Order_Id not found in Excel sheet. Ensure the order has been created first.');
                        }

                        const verificationResult = await verifyOrderInDatabase(orderId);

                        if (verificationResult.error) {
                            throw new Error(`Database verification failed: ${verificationResult.error}`);
                        }

                        expect(verificationResult.exists).toBe(true);

                        if (verificationResult.details && verificationResult.details.length > 0) {
                            console.log(`Order ${orderId} found with ${verificationResult.details.length} detail records`);
                            // Verify that the first record has the correct OrderNumber
                            expect(verificationResult.details[0].OrderNumber).toBe(orderId);
                            console.log('Order details from database:', verificationResult.details[0]);
                        }

                        executionNotes = `Order ${orderId} successfully verified in BigCommerce database. Found ${verificationResult.details?.length || 0} detail records.`;

                    } catch (err: any) {
                        testResult = 'Failed';
                        failedStep = 'Database Verification';

                        executionNotes = `Failed to verify order in database: ${err.message}`;

                        await excelReader.handleTestFailure(sheetName, testCaseName, failedStep, err, undefined, testCase);

                        throw err;
                    } finally {
                        if (testCase) {
                            await excelReader.logTestSummaryAndRecordResult(testCase, testResult, undefined, executionNotes, sheetName, testCaseName);
                        }
                    }
                });
            }
        });
    }
});
