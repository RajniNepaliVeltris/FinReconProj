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
         * Update Test_Result and Execution_Notes for a test case in the Excel sheet
         */
        public async updateTestResult(sheetName: string, testCaseName: string, result: string, notes: string): Promise<void> {
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

            // Find the row for the test case
            let foundRow: any = null;
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header
                const nameCell = row.getCell(headers['Test Case Name']);
                if (nameCell.value?.toString() === testCaseName) {
                    foundRow = row;
                }
            });

            if (!foundRow) {
                throw new Error(`Test case '${testCaseName}' not found in sheet '${sheetName}'`);
            }

            // Update result and notes
            if (headers['Test_Result']) {
                foundRow.getCell(headers['Test_Result']).value = result;
            }
            if (headers['Execution_Notes']) {
                foundRow.getCell(headers['Execution_Notes']).value = notes;
            }
            await workbook.xlsx.writeFile(path.join(__dirname, '../data/BigCommerceData/BigC_Ecomm_TestCases_AutomationMasterSheet.xlsx'));
        }
}