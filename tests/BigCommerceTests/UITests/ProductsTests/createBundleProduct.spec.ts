import { test, expect, chromium } from '@playwright/test';
import { AddProductPage } from '../../../../pages/BigCommercePages/Products/addProduct';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { ProductData } from '../../../../pages/BigCommercePages/Products/productType';
import * as XLSX from 'xlsx';
import path from 'path';

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

let browser: import('@playwright/test').Browser;
let context: import('@playwright/test').BrowserContext;

test.beforeAll(async () => {
    browser = await chromium.connectOverCDP({ endpointURL: 'http://localhost:9222', timeout: 30000, slowMo: 100 });
    context = browser.contexts()[0];
});

test.describe('Create New Product with Dynamic Bundle Modifiers', () => {
    productData.forEach((product) => {
        test(product.productName, async () => {
            const pages = await context.pages();
            const page = pages.length > 0 ? pages[0] : await context.newPage();
            await page.bringToFront();

            const homepage = new Homepage(page);
            await homepage.navigateToSideMenuOption('Products', 'Add');
            const addProductPage = new AddProductPage(page);

            // Categories string → array
            if (typeof product.categories === 'string') {
                product.categories = (product.categories as string).split(',').map(c => c.trim()).filter(Boolean);
            }

            await test.step('Fill Product Details', async () => {
        await addProductPage.fillProductDetails(product);
      });

            // Add dynamic modifiers only for bundle products
            const productType = String(product.productType || '').toLowerCase();
            const modifiers = String((product as any).modifiers || '');
            if (productType === 'bundle' && modifiers) {
                await addProductPage.addBundleModifiers(modifiers);
            }

            await homepage.navigateToSideMenuOption('Products', 'All Products');
            await addProductPage.verifyProductExistsBySKU(product.sku);
        });
    });
});
