import { Locator, Page, expect } from '@playwright/test';
import { CustomerInfo, OrderItem, ShippingDetails, PaymentDetails, OrderData } from '../../../models/OrderTypes';

export class AddOrderPage {
    private page: Page;


    // Shipping Locators
    private shippingMethodSelect: Locator;
    private shippingMethodInput: Locator;
    private shippingCostInput: Locator;
    
    // Payment Locators
    private paymentMethodSelect: Locator;
    private amountInput: Locator;

    // Billing Information Locators
    private billingFirstNameInput: Locator;
    private billingLastNameInput: Locator;
    private billingCompanyNameInput: Locator;
    private billingPhoneNumberInput: Locator;
    private billingAddressLine1Input: Locator;
    private billingAddressLine2Input: Locator;
    private billingSuburbCityInput: Locator;
    private billingCountrySelect: Locator;
    private billingStateProvinceSelect: Locator;
    private billingZipPostcodeInput: Locator;
    private billingPONumberInput: Locator;
    private billingTaxIDInput: Locator;
    private billingSaveToAddressBookCheckbox: Locator;

    // Dynamic UI for New Customer Locators
    private newCustomerEmailInput: Locator;
    private newCustomerPasswordInput: Locator;
    private newCustomerConfirmPasswordInput: Locator;
    private newCustomerExclusiveOffersCheckbox: Locator;
    private newCustomerLineOfCreditInput: Locator;
    private newCustomerPaymentTermsSelect: Locator;
    private newCustomerGroupSelect: Locator;

    // Add Products Section Locators
    private addProductsSearchInput: Locator;
    private browseCategoriesButton: Locator;
    private addCustomProductLink: Locator;
    private emptyOrderMessage: Locator;

    // Product Search Results Locators
    private productSearchResultsList: Locator;
    private productSearchResultItem: Locator;
    private productViewLink: Locator;

    // Customer Information Locators
    private existingCustomerRadio: Locator;
    private newCustomerRadio: Locator;
    private customerSearchInput: Locator;
    private selectedCustomerLabel: Locator;

    // Button Locators
    private cancelButton: Locator;
    private backButton: Locator;
    private nextButton: Locator;
    private saveButton: Locator;

    // Custom Product Dialog Locators
    private customProductNameInput: Locator;
    private customProductSKUInput: Locator;
    private customProductPriceInput: Locator;
    private customProductQuantityInput: Locator;
    private customProductAddItemButton: Locator;
    private customProductCloseButton: Locator;

    // Table Locators
    private productTable: Locator;
    private productTableRows: Locator;

    // Subtotal Locator
    private subtotalPrice: Locator;

    // Fulfillment Section Locators
    private billingAddressRadio: Locator;
    private newSingleAddressRadio: Locator;
    private newMultipleAddressRadio: Locator;
    private billingAddressDetails: Locator;
    private fetchShippingQuotesLink: Locator;
    private chooseShippingMethodSelect: Locator;

    // Payment Section Locators
    private customerBillingDetails: Locator;
    private changeBillingDetailsLink: Locator;

    // Fulfillment Details Locators
    private shippingDetails: Locator;
    private changeShippingDetailsLink: Locator;
    private changeShippingMethodLink: Locator;
    private fulfillmentProductTable: Locator;
    private fulfillmentProductTableRows: Locator;

    // Payment and Summary Section Locators
    private paymentDropdown: Locator;
    private manualDiscountInput: Locator;
    private applyDiscountButton: Locator;
    private couponInput: Locator;
    private applyCouponButton: Locator;
    private subtotalText: Locator;
    private shippingText: Locator;
    private grandTotalText: Locator;

    // Comments and Notes Section Locators
    private commentsInput: Locator;
    private staffNotesInput: Locator;

    //Save and Process Payment Button
    private saveAndProcessPaymentButton: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize all locators

        this.shippingMethodSelect = page.locator('//select[@aria-label="Shipping Method"]');
        
        this.paymentMethodSelect = page.locator('//select[@aria-label="Payment Method"]');
        this.amountInput = page.locator('//input[@aria-label="Amount"]');

        const billingBaseXPath = "//fieldset//span[text()='Billing information']//..//..";
        this.billingFirstNameInput = page.locator(`${billingBaseXPath}//input[@value='FirstName']/following-sibling::input`);
        this.billingLastNameInput = page.locator(`${billingBaseXPath}//input[@value='LastName']/following-sibling::input`);
        this.billingCompanyNameInput = page.locator(`${billingBaseXPath}//input[@value='CompanyName']/following-sibling::input`);
        this.billingPhoneNumberInput = page.locator(`${billingBaseXPath}//input[@value='Phone']/following-sibling::input`);
        this.billingAddressLine1Input = page.locator(`${billingBaseXPath}//input[@value='AddressLine1']/following-sibling::input`);
        this.billingAddressLine2Input = page.locator(`${billingBaseXPath}//input[@value='AddressLine2']/following-sibling::input`);
        this.billingSuburbCityInput = page.locator(`${billingBaseXPath}//input[@value='City']/following-sibling::input`);
        this.billingCountrySelect = page.locator(`${billingBaseXPath}//input[@value='Country']/following-sibling::select`);
        this.billingStateProvinceSelect = page.locator(`${billingBaseXPath}//input[@value='State']/following-sibling::input`);
        this.billingZipPostcodeInput = page.locator(`${billingBaseXPath}//input[@value='Zip']/following-sibling::input`);
        this.billingPONumberInput = page.locator(`${billingBaseXPath}//input[contains(@class,'po-field')]`);
        this.billingTaxIDInput = page.locator(`${billingBaseXPath}//input[contains(@class,'tax-id')]`);
        this.billingSaveToAddressBookCheckbox = page.locator("//input[@id='saveBillingAddress']");
        //AccountDeatils for new customer information
        const customerInfoBaseXPath = "//fieldset//span[text()='Customer information']//..//..";
        this.newCustomerEmailInput = page.locator(`${customerInfoBaseXPath}//input[@value='EmailAddress']/following-sibling::input`);
        this.newCustomerPasswordInput = page.locator(`${customerInfoBaseXPath}//input[@value='Password']/following-sibling::input`);
        this.newCustomerConfirmPasswordInput = page.locator(`${customerInfoBaseXPath}//input[@value='ConfirmPassword']/following-sibling::input`);
        this.newCustomerExclusiveOffersCheckbox = page.locator(`${customerInfoBaseXPath}//input[@value='ReceiveMarketingEmails']/following-sibling::div/input`);
        this.newCustomerLineOfCreditInput = page.locator(`${customerInfoBaseXPath}//input[contains(@class,'line-of-credit')]`);
        this.newCustomerPaymentTermsSelect = page.locator(`${customerInfoBaseXPath}//input[@value='Please choose a Term']/following-sibling::select`);
        this.newCustomerGroupSelect = page.locator(`${customerInfoBaseXPath}//select[@id='accountCustomerGroup']`);

        this.addProductsSearchInput = page.locator("//input[@id='quote-item-search']");
        this.browseCategoriesButton = page.locator("//button[@id='browse-categories']");
        this.addCustomProductLink = page.locator("//a[@id='add-custom-product']");
        this.emptyOrderMessage = page.locator("//div[@class='orderNoItemsMessage']/div");

        this.productSearchResultsList = page.locator("//div[@id='productAutocompleteResults']//ul");
        this.productSearchResultItem = page.locator("//div[@id='productAutocompleteResults']//li[contains(@class, 'ui-menu-item')]//strong");
        this.productViewLink = page.locator("//div[@id='productAutocompleteResults']//li[contains(@class, 'ui-menu-item')]//a[text()='View product']");

        // Initialize Customer Information Locators
        this.existingCustomerRadio = page.locator(`${customerInfoBaseXPath}//input[@type='radio'][@id='check-search-customer']`);
        this.newCustomerRadio = page.locator(`${customerInfoBaseXPath}//input[@type='radio'][@id='check-new-customer']`);
        this.customerSearchInput = page.locator(`${customerInfoBaseXPath}//fieldset//span[text()='Customer information']//..//..//input[@id='orderForSearch']`);
        this.selectedCustomerLabel = page.locator(`${customerInfoBaseXPath}//div[@id='selected-customer-form']/div`);

        // Initialize Button Locators
        const buttonBaseXPath = "//div[@class='field-group']//ul[@class='field-action']";
        this.cancelButton = page.locator(`${buttonBaseXPath}//a[contains(@class,'orderMachineCancelButton')]`);
        this.backButton = page.locator(`${buttonBaseXPath}//button[contains(@class,'orderMachineBackButton')]`);
        this.nextButton = page.locator(`${buttonBaseXPath}//button[contains(@class,'orderMachineNextButton')]`);
        this.saveButton = page.locator(`${buttonBaseXPath}//button[contains(@class,'orderMachineSaveButton')]`);

        // Initialize Custom Product Dialog Locators
        const customProductDialogXPath = "//div[@id='dialog-options']//div[@id='orderCustomizeItemTabs']";
        this.customProductNameInput = page.locator(`${customProductDialogXPath}//input[@id='product-name']`);
        this.customProductSKUInput = page.locator(`${customProductDialogXPath}//input[@id='product-sku']`);
        this.customProductPriceInput = page.locator(`${customProductDialogXPath}//input[@name='price']`);
        this.customProductQuantityInput = page.locator(`${customProductDialogXPath}//input[@id='product-quantity']`);
        this.customProductAddItemButton = page.locator(`//div[@id='dialog-options']//button[@id='dialog-options-submit']`);
        this.customProductCloseButton = page.locator(`//div[@id='dialog-options']//button[@class='btn-dialog-close']`);

        // Initialize Product Table Locators
        const tableBaseXPath = "//div[@class='orderItemsGrid']//table";
        this.productTable = page.locator(`${tableBaseXPath}`);
        this.productTableRows = page.locator(`${tableBaseXPath}//tr`);

        // Initialize Subtotal Locator
        this.subtotalPrice = page.locator("//div[@id='itemSubtotal']//span");

        // Initialize Fulfillment Section Locators
        const fulfillmentBaseXPath = "//div[@class='orderMachineStateShipping']";
        this.billingAddressRadio = page.locator(`${fulfillmentBaseXPath}//input[@id='shipping-billing']`);
        this.newSingleAddressRadio = page.locator(`${fulfillmentBaseXPath}//input[@value='shipping-single']`);
        this.newMultipleAddressRadio = page.locator(`${fulfillmentBaseXPath}//input[@value='shipping-multiple']`);
        this.billingAddressDetails = page.locator(`${fulfillmentBaseXPath}//div[@id='shipItemsToBillingAddress']//div[@class='order-details']`);
        this.fetchShippingQuotesLink = page.locator(`${fulfillmentBaseXPath}//fieldset[@class='shipping-method-form']//a[@class='fetchShippingQuotesLink']`);
        this.chooseShippingMethodSelect = page.locator(`${fulfillmentBaseXPath}//fieldset[@class='shipping-method-form']//select[@id='chooseProvider']`);

        // Initialize Shipping Method Locators
        const shippingMethodBaseXPath = "//fieldset[@class='shipping-method-form']";
        this.shippingMethodInput = page.locator(`${shippingMethodBaseXPath}//input[@id='customShippingMethod']`);
        this.shippingCostInput = page.locator(`${shippingMethodBaseXPath}//input[@id='customShippingPrice']`);

        // Initialize Payment Section Locators
        const paymentCustomerBillingSectionXPath = "//div[@class='orderFormSummaryBillingDetailsContainer']";
        this.customerBillingDetails = page.locator(`${paymentCustomerBillingSectionXPath}//div[@class='order-details']`);
        this.changeBillingDetailsLink = page.locator(`${paymentCustomerBillingSectionXPath}//div[@class='order-details']//a[contains(@class,'orderFormChangeBillingDetailsLink')]`);

        // Initialize Fulfillment Details Locators
        const fulfillmentDetailsXPath = "//div[@class='orderFormSummaryShippingDetailsContainer']";
        this.shippingDetails = page.locator(`${fulfillmentDetailsXPath}//div[@class='order-details']//dl`);
        this.changeShippingDetailsLink = page.locator(`${fulfillmentDetailsXPath}//div[@class='order-details']//h3[contains(text(),'Shipping to:')]/following-sibling::a[contains(@class,'orderFormChangeShippingDetailsLink')]`);
       this.changeShippingMethodLink = page.locator(`${fulfillmentDetailsXPath}//div[@class='order-details']//h3[contains(text(),'Shipping method:')]/following-sibling::a[contains(@class,'orderFormChangeShippingDetailsLink')]`);
        this.fulfillmentProductTable = page.locator(`${fulfillmentDetailsXPath}//div[contains(@class,'quoteItemsGrid ')]//table`);
        this.fulfillmentProductTableRows = page.locator(`${fulfillmentDetailsXPath}//div[contains(@class,'quoteItemsGrid ')]//table//tbody/tr`);

        //PaymentMethod
        this.paymentDropdown = page.locator(`//div[@class='payment-form']//select[@id='paymentMethod']`);
        
        const summarySectionXPath = "//div[contains(@class,'orderSummaryContainer')]";
        this.subtotalText = page.locator(`${summarySectionXPath}//tr[contains(@class,'orderFormSummaryTable-subtotal')]/td`);
        this.shippingText = page.locator(`${summarySectionXPath}//tr[contains(@class,'orderFormSummaryTable-shipping')]/td`);
        this.grandTotalText = page.locator(`${summarySectionXPath}//tr[contains(@class,'orderFormSummaryTable-total')]/td/strong`);
        this.manualDiscountInput = page.locator(`${summarySectionXPath}//div[contains(@class,'applyDiscountContainer')]//input[@id='discountAmount']`);
        this.applyDiscountButton = page.locator(`${summarySectionXPath}//div[contains(@class,'applyDiscountContainer')]//button[contains(@class,'orderMachineApplyDiscountButton')]`);
        this.couponInput = page.locator(`${summarySectionXPath}//div[contains(@class,'couponGiftCertificateContainer')]//input[contains(@id,'couponGiftCertificate')]`);
        this.applyCouponButton = page.locator(`${summarySectionXPath}//div[contains(@class,'couponGiftCertificateContainer')]//button[contains(@class,'orderMachineCouponButton')]`);

        
        this.commentsInput = page.locator(`//textarea[@id="order-comment"]`);
        this.staffNotesInput = page.locator(`//textarea[@id="staff-note"]`);
        this.saveAndProcessPaymentButton = page.locator("//button[@data-saveandprocesspayment='Save & process payment »']");
    }

    async setShippingDetails(shipping: ShippingDetails) {
        await this.shippingMethodSelect.selectOption(shipping.method);
    }

    async setPaymentDetails(payment: PaymentDetails) {
        await this.paymentMethodSelect.selectOption(payment.method);
        await this.amountInput.fill(payment.amount.toString());
    }

    async fillBillingInformation(billingInfo: {
        firstName: string;
        lastName: string;
        companyName: string;
        phoneNumber: string;
        addressLine1: string;
        addressLine2: string;
        suburbCity: string;
        country: string;
        stateProvince: string;
        zipPostcode: string;
        poNumber: string;
        taxID: string;
        saveToAddressBook: boolean;
    }) {
        await this.billingFirstNameInput.fill(billingInfo.firstName);
        await this.billingLastNameInput.fill(billingInfo.lastName);
        if (billingInfo.companyName) await this.billingCompanyNameInput.fill(billingInfo.companyName);
        if (billingInfo.phoneNumber) await this.billingPhoneNumberInput.fill(billingInfo.phoneNumber);
        await this.billingAddressLine1Input.fill(billingInfo.addressLine1);
        if (billingInfo.addressLine2) await this.billingAddressLine2Input.fill(billingInfo.addressLine2);
        await this.billingSuburbCityInput.fill(billingInfo.suburbCity);
        await this.billingCountrySelect.selectOption(billingInfo.country);
        await this.billingStateProvinceSelect.selectOption(billingInfo.stateProvince);
        await this.billingZipPostcodeInput.fill(billingInfo.zipPostcode);
        if (billingInfo.poNumber) await this.billingPONumberInput.fill(billingInfo.poNumber);
        if (billingInfo.taxID) await this.billingTaxIDInput.fill(billingInfo.taxID);
        if (billingInfo.saveToAddressBook) await this.billingSaveToAddressBookCheckbox.check();
    }

    async fillNewCustomerDetails(newCustomerDetails: {
        email: string;
        password: string;
        confirmPassword: string;
        exclusiveOffers: boolean;
        lineOfCredit: string;
        paymentTerms: string;
        customerGroup: string;
    }) {
        await this.newCustomerEmailInput.fill(newCustomerDetails.email);
        await this.newCustomerPasswordInput.fill(newCustomerDetails.password);
        await this.newCustomerConfirmPasswordInput.fill(newCustomerDetails.confirmPassword);
        if (newCustomerDetails.exclusiveOffers) {
            await this.newCustomerExclusiveOffersCheckbox.check();
        }
        await this.newCustomerLineOfCreditInput.fill(newCustomerDetails.lineOfCredit);
        await this.newCustomerPaymentTermsSelect.selectOption(newCustomerDetails.paymentTerms);
        await this.newCustomerGroupSelect.selectOption(newCustomerDetails.customerGroup);
    }

    async searchProduct(productName: string) {
        await this.addProductsSearchInput.fill(productName);
        console.log(`Searching for product: ${productName}`);
    }

    async browseCategories() {
        await this.browseCategoriesButton.click();
        console.log("Browsing categories.");
    }

    async addCustomProduct() {
        await this.addCustomProductLink.click();
        console.log("Adding a custom product.");
        await this.page.waitForTimeout(500); // Wait for any animations
        
    }

    async selectProductFromSearchResults(productName: string) {
        const productItem = this.productSearchResultItem.locator(`text=${productName}`);
        if (await productItem.isVisible()) {
            await productItem.click();
            console.log(`Selected product: ${productName}`);
        } else {
            console.error(`Product not found in search results: ${productName}`);
        }
    }

    async viewProductDetails(productName: string) {
        const productLink = this.productViewLink.locator(`text=${productName}`);
        if (await productLink.isVisible()) {
            await productLink.click();
            console.log(`Viewing product details for: ${productName}`);
        } else {
            console.error(`View product link not found for: ${productName}`);
        }
    }

    async selectExistingCustomer() {
        await this.existingCustomerRadio.check();
    }

    async selectNewCustomer() {
        await this.newCustomerRadio.check();
    }

    async searchCustomer(customerName: string) {
        await this.customerSearchInput.fill(customerName);
        await this.page.waitForTimeout(500); // Wait for search results
    }

    async getSelectedCustomer() {
        return await this.selectedCustomerLabel.textContent();
    }

    async clickCancelButton() {
        await this.cancelButton.click();
    }

    async clickBackButton() {
        await this.backButton.click();
    }

    async clickNextButton() {
        await this.nextButton.click();
    }

    async clickSaveButton() {
        await this.saveButton.click();
    }

    async addCustomProductDetails(productDetails: {
        name: string;
        sku: string;
        price: string;
        quantity: string;
    }) {
        await this.customProductNameInput.fill(productDetails.name);
        await this.customProductSKUInput.fill(productDetails.sku);
        await this.customProductPriceInput.fill(productDetails.price);
        await this.customProductQuantityInput.fill(productDetails.quantity);
        await this.customProductAddItemButton.click();
    }

    async closeCustomProductDialog() {
        await this.customProductCloseButton.click();
    }

    async clickAddCustomProductLink() {
        await this.addCustomProductLink.click();
    }

    async verifyCustomProductDialogOpen() {
        await expect(this.customProductNameInput).toBeVisible();
    }

    async verifyProductInTable(productDetails: {
        name: string;
        sku?: string;
        price?: string;
        quantity?: string;
    }) {
        const productRow = this.productTableRows.locator(`text=${productDetails.name}`);
        if (await productRow.isVisible()) {
            console.log(`Product '${productDetails.name}' is displayed in the table.`);

            if (productDetails.sku || productDetails.price || productDetails.quantity) {
                const sku = await productRow.locator(".quoteItemSku").textContent();
                const price = await productRow.locator("input[name='price']").getAttribute("value");
                const quantity = await productRow.locator("input[name='quantity']").getAttribute("value");

                if (
                    (productDetails.sku && sku !== productDetails.sku) ||
                    (productDetails.price && price !== productDetails.price) ||
                    (productDetails.quantity && quantity !== productDetails.quantity)
                ) {
                    throw new Error(`Product details do not match. Expected: ${JSON.stringify(productDetails)}, Found: { sku: ${sku}, price: ${price}, quantity: ${quantity} }`);
                }
                console.log(`Product '${productDetails.name}' details are verified successfully.`);
            }
        } else {
            throw new Error(`Product '${productDetails.name}' is not found in the table.`);
        }
    }

    async verifySubtotal(expectedSubtotal: string) {
        const actualSubtotal = await this.subtotalPrice.textContent();
        if (actualSubtotal?.trim() !== expectedSubtotal.trim()) {
            throw new Error(`Subtotal does not match. Expected: ${expectedSubtotal}, Found: ${actualSubtotal}`);
        }
        console.log(`Subtotal '${expectedSubtotal}' is verified successfully.`);
    }

    async selectBillingAddress() {
        await this.billingAddressRadio.check();
    }

    async selectNewSingleAddress() {
        await this.newSingleAddressRadio.check();
    }

    async selectNewMultipleAddress() {
        await this.newMultipleAddressRadio.check();
    }

    async verifyBillingAddressDetails(expectedDetails: Record<string, string>) {
        const actualDetails = await this.billingAddressDetails.locator("dl").allTextContents();
        const actualDetailsMap: Record<string, string> = actualDetails.reduce((acc: Record<string, string>, detail: string) => {
            const [key, value] = detail.split(":");
            acc[key.trim()] = value.trim();
            return acc;
        }, {});

        for (const [key, value] of Object.entries(expectedDetails)) {
            if (actualDetailsMap[key] !== value) {
                throw new Error(`Billing address detail mismatch for '${key}'. Expected: '${value}', Found: '${actualDetailsMap[key]}'`);
            }
        }
        console.log("Billing address details are verified successfully.");
    }

    async fetchShippingQuotes() {
        await this.fetchShippingQuotesLink.click();
    }

    //None or Custom
    async selectShippingMethod(method: string) {
        await this.chooseShippingMethodSelect.selectOption(method);
    }

    async setCustomShippingDetails(details: { method: string; cost: string }) {
        await this.shippingMethodInput.fill(details.method);
        await this.shippingCostInput.fill(details.cost);
    }

     async verifyPaymentCustomerBillingDetails(expectedDetails: Record<string, string>) {
        const actualDetails = await this.customerBillingDetails.locator("dl").allTextContents();
        const actualDetailsMap: Record<string, string> = actualDetails.reduce((acc: Record<string, string>, detail: string) => {
            const [key, value] = detail.split(":");
            acc[key.trim()] = value.trim();
            return acc;
        }, {});

        for (const [key, value] of Object.entries(expectedDetails)) {
            if (actualDetailsMap[key] !== value) {
                throw new Error(`Billing detail mismatch for '${key}'. Expected: '${value}', Found: '${actualDetailsMap[key]}'`);
            }
        }
        console.log("Billing details are verified successfully.");
    }


    async verifyFulfillmentShippingDetails(expectedDetails: Record<string, string>) {
        const actualDetails = await this.shippingDetails.locator("dl").allTextContents();
        const actualDetailsMap: Record<string, string> = actualDetails.reduce((acc: Record<string, string>, detail: string) => {
            const [key, value] = detail.split(":");
            acc[key.trim()] = value.trim();
            return acc;
        }, {});

        for (const [key, value] of Object.entries(expectedDetails)) {
            if (actualDetailsMap[key] !== value) {
                throw new Error(`Shipping detail mismatch for '${key}'. Expected: '${value}', Found: '${actualDetailsMap[key]}'`);
            }
        }
        console.log("Shipping details are verified successfully.");
    }

    async changeShippingDetails() {
        await this.changeShippingDetailsLink.click();
    }

    async changeShippingMethod() {
        await this.changeShippingMethodLink.click();
    }


    async verifyFulfillmentProductTable(expectedProducts: Array<{ name: string; quantity: string; price: string; total: string }>) {
        for (const product of expectedProducts) {
            const productRow = this.fulfillmentProductTableRows.locator(`text=${product.name}`);
            if (await productRow.isVisible()) {
                const quantity = await productRow.locator("td.quantity").textContent();
                const price = await productRow.locator("td.price").textContent();
                const total = await productRow.locator("td.total").textContent();

                if (quantity?.trim() !== product.quantity || price?.trim() !== product.price || total?.trim() !== product.total) {
                    throw new Error(`Product details mismatch for '${product.name}'. Expected: ${JSON.stringify(product)}, Found: { quantity: ${quantity}, price: ${price}, total: ${total} }`);
                }
                console.log(`Product '${product.name}' details are verified successfully.`);
            } else {
                throw new Error(`Product '${product.name}' is not found in the table.`);
            }
        }
    }

    async selectPaymentMethod(method: string) {
        await this.paymentDropdown.selectOption(method);
    }

    async applyManualDiscount(discount: string) {
        await this.manualDiscountInput.fill(discount);
        await this.applyDiscountButton.click();
    }

    async applyCoupon(couponCode: string) {
        await this.couponInput.fill(couponCode);
        await this.applyCouponButton.click();
    }

    async fillComments(comments: string) {
        await this.commentsInput.fill(comments);
    }

    async fillStaffNotes(notes: string) {
        await this.staffNotesInput.fill(notes);
    }

    async verifySummaryDetails(expectedSummary: { subtotal: string; shipping: string; grandTotal: string }) {
        const actualSubtotal = await this.subtotalText.textContent();
        const actualShipping = await this.shippingText.textContent();
        const actualGrandTotal = await this.grandTotalText.textContent();

        if (actualSubtotal?.trim() !== expectedSummary.subtotal.trim()) {
            throw new Error(`Subtotal mismatch. Expected: ${expectedSummary.subtotal}, Found: ${actualSubtotal}`);
        }
        if (actualShipping?.trim() !== expectedSummary.shipping.trim()) {
            throw new Error(`Shipping mismatch. Expected: ${expectedSummary.shipping}, Found: ${actualShipping}`);
        }
        if (actualGrandTotal?.trim() !== expectedSummary.grandTotal.trim()) {
            throw new Error(`Grand Total mismatch. Expected: ${expectedSummary.grandTotal}, Found: ${actualGrandTotal}`);
        }

        console.log("Summary details verified successfully.");
    }
}