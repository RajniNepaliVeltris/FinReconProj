import { test, expect, chromium } from '@playwright/test';
import { AddProductPage } from '../../../../pages/BigCommercePages/Products/addProductPage';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { ProductData } from '../../../../pages/BigCommercePages/Products/productType';
import * as XLSX from 'xlsx';
import path from 'path';

interface ProductModifier {
  name: string;
  type: string;
  value: string;
  required: boolean;
}

function parseModifiers(row: any): ProductModifier[] {
  const names = row['Modifier name']?.split(',').map((x: string) => x.trim()) || [];
  const types = row['Modifier Type']?.split(',').map((x: string) => x.trim()) || [];
  const values = row['Modifier Value']?.split(',').map((x: string) => x.trim()) || [];
  const requiredFlags = row['Required']?.split(',').map((x: string) => x.trim().toLowerCase() === 'yes') || [];

  const modifiers: ProductModifier[] = [];
  for (let i = 0; i < names.length; i++) {
    if (names[i]) {
      modifiers.push({
        name: names[i],
        type: types[i] || '',
        value: values[i] || '',
        required: requiredFlags[i] || false,
      });
    }
  }
  return modifiers;
}

const excelPath = path.resolve(__dirname, '../../../../data/BigCommerceData/addProductData.xlsx');
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
let productData: ProductData[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

productData = productData.map((row: any) => {
  const clean: any = {};
  for (const key in row) {
    const value = row[key];
    clean[key] = value === null || value === undefined ? '' : String(value);
  }

  clean.dimensions = {
    width: String(row['dimensions.width'] || ''),
    height: String(row['dimensions.height'] || ''),
    depth: String(row['dimensions.depth'] || ''),
  };

  clean.modifiers = parseModifiers(row);

  delete clean['dimensions.width'];
  delete clean['dimensions.height'];
  delete clean['dimensions.depth'];
  return clean as ProductData & { modifiers: ProductModifier[] };
});

let browser: import('@playwright/test').Browser;
let context: import('@playwright/test').BrowserContext;

test.beforeAll(async () => {
  browser = await chromium.connectOverCDP({
    endpointURL: 'http://localhost:9222',
    timeout: 30000,
    slowMo: 100,
  });
  context = browser.contexts()[0];
});

test.afterAll(async () => {
  // Browser intentionally left open for debugging
});

test.describe('Create Products Dynamically (Standard + Bundle + Modifiers)', () => {
  productData.forEach((product) => {
    test(product.productName , async () => {
      const pages = await context.pages();
      const page = pages.length > 0 ? pages[0] : await context.newPage();
      await page.bringToFront();

      const homepage = new Homepage(page);
const addProductPage = new AddProductPage(page);

      // Added try/catch/finally to prevent silent exit
      try {
        console.log(`Starting test for: ${product.productName} (${product.sku})`);

        await test.step('Navigate to Add Product Page', async () => {
          await homepage.navigateToSideMenuOption('Products', 'Add');
          const url = await page.url();
          expect(url).toContain('/manage/products/add');
        });

        // Convert category string to array
        if (typeof product.categories === 'string') {
          product.categories = (product.categories as string)
            .split(',')
            .map((c) => c.trim())
            .filter((c) => c.length > 0);
        }

        const modifiers = (product as any).modifiers || [];
        const hasModifiers =
          modifiers.length > 0 &&
          modifiers.some((m: any) => m.name && m.value);

        await test.step('Fill Product Details', async () => {
          await addProductPage.fillProductDetails(product);
        });

        await test.step('Verify Product Exists by SKU', async () => {
          await homepage.navigateToSideMenuOption('Products', 'All Products');
          const url = await page.url();
          expect(url).toContain('/manage/products');
          await addProductPage.verifyProductExistsBySKU(product.sku);
        });

        console.log(`Completed product: ${product.productName} (${product.sku})`);
      } 
      catch (err) {
        // Added error logging — prevents silent exits
        console.error(` Error while testing SKU ${product.sku}:`, err);
        throw err; // ensure test is marked failed
      } 
      finally {
        // Added end marker to confirm test reached here
        console.log(` Finished test for SKU: ${product.sku}`);
      }
    });
  });
});
