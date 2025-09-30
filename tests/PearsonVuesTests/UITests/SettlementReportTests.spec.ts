import { test, expect, TestInfo } from '@playwright/test';
import { LoginPage } from '../../../pages/PerasonVuewPages/Login/loginPage';
import { HomePage } from '../../../pages/PerasonVuewPages/Dashboard/HomePage';
import { SettlementReportPage } from '../../../pages/PerasonVuewPages/Reports/SettlementReportPage';
import { ExcelReader, TestCase } from '../../../utils/excelReader';

const SHEET_NAME = 'Standard Product'; // adjust if your sheet name differs

test.describe('Settlement Report - Compare BIGC and KIBO order results', () => {
  let excelReader: ExcelReader;

  test.beforeAll(() => {
    excelReader = ExcelReader.getInstance();
  });

  test('Compare results for BIGC and KIBO order IDs from Excel', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const settlementPage = new SettlementReportPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.loginWithDefaults();
    await page.waitForLoadState('networkidle');

    // Navigate to Settlement Report
    await homePage.navigationtoSpecificMenu('Report', 'Settlement Report');
    await settlementPage.waitForElement(settlementPage.resultsContainer, 50000);

    // Read all test cases from Excel sheet
    const allCases: TestCase[] = await excelReader.getAllTestCases(SHEET_NAME);
    // Filter test cases that have both BIGOrderId and KIBOOrderId and are marked for automation
    const relevant = allCases.filter((tc: TestCase) => {
      const auto = String(tc['Automation'] || '').toLowerCase() === 'true';
      const big = (tc['BigC_OrderId'] || '').toString().trim();
      const kibo = (tc['KIBO_OrderId'] || tc['KIBO_OrderId'] || '').toString().trim();
      return auto && big && kibo;
    });

    if (relevant.length === 0) {
      test.skip(true, `No automated test cases with BigC_OrderId and KIBO_OrderId found in sheet '${SHEET_NAME}'`);
      return;
    }

    // Columns to compare (must match visible header text). Adjust as needed.
    const compareColumns = [
      'Finance Client',
      'Site Name',
      'Order Number',
      'Line Item Id',
      'Payment Date',
      'Order Date',
      'Customer Account Id',
      'Payment Method',
      'Currency',
      'Order Status',
      'Line Item Status',
      'Billing Company Name',
      'Billing First Name',
      'Billing Last Name',
      'Billing Address1',
      'Billing Address2',
      'Billing City',
      'Billing State',
      'Billing Postal Or Zipcode',
      'Billing Country',
      'Billing Phone Number',
      'Shipping Company Name',
      'Shipping First Name',
      'Shipping Last Name',
      'Shipping Address1',
      'Shipping Address2',
      'Shipping City',
      'Shipping State',
      'Shipping Postal Or Zip Code',
      'Shipping Country',
      'Shipping Phone Number',
      'Ship To Email',
      'Manufacturer',
      'Finance Product Type',
      'Product Type',
      'Product Usage',
      'Product Name',
      'Product Code',
      'Quantity',
      'Product Price',
      'Sale Price',
      'Total COGS',
      'Discounted Total',
      'Product Loss Amount',
      'Line Item Level Tax',
      'Order Line Discount',
      'Order Shipping',
      'Coupon Code',
      'Order Discount',
      'Shipping Tax',
      'Component Product Price',
      'Component Total Price',
      'FXRate',
      'Discounted Total USD',
      'Product Loss Amount USD',
      'Component Total Price USD',
      'Fee USD',
      'Due to Client USD',
      'Settlement Status'
    ];

    for (const tc of relevant) {
      const testCaseName = String(tc['Test Case Name'] || tc['TestCaseName'] || 'Unnamed');
      const bigOrderId = String(tc['BigC_OrderId']).trim();
      const kiboOrderId = String(tc['KIBO_OrderId'] || tc['KibOrderId']).trim();

      let pearsonUITestResult = 'Passed';
      let pearsonUIExecutionNotes = '';

      await test.step(`Compare order results for test case: ${testCaseName}`, async () => {
        try {
          if (!bigOrderId || !kiboOrderId) {
            throw new Error(`Missing BIG or KIBO order id for test case: ${testCaseName}`);
          }

          // Search KIBO order id first
          await settlementPage.setOrderNumber(kiboOrderId);
          await settlementPage.clickSearch();
          await settlementPage.waitForElement(settlementPage.resultsTable, 5000);

          // Extract comparison values for Kibo
          const rowData = await settlementPage.getRowData(0);
          const kiboValues: Record<string, string> = {};
          for (const col of compareColumns) {
            kiboValues[col] = rowData[col] || '';
            console.log("THE value for kiboValues[col] : ",kiboValues[col]);
          }

          // Search BIGC order id
          await settlementPage.setOrderNumber(bigOrderId);
          await settlementPage.clickSearch();
          await settlementPage.waitForElement(settlementPage.resultsTable, 5000);

          const bigRowCount = await settlementPage.getRowCount();
          if (bigRowCount === 0) throw new Error(`No results found for BIGC Order ID: ${bigOrderId}`);
//360296
          // Extract comparison values for BigC
          const bigRowData = await settlementPage.getRowData(0);
          const bigValues: Record<string, string> = {};
          for (const col of compareColumns) {
            bigValues[col] = bigRowData[col] || '';
          }

          // Compare selected columns
          const mismatches: string[] = [];
          for (const col of compareColumns) {
            const a = kiboValues[col] || '';
            const b = bigValues[col] || '';
            if (a !== b) {
              mismatches.push(`${col}: expected='${a}' got='${b}'`);
            }
          }

          if (mismatches.length > 0) {
            pearsonUITestResult = 'Failed';
            pearsonUIExecutionNotes = `Mismatches: ${mismatches.join('; ')}`;
            throw new Error(pearsonUIExecutionNotes);
          }

          // Record pass in Excel
          pearsonUIExecutionNotes = `All compared columns matched for Kibo:${kiboOrderId} and BigC:${bigOrderId}`;
          await excelReader.updateTestResult(String(SHEET_NAME), String(testCaseName), 'Passed', pearsonUIExecutionNotes, 'pearsonUI');
        } catch (err: any) {
          pearsonUITestResult = 'Failed';
          pearsonUIExecutionNotes = err?.message || String(err);

          try {
            await excelReader.handleTestFailure(String(SHEET_NAME), String(testCaseName), 'Settlement report comparison', err, page, tc as any, 'pearsonUI');
          } catch (innerErr) {
            console.error('Failed to record failure in Excel:', innerErr);
          }

          try {
                await excelReader.updateTestResult(String(SHEET_NAME), String(testCaseName), 'Failed', pearsonUIExecutionNotes, 'pearsonUI');
          } catch (innerErr) {
            console.error('Failed to update test result in Excel:', innerErr);
          }
          throw err;
        } finally {
          try {
              await excelReader.logTestSummaryAndRecordResult(tc as any, pearsonUITestResult, undefined, pearsonUIExecutionNotes, String(SHEET_NAME), String(testCaseName), 'pearsonUI');
          } catch (e) {
            console.error('Failed to log test summary:', e);
          }
        }
      });
    }
  });
});
