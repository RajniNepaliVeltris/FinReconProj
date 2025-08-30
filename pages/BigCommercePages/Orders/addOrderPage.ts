import { Locator, Page, expect } from '@playwright/test';
import { CustomerInfo, OrderItem, ShippingDetails, PaymentDetails, OrderData } from '../../../models/OrderTypes';

export class AddOrderPage {
    private page: Page;


    // Shipping Locators
    private shippingMethodSelect: Locator;
    
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
        companyName?: string;
        phoneNumber?: string;
        addressLine1: string;
        addressLine2?: string;
        suburbCity: string;
        country: string;
        stateProvince: string;
        zipPostcode: string;
        poNumber?: string;
        taxID?: string;
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

  
    
}