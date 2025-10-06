import { Locator, Page } from '@playwright/test';
import { BasePage } from '../Base/basePage';

export class SettlementReportPage extends BasePage {
  // Filters
  readonly monthSelect: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly clientSelect: Locator;
  readonly settlementStatusSelect: Locator;
  readonly productUsageSelect: Locator;
  readonly orderNumberInput: Locator;
  readonly searchButton: Locator;

  // Action buttons
  readonly reapplyComponentPriceBtn: Locator;
  readonly reapplyFxRateBtn: Locator;
  readonly finalizeBtn: Locator;
  readonly excelBtn: Locator;

  // Results / table
  readonly resultsContainer: Locator;
  readonly resultsTable: Locator;
  readonly tableRows: Locator;
  readonly paginationPrev: Locator;
  readonly paginationNext: Locator;
  readonly noDataMessage: Locator;

  // Cached headers for performance
  private cachedHeaders: string[] | null = null;

  constructor(page: Page) {
    super(page);

    // Filters area - based on screenshot structure
    this.monthSelect = page.locator('#Month');
    this.fromDateInput = page.locator('#txtStartIssueDate');
    this.toDateInput = page.locator('#txtEndIssueDate');
    this.clientSelect = page.locator('#Client');
    this.settlementStatusSelect = page.locator('#SettlementStatus');
    this.productUsageSelect = page.locator('#ProductUsage');
    this.orderNumberInput = page.locator('#txtOrderNumber');
    this.searchButton = page.locator('#btnSearch');

    // Action buttons (these appear above the table)
    this.reapplyComponentPriceBtn = page.locator('#reapplyComponentPrice');
    this.reapplyFxRateBtn = page.locator('#FxRate');
    this.finalizeBtn = page.locator('#Finalize');
    this.excelBtn = page.locator('#ExportToExcel');

    // Results
    this.resultsContainer = page.locator('#myTable_wrapper');
    this.resultsTable = this.resultsContainer.locator("//table[@id='myTable']");
    this.tableRows = this.resultsTable.locator('tbody tr');
    this.paginationPrev = this.resultsContainer.locator('button:has-text("Previous"), a:has-text("Previous")').first();
    this.paginationNext = this.resultsContainer.locator('button:has-text("Next"), a:has-text("Next")').first();
    this.noDataMessage = this.resultsTable.locator('#myTable_info');
  }

  async setMonth(value: string): Promise<void> {
    try {
      await this.selectDropdownOption(this.monthSelect, value);
    } catch (error) {
      console.error(`setMonth failed for value='${value}'`, error);
      throw new Error(`setMonth failed: ${error}`);
    }
  }

  async setFromDate(value: string): Promise<void> {
    try {
      await this.clearAndEnterText(this.fromDateInput, value);
    } catch (error) {
      console.error(`setFromDate failed for value='${value}'`, error);
      throw new Error(`setFromDate failed: ${error}`);
    }
  }

  async setToDate(value: string): Promise<void> {
    try {
      await this.clearAndEnterText(this.toDateInput, value);
    } catch (error) {
      console.error(`setToDate failed for value='${value}'`, error);
      throw new Error(`setToDate failed: ${error}`);
    }
  }

  async setClient(value: string): Promise<void> {
    try {
      await this.selectDropdownOption(this.clientSelect, value);
    } catch (error) {
      console.error(`setClient failed for value='${value}'`, error);
      throw new Error(`setClient failed: ${error}`);
    }
  }

  async setSettlementStatus(value: string): Promise<void> {
    try {
      await this.selectDropdownOption(this.settlementStatusSelect, value);
    } catch (error) {
      console.error(`setSettlementStatus failed for value='${value}'`, error);
      throw new Error(`setSettlementStatus failed: ${error}`);
    }
  }

  async setProductUsage(value: string): Promise<void> {
    try {
      await this.selectDropdownOption(this.productUsageSelect, value);
    } catch (error) {
      console.error(`setProductUsage failed for value='${value}'`, error);
      throw new Error(`setProductUsage failed: ${error}`);
    }
  }

  async setOrderNumber(value: string): Promise<void> {
    try {
      await this.clearAndEnterText(this.orderNumberInput, value);
    } catch (error) {
      console.error(`setOrderNumber failed for value='${value}'`, error);
      throw new Error(`setOrderNumber failed: ${error}`);
    }
  }

  async clickSearch(): Promise<void> {
    try {
      await this.clickElement(this.searchButton, 'Search button');
      await this.waitForNetworkIdle(5000);
    } catch (error) {
      console.error('clickSearch failed', error);
      throw new Error(`clickSearch failed: ${error}`);
    }
  }

  async clickReapplyComponentPrice(): Promise<void> {
    try {
      await this.clickElement(this.reapplyComponentPriceBtn, 'Reapply Component Price');
    } catch (error) {
      console.error('clickReapplyComponentPrice failed', error);
      throw new Error(`clickReapplyComponentPrice failed: ${error}`);
    }
  }

  async clickReapplyFxRate(): Promise<void> {
    try {
      await this.clickElement(this.reapplyFxRateBtn, 'Reapply FxRate');
    } catch (error) {
      console.error('clickReapplyFxRate failed', error);
      throw new Error(`clickReapplyFxRate failed: ${error}`);
    }
  }

  async clickFinalize(): Promise<void> {
    try {
      await this.clickElement(this.finalizeBtn, 'Finalize');
    } catch (error) {
      console.error('clickFinalize failed', error);
      throw new Error(`clickFinalize failed: ${error}`);
    }
  }

  async clickExcel(): Promise<void> {
    try {
      await this.clickElement(this.excelBtn, 'Excel');
    } catch (error) {
      console.error('clickExcel failed', error);
      throw new Error(`clickExcel failed: ${error}`);
    }
  }

  async getRowCount(): Promise<number> {
    try {
      return await this.tableRows.count();
    } catch (error) {
      console.error('getRowCount failed', error);
      throw new Error(`getRowCount failed: ${error}`);
    }
  }

 async getCellText(rowIndex: number, columnIndex: number): Promise<string> {
  const maxAttempts = 3;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const row = this.tableRows.nth(rowIndex);
      await row.waitFor({ state: 'visible', timeout: 5000 });

      // Get all cell texts at once
      const cells = row.locator('td');
      const texts = await cells.allTextContents();
      const text = (texts[columnIndex] || '').trim();

      if (text) return text;
      else throw new Error(`Cell text is empty on attempt ${attempt}`);

    } catch (err) {
      lastError = err;
      console.warn(
        `getCellText attempt ${attempt}/${maxAttempts} failed for row=${rowIndex}, col=${columnIndex}: ${err instanceof Error ? err.message : err}`
      );

      if (err instanceof Error && err.message.includes('page/context/browser is closed')) {
        throw err; // unrecoverable
      }
    }

    // Retry with exponential backoff
    const backoff = 250 * 2 ** (attempt - 1);
    await this.page.waitForTimeout(backoff);
  }

  console.error(`getCellText failed after ${maxAttempts} attempts for row=${rowIndex}, col=${columnIndex}`, lastError);
  throw new Error(`getCellText failed for row=${rowIndex}, col=${columnIndex}`);
}

  async goToNextPage(): Promise<void> {
    try {
      if (await this.isElementVisible(this.paginationNext, 1000)) {
        await this.clickElement(this.paginationNext, 'Next page');
      }
    } catch (error) {
      console.error('goToNextPage failed', error);
      throw new Error(`goToNextPage failed: ${error}`);
    }
  }

  async goToPreviousPage(): Promise<void> {
    try {
      if (await this.isElementVisible(this.paginationPrev, 1000)) {
        await this.clickElement(this.paginationPrev, 'Previous page');
      }
    } catch (error) {
      console.error('goToPreviousPage failed', error);
      throw new Error(`goToPreviousPage failed: ${error}`);
    }
  }

  async getRowTexts(rowIndex: number): Promise<string[]> {
    const maxAttempts = 3;
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const row = this.tableRows.nth(rowIndex);
        await row.waitFor({ state: 'visible', timeout: 5000 });

        // Get all cell texts at once
        const cells = row.locator('td');
        const texts = await cells.allTextContents();
        return texts.map(t => t.trim());

      } catch (err) {
        lastError = err;
        console.warn(
          `getRowTexts attempt ${attempt}/${maxAttempts} failed for row=${rowIndex}: ${err instanceof Error ? err.message : err}`
        );

        if (err instanceof Error && err.message.includes('page/context/browser is closed')) {
          throw err; // unrecoverable
        }
      }

      // Retry with exponential backoff
      const backoff = 250 * 2 ** (attempt - 1);
      await this.page.waitForTimeout(backoff);
    }

    console.error(`getRowTexts failed after ${maxAttempts} attempts for row=${rowIndex}`, lastError);
    throw new Error(`getRowTexts failed for row=${rowIndex}`);
  }

  async getRowData(rowIndex: number): Promise<Record<string, string>> {
    if (!this.cachedHeaders) {
      const headerElements = this.resultsTable.locator('thead th');
      this.cachedHeaders = (await headerElements.allTextContents()).map((h: string) => h.trim());
    }
    const headers = this.cachedHeaders;
    const texts = await this.getRowTexts(rowIndex);

    const data: Record<string, string> = {};
    headers.forEach((header: string, index: number) => {
      data[header] = texts[index] || '';
    });
    return data;
  }

  async filterAndSearch(filters: { month?: string; fromDate?: string; toDate?: string; client?: string; settlementStatus?: string; productUsage?: string; orderNumber?: string; }): Promise<Record<string, string> | void> {
    try {
      if (filters.month) {
        try {
          await this.setMonth(filters.month);
        } catch (error) {
          console.warn(`Skipping month filter '${filters.month}': ${error}`);
        }
      }
      if (filters.fromDate) {
        try {
          await this.setFromDate(filters.fromDate);
          //close the date picker if it remains open
          await this.clickElement(this.fromDateInput, 'fromDate input');
          await this.page.keyboard.press('Escape');
        } catch (error) {
          console.warn(`Skipping fromDate filter '${filters.fromDate}': ${error}`);
        }
      }
      if (filters.toDate) {
        try {
          await this.setToDate(filters.toDate);
          //close the date picker if it remains open
          await this.clickElement(this.toDateInput, 'toDate input');
          await this.page.keyboard.press('Escape');
        } catch (error) {
          console.warn(`Skipping toDate filter '${filters.toDate}': ${error}`);
        }
      }
      if (filters.client) {
        try {
          await this.setClient(filters.client);
        } catch (error) {
          console.warn(`Skipping client filter '${filters.client}': ${error}`);
        }
      }
      if (filters.settlementStatus) {
        try {
          await this.setSettlementStatus(filters.settlementStatus);
        } catch (error) {
          console.warn(`Skipping settlementStatus filter '${filters.settlementStatus}': ${error}`);
        }
      }
      if (filters.productUsage) {
        try {
          await this.setProductUsage(filters.productUsage);
        } catch (error) {
          console.warn(`Skipping productUsage filter '${filters.productUsage}': ${error}`);
        }
      }
      if (filters.orderNumber) {
        try {
          await this.setOrderNumber(filters.orderNumber);
        } catch (error) {
          console.warn(`Skipping orderNumber filter '${filters.orderNumber}': ${error}`);
        }
      }
      await this.page.waitForTimeout(1000);
      await this.clickSearch();
      //wait extra time for results to load

      await this.waitForElement(this.resultsTable, 5000);
      //if no results found, throw error
      
      const rowCount = await this.getRowCount();
      if (rowCount === 0) {
         console.error('No results found');

      }
      else if (rowCount === 1) {
        return await this.getRowData(0);

      }
    } catch (error) {
      console.error('Error filtering and searching:', error);
      throw new Error(`Failed to apply filters: ${error}`);
    }
  }
}
