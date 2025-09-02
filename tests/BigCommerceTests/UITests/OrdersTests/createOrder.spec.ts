import { test, expect, chromium } from '@playwright/test';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { AddOrderPage } from '../../../../pages/BigCommercePages/Orders/addOrderPage';
import orderTestData from '../../../../data/BigCommerceData/orderTestData.json';

let browser: import('@playwright/test').Browser;
let context: import('@playwright/test').BrowserContext;

test.beforeAll(async () => {
    // Connect to your existing Chrome instance
    browser = await chromium.connectOverCDP({
        endpointURL: 'http://localhost:9222',
        timeout: 30000,
        slowMo: 100 // Add a small delay for debugging
    });
    // Get the existing context
    const contexts = browser.contexts();
    context = contexts[0];
});

test.afterAll(async () => {
    // Don't close the browser since it's your existing instance
});

test.describe('Create Order Flow', () => {
    test('Create a new order with Standard Product for a new customer', async () => {
        // Use existing tab or create new one
        const pages = await context.pages();
        const page = pages.length > 0 ? pages[0] : await context.newPage();
        // Bring the page to front for debugging
        await page.bringToFront();
        const addOrderPage = new AddOrderPage(page);

        // Fetch order data by description
        const orderData = orderTestData.testOrders.find(order => order.description === "New customer with single item");
        if (!orderData) {
            throw new Error("Order data not found for description: New customer with single item");
        }

        // Step 1: Navigate to Orders - Add Order
        const homepage = new Homepage(page);
        await homepage.navigateToSideMenuOption('Orders', 'Add');
        await expect(page).toHaveURL('https://store-8ijomozpnx.mybigcommerce.com/manage/orders/add-order');
        //await expect(page.locator('//h1')).toHaveText('Add an Order');

        // Step 2: Select New Customer
        await addOrderPage.selectNewCustomer();

        // Step 3: Fill new customer details
        await addOrderPage.fillNewCustomerDetails({
            email: orderData.customer.email,
            password: orderData.customer.password || "DefaultPassword123",
            confirmPassword: orderData.customer.confirmPassword || "DefaultPassword123",
            exclusiveOffers: orderData.customer.exclusiveOffers || false,
            lineOfCredit: orderData.customer.lineOfCredit || '',
            paymentTerms: orderData.customer.paymentTerms || '',
            customerGroup: orderData.customer.customerGroup || ''
        });

        // Step 4: Fill billing information
        const billingInfo = {
            firstName: orderData.customer.firstName || '',
            lastName: orderData.customer.lastName || '',
            companyName: orderData.customer.companyName || '',
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

        // Step 5: Proceed to Add Items page
        await addOrderPage.clickNextButton();

        // Step 6: Add products
        const productCount = 1; // Specify the number of products to add
        for (let i = 0; i < Math.min(productCount, orderData.items.length); i++) {
            const customProductDetails = orderData.items[i];

            // Add custom product
            await addOrderPage.clickAddCustomProductLink();
            await addOrderPage.verifyCustomProductDialogOpen();
            await addOrderPage.addCustomProductDetails({
                name: customProductDetails.productName,
                sku: customProductDetails.sku,
                price: customProductDetails.price.toString(),
                quantity: customProductDetails.quantity.toString()
            });
        }

        // Step 7: Verify added products
        for (const item of orderData.items.slice(0, productCount)) {
            await addOrderPage.verifyProductInTable({
                name: item.productName,
                sku: item.sku,
                price: item.price?.toString(),
                quantity: item.quantity?.toString()
            });
        }

        // Step 8: Verify subtotal
        await addOrderPage.verifySubtotal(orderData.expectedProductSubtotal || '');

        // Step 9: Proceed to Fulfillment page
        await addOrderPage.clickNextButton();

        // Step 10: Verify billing address details
        const expectedBillingDetails = {
            Name: orderData.expectedBillingDetails?.Name || '',
            Company: orderData.expectedBillingDetails?.Company || '',
            Phone: orderData.expectedBillingDetails?.Phone || '',
            Address: orderData.expectedBillingDetails?.Address || '',
            "Suburb/City": orderData.expectedBillingDetails?.["Suburb/City"] || '',
            "State/Province": orderData.expectedBillingDetails?.["State/Province"] || '',
            Country: orderData.expectedBillingDetails?.Country || '',
            "ZIP/Postcode": orderData.expectedBillingDetails?.["ZIP/Postcode"] || ''
        };
        await addOrderPage.verifyBillingAddressDetails(expectedBillingDetails);

        // Step 11: Select shipping method
        await addOrderPage.selectShippingMethod('Custom');

        // Step 12: Set custom shipping details
        const customShippingDetails = {
            method: orderData.shipping.method || 'Custom Shipping',
            cost: orderData.shipping.price?.toString() || '0.00'
        };
        await addOrderPage.setCustomShippingDetails(customShippingDetails);

        // Step 13: Proceed to Payment page
        await addOrderPage.clickNextButton();

        // Step 14: Verify payment and fulfillment details
        await addOrderPage.verifyPaymentCustomerBillingDetails(expectedBillingDetails);
        await addOrderPage.verifyFulfillmentShippingDetails(expectedBillingDetails);

        // Step 15: Verify product items at payment stage
        const expectedProducts = orderData.items.map(item => ({
            name: item.productName,
            quantity: item.quantity.toString(),
            price: `$${item.price.toFixed(2)}`,
            total: `$${(item.price * item.quantity).toFixed(2)}`
        }));
        await addOrderPage.verifyFulfillmentProductTable(expectedProducts);

        // Step 16: Add order comments and staff notes
        await addOrderPage.fillComments(orderData.comments || 'Default customer comment');
        await addOrderPage.fillStaffNotes(orderData.staffNotes || 'Default staff note');

        // Step 17: Select payment method and verify summary details
        await addOrderPage.selectPaymentMethod(orderData.payment.method || '');
        await addOrderPage.verifySummaryDetails({
            subtotal: orderData.expectedPaymentSummary?.subtotal || '',
            shipping: orderData.expectedPaymentSummary?.shipping || '',
            grandTotal: orderData.expectedPaymentSummary?.grandTotal || ''
        });
    });
});