import { test, expect, chromium } from '@playwright/test';
import { AddProductPage } from '../../../../pages/BigCommercePages/Products/addProduct';
import productData from '../../../../data/BigCommerceData/addProductData.json';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { ProductData } from '../../../../pages/BigCommercePages/Products/productType';

if (!productData || !Array.isArray(productData)) {
    throw new Error('productData is undefined or not an array. Check the import path and JSON file.');
}

let browser: import('@playwright/test').Browser;
let context: import('@playwright/test').BrowserContext;

test.beforeAll(async () => {
    browser = await chromium.connectOverCDP({
        endpointURL: 'http://localhost:9222',
        timeout: 30000,
        slowMo: 100
    });
    const contexts = browser.contexts();
    context = contexts[0];
});

test.afterAll(async () => {
    // Do not close the browser
});

test.describe('Create New Product', () => {
    if (Array.isArray(productData)) {
        (productData as ProductData[]).forEach((product) => {
            test(product.productName, async () => {
                const pages = await context.pages();
                const page = pages.length > 0 ? pages[0] : await context.newPage();
                await test.step('Bring page to front', async () => {
                    await page.bringToFront();
                });

                const homepage = new Homepage(page);

                await test.step('Navigate to Add Product page', async () => {
                    await homepage.navigateToSideMenuOption('Products', 'Add');
                    const url = await page.url();
                    expect(url).toContain('/manage/products/add');
                });

                const addProductPage = new AddProductPage(page);
                await test.step('Fill Product Details', async () => {
                    await addProductPage.fillProductDetails(product);
                });
                await test.step('Verify Prodcut Exists By SKU', async () => {
                    await homepage.navigateToSideMenuOption('Products', 'All Products');
                    const url = await page.url();
                    expect(url).toContain('/manage/products');
                    await addProductPage.verifyProductExistsBySKU(product.sku);
                });
            });
        });
    }
});
