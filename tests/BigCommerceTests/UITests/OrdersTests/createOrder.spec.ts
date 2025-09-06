import { test, expect, chromium } from '@playwright/test';
import { Homepage } from '../../../../pages/BigCommercePages/Dashboard/homepage';
import { AddOrderPage } from '../../../../pages/BigCommercePages/Orders/addOrderPage';
import orderTestData from '../../../../data/BigCommerceData/orderTestData.json';
import { PerformanceRecorder } from '../../../../utils/PerformanceRecorder';
import { generatePerformanceHtmlReport } from '../../../../utils/performanceHtmlReport';
import * as fs from 'fs';

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
            const perf = new PerformanceRecorder();
            perf.startFlow('Create Order Flow');
            let html = '';
                try {
                    const pages = await context.pages();
                    const page = pages.length > 0 ? pages[0] : await context.newPage();
                    await test.step('Bring page to front', async () => {
                        await page.bringToFront();
                    });
                    perf.start('Navigate to Add Order');

                    const orderData = await test.step('Fetch order data', async () => {
                        return orderTestData.testOrders.find(order => order.description === "New customer with single item");
                    });
                    if (!orderData) {
                        throw new Error("Order data not found for description: New customer with single item");
                    }

                    const homepage = new Homepage(page);
                    await test.step('Navigate to Add Order page', async () => {
                        await homepage.navigateToSideMenuOption('Orders', 'Add');
                        await expect(page).toHaveURL('https://store-8ijomozpnx.mybigcommerce.com/manage/orders/add-order');
                        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
                    });

                    const addOrderPage = new AddOrderPage(page);
                    perf.nextAction('Fill New Customer Details');
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
                    perf.nextAction('Set Transactional Currency');
                    await test.step('Set Transactional Currency', async () => {
                        if (orderData.customer.transactionalCurrency) {
                            await addOrderPage.setTransactionalCurrency(orderData.customer.transactionalCurrency);
                        }
                    });
                    perf.nextAction('Fill Billing Information');
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
                    perf.nextAction('Proceed to Add Items');
                    await test.step('Proceed to Add Items', async () => {
                        await addOrderPage.clickNextButton();
                    });
                    perf.nextAction('Add Products');
                    await test.step('Add Products', async () => {
                        const productCount = 1; // Specify the number of products to add
                        for (let i = 0; i < Math.min(productCount, orderData.items.length); i++) {
                            const customProductDetails = orderData.items[i];
                            await addOrderPage.clickAddCustomProductLink();
                            await addOrderPage.verifyCustomProductDialogOpen();
                            await addOrderPage.addCustomProductDetails({
                                name: customProductDetails.productName,
                                sku: customProductDetails.sku,
                                price: customProductDetails.price.toString(),
                                quantity: customProductDetails.quantity.toString()
                            });
                        }
                    });
                    perf.nextAction('Verify Subtotal');
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
                            method: orderData.shipping.method || '',
                            cost: orderData.shipping.price?.toString() || ''
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
                        await addOrderPage.selectPaymentMethod(orderData.payment.paymentCategory || '');
                        await addOrderPage.verifyPaymentMethodSelected(orderData.payment.paymentCategory || '');
                        await addOrderPage.verifySummaryDetails({
                            subtotal: orderData.expectedPaymentSummary?.subtotal || '',
                            shipping: orderData.expectedPaymentSummary?.shipping || '',
                            grandTotal: orderData.expectedPaymentSummary?.grandTotal || '',
                            taxIncludedInTotal: orderData.expectedPaymentSummary?.taxIncludedInTotal || ''
                        });
                    });
                } finally {
                    // Generate and save performance HTML report even if test fails
                    html = generatePerformanceHtmlReport('Create Order Flow', perf.getLogs());
                    fs.writeFileSync('test-results/performance-report.html', html);
                }
        });

        test('Create a new order with Standard Product for an existing customer', async () => {
            const perf = new PerformanceRecorder();
            perf.startFlow('Create Order Flow - Existing Customer');
            let html = '';
            try {
                const pages = await context.pages();
                const page = pages.length > 0 ? pages[0] : await context.newPage();
                await test.step('Bring page to front', async () => {
                    await page.bringToFront();
                });
                perf.start('Navigate to Add Order');

                const orderData = await test.step('Fetch order data', async () => {
                    return orderTestData.testOrders.find(order => order.description === "Existing customer with Standard Product");
                });
                if (!orderData) {
                    throw new Error("Order data not found for description: Existing customer with Standard Product");
                }

                const homepage = new Homepage(page);
                await test.step('Navigate to Add Order page', async () => {
                    await homepage.navigateToSideMenuOption('Orders', 'Add');
                    await expect(page).toHaveURL('https://store-5nfoomf2b4.mybigcommerce.com/manage/orders/add-order');
                    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
                });

                const addOrderPage = new AddOrderPage(page);
                perf.nextAction('Select Existing Customer');
                await test.step('Select Existing Customer', async () => {
                await addOrderPage.selectAndFillExistingCustomerDetails(
                                    orderData.customer?.email || '',
                                    orderData.customer?.existingCustomerAddressCard || ''
                                    );
                 });
                perf.nextAction('Proceed to Add Items');
                await test.step('Proceed to Add Items', async () => {
                    await addOrderPage.clickNextButton();
                });
                perf.nextAction('Add Products');
                await test.step('Add Products', async () => {
                    for (let i = 0; i < orderData.items.length; i++) {
                        const productDetails = orderData.items[i];
                        await addOrderPage.clickAddCustomProductLink();
                        await addOrderPage.verifyCustomProductDialogOpen();
                        await addOrderPage.addCustomProductDetails({
                            name: productDetails.productName,
                            sku: productDetails.sku,
                            price: productDetails.price.toString(),
                            quantity: productDetails.quantity.toString()
                        });
                    }
                });
                await test.step('Proceed to Fulfillment', async () => {
                    await addOrderPage.clickNextButton();
                });
                await test.step('Select Shipping Method', async () => {
                    await addOrderPage.selectShippingMethod(orderData.shipping.method || '');
                });
                await test.step('Set Custom Shipping Details', async () => {
                    const customShippingDetails = {
                        method: orderData.shipping.method || '',
                        cost: orderData.shipping.price?.toString() || ''
                    };
                    await addOrderPage.setCustomShippingDetails(customShippingDetails);
                });
                await test.step('Proceed to Payment', async () => {
                    await addOrderPage.clickNextButton();
                });
                await test.step('Select Payment Method & Verify Summary', async () => {
                    await addOrderPage.selectPaymentMethod(orderData.payment.paymentCategory || '');
                    await addOrderPage.verifyPaymentMethodSelected(orderData.payment.paymentCategory || '');
                    await addOrderPage.verifySummaryDetails(orderData.expectedPaymentSummary || {});
                });
                await test.step('Add Comments & Staff Notes', async () => {
                    await addOrderPage.fillComments(orderData.comments || 'Default customer comment');
                    await addOrderPage.fillStaffNotes(orderData.staffNotes || 'Default staff note');
                });
            } finally {
                html = generatePerformanceHtmlReport('Create Order Flow - Existing Customer', perf.getLogs());
                fs.writeFileSync('test-results/performance-report-existing-customer.html', html);
            }
        });

});