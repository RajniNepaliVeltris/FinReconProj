import * as Excel from 'exceljs';
import * as path from 'path';

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
}