import * as Excel from 'exceljs';
import * as path from 'path';
import orderTestData from '../data/BigCommerceData/orderTestData.json';

export interface TestCase {
    'Global Test Case ID': string;
    'Prefixed Test Case ID': string;
    'Test Case ID': string;
    'Test Scenario': string;
    'Pre-Condition': string;
    'Product Type': string;
    'Payment Method': string;
    'Discount Applied': string;
    'Coupon Applied': string;
    'Billing/Shipping Details': string;
    'Expected Result': string;
    'Automation Priority': string;
    'Scenario Category': string;
    'Test Case Name': string;
    'Product_Name': string;
    'Product_SKU': string;
    'Product_Quantity': string;
    'Product_Price': string;
    'Shipping_Method': string;
    'Shipping_Provider': string;
    'Shipping_Price': string;
    'Payment_Category': string;
    'Payment_description': string;
    'Email_Invoice_Check': string;
    'Manual_Discount': string;
    'ExpectedPaySum_subtotalAmt': string;
    'ExpectedPaySum_shippingAmt': string;
    'ExpectedPaySum_taxAmt': string;
    'ExpectedPaySum_totalAmt': string;
    'Comments': string;
    'Staff_Notes': string;
    'CS_CardHolderName': string;
    'CS_CardType': string;
    'CS_CreditCardNo': string;
    'CS_CCV2Value': string;
    'CS_CardExpiryDate(JAN-2025)(JAN-2025)': string;
    'Automation': boolean;
    'Order_Id': string;
    'Test_Result': string;
    'Execution_Notes': string;
    [key: string]: string | boolean; // For any additional dynamic columns

}

export interface TestCaseSheet {
    name: string;
    defaultScenario: string;
}

export class ExcelReader {
    /**
     * Log key test case info to console
     */
        /**
         * Update the Order_Id for a test case in the Excel sheet
         * @param sheetName Name of the worksheet
         * @param testCaseName Name of the test case
         * @param orderId The orderId to write
         */
        public async updateOrderId(sheetName: string, testCaseName: string, orderId: string): Promise<void> {
            try {
                const workbook = await this.readWorkbook();
                const worksheet = workbook.getWorksheet(sheetName);
                if (!worksheet) {
                    throw new Error(`Worksheet ${sheetName} not found in the Excel file`);
                }

                // Find header columns
                const headers: { [key: string]: number } = {};
                worksheet.getRow(1).eachCell((cell, colNumber) => {
                    headers[cell.value?.toString() || ''] = colNumber;
                });

                if (!headers['Order_Id']) {
                    throw new Error('Order_Id column not found in the worksheet');
                }
                if (!headers['Test Case Name']) {
                    throw new Error('Test Case Name column not found in the worksheet');
                }

                // Find the row for the test case
                let foundRow: any = null;
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return; // Skip header
                    const nameCell = row.getCell(headers['Test Case Name']);
                    const cellValue = nameCell.value?.toString() || '';
                    if (cellValue === testCaseName) {
                        foundRow = row;
                    }
                });

                if (!foundRow) {
                    throw new Error(`Test case "${testCaseName}" not found in sheet "${sheetName}"`);
                }

                // Update the Order_Id cell
                foundRow.getCell(headers['Order_Id']).value = orderId;

                // Save the workbook
                const filePath = path.join(__dirname, '../data/BigCommerceData/BigC_Ecomm_TestCases_AutomationMasterSheet.xlsx');
                await workbook.xlsx.writeFile(filePath);
                console.log(`Order_Id updated for test case "${testCaseName}" in sheet "${sheetName}"`);
            } catch (error) {
                console.error('Error updating Order_Id:', error);
                throw error;
            }
        }
    public logTestCaseInfo(testCase: TestCase): void {
        console.log(`Executing Test Case: ${testCase['Test Case ID']}`);
        console.log(`Scenario: ${testCase['Test Scenario']}`);
        console.log(`Pre-Condition: ${testCase['Pre-Condition']}`);
        console.log(`Payment Method: ${testCase['Payment Method']}`);
        console.log(`Expected Result: ${testCase['Expected Result']}`);
    }
    private static instance: ExcelReader;
    private constructor() { }

    public static getInstance(): ExcelReader {
        if (!ExcelReader.instance) {
            ExcelReader.instance = new ExcelReader();
        }
        return ExcelReader.instance;
    }

    private async readWorkbook(): Promise<Excel.Workbook> {
        const workbook = new Excel.Workbook();
        try {
            const filePath = path.join(__dirname, '../data/BigCommerceData/BigC_Ecomm_TestCases_AutomationMasterSheet.xlsx');
            console.log('Attempting to load Excel file:', filePath);
            await workbook.xlsx.readFile(filePath);
            console.log('Excel file loaded successfully');
        } catch (err) {
            console.error('Error loading Excel file:', err);
            throw err;
        }
        return workbook;
    }

    /**
     * Wrapper to fetch a test case by scenario and sheet name
     */
    public async getTestCase({ testCase, sheetName }: { testCase: TestCase | undefined, sheetName: string }): Promise<TestCase | undefined> {
        try {
            const workbook = await this.readWorkbook();
            const worksheet = workbook.getWorksheet(sheetName);
            if (!worksheet) {
                console.log('Worksheet not found:', sheetName);
                throw new Error(`Worksheet ${sheetName} not found in the Excel file`);
            }

            const headers: { [key: string]: number } = {};
            worksheet.getRow(1).eachCell((cell, colNumber) => {
                headers[cell.value?.toString() || ''] = colNumber;
            });

            if (!headers['Test Scenario']) {
                console.log('Test Scenario column not found in the worksheet');
                throw new Error('Test Scenario column not found in the worksheet');
            }

            const testCases: TestCase[] = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header row
                const testCase: any = {};
                Object.keys(headers).forEach(header => {
                    testCase[header] = row.getCell(headers[header]).value?.toString() || '';
                });
                testCases.push(testCase as TestCase);
            });

            return testCases.find(testCase => testCase['Test Case Name'] && testCase['Test Case Name'].includes(testCase?.['Test Case Name'] || ''));
        } catch (error) {
            console.log('Error fetching test case:', error);
            console.error('Error fetching test case:', error);
        }
    }

    
public async fetchTestCaseDataByName(testCaseName: string, sheetName: string) {
    const excelReader = ExcelReader.getInstance();
    const allCases = await excelReader.getAllTestCases(sheetName);
    const tc = allCases.find(tc => tc['Test Case Name'] === testCaseName);
    if (!tc) throw new Error(`Test case '${testCaseName}' not found in Excel sheet '${sheetName}'`);
    await this.logStep('Test Case Info', {
        'ID': tc['Test Case ID'],
        'Name': tc['Test Case Name'],
        'Scenario': tc['Test Scenario'],
        'Pre-Condition': tc['Pre-Condition'],
        'Payment Method': tc['Payment Method'],
        'Expected Result': tc['Expected Result']
    });
    return tc;
}

// Helper functions
public async logStep(title: string, details?: any) {
    console.log(`\n=== ${title} ===`);
    if (details) console.table(details);
}

    public async getAllTestCases(sheetName: string = 'Custom Product'): Promise<TestCase[]> {
        const workbook = await this.readWorkbook();
        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
            throw new Error(`Worksheet ${sheetName} not found in the Excel file`);
        }

        const headers: { [key: string]: number } = {};
        worksheet.getRow(1).eachCell((cell, colNumber) => {
            headers[cell.value?.toString() || ''] = colNumber;
        });

        const testCases: TestCase[] = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header row

            const testCase: any = {};
            Object.keys(headers).forEach(header => {
                testCase[header] = row.getCell(headers[header]).value?.toString() || '';
            });
            testCases.push(testCase as TestCase);
        });

        return testCases;
    }

        /**
         * Update test result with detailed execution information
         * @param sheetName Name of the worksheet
         * @param testCaseName Name of the test case
         * @param result Test result (Passed/Failed)
         * @param notes Basic execution notes
         * @param failureInfo Optional failure information
         */
        public async updateTestResult(
            sheetName: string, 
            testCaseName: string, 
            result: string, 
            notes: string,
            failureInfo?: {
                failedStep?: string;
                errorMessage?: string;
                failureScreenshot?: string;
                failureTimestamp?: string;
            }
        ): Promise<void> {
            try {
                console.log(`Updating test result for "${testCaseName}" in sheet "${sheetName}"`);
                const workbook = await this.readWorkbook();
                const worksheet = workbook.getWorksheet(sheetName);
                if (!worksheet) {
                    throw new Error(`Worksheet ${sheetName} not found in the Excel file`);
                }

                // Find header columns and handle common variations
                const headers: { [key: string]: number } = {};
                const columnMappings = {
                    'Test Case Name': ['Test Case Name', 'TestCaseName', 'Test_Case_Name'],
                    'Test_Result': ['Test_Result', 'Test Result', 'TestResult', 'Result'],
                    'Execution_Notes': ['Execution_Notes', 'Execution Notes', 'ExecutionNotes', 'Notes']
                };

                worksheet.getRow(1).eachCell((cell, colNumber) => {
                    const headerName = cell.value?.toString() || '';
                    console.log(`Found original header: "${headerName}" at column ${colNumber}`);
                    
                    // Store the original header
                    headers[headerName] = colNumber;
                    
                    // Check if this header matches any of our expected variations
                    for (const [key, variations] of Object.entries(columnMappings)) {
                        if (variations.includes(headerName)) {
                            headers[key] = colNumber; // Store with our standard key
                            console.log(`Mapped "${headerName}" to standard header "${key}"`);
                        }
                    }
                });

                // Log all found headers for debugging
                console.log('All found headers:', Object.keys(headers));

                // Verify required columns exist with flexible matching
                const requiredColumns = ['Test Case Name', 'Test_Result', 'Execution_Notes'];
                for (const col of requiredColumns) {
                    if (!(col in headers)) {
                        throw new Error(`Required column "${col}" not found in worksheet. Available columns: ${Object.keys(headers).join(', ')}`);
                    }
                }

                // Find the row for the test case
                let foundRow: any = null;
                let foundRowNumber = 0;
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return; // Skip header
                    const nameCell = row.getCell(headers['Test Case Name']);
                    const cellValue = nameCell.value?.toString() || '';
                    if (cellValue === testCaseName) {
                        foundRow = row;
                        foundRowNumber = rowNumber;
                        console.log(`Found matching test case at row ${rowNumber}`);
                    }
                });

                if (!foundRow) {
                    throw new Error(`Test case "${testCaseName}" not found in sheet "${sheetName}"`);
                }

                // Update result and notes with current timestamp
                const timestamp = new Date().toISOString();
                
                // Debug current cell values before update
                if (headers['Test_Result']) {
                    const currentResult = foundRow.getCell(headers['Test_Result']).value;
                    console.log(`Current Test_Result value: "${currentResult}"`);
                    
                    // Set the new result value
                    foundRow.getCell(headers['Test_Result']).value = result;
                    
                    // Verify the update
                    const newResult = foundRow.getCell(headers['Test_Result']).value;
                    console.log(`Updated Test_Result from "${currentResult}" to "${newResult}" at row ${foundRowNumber}`);
                }

                if (headers['Execution_Notes']) {
                    const currentNotes = foundRow.getCell(headers['Execution_Notes']).value;
                    console.log(`Current Execution_Notes value: "${currentNotes}"`);
                    
                    // Format the notes based on test result
                    let formattedNotes: string[];
                    
                    if (result === 'Failed' && failureInfo) {
                        formattedNotes = [
                            '=== Test Failure Details ===',
                            `Failed Step: ${failureInfo.failedStep || 'Unknown'}`,
                            `Error Message: ${failureInfo.errorMessage || 'No error message provided'}`,
                            `Failure Timestamp: ${failureInfo.failureTimestamp || timestamp}`,
                            `Failure Screenshot: ${failureInfo.failureScreenshot || 'Not available'}`,
                            '',
                            '=== Additional Notes ===',
                            notes,
                            '',
                            `Status: ${result}`,
                            `Last Updated: ${timestamp}`,
                            '---'
                        ];
                    } else {
                        formattedNotes = [
                            notes,
                            `Status: ${result}`,
                            `Last Updated: ${timestamp}`,
                            '---'
                        ];
                    }
                    
                    foundRow.getCell(headers['Execution_Notes']).value = formattedNotes;
                    console.log(`Updated Execution_Notes at row ${foundRowNumber}`);
                }

                // Update last run date if the column exists
                if (headers['Last_Run_Date'] || headers['LastRunDate']) {
                    const lastRunColumn = headers['Last_Run_Date'] || headers['LastRunDate'];
                    foundRow.getCell(lastRunColumn).value = timestamp;
                    console.log(`Updated Last_Run_Date to "${timestamp}" at row ${foundRowNumber}`);
                }

                const filePath = path.join(__dirname, '../data/BigCommerceData/BigC_Ecomm_TestCases_AutomationMasterSheet.xlsx');
                console.log(`Saving changes to Excel file: ${filePath}`);
                
                try {
                    // Ensure the file isn't locked
                    const fileHandle = await workbook.xlsx.writeFile(filePath);
                    console.log('Successfully saved test results to Excel file');
                    
                    // Verify the write by reading back the updated cell
                    const verifyWorkbook = await this.readWorkbook();
                    const verifySheet = verifyWorkbook.getWorksheet(sheetName);
                    const verifyRow = verifySheet?.getRow(foundRowNumber);
                    const verifiedResult = verifyRow?.getCell(headers['Test_Result']).value;
                    
                    if (verifiedResult?.toString() !== result) {
                        throw new Error(`Excel update verification failed. Expected "${result}" but found "${verifiedResult}"`);
                    }
                    console.log('Verified test result was correctly written to Excel');
                    
                } catch (writeError) {
                    console.error('Error writing to Excel file:', writeError);
                    console.error('File path:', filePath);
                    console.error('Attempting to diagnose issue...');
                    
                    try {
                        // Check if file exists and is writable
                        const fs = require('fs');
                        const stats = fs.statSync(filePath);
                        console.error('File exists:', stats.isFile());
                        console.error('File size:', stats.size);
                        console.error('File permissions:', stats.mode.toString(8));
                    } catch (statError) {
                        console.error('Error checking file stats:', statError);
                    }
                    
                    throw writeError;
                }

            } catch (error) {
                console.error('Error updating test results:', error);
                console.error('Error details:', {
                    sheetName,
                    testCaseName,
                    result,
                    error: error instanceof Error ? error.message : String(error)
                });
                throw error;
            }
        }

    /**
     * Record a detailed test failure in Excel with step, error, screenshot, and summary
     */
    public async recordDetailedTestFailure(
        sheetName: string,
        testCaseName: string,
        currentStep: string,
        err: any,
        failureScreenshotPath?: string
    ): Promise<void> {
        const failureTime = new Date().toISOString();
        const failureInfo = {
            failedStep: currentStep,
            errorMessage: err?.message || String(err),
            failureScreenshot: failureScreenshotPath,
            failureTimestamp: failureTime
        };
        const executionSummary = `Test failed during: ${currentStep}\n` +
            `Previous successful steps:\n` +
            `1. Navigate to Add Order page\n` +
            `2. Select Existing Customer\n` +
            `3. Add Products\n` +
            `4. Proceed to Fulfillment\n` +
            `5. Proceed to Payment\n` +
            `6. Verify Summary and Add Comments`;
        await this.updateTestResult(
            sheetName,
            testCaseName,
            'Failed',
            executionSummary,
            failureInfo
        );
        console.log('Successfully recorded detailed test failure in Excel');
    }

    /**
     * Check if the test case should be automated and skip if not
     */
    public async checkAutomationAndSkipIfNeeded(
        testCase: TestCase,
        sheetName: string,
        testCaseName: string,
        test: any
    ): Promise<boolean> {
        const automationValue = String(testCase['Automation']).toLowerCase();
        if (automationValue !== 'true') {
            test.skip(true, `Automation column is not set to true for this test case.`);
            await this.updateTestResult(sheetName, testCaseName, 'Skipped', 'Automation column not true');
            return false;
        }
        return true;
    }

    /**
     * Handle test failure: capture screenshot and record detailed failure in Excel
     */
    public async handleTestFailure(
        sheetName: string,
        testCaseName: string,
        currentStep: string,
        err: any,
        page: any, // Playwright Page
        testCase: TestCase | undefined
    ): Promise<string | undefined> {
        let failureScreenshotPath: string | undefined;
        // Capture failure screenshot
        try {
            if (page && testCase) {
                failureScreenshotPath = `test-results/screenshots/failure_${testCase['Test Case ID']}_${Date.now()}.png`;
                await page.screenshot({ path: failureScreenshotPath });
                console.log(`Captured failure screenshot: ${failureScreenshotPath}`);
            }
        } catch (screenshotErr) {
            console.error('Failed to capture failure screenshot:', screenshotErr);
        }
        // Record detailed failure
        try {
            await this.recordDetailedTestFailure(sheetName, testCaseName, currentStep, err, failureScreenshotPath);
        } catch (excelErr) {
            console.error('Failed to record test failure in Excel:', excelErr);
            console.error('Excel Error:', excelErr);
        }
        return failureScreenshotPath;
    }

    /**
     * Record test success in Excel with details
     */
    public async recordTestSuccess(
        sheetName: string,
        testCaseName: string,
        screenshotPath?: string
    ): Promise<void> {
        const successDetails = [
            'All steps completed successfully',
            `Execution Time: ${new Date().toISOString()}`,
            `Screenshot: ${screenshotPath || 'N/A'}`
        ].join('\n');

        await this.updateTestResult(sheetName, testCaseName, 'Passed', successDetails);
        console.log('Successfully recorded test success in Excel');
    }

    /**
     * Log test summary and record final result in Excel
     */
    public async logTestSummaryAndRecordResult(
        testCase: TestCase,
        testResult: string,
        screenshotPath: string | undefined,
        executionNotes: string,
        sheetName: string,
        testCaseName: string
    ): Promise<void> {
        console.log('\nTest Summary:');
        console.table([
            {
                'Test Case': testCase['Test Case Name'],
                'Result': testResult,
                'Screenshot': screenshotPath || 'N/A',
                'Execution_Notes': executionNotes
            }
        ]);

        if (testResult === 'Passed') {
            try {
                await this.recordTestSuccess(sheetName, testCaseName, screenshotPath);
            } catch (excelErr) {
                console.error('Failed to record final test result in Excel:', excelErr);
            }
        }
    }

    /**
     * Capture screenshot and attach to test info
     */
    public async captureAndAttachScreenshot(
        page: any,
        testCase: TestCase,
        testInfo: any
    ): Promise<string> {
        const screenshotPath = `test-results/screenshots/${testCase['Test Case ID']}.png`;
        await page.screenshot({ path: screenshotPath });
        await testInfo.attach('screenshot', { path: screenshotPath, contentType: 'image/png' });
        return screenshotPath;
    }

    /**
     * Get order data by description from JSON
     */
    public getOrderData(description: string) {
        const orderData = orderTestData.testOrders.find(order => order.description === description);
        if (!orderData) throw new Error(`Order data not found for description: ${description}`);
        return orderData;
    }
}