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
    await settlementPage.waitForElement(settlementPage.resultsContainer, 5000);

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
      'Order Number',
      'Total',
      'Customer Account Id',
      'Order Status',
      'Line Item Status'
    ];

    for (const tc of relevant) {
      const testCaseName = String(tc['Test Case Name'] || tc['TestCaseName'] || 'Unnamed');
      const bigOrderId = String(tc['BigC_OrderId']).trim();
      const kiboOrderId = String(tc['KIBO_OrderId'] || tc['KibOrderId']).trim();

      let testResult = 'Passed';
      let executionNotes = '';

      await test.step(`Compare order results for test case: ${testCaseName}`, async () => {
        try {
          if (!bigOrderId || !kiboOrderId) {
            throw new Error(`Missing BIG or KIBO order id for test case: ${testCaseName}`);
          }

          // Search KIBO order id first
          await settlementPage.setOrderNumber(kiboOrderId);
          await settlementPage.clickSearch();
          await settlementPage.waitForElement(settlementPage.resultsTable, 5000);

          // Read headers to map column indices
          const headers = (await settlementPage.resultsTable.locator('thead th').allTextContents()).map(h => h.trim());
          const headerIndexMap: Record<string, number> = {};
          headers.forEach((h, i) => (headerIndexMap[h] = i));

          // Ensure at least one result
          const kiboRowCount = await settlementPage.getRowCount();
          if (kiboRowCount === 0) throw new Error(`No results found for KIBO Order ID: ${kiboOrderId}`);

          // Extract comparison values for Kibo
          const kiboValues: Record<string, string> = {};
          for (const col of compareColumns) {
            const idx = headerIndexMap[col];
            if (idx === undefined) continue;
            kiboValues[col] = (await settlementPage.getCellText(0, idx)).trim();
          }

          // Search BIGC order id
          await settlementPage.setOrderNumber(bigOrderId);
          await settlementPage.clickSearch();
          await settlementPage.waitForElement(settlementPage.resultsTable, 5000);

          const bigRowCount = await settlementPage.getRowCount();
          if (bigRowCount === 0) throw new Error(`No results found for BIGC Order ID: ${bigOrderId}`);

          // Extract comparison values for BigC
          const bigValues: Record<string, string> = {};
          for (const col of compareColumns) {
            const idx = headerIndexMap[col];
            if (idx === undefined) continue;
            bigValues[col] = (await settlementPage.getCellText(0, idx)).trim();
          }

          // Compare selected columns
          const mismatches: string[] = [];
          for (const col of compareColumns) {
            if (headerIndexMap[col] === undefined) continue; // skipped
            const a = kiboValues[col] || '';
            const b = bigValues[col] || '';
            if (a !== b) {
              mismatches.push(`${col}: expected='${a}' got='${b}'`);
            }
          }

          if (mismatches.length > 0) {
            testResult = 'Failed';
            executionNotes = `Mismatches: ${mismatches.join('; ')}`;
            throw new Error(executionNotes);
          }

          // Record pass in Excel
          executionNotes = `All compared columns matched for Kibo:${kiboOrderId} and BigC:${bigOrderId}`;
          await excelReader.updateTestResult(String(SHEET_NAME), String(testCaseName), 'Passed', executionNotes);
        } catch (err: any) {
          testResult = 'Failed';
          executionNotes = err?.message || String(err);

          try {
            await excelReader.handleTestFailure(String(SHEET_NAME), String(testCaseName), 'Settlement report comparison', err, page, tc as any);
          } catch (innerErr) {
            console.error('Failed to record failure in Excel:', innerErr);
          }

          try {
            await excelReader.updateTestResult(String(SHEET_NAME), String(testCaseName), 'Failed', executionNotes);
          } catch (innerErr) {
            console.error('Failed to update test result in Excel:', innerErr);
          }

          throw err;
        } finally {
          try {
            await excelReader.logTestSummaryAndRecordResult(tc as any, testResult, undefined, executionNotes, String(SHEET_NAME), String(testCaseName));
          } catch (e) {
            console.error('Failed to log test summary:', e);
          }
        }
      });
    }
  });
});
