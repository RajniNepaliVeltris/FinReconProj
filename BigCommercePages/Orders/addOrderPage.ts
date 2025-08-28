import { Locator, Page } from '@playwright/test';
import { CustomerInfo, OrderItem, ShippingDetails, PaymentDetails, OrderData } from '../../models/OrderTypes';

export class AddOrderPage {
    private page: Page;
    
    // Customer Information Locators
    private customerTypeRadio: Record<string, Locator>;
    private emailInput: Locator;
    private firstNameInput: Locator;
    private lastNameInput: Locator;
    private phoneInput: Locator;
    private address1Input: Locator;
    private cityInput: Locator;
    private countrySelect: Locator;
    private stateSelect: Locator;
    private postalCodeInput: Locator;
    
    // Product Selection Locators
    private addProductButton: Locator;
    private productSearchInput: Locator;
    private quantityInput: Locator;
    
    // Shipping Locators
    private shippingMethodSelect: Locator;
    
    // Payment Locators
    private paymentMethodSelect: Locator;
    private amountInput: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize all locators
        this.customerTypeRadio = {
            'existing': page.locator('//input[@name="customerType" and @value="existing"]'),
            'new': page.locator('//input[@name="customerType" and @value="new"]')
        };
        this.emailInput = page.locator('//input[@aria-label="Email"]');
        this.firstNameInput = page.locator('//input[@aria-label="First Name"]');
        this.lastNameInput = page.locator('//input[@aria-label="Last Name"]');
        this.phoneInput = page.locator('//input[@aria-label="Phone"]');
        this.address1Input = page.locator('//input[@aria-label="Address"]');
        this.cityInput = page.locator('//input[@aria-label="City"]');
        this.countrySelect = page.locator('//select[@aria-label="Country"]');
        this.stateSelect = page.locator('//select[@aria-label="State"]');
        this.postalCodeInput = page.locator('//input[@aria-label="Postal Code"]');
        
        this.addProductButton = page.locator('//button[contains(text(), "Add Product")]');
        this.productSearchInput = page.locator('//input[@aria-label="Search Products"]');
        this.quantityInput = page.locator('//input[@aria-label="Quantity"]');
        
        this.shippingMethodSelect = page.locator('//select[@aria-label="Shipping Method"]');
        
        this.paymentMethodSelect = page.locator('//select[@aria-label="Payment Method"]');
        this.amountInput = page.locator('//input[@aria-label="Amount"]');
    }

    async fillCustomerInfo(customerInfo: CustomerInfo) {
        await this.customerTypeRadio[customerInfo.type].click();
        
        if (customerInfo.type === 'new') {
            await this.emailInput.fill(customerInfo.email || '');
            await this.firstNameInput.fill(customerInfo.firstName || '');
            await this.lastNameInput.fill(customerInfo.lastName || '');
            await this.phoneInput.fill(customerInfo.phone || '');
            await this.address1Input.fill(customerInfo.address1 || '');
            await this.cityInput.fill(customerInfo.city || '');
            await this.countrySelect.selectOption(customerInfo.country || '');
            await this.stateSelect.selectOption(customerInfo.state || '');
            await this.postalCodeInput.fill(customerInfo.postalCode || '');
        } else {
            await this.emailInput.fill(customerInfo.email || '');
            // Wait for customer details to auto-populate
            await this.page.waitForTimeout(1000);
        }
    }

    async addOrderItem(item: OrderItem) {
        await this.addProductButton.click();
        await this.productSearchInput.fill(item.productName);
        await this.page.waitForTimeout(500); // Wait for search results
        await this.page.locator(`//div[contains(text(), "${item.productName}")]`).click();
        await this.quantityInput.fill(item.quantity.toString());
    }

    async setShippingDetails(shipping: ShippingDetails) {
        await this.shippingMethodSelect.selectOption(shipping.method);
    }

    async setPaymentDetails(payment: PaymentDetails) {
        await this.paymentMethodSelect.selectOption(payment.method);
        await this.amountInput.fill(payment.amount.toString());
    }

    async createOrder(orderData: OrderData) {
        await this.fillCustomerInfo(orderData.customer);
        
        for (const item of orderData.items) {
            await this.addOrderItem(item);
        }
        
        await this.setShippingDetails(orderData.shipping);
        await this.setPaymentDetails(orderData.payment);
        
        // Click submit button
        await this.page.locator('//button[contains(text(), "Create Order")]').click();
        
        // Wait for order creation confirmation
        await this.page.waitForSelector('//div[contains(text(), "Order created successfully")]');
    }
}