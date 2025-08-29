import { test, expect } from '@playwright/test';
import { AddOrderPage } from '../../../../BigCommercePages/Orders/addOrderPage';
import { Homepage } from '../../../../BigCommercePages/homepage';
import * as testData from '../../../../data/orderTestData.json';

test.describe('Order Creation Tests', () => {
    let homePage: Homepage;
    let addOrderPage: AddOrderPage;

    test.beforeEach(async ({ page }) => {
        homePage = new Homepage(page);
        addOrderPage = new AddOrderPage(page);
        
        // Navigate to homepage and go to Add Order page
        await homePage.navigateAndVerifyMenuSideMenuOption('Orders', 'Add');
    });

    for (const orderData of testData.testOrders) {
        test(`Create order - ${orderData.description}`, async () => {
            //await addOrderPage.createOrder(orderData);
            
            // Add verification steps as needed
            // For example, verify order appears in the orders list
            await homePage.navigateAndVerifyMenuSideMenuOption('Orders', 'Search');
            // Add verification logic here
        });
    }
});