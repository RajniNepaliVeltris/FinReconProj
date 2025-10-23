import { test, expect, chromium } from '@playwright/test';
import { AddProductPage } from '../../../../pages/BigCommercePages/Products/addProductPage';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { ProductData } from '../../../../pages/BigCommercePages/Products/productType';
import * as XLSX from 'xlsx';
import path from 'path';

// Read Excel file instead of JSON
const excelPath = path.resolve(__dirname, '../../../../data/BigCommerceData/addProductData.xlsx');
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
let productData: ProductData[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

productData = productData.map((row: any) => {
    const clean: any = {};
    for (const key in row) {
        const value = row[key];
        clean[key] = value === null || value === undefined ? "" : String(value);
    }
    clean.dimensions = {
    width: String(row['dimensions.width'] || ''),
    height: String(row['dimensions.height'] || ''),
    depth: String(row['dimensions.depth'] || '')
  };

    delete clean['dimensions.width'];
    delete clean['dimensions.height'];
    delete clean['dimensions.depth'];
    return clean as ProductData;
});

if (!productData || !Array.isArray(productData)) {
  throw new Error(' productData is undefined or not an array. Check Excel path and structure.');
}

let browser: import('@playwright/test').Browser;
let context: import('@playwright/test').BrowserContext;

test.beforeAll(async () => {
  browser = await chromium.connectOverCDP({
    endpointURL: 'http://localhost:9222',
    timeout: 30000,
    slowMo: 100,
  });
  const contexts = browser.contexts();
  context = contexts[0];
});

test.afterAll(async () => {
  // Keeping browser open intentionally
});

// Main Product Creation Loop
test.describe('Create New Product', () => {
  productData.forEach((product) => {
    test(product.productName, async () => {
      const pages = await context.pages();
      const page = pages.length > 0 ? pages[0] : await context.newPage();
      await page.bringToFront();

      const homepage = new Homepage(page);

      await test.step('Navigate to Add Product page', async () => {
        await homepage.navigateToSideMenuOption('Products', 'Add');
        const url = await page.url();
        expect(url).toContain('/manage/products/add');
      });

      const addProductPage = new AddProductPage(page);

      //  Convert categories string → array (important for Excel)
      if (typeof product.categories === 'string') {
        product.categories = (product.categories as string)
          .split(',')
          .map((c) => c.trim())
          .filter((c) => c.length > 0);
      }

      await test.step('Fill Product Details', async () => {
        await addProductPage.fillProductDetails(product);
      });

      await test.step('Verify Product Exists By SKU', async () => {
        await homepage.navigateToSideMenuOption('Products', 'All Products');
        const url = await page.url();
        expect(url).toContain('/manage/products');
        await addProductPage.verifyProductExistsBySKU(product.sku);
      });
    });
  });
});
