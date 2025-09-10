import { test, expect, chromium } from '@playwright/test';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { AddOrderPage } from '../../../../pages/BigCommercePages/Orders/addOrderPage';
import orderTestData from '../../../../data/BigCommerceData/orderTestData.json';
import { ExcelReader } from '../../../../utils/excelReader';

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
    test('should create a new order with a standard product for a new customer', async () => {
        const pages = await context.pages();
        const page = pages.length > 0 ? pages[0] : await context.newPage();
        await test.step('Bring page to front', async () => {
            await page.bringToFront();
        });

            const orderData = await test.step('Fetch order data', async () => {
                return orderTestData.testOrders.find(order => order.description === 'Order with Standard product - Fulfillment using Billing Address');
            });
            if (!orderData) {
                throw new Error('Order data not found for description: Order with Standard product - Fulfillment using Billing Address');
            }

            const homepage = new Homepage(page);
            await test.step('Navigate to Add Order page', async () => {
                await homepage.navigateToSideMenuOption('Orders', 'Add');
                await expect(page).toHaveURL('https://store-8ijomozpnx.mybigcommerce.com/manage/orders/add-order');
                await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
            });

            const addOrderPage = new AddOrderPage(page);
            await test.step('Fill New Customer Details', async () => {
                await addOrderPage.selectAndFillNewCustomerDetails({
                    email: orderData.customer.email,
                    password: orderData.customer.password || "DefaultPassword123",
                    confirmPassword: orderData.customer.confirmPassword || "DefaultPassword123",
                    exclusiveOffers: orderData.customer.exclusiveOffers || false,
                    lineOfCredit: orderData.customer.lineOfCredit || '',
                    paymentTerms: orderData.customer.paymentTerms || '',
                    customerGroup: orderData.customer.customerGroup || ''
                });
            });
            await test.step('Set Transactional Currency', async () => {
                if (orderData.customer.transactionalCurrency) {
                    await addOrderPage.setTransactionalCurrency(orderData.customer.transactionalCurrency);
                }
            });
            await test.step('Fill Billing Information', async () => {
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
            });
            await test.step('Proceed to Add Items', async () => {
                await addOrderPage.clickNextButton();
            });
            await test.step('Add Products', async () => {
                const productCount = 1; // Specify the number of products to add
                for (let i = 0; i < Math.min(productCount, orderData.items?.length || 0); i++) {
                    const customProductDetails = orderData.items![i];
                    await addOrderPage.clickAddCustomProductLink();
                    await addOrderPage.verifyCustomProductDialogOpen();
                    await addOrderPage.addCustomProductDetails({
                        productName: customProductDetails.productName,
                        sku: customProductDetails.sku,
                        price: customProductDetails.price.toString(),
                        quantity: customProductDetails.quantity.toString()
                    });
                }
            });
            await test.step('Verify Subtotal', async () => {
                await addOrderPage.verifySubtotal(orderData.expectedProductSubtotal || '');
            });
            await test.step('Proceed to Fulfillment', async () => {
                await addOrderPage.clickNextButton();
            });
            await test.step('Verify Billing Address', async () => {
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
            });
            await test.step('Select Shipping Method', async () => {
                await addOrderPage.selectShippingMethod(orderData.ShippingMethod || '');
            });
            await test.step('Set Custom Shipping Details', async () => {
                const customShippingDetails = {
                    provider: orderData.shipping?.method || '',
                    cost: orderData.shipping?.price?.toString() || ''
                };
                await addOrderPage.setCustomShippingDetails(customShippingDetails);
            });
            await test.step('Proceed to Payment', async () => {
                await addOrderPage.clickNextButton();
            });
            await test.step('Verify Payment & Fulfillment', async () => {
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
                await addOrderPage.verifyPaymentCustomerBillingDetails(expectedBillingDetails);
                console.log("About to verify fulfillment shipping details...");
                await addOrderPage.ensureShippingDetailsVisible();
                await addOrderPage.verifyFulfillmentShippingDetails(expectedBillingDetails);
            });
            await test.step('Add Comments & Staff Notes', async () => {
                await addOrderPage.fillComments(orderData.comments || 'Default customer comment');
                await addOrderPage.fillStaffNotes(orderData.staffNotes || 'Default staff note');
            });
            await test.step('Select Payment Method & Verify Summary', async () => {
                await addOrderPage.selectPaymentMethod(orderData.payment?.paymentCategory || '');
                await addOrderPage.verifyPaymentMethodSelected(orderData.payment?.paymentCategory || '');
                await addOrderPage.verifySummaryDetails({
                    subtotal: orderData.expectedPaymentSummary?.subtotal || '',
                    shipping: orderData.expectedPaymentSummary?.shipping || '',
                    grandTotal: orderData.expectedPaymentSummary?.grandTotal || '',
                    taxIncludedInTotal: orderData.expectedPaymentSummary?.taxIncludedInTotal || ''
        });
    });
});    test('Order with Custom product - Fulfillment using Billing Address', async () => {
        const pages = await context.pages();
        const page = pages.length > 0 ? pages[0] : await context.newPage();
        await test.step('Bring page to front', async () => {
            await page.bringToFront();
        });

        const orderData = await test.step('Fetch order data', async () => {
            return orderTestData.testOrders.find(order => order.description === "Existing customer with Standard Product");
        });
        if (!orderData) {
            throw new Error("Order data not found for description: Existing customer with Standard Product");
        }

        // Fetch test case data from Excel
        const excelReader = ExcelReader.getInstance();
        const tc = await excelReader.getTestCase({ testCase: undefined, sheetName: 'Custom Product' });
        if (!tc) {
            throw new Error('Test case not found in Excel sheet');
        }

        // Log test case information
        console.log(`Executing Test Case: ${tc['Test Case ID']}`);
        console.log(`Scenario: ${tc['Test Scenario']}`);
        console.log(`Pre-Condition: ${tc['Pre-Condition']}`);
        console.log(`Payment Method: ${tc['Payment Method']}`);
        console.log(`Expected Result: ${tc['Expected Result']}`);

        // Use Excel data for test logic
        const homepage = new Homepage(page);
        await test.step('Navigate to Add Order page', async () => {
            await homepage.navigateToSideMenuOption('Orders', 'Add');
            await expect(page).toHaveURL('https://store-5nfoomf2b4.mybigcommerce.com/manage/orders/add-order');
            await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
        });

        const addOrderPage = new AddOrderPage(page);
        await test.step('Select Existing Customer', async () => {
            await addOrderPage.selectAndFillExistingCustomerDetails(
                orderData.customer?.email || '',
                orderData.customer?.existingCustomerAddressCard || ''
            );
        });
        await test.step('Proceed to Add Items', async () => {
            await addOrderPage.clickNextButton();
        });
        await test.step('Add Products', async () => {
            const productName = tc['Product_Name'] || '';
            const sku = tc['Product_SKU'] || '';
            const price = tc['Product_Price'] || 0;
            const quantity = Number(tc['Product_Quantity']) || 1;

                await addOrderPage.clickAddCustomProductLink();
                await addOrderPage.verifyCustomProductDialogOpen();
                await addOrderPage.addCustomProductDetails({
                    productName,
                    sku,
                    price: price.toString(),
                    quantity: '1'
                });
        });
        await test.step('Proceed to Fulfillment', async () => {
            await addOrderPage.clickNextButton();
        });
        await test.step('Select Shipping Method', async () => {
            await addOrderPage.selectShippingMethod(orderData.ShippingMethod || '');
        });
        await test.step('Set Custom Shipping Details', async () => {
            const customShippingDetails = {
                provider: tc['Shipping_Provider'] || '',
                cost: tc['Shipping_Cost']?.toString() || ''
            };
            await addOrderPage.setCustomShippingDetails(customShippingDetails);
        });
        await test.step('Proceed to Payment', async () => {
            await addOrderPage.clickNextButton();
        });
        await test.step('Select Payment Method & Verify Summary', async () => {
            await addOrderPage.selectPaymentMethod(tc['Payment_Category'] || '');
            await addOrderPage.verifyPaymentMethodSelected(tc['Payment_Category'] || '');
             const expectedPaymentDetails = {
                subtotal: tc['ExpectedPaySum_subtotalAmt']?.toString() || '',
                shipping: tc['ExpectedPaySum_shippingAmt']?.toString() || '',
                taxIncludedInTotal: tc['ExpectedPaySum_taxAmt']?.toString() || '',
                grandTotal: tc['ExpectedPaySum_totalAmt']?.toString() || ''
            };
            await addOrderPage.verifySummaryDetails(expectedPaymentDetails);
        });
        await test.step('Add Comments & Staff Notes', async () => {
            await addOrderPage.fillComments(tc['Comments'] || 'Default customer comment');
            await addOrderPage.fillStaffNotes(tc['Staff_Notes'] || 'Default staff note');
        });
    });
});