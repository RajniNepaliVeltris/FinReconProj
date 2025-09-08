import { test, expect } from '@playwright/test';
import { ExcelReader } from '../utils/excelReader';
import * as Excel from 'exceljs';
import * as path from 'path';

test('should read test case and display headers from Custom Product sheet', async () => {
    // First, let's check the headers in the Excel file
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, '../data/BigCommerceData/BigC_Ecomm_TestCases_AutomationMasterSheet.xlsx'));
    const worksheet = workbook.getWorksheet('Custom Product');
    
    console.log('Available headers in Custom Product sheet:');
    worksheet?.getRow(1).eachCell((cell, colNumber) => {
        console.log(`Column ${colNumber}: ${cell.value}`);
    });

    // Now try to read a test case
    const excelReader = ExcelReader.getInstance();
    //const testCase = await excelReader.getTestCaseById('TC0193', 'Custom Product');
    const testCase = await excelReader.getTestCase({ scenario: 'Existing customer with Custom Product', sheetName: 'Custom Product' });
    if (!testCase) {
        throw new Error('Test case not found in Excel sheet');
    }

    console.log('\nTest Case Data:', testCase);
    expect(testCase).toBeDefined();
});