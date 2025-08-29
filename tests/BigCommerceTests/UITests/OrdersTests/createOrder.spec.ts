import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/BigCommercePages/Login/loginPage';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { AddOrderPage } from '../../../../pages/BigCommercePages/Orders/addOrderPage';
import orderTestData from '../../../../data/BigCommerceData/orderTestData.json';
import loginTestData from '../../../../data/BigCommerceData/loginTestData.json';

test.describe('Create Order Flow', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();

        // Fetch login data by description
        const loginData = loginTestData.loginTests.find((test: { description: string }) => test.description === "Valid login with admin user");
        if (!loginData) {
            throw new Error("Login data not found for description: Valid login with admin user");
        }
        await loginPage.login(loginData.username, loginData.password);
        if (!loginData.expectedUrl) {
            throw new Error("Expected URL is not defined for the login data.");
        }
        await expect(page).toHaveURL(loginData.expectedUrl);
    });

    test('Create a new order with Standard Product for a new customer', async ({ page }) => {
        const addOrderPage = new AddOrderPage(page);

        // Fetch order data by description
        const orderData = orderTestData.testOrders.find(order => order.description === "New customer with single item");
        if (!orderData) {
            throw new Error("Order data not found for description: New customer with single item");
        }

        // Navigate to Orders - Add Order
        const homepage = new Homepage(page);
        await homepage.navigateToSideMenuOption('Orders', 'Add');
        await expect(page).toHaveURL('/manage/orders/add-order');

        // Create an order using fetched data
        const billingInfo = {
            firstName: orderData.customer.firstName || '',
            lastName: orderData.customer.lastName || '',
            companyName: '',
            phoneNumber: orderData.customer.phone || '',
            addressLine1: orderData.customer.address1 || '',
            addressLine2: orderData.customer.address2 || '',
            suburbCity: orderData.customer.city || '',
            country: orderData.customer.country || '',
            stateProvince: orderData.customer.state || '',
            zipPostcode: orderData.customer.postalCode || '',
            poNumber: '',
            taxID: '',
            saveToAddressBook: orderData.customer.exclusiveOffers || false
        };
        await addOrderPage.fillBillingInformation(billingInfo);

        for (const item of orderData.items) {
            await addOrderPage.addOrderItem(item);
        }

        await addOrderPage.setShippingDetails(orderData.shipping);
        await addOrderPage.setPaymentDetails(orderData.payment);

        // Submit the order
        await page.locator('//button[contains(text(), "Create Order")]').click();
        await expect(page.locator('//div[contains(text(), "Order created successfully")]')).toBeVisible();
    });
});