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
    private passwordInput: Locator;
    private confirmPasswordInput: Locator;
    private lineOfCreditInput: Locator;
    
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
            'existing': page.locator('#check-search-customer'),
            'new': page.locator('#check-new-customer')
        };
        this.emailInput = page.locator('#FormField_1');
        this.firstNameInput = page.locator('#FormField_4');
        this.lastNameInput = page.locator('#FormField_5');
        this.phoneInput = page.locator('#FormField_7');
        this.address1Input = page.locator('#FormField_8');
        this.cityInput = page.locator('#FormField_10');
        this.countrySelect = page.locator('#FormField_9');
        this.stateSelect = page.locator('#FormField_12');
        this.postalCodeInput = page.locator('#FormField_13');
        this.passwordInput = page.locator('#FormField_2');
        this.confirmPasswordInput = page.locator('#FormField_3');
        this.lineOfCreditInput = page.locator('#FormField_26');
        
        this.addProductButton = page.locator('#dialog-options-submit');
        this.productSearchInput = page.locator('#quote-item-search');
        this.quantityInput = page.locator('#qty');
        
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