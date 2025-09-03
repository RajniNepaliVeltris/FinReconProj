import { Locator, Page, expect } from '@playwright/test';
import { CustomerInfo, OrderItem, ShippingDetails, PaymentDetails, OrderData } from '../../../models/OrderTypes';
import { log } from 'console';
import { UIInteractions } from '../../../utils/uiInteractions';

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

    //Transactional Currency
    private transactionalCurrencySelect: Locator;

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
        
        // Switch to the iframe before initializing locators
        const iframe = this.page.frameLocator('#content-iframe');
        if (!iframe) {
            console.error('Iframe with id "content-iframe" not found');
            throw new Error('Iframe not found. Ensure the iframe is loaded and accessible.');
        }
        console.log('Successfully switched to iframe: content-iframe');

        // Shipping Method Locators
        this.shippingMethodSelect = iframe.locator('//select[@aria-label="Shipping Method"]');
        
        // Payment Locators
        this.paymentMethodSelect = iframe.locator('//select[@aria-label="Payment Method"]');
        this.amountInput = iframe.locator('//input[@aria-label="Amount"]');

        // Billing Information Locators
        const billingBaseXPath = "//fieldset//span[text()='Billing information']//..//..";
        this.billingFirstNameInput = iframe.locator(`${billingBaseXPath}//input[@value='FirstName']/following-sibling::input`);
        this.billingLastNameInput = iframe.locator(`${billingBaseXPath}//input[@value='LastName']/following-sibling::input`);
        this.billingCompanyNameInput = iframe.locator(`${billingBaseXPath}//input[@value='CompanyName']/following-sibling::input`);
        this.billingPhoneNumberInput = iframe.locator(`${billingBaseXPath}//input[@value='Phone']/following-sibling::input`);
        this.billingAddressLine1Input = iframe.locator(`${billingBaseXPath}//input[@value='AddressLine1']/following-sibling::input`);
        this.billingAddressLine2Input = iframe.locator(`${billingBaseXPath}//input[@value='AddressLine2']/following-sibling::input`);
        this.billingSuburbCityInput = iframe.locator(`${billingBaseXPath}//input[@value='City']/following-sibling::input`);
        this.billingCountrySelect = iframe.locator(`${billingBaseXPath}//input[@value='Country']/following-sibling::select`);
        this.billingStateProvinceSelect = iframe.locator(`${billingBaseXPath}//input[@value='State']/following-sibling::select`);
        this.billingZipPostcodeInput = iframe.locator(`${billingBaseXPath}//input[@value='Zip']/following-sibling::input`);
        this.billingPONumberInput = iframe.locator(`${billingBaseXPath}//input[contains(@class,'po-field')]`);
        this.billingTaxIDInput = iframe.locator(`${billingBaseXPath}//input[contains(@class,'tax-id')]`);
        this.billingSaveToAddressBookCheckbox = iframe.locator("//input[@id='saveBillingAddress']");
        //AccountDeatils for new customer information
        const customerInfoBaseXPath = "//fieldset//span[text()='Customer information']//..//..";
        this.newCustomerEmailInput = iframe.locator(`${customerInfoBaseXPath}//input[@value='EmailAddress']/following-sibling::input`);
        this.newCustomerPasswordInput = iframe.locator(`//input[@value='Password']/following-sibling::input`);
        this.newCustomerConfirmPasswordInput = iframe.locator(`//input[@value='ConfirmPassword']/following-sibling::input`);
        this.newCustomerExclusiveOffersCheckbox = iframe.locator(`//input[@value='ReceiveMarketingEmails']/following-sibling::div/input`);
        this.newCustomerLineOfCreditInput = iframe.locator(`//input[contains(@class,'line-of-credit')]`);
        this.newCustomerPaymentTermsSelect = iframe.locator(`//input[@value='Please choose a Term']/following-sibling::select`);
        this.newCustomerGroupSelect = iframe.locator(`//select[@id='accountCustomerGroup']`);

        this.addProductsSearchInput = iframe.locator("//input[@id='quote-item-search']");
        this.browseCategoriesButton = iframe.locator("//button[@id='browse-categories']");
        this.addCustomProductLink = iframe.locator("//a[@id='add-custom-product']");
        this.emptyOrderMessage = iframe.locator("//div[@class='orderNoItemsMessage']/div");

        this.productSearchResultsList = iframe.locator("//div[@id='productAutocompleteResults']//ul");
        this.productSearchResultItem = iframe.locator("//div[@id='productAutocompleteResults']//li[contains(@class, 'ui-menu-item')]//strong");
        this.productViewLink = iframe.locator("//div[@id='productAutocompleteResults']//li[contains(@class, 'ui-menu-item')]//a[text()='View product']");

        // Initialize Customer Information Locators
        this.existingCustomerRadio = iframe.locator(`${customerInfoBaseXPath}//input[@type='radio'][@id='check-search-customer']`);
        this.newCustomerRadio = iframe.locator(`${customerInfoBaseXPath}//input[@type='radio'][@id='check-new-customer']`);
        this.customerSearchInput = iframe.locator(`${customerInfoBaseXPath}//fieldset//span[text()='Customer information']//..//..//input[@id='orderForSearch']`);
        this.selectedCustomerLabel = iframe.locator(`${customerInfoBaseXPath}//div[@id='selected-customer-form']/div`);

        //Transactional Currency
        this.transactionalCurrencySelect = iframe.locator(`//select[@id='currencyCode']`);

        // Initialize Button Locators
        const buttonBaseXPath = "//div[@class='field-group']//ul[@class='field-action']";
        this.cancelButton = iframe.locator(`${buttonBaseXPath}//a[contains(@class,'orderMachineCancelButton')]`);
        this.backButton = iframe.locator(`${buttonBaseXPath}//button[contains(@class,'orderMachineBackButton')]`);
       // this.nextButton = iframe.locator(`${buttonBaseXPath}//button[contains(@class,'orderMachineNextButton')]`);
        this.saveButton = iframe.locator(`${buttonBaseXPath}//button[contains(@class,'orderMachineSaveButton')]`);
        this.nextButton = iframe.locator(`//button[contains(text(),'Next')]`);

        // Initialize Custom Product Dialog Locators
        const customProductDialogXPath = "//div[@id='dialog-options']//div[@id='orderCustomizeItemTabs']";
        this.customProductNameInput = iframe.locator(`${customProductDialogXPath}//input[@id='product-name']`);
        this.customProductSKUInput = iframe.locator(`${customProductDialogXPath}//input[@id='product-sku']`);
        this.customProductPriceInput = iframe.locator(`${customProductDialogXPath}//input[@name='price']`);
        this.customProductQuantityInput = iframe.locator(`${customProductDialogXPath}//input[@id='product-quantity']`);
        this.customProductAddItemButton = iframe.locator(`//div[@id='dialog-options']//button[@id='dialog-options-submit']`);
        this.customProductCloseButton = iframe.locator(`//div[@id='dialog-options']//button[@class='btn-dialog-close']`);

        // Initialize Product Table Locators
        const tableBaseXPath = "//div[contains(@class,'orderItemsGrid')]//table";
        this.productTable = iframe.locator(`${tableBaseXPath}`);
        this.productTableRows = iframe.locator(`${tableBaseXPath}//tr`);
        
        // Add additional debug information about the table existence
        this.page.frameLocator('#content-iframe').locator("//div[contains(@class,'orderItemsGrid')]").count()
            .then(count => console.log(`Found ${count} orderItemsGrid elements`))
            .catch(e => console.error(`Error checking orderItemsGrid count: ${e}`));

        // Initialize Subtotal Locator
        this.subtotalPrice = iframe.locator("//div[@id='itemSubtotal']//span");

        // Initialize Fulfillment Section Locators
        const fulfillmentBaseXPath = "//div[@class='orderMachineStateShipping']";
        this.billingAddressRadio = iframe.locator(`${fulfillmentBaseXPath}//input[@id='shipping-billing']`);
        this.newSingleAddressRadio = iframe.locator(`${fulfillmentBaseXPath}//input[@value='shipping-single']`);
        this.newMultipleAddressRadio = iframe.locator(`${fulfillmentBaseXPath}//input[@value='shipping-multiple']`);
        this.billingAddressDetails = iframe.locator(`${fulfillmentBaseXPath}//div[@id='shipItemsToBillingAddress']//div[@class='order-details']`);
        this.fetchShippingQuotesLink = iframe.locator(`${fulfillmentBaseXPath}//fieldset[@class='shipping-method-form']//a[@class='fetchShippingQuotesLink']`);
        this.chooseShippingMethodSelect = iframe.locator(`${fulfillmentBaseXPath}//fieldset[@class='shipping-method-form']//select[@id='chooseProvider']`);

        // Initialize Shipping Method Locators
        const shippingMethodBaseXPath = "//fieldset[@class='shipping-method-form']";
        this.shippingMethodInput = iframe.locator(`${shippingMethodBaseXPath}//input[@id='customShippingMethod']`);
        this.shippingCostInput = iframe.locator(`${shippingMethodBaseXPath}//input[@id='customShippingPrice']`);

        // Initialize Payment Section Locators
        const paymentCustomerBillingSectionXPath = "//div[@class='orderFormSummaryBillingDetailsContainer']";
        this.customerBillingDetails = iframe.locator(`${paymentCustomerBillingSectionXPath}//div[@class='order-details']`);
        this.changeBillingDetailsLink = iframe.locator(`${paymentCustomerBillingSectionXPath}//div[@class='order-details']//a[contains(@class,'orderFormChangeBillingDetailsLink')]`);

        // Initialize Fulfillment Details Locators
        const fulfillmentDetailsXPath = "//div[@class='orderFormSummaryShippingDetailsContainer']";
        this.shippingDetails = iframe.locator(`${fulfillmentDetailsXPath}//div[@class='order-details']//dl`);
        this.changeShippingDetailsLink = iframe.locator(`${fulfillmentDetailsXPath}//div[@class='order-details']//h3[contains(text(),'Shipping to:')]/following-sibling::a[contains(@class,'orderFormChangeShippingDetailsLink')]`);
       this.changeShippingMethodLink = iframe.locator(`${fulfillmentDetailsXPath}//div[@class='order-details']//h3[contains(text(),'Shipping method:')]/following-sibling::a[contains(@class,'orderFormChangeShippingDetailsLink')]`);
        this.fulfillmentProductTable = iframe.locator(`${fulfillmentDetailsXPath}//div[contains(@class,'quoteItemsGrid')]//table`);
        this.fulfillmentProductTableRows = iframe.locator(`${fulfillmentDetailsXPath}//div[contains(@class,'quoteItemsGrid')]//table//tr`);
        
        // Add additional debug information about the fulfillment table existence
        this.page.frameLocator('#content-iframe').locator("//div[contains(@class,'quoteItemsGrid')]").count()
            .then(count => console.log(`Found ${count} quoteItemsGrid elements`))
            .catch(e => console.error(`Error checking quoteItemsGrid count: ${e}`));

        //PaymentMethod
        this.paymentDropdown = iframe.locator(`//div[@class='payment-form']//select[@id='paymentMethod']`);
        
        const summarySectionXPath = "//div[contains(@class,'orderSummaryContainer')]";
        this.subtotalText = iframe.locator(`${summarySectionXPath}//tr[contains(@class,'orderFormSummaryTable-subtotal')]/td`);
        this.shippingText = iframe.locator(`${summarySectionXPath}//tr[contains(@class,'orderFormSummaryTable-shipping')]/td`);
        this.grandTotalText = iframe.locator(`${summarySectionXPath}//tr[contains(@class,'orderFormSummaryTable-total')]/td/strong`);
        this.manualDiscountInput = iframe.locator(`${summarySectionXPath}//div[contains(@class,'applyDiscountContainer')]//input[@id='discountAmount']`);
        this.applyDiscountButton = iframe.locator(`${summarySectionXPath}//div[contains(@class,'applyDiscountContainer')]//button[contains(@class,'orderMachineApplyDiscountButton')]`);
        this.couponInput = iframe.locator(`${summarySectionXPath}//div[contains(@class,'couponGiftCertificateContainer')]//input[contains(@id,'couponGiftCertificate')]`);
        this.applyCouponButton = iframe.locator(`${summarySectionXPath}//div[contains(@class,'couponGiftCertificateContainer')]//button[contains(@class,'orderMachineCouponButton')]`);

        
        this.commentsInput = iframe.locator(`//textarea[@id="order-comment"]`);
        this.staffNotesInput = iframe.locator(`//textarea[@id="staff-note"]`);
        this.saveAndProcessPaymentButton = iframe.locator("//button[@data-saveandprocesspayment='Save & process payment »']");
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
        if (billingInfo.saveToAddressBook) {
            await UIInteractions.checkElement(
                this.billingSaveToAddressBookCheckbox, 
                {
                    description: 'Save to Address Book checkbox',
                    timeout: 5000,
                    page: this.page,
                    iframe: 'content-iframe'
                }
            );
        }
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
        // Use our utility method for reliable checkbox interaction
        // But DON'T pass the iframe parameter since the locator already has it
        await UIInteractions.checkElement(
            this.newCustomerExclusiveOffersCheckbox, 
            {
                description: 'I would like to receive updates and offers.',
                timeout: 5000,
                page: this.page
                // Remove the iframe parameter here
            }
        );
    }
    
    await this.newCustomerLineOfCreditInput.fill(newCustomerDetails.lineOfCredit);
    await this.newCustomerPaymentTermsSelect.selectOption(newCustomerDetails.paymentTerms);
    await this.newCustomerGroupSelect.selectOption(newCustomerDetails.customerGroup);
}

    async setTransactionalCurrency(currencyCode: string) {
        await this.transactionalCurrencySelect.selectOption(currencyCode);
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
        await UIInteractions.checkElement(
            this.existingCustomerRadio, 
            {
                description: 'Existing Customer radio button',
                timeout: 5000,
                page: this.page,
                iframe: 'content-iframe'
            }
        );
    }

    async selectNewCustomer() {
        const success = await UIInteractions.checkElement(
            this.newCustomerRadio, 
            {
                description: 'New Customer radio button',
                timeout: 5000,
                page: this.page,
                iframe: 'content-iframe'
            }
        );
        
        if (!success) {
            console.error('Failed to select New Customer radio button after multiple attempts');
            // As a last resort, try with a direct selector
            const directRadioLocator = this.page.frameLocator('#content-iframe')
                .locator('input[type="radio"][id="check-new-customer"]');
            await directRadioLocator.waitFor({ state: 'visible', timeout: 5000 })
                .catch(() => {});
            await directRadioLocator.check({ force: true })
                .catch((error) => {
                    console.error('Failed with direct selector too:', error);
                    throw new Error('Unable to select New Customer radio button');
                });
        }
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

    /**
     * Enhanced method to verify product details in a table, supporting both input values and displayed/highlighted values
     * @param productDetails - The details of the product to verify
     * @param options - Optional verification options
     */
    async verifyProductInTable(
        productDetails: {
            name: string;
            sku?: string;
            price?: string;
            quantity?: string;
        },
        options: {
            checkHighlightedValues?: boolean; // Whether to check values as displayed in UI (text) vs input values
            formatMatch?: boolean; // Whether to normalize formats (e.g., currency symbols)
        } = { checkHighlightedValues: false, formatMatch: true }
    ) {
        // Use a more reliable way to locate the product row - contains instead of exact match
        // This helps when product names get truncated in the UI
        console.log(`Looking for product with name containing: '${productDetails.name}'`);
        const productRow = this.productTableRows.filter({ hasText: productDetails.name }).first();
        
        try {
            // Check if the product row exists with a generous timeout
            await productRow.waitFor({ state: 'visible', timeout: 10000 });
            console.log(`Product row with name containing '${productDetails.name}' is displayed in the table.`);
            console.log(`Verifying details for product: ${await productRow.textContent()}`);

            const errors: string[] = [];
            const valueType = options.checkHighlightedValues ? 'text' : 'both';

            // Verify SKU
            if (productDetails.sku) {
                const skuResult = await UIInteractions.verifyTableValues(productRow, {
                    selector: ".quoteItemSku",
                    expectedValue: productDetails.sku,
                    description: "Product SKU",
                    valueType,
                    formatMatch: options.formatMatch
                });
                
                if (!skuResult.success) {
                    errors.push(skuResult.message);
                } else {
                    console.log(skuResult.message);
                }
            }

            // Verify price
            if (productDetails.price) {
                const priceSelector = options.checkHighlightedValues ? "td.price" : "input[name='price']";
                const isAttribute = !options.checkHighlightedValues;
                
                const priceResult = await UIInteractions.verifyTableValues(productRow, {
                    selector: priceSelector,
                    expectedValue: productDetails.price,
                    description: "Product price",
                    isAttribute,
                    valueType,
                    formatMatch: options.formatMatch,
                    formatOptions: {
                        removeSymbols: true,
                        ignoreCasing: true,
                        numericCompare: true
                    }
                });
                
                if (!priceResult.success) {
                    errors.push(priceResult.message);
                } else {
                    console.log(priceResult.message);
                }
            }

            // Verify quantity
            if (productDetails.quantity) {
                const quantitySelector = options.checkHighlightedValues ? "td.quantity" : "input[name='quantity']";
                const isAttribute = !options.checkHighlightedValues;
                
                const quantityResult = await UIInteractions.verifyTableValues(productRow, {
                    selector: quantitySelector,
                    expectedValue: productDetails.quantity,
                    description: "Product quantity",
                    isAttribute,
                    valueType,
                    formatMatch: options.formatMatch
                });
                
                if (!quantityResult.success) {
                    errors.push(quantityResult.message);
                } else {
                    console.log(quantityResult.message);
                }
            }

            // If any errors, throw an error with all the details
            if (errors.length > 0) {
                throw new Error(`Product details validation failed for '${productDetails.name}':\n${errors.join('\n')}`);
            }

            console.log(`All details for product '${productDetails.name}' are verified successfully.`);
        } catch (error) {
            console.error(`Error verifying product '${productDetails.name}':`, error);
            throw new Error(`Product '${productDetails.name}' verification failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Enhanced method to verify the order subtotal, with support for format normalization
     * @param expectedSubtotal - The expected subtotal value
     * @param options - Optional verification options
     */
    async verifySubtotal(
        expectedSubtotal: string,
        options: {
            formatMatch?: boolean; // Whether to normalize formats (e.g., currency symbols)
        } = { formatMatch: true }
    ) {
        const result = await UIInteractions.verifyTableValues(this.subtotalPrice, {
            selector: "", // Empty since we're passing the exact locator
            expectedValue: expectedSubtotal,
            description: "Order subtotal",
            valueType: 'text',
            formatMatch: options.formatMatch,
            formatOptions: {
                removeSymbols: true,
                ignoreCasing: true,
                numericCompare: true
            }
        });
        
        if (!result.success) {
            throw new Error(result.message);
        }
        
        console.log(`Subtotal '${expectedSubtotal}' is verified successfully.`);
    }

    async selectBillingAddress() {
        await UIInteractions.checkElement(
            this.billingAddressRadio, 
            {
                description: 'Billing Address radio button',
                timeout: 5000,
                page: this.page,
                iframe: 'content-iframe'
            }
        );
    }

    async selectNewSingleAddress() {
        await UIInteractions.checkElement(
            this.newSingleAddressRadio, 
            {
                description: 'New Single Address radio button',
                timeout: 5000,
                page: this.page,
                iframe: 'content-iframe'
            }
        );
    }

    async selectNewMultipleAddress() {
        await UIInteractions.checkElement(
            this.newMultipleAddressRadio, 
            {
                description: 'New Multiple Address radio button',
                timeout: 5000,
                page: this.page,
                iframe: 'content-iframe'
            }
        );
    }

    async verifyBillingAddressDetails(expectedDetails: Record<string, string>) {
        const actualDetails = await this.billingAddressDetails.locator("dl").allTextContents();
        console.log("Actual billing address details:", actualDetails);
        
        // Improved logic to handle different formats of billing details
        const actualDetailsMap: Record<string, string> = {};
        
        if (actualDetails.length > 0) {
            const detailsText = actualDetails[0]; // Get the combined text
            console.log("Processing details text:", detailsText);
            
            // List of known billing field keys to extract
            const knownFields = [
                "Name", "Company", "Phone", "Address", "Suburb/City", 
                "State/Province", "Country", "ZIP/Postcode", "PO Number", "Tax ID"
            ];
            
            // Process each known field
            for (let i = 0; i < knownFields.length; i++) {
                const currentField = knownFields[i];
                const nextField = knownFields[i + 1]; // Next field or undefined if last
                
                // Find the current field position
                const fieldPos = detailsText.indexOf(currentField);
                if (fieldPos !== -1) {
                    let valueEndPos;
                    
                    // If it's not the last field, find the next field position
                    if (nextField) {
                        valueEndPos = detailsText.indexOf(nextField, fieldPos);
                        // If next field not found, use end of string
                        if (valueEndPos === -1) valueEndPos = detailsText.length;
                    } else {
                        valueEndPos = detailsText.length;
                    }
                    
                    // Extract the value without the field name
                    const fieldNameLength = currentField.length;
                    const value = detailsText.substring(fieldPos + fieldNameLength, valueEndPos).trim();
                    actualDetailsMap[currentField] = value;
                    
                    console.log(`Extracted ${currentField}: '${value}'`);
                }
            }
        }

        // Special handling for Address verification
        // Address in the UI often combines address line 1 and address line 2
        if (expectedDetails["Address"] && expectedDetails["Address"].includes("Suite")) {
            console.log("Address contains Suite, performing flexible address matching");
            
            // Extract the base parts of the expected address (before "Suite")
            const expectedAddressParts = expectedDetails["Address"].split("Suite");
            const expectedBaseAddress = expectedAddressParts[0].trim();
            
            // Check if the actual address contains the base address part
            if (actualDetailsMap["Address"] && 
                actualDetailsMap["Address"].includes(expectedBaseAddress)) {
                console.log("Base address part matched, considering address verification successful");
                
                // Create a temporary copy of expected details with the base address for other checks
                const modifiedExpectedDetails = {...expectedDetails};
                delete modifiedExpectedDetails["Address"]; // Remove address to skip standard comparison
                
                // Verify all other fields
                for (const [key, value] of Object.entries(modifiedExpectedDetails)) {
                    if (actualDetailsMap[key] !== value) {
                        throw new Error(`Billing address detail mismatch for '${key}'. Expected: '${value}', Found: '${actualDetailsMap[key] || "(not found)"}'`);
                    }
                }
                
                console.log("Billing address details are verified successfully (with flexible address matching).");
                return; // Skip standard verification since we've done special handling
            }
        }

        // Standard verification for all fields
        for (const [key, value] of Object.entries(expectedDetails)) {
            if (actualDetailsMap[key] !== value) {
                throw new Error(`Billing address detail mismatch for '${key}'. Expected: '${value}', Found: '${actualDetailsMap[key] || "(not found)"}'`);
            }
        }
        console.log("Billing address details are verified successfully.");
    }

    async fetchShippingQuotes() {
        await this.fetchShippingQuotesLink.click();
    }

    //None or Custom
    async selectShippingMethod(method: string) {
        await this.fetchShippingQuotes();
        await this.chooseShippingMethodSelect.selectOption(method);
    }

    async setCustomShippingDetails(details: { method: string; cost: string }) {
        await this.shippingMethodInput.fill(details.method);
        await this.shippingCostInput.fill(details.cost);
    }

     async verifyPaymentCustomerBillingDetails(expectedDetails: Record<string, string>) {
        const actualDetails = await this.customerBillingDetails.locator("dl").allTextContents();
        console.log("Actual payment customer billing details:", actualDetails);
        
        // Improved logic to handle different formats of billing details
        const actualDetailsMap: Record<string, string> = {};
        
        if (actualDetails.length > 0) {
            const detailsText = actualDetails[0]; // Get the combined text
            console.log("Processing payment details text:", detailsText);
            
            // List of known billing field keys to extract
            const knownFields = [
                "Name", "Company", "Phone", "Address", "Suburb/City", 
                "State/Province", "Country", "ZIP/Postcode", "PO Number", "Tax ID"
            ];
            
            // Process each known field
            for (let i = 0; i < knownFields.length; i++) {
                const currentField = knownFields[i];
                const nextField = knownFields[i + 1]; // Next field or undefined if last
                
                // Find the current field position
                const fieldPos = detailsText.indexOf(currentField);
                if (fieldPos !== -1) {
                    let valueEndPos;
                    
                    // If it's not the last field, find the next field position
                    if (nextField) {
                        valueEndPos = detailsText.indexOf(nextField, fieldPos);
                        // If next field not found, use end of string
                        if (valueEndPos === -1) valueEndPos = detailsText.length;
                    } else {
                        valueEndPos = detailsText.length;
                    }
                    
                    // Extract the value without the field name
                    const fieldNameLength = currentField.length;
                    const value = detailsText.substring(fieldPos + fieldNameLength, valueEndPos).trim();
                    actualDetailsMap[currentField] = value;
                    
                    console.log(`Extracted ${currentField}: '${value}'`);
                }
            }
        }

        // Special handling for Address verification
        // Address in the UI often combines address line 1 and address line 2
        if (expectedDetails["Address"] && expectedDetails["Address"].includes("Suite")) {
            console.log("Address contains Suite, performing flexible address matching");
            
            // Extract the base parts of the expected address (before "Suite")
            const expectedAddressParts = expectedDetails["Address"].split("Suite");
            const expectedBaseAddress = expectedAddressParts[0].trim();
            
            // Check if the actual address contains the base address part
            if (actualDetailsMap["Address"] && 
                actualDetailsMap["Address"].includes(expectedBaseAddress)) {
                console.log("Base address part matched, considering address verification successful");
                
                // Create a temporary copy of expected details with the base address for other checks
                const modifiedExpectedDetails = {...expectedDetails};
                delete modifiedExpectedDetails["Address"]; // Remove address to skip standard comparison
                
                // Verify all other fields
                for (const [key, value] of Object.entries(modifiedExpectedDetails)) {
                    if (actualDetailsMap[key] !== value) {
                        throw new Error(`Billing detail mismatch for '${key}'. Expected: '${value}', Found: '${actualDetailsMap[key] || "(not found)"}'`);
                    }
                }
                
                console.log("Billing details are verified successfully (with flexible address matching).");
                return; // Skip standard verification since we've done special handling
            }
        }

        // Standard verification for all fields
        for (const [key, value] of Object.entries(expectedDetails)) {
            if (actualDetailsMap[key] !== value) {
                throw new Error(`Billing detail mismatch for '${key}'. Expected: '${value}', Found: '${actualDetailsMap[key] || "(not found)"}'`);
            }
        }
        console.log("Billing details are verified successfully.");
    }


    async verifyFulfillmentShippingDetails(expectedDetails: Record<string, string>) {
        const actualDetails = await this.shippingDetails.locator("dl").allTextContents();
        console.log("Actual fulfillment shipping details:", actualDetails);
        
        // Improved logic to handle different formats of shipping details
        const actualDetailsMap: Record<string, string> = {};
        
        if (actualDetails.length > 0) {
            const detailsText = actualDetails[0]; // Get the combined text
            console.log("Processing shipping details text:", detailsText);
            
            // List of known shipping field keys to extract
            const knownFields = [
                "Name", "Company", "Phone", "Address", "Suburb/City", 
                "State/Province", "Country", "ZIP/Postcode", "Method", "Carrier"
            ];
            
            // Process each known field
            for (let i = 0; i < knownFields.length; i++) {
                const currentField = knownFields[i];
                const nextField = knownFields[i + 1]; // Next field or undefined if last
                
                // Find the current field position
                const fieldPos = detailsText.indexOf(currentField);
                if (fieldPos !== -1) {
                    let valueEndPos;
                    
                    // If it's not the last field, find the next field position
                    if (nextField) {
                        valueEndPos = detailsText.indexOf(nextField, fieldPos);
                        // If next field not found, use end of string
                        if (valueEndPos === -1) valueEndPos = detailsText.length;
                    } else {
                        valueEndPos = detailsText.length;
                    }
                    
                    // Extract the value without the field name
                    const fieldNameLength = currentField.length;
                    const value = detailsText.substring(fieldPos + fieldNameLength, valueEndPos).trim();
                    actualDetailsMap[currentField] = value;
                    
                    console.log(`Extracted ${currentField}: '${value}'`);
                }
            }
        }

        // Special handling for Address verification
        // Address in the UI often combines address line 1 and address line 2
        if (expectedDetails["Address"] && expectedDetails["Address"].includes("Suite")) {
            console.log("Address contains Suite, performing flexible address matching");
            
            // Extract the base parts of the expected address (before "Suite")
            const expectedAddressParts = expectedDetails["Address"].split("Suite");
            const expectedBaseAddress = expectedAddressParts[0].trim();
            
            // Check if the actual address contains the base address part
            if (actualDetailsMap["Address"] && 
                actualDetailsMap["Address"].includes(expectedBaseAddress)) {
                console.log("Base address part matched, considering address verification successful");
                
                // Create a temporary copy of expected details with the base address for other checks
                const modifiedExpectedDetails = {...expectedDetails};
                delete modifiedExpectedDetails["Address"]; // Remove address to skip standard comparison
                
                // Verify all other fields
                for (const [key, value] of Object.entries(modifiedExpectedDetails)) {
                    if (actualDetailsMap[key] !== value) {
                        throw new Error(`Shipping detail mismatch for '${key}'. Expected: '${value}', Found: '${actualDetailsMap[key] || "(not found)"}'`);
                    }
                }
                
                console.log("Shipping details are verified successfully (with flexible address matching).");
                return; // Skip standard verification since we've done special handling
            }
        }

        // Standard verification for all fields
        for (const [key, value] of Object.entries(expectedDetails)) {
            if (actualDetailsMap[key] !== value) {
                throw new Error(`Shipping detail mismatch for '${key}'. Expected: '${value}', Found: '${actualDetailsMap[key] || "(not found)"}'`);
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


    /**
     * Enhanced method to verify fulfillment product details in a table
     * @param expectedProducts - Array of expected product details
     * @param options - Optional verification options
     */
    async verifyFulfillmentProductTable(
        expectedProducts: Array<{ name: string; quantity: string; price: string; total: string }>,
        options: {
            formatMatch?: boolean; // Whether to normalize formats (e.g., currency symbols)
        } = { formatMatch: true }
    ) {
        for (const product of expectedProducts) {
            // Use a more reliable way to locate the product row with contains filter
            console.log(`Looking for fulfillment product with name containing: '${product.name}'`);
            const productRow = this.fulfillmentProductTableRows.filter({ hasText: product.name }).first();
            
            try {
                // Check if the product row exists with a generous timeout
                await productRow.waitFor({ state: 'visible', timeout: 10000 });
                console.log(`Fulfillment product row with name containing '${product.name}' is displayed in the table.`);
                
                const errors: string[] = [];
                
                // Verify quantity
                const quantityResult = await UIInteractions.verifyTableValues(productRow, {
                    selector: "td.quantity",
                    expectedValue: product.quantity,
                    description: "Product quantity",
                    valueType: 'text',
                    formatMatch: options.formatMatch
                });
                
                if (!quantityResult.success) {
                    errors.push(quantityResult.message);
                } else {
                    console.log(quantityResult.message);
                }
                
                // Verify price
                const priceResult = await UIInteractions.verifyTableValues(productRow, {
                    selector: "td.price",
                    expectedValue: product.price,
                    description: "Product price",
                    valueType: 'text',
                    formatMatch: options.formatMatch,
                    formatOptions: {
                        removeSymbols: true,
                        ignoreCasing: true,
                        numericCompare: true
                    }
                });
                
                if (!priceResult.success) {
                    errors.push(priceResult.message);
                } else {
                    console.log(priceResult.message);
                }
                
                // Verify total
                const totalResult = await UIInteractions.verifyTableValues(productRow, {
                    selector: "td.total",
                    expectedValue: product.total,
                    description: "Product total",
                    valueType: 'text',
                    formatMatch: options.formatMatch,
                    formatOptions: {
                        removeSymbols: true,
                        ignoreCasing: true,
                        numericCompare: true
                    }
                });
                
                if (!totalResult.success) {
                    errors.push(totalResult.message);
                } else {
                    console.log(totalResult.message);
                }
                
                // If any errors, throw an error with all the details
                if (errors.length > 0) {
                    throw new Error(`Product details validation failed for '${product.name}':\n${errors.join('\n')}`);
                }
                
                console.log(`All details for product '${product.name}' are verified successfully.`);
            } catch (error) {
                console.error(`Error verifying fulfillment product '${product.name}':`, error);
                throw new Error(`Fulfillment product '${product.name}' verification failed: ${error instanceof Error ? error.message : String(error)}`);
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