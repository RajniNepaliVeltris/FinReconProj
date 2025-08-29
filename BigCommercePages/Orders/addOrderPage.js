"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOrderPage = void 0;
class AddOrderPage {
    constructor(page) {
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
    fillCustomerInfo(customerInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.customerTypeRadio[customerInfo.type].click();
            if (customerInfo.type === 'new') {
                yield this.emailInput.fill(customerInfo.email || '');
                yield this.firstNameInput.fill(customerInfo.firstName || '');
                yield this.lastNameInput.fill(customerInfo.lastName || '');
                yield this.phoneInput.fill(customerInfo.phone || '');
                yield this.address1Input.fill(customerInfo.address1 || '');
                yield this.cityInput.fill(customerInfo.city || '');
                yield this.countrySelect.selectOption(customerInfo.country || '');
                yield this.stateSelect.selectOption(customerInfo.state || '');
                yield this.postalCodeInput.fill(customerInfo.postalCode || '');
            }
            else {
                yield this.emailInput.fill(customerInfo.email || '');
                // Wait for customer details to auto-populate
                yield this.page.waitForTimeout(1000);
            }
        });
    }
    addOrderItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.addProductButton.click();
            yield this.productSearchInput.fill(item.productName);
            yield this.page.waitForTimeout(500); // Wait for search results
            yield this.page.locator(`//div[contains(text(), "${item.productName}")]`).click();
            yield this.quantityInput.fill(item.quantity.toString());
        });
    }
    setShippingDetails(shipping) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.shippingMethodSelect.selectOption(shipping.method);
        });
    }
    setPaymentDetails(payment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.paymentMethodSelect.selectOption(payment.method);
            yield this.amountInput.fill(payment.amount.toString());
        });
    }
    createOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fillCustomerInfo(orderData.customer);
            for (const item of orderData.items) {
                yield this.addOrderItem(item);
            }
            yield this.setShippingDetails(orderData.shipping);
            yield this.setPaymentDetails(orderData.payment);
            // Click submit button
            yield this.page.locator('//button[contains(text(), "Create Order")]').click();
            // Wait for order creation confirmation
            yield this.page.waitForSelector('//div[contains(text(), "Order created successfully")]');
        });
    }
}
exports.AddOrderPage = AddOrderPage;
