import { Locator, Page, expect } from '@playwright/test';
import { Homepage } from '../Dashboard/homepage';
import { CustomerDetails } from './customerType';

export class AddCustomerPage extends Homepage {
    // Locators
    private customerHeader: Locator;
    private originChannelSelect: Locator;
    private firstNameInput: Locator;
    private lastNameInput: Locator;
    private companyNameInput: Locator;
    private emailInput: Locator;
    private customerGroupSelect: Locator;
    private phoneInput: Locator;
    private storeCreditInput: Locator;
    private receiveACSEmailsSelect: Locator;
    private forcePasswordResetSelect: Locator;
    private taxExemptCodeInput: Locator;
    private lineOfCreditInput: Locator;
    private paymentTermsInput: Locator;
    private passwordInput: Locator;
    private confirmPasswordInput: Locator;
    private cancelButton: Locator;
    private saveAndAddAnotherButton: Locator;
    channeloptionselect: Locator;
    customerGroupOptionselect: Locator;
    paymentTermsOptionInput: Locator;
    addCustomerAddressButton: Locator;
    confirmSaveOkButton: Locator;
    addAnAddressButton: Locator;
    addAddressFirstNameInput: Locator;
    addAddressLastNameInput: Locator;
    addAddressCompanyNameInput: Locator;
    addAddressPhoneNumberInput: Locator;
    addAddressLine1Input: Locator;
    addAddressLine2Input: Locator;
    addAddressSuburbOrCityInput: Locator;
    addAddressStateOrProvinceInput: Locator;
    addCountryInputDropDown: Locator;
    addTypeRadioButtonInput: Locator;
    addPONumberInput: Locator;
    addTaxIDInput: Locator;
    addAddressHeading: Locator;
    addAddressZipOrPostcodeInput: Locator;
    addcountryinputhardcoded: Locator;
    saveAddressButton: Locator;
    allCustomerMenu: Locator;
    searchCustomerInputBox: Locator;
    rows: Locator;
    searchCustomerButton: Locator;

    constructor(page: Page) {
        super(page);
        const iframe = this.page.frameLocator('#content-iframe');
        if (!iframe) throw new Error('Iframe not found. Ensure the iframe is loaded and accessible.');

        // Helper to initialize locators
        const initLocator = (xpath: string) => iframe.locator(xpath);
        const CustomerBaseXPath = "//fieldset//span[text()='Customer details']//..//..";
        this.customerHeader = initLocator(`${CustomerBaseXPath}//span[text()="Customer details"]`);
        this.originChannelSelect = initLocator(`${CustomerBaseXPath}//button[@class="dropdown-button"]`);
        this.channeloptionselect = initLocator(`${CustomerBaseXPath}//ul[@class="dropdown-menu"]//li[1]`);
        this.firstNameInput = initLocator(`${CustomerBaseXPath}//input[@id="firstName"]`);
        this.lastNameInput = initLocator(`${CustomerBaseXPath}//input[@id="lastName"]`);
        this.companyNameInput = initLocator(`${CustomerBaseXPath}//input[@id="companyName"]`);
        this.emailInput = initLocator(`${CustomerBaseXPath}//input[@id="emailAddress"]`);
        this.customerGroupSelect = initLocator(`${CustomerBaseXPath}//select[@id="customerGroup"]`);
        this.customerGroupOptionselect = initLocator(`${CustomerBaseXPath}//select[@id="customerGroup"]`);
        this.phoneInput = initLocator(`${CustomerBaseXPath}//input[@id="phoneNumber"]`);
        this.storeCreditInput = initLocator(`${CustomerBaseXPath}//input[@id="storeCredit"]`);
        this.receiveACSEmailsSelect = initLocator(`${CustomerBaseXPath}//select[@id="receiveEmail"]`);
        this.forcePasswordResetSelect = initLocator(`${CustomerBaseXPath}//select[@id="forcePasswordReset"]`);
        this.taxExemptCodeInput = initLocator(`${CustomerBaseXPath}//input[@id="taxExemptCategory"]`);
        this.lineOfCreditInput = initLocator('//form-field[label[contains(normalize-space(.), "Line of Credit")]]//input');
        this.paymentTermsInput = initLocator('//form-field[label[contains(normalize-space(.), "Payment Terms")]]//select');
        this.paymentTermsOptionInput = initLocator('//form-field[label[contains(normalize-space(.), "Payment Terms")]]//select//option[2]');
        const PasswordBaseXPath = "//fieldset//span[text()='Password']//..//..";
        this.passwordInput = initLocator(`${PasswordBaseXPath}//input[@id="password"]`);
        this.confirmPasswordInput = initLocator(`${PasswordBaseXPath}//input[@name="passwordConfirm"]`);
        this.addCustomerAddressButton = initLocator('//customer-edit//..//..//li//a[text()="Customer address book"]');
        this.confirmSaveOkButton = initLocator('//section//button//span[text()="OK"]')
        this.addAnAddressButton = initLocator('//a//span[text()="Add an address"]')
        const AddressBaseXPath = "//add-customer-address//div//span"
        this.addAddressHeading = initLocator('//h1[text()="Add address"]');
        this.addAddressFirstNameInput = initLocator(`${AddressBaseXPath}//input[@name="firstName"]`);
        this.addAddressLastNameInput = initLocator(`${AddressBaseXPath}//input[@name="lastName"]`);
        this.addAddressCompanyNameInput = initLocator(`${AddressBaseXPath}//input[@name="company"]`);
        this.addAddressPhoneNumberInput = initLocator(`${AddressBaseXPath}//input[@name="phoneNumber"]`);
        this.addAddressLine1Input = initLocator(`${AddressBaseXPath}//input[@name="addressLine1"]`);
        this.addAddressLine2Input = initLocator(`${AddressBaseXPath}//input[@name="addressLine2"]`);
        this.addAddressSuburbOrCityInput = initLocator(`${AddressBaseXPath}//input[@name="suburbOrCity"]`);
        this.addAddressStateOrProvinceInput = initLocator(`${AddressBaseXPath}//input[@name="stateOrProvince"]`);
        this.addAddressZipOrPostcodeInput = initLocator(`${AddressBaseXPath}//input[@name="zipOrPostcode"]`);
        this.addcountryinputhardcoded = initLocator('//input[@role="combobox" and @placeholder="Choose country"]');
        this.addCountryInputDropDown = initLocator('//add-customer-address//button[@aria-label="toggle menu"]');
        // this.addTypeRadioButtonInput will be initialized in fillCustomerDetails where 'details' is available
        this.addTypeRadioButtonInput = null as unknown as Locator;
        this.addPONumberInput = initLocator('//label[normalize-space(text())="PO Number"]/following-sibling::span//input');
        this.addTaxIDInput = initLocator('//label[normalize-space(text())="Tax ID"]/following-sibling::span//input');
        this.allCustomerMenu = initLocator('//nav//li//a[text()="All customers"]');
        this.searchCustomerInputBox = initLocator('//customers-list//div[@class="form-prefixPostfix"]//input[contains(@class, "form-input")]');
        this.searchCustomerButton = initLocator('//a[@aria-label="Advanced Search" and contains(@class,"button")]')
        this.cancelButton = initLocator('//span[text()="Cancel"]');
        this.saveAndAddAnotherButton = initLocator('//button[text()="Save and add another"]');
        this.saveAddressButton = initLocator('//button//span[text()="Save"]');
        this.rows = initLocator('tr.tableRow');
    }

    async navigateToAddCustomerPage() {
        await this.page.goto('https://YOUR_BIGCOMMERCE_URL/admin/customers/add');
    }


    public getNextEmail(base: string = 'johndoe', domain: string = '@gmail.com'): string {
        const uniqueNumber = Date.now(); // milliseconds
        return `${base}${uniqueNumber}${domain}`;
    }



    async fillCustomerDetails(details: CustomerDetails) {
        try{
        await this.isElementVisible(this.customerHeader);
        if (await this.customerHeader.isVisible() === false) {
            throw new Error('Add Customer page is not loaded properly.');
        }else{

        await this.clickElement(this.originChannelSelect, 'Origin Channel Select');
        await this.clickElement(this.channeloptionselect, 'Channel Option Select');
        await this.enterText(this.firstNameInput, details.firstName);
        await this.enterText(this.lastNameInput, details.lastName);
        if (details.companyName) {
            await this.enterText(this.companyNameInput, details.companyName);
        }else{
            await this.enterText(this.companyNameInput, 'Default Company');
        }
        if (details.email) {
            await this.enterText(this.emailInput, details.email);
        }
        else{
            throw new Error('email box not shown');
        }
        if (details.customerGroup){
        await this.clickElement(this.customerGroupSelect, 'Customer Group Select');
        await this.customerGroupOptionselect.selectOption({label: details.customerGroup})
        }
        else{
            throw new Error('Customer Group not provided');
        }
        if (details.phone) {
            await this.enterText(this.phoneInput, details.phone);
        }
        if (details.storeCredit) {
            await this.enterText(this.storeCreditInput, details.storeCredit);
        }
        if (details.receiveACSEmails) {
            await this.receiveACSEmailsSelect.selectOption({ label: details.receiveACSEmails });
        }
        if (details.forcePasswordReset) {
            await this.forcePasswordResetSelect.selectOption({ label: details.forcePasswordReset });
        }
        if (details.taxExemptCode) {
            await this.enterText(this.taxExemptCodeInput, details.taxExemptCode);
        }
        if (details.lineOfCredit) {
            await this.enterText(this.lineOfCreditInput, details.lineOfCredit);
        }
        if (details.paymentTerms) {
            await this.paymentTermsInput.selectOption({ label: details.paymentTerms });
        }
        await this.enterText(this.passwordInput, details.password);
        await this.enterText(this.confirmPasswordInput, details.confirmPassword);

    await this.clickElement(this.addCustomerAddressButton, 'Add Customer Address Button');
    await this.clickElement(this.confirmSaveOkButton, 'Confirm Save OK Button');
    await this.clickElement(this.addAnAddressButton, 'Add Address Button');

    if (details.address) {
        await this.waitForElement(this.addAddressHeading);
        await expect(this.addAddressHeading).toBeVisible();
        await this.enterText(this.addAddressFirstNameInput, details.address.firstName);
        console.log('First name entered:', details.address.lastName);
        console.log('Xpath for  Last Name input:', this.addAddressLastNameInput);
            await this.enterText(this.addAddressLastNameInput, details.address.lastName);
            await this.enterText(this.addAddressCompanyNameInput, details.address.companyName || "");
            await this.enterText(this.addAddressPhoneNumberInput, details.address.phone || "");
            await this.enterText(this.addAddressLine1Input, details.address.street);
            await this.enterText(this.addAddressLine2Input, details.address.line2 || "");
            await this.enterText(this.addAddressSuburbOrCityInput, details.address.city);
            await this.enterText(this.addAddressZipOrPostcodeInput, details.address.zip);
            await this.enterText(this.addPONumberInput, details.address.poNumber || "");
            await this.enterText(this.addTaxIDInput, details.address.taxId || "");
            await this.selectFromInputDropdownDynamic(this.addcountryinputhardcoded, details.address.country);
            await this.selectFromInputDropdownDynamic(this.addAddressStateOrProvinceInput, details.address.state);
            this.addTypeRadioButtonInput = this.page.frameLocator('#content-iframe').locator(`//fieldset//label[text()="${details.address.type}"]`);
            await this.selectRadioButton(this.addTypeRadioButtonInput, details.address.type);
            await this.clickElement(this.saveAddressButton, 'Save Address Button');
        }
        }
    } catch (error) {
        console.log('Error in fillCustomerDetails:', error);
        console.error('Error in fillCustomerDetails:', error);
        throw error; // Re-throw the error after logging it
    }
}

    async clickAllCustomers(details: CustomerDetails) {
    try {
       await this.searchCustomerInputBox.fill(details.email);
        // Press Enter key to trigger search
        await this.searchCustomerInputBox.press('Enter');
        // Get all rows in the grid
        await expect(this.rows, `Expected exactly 1 row for email ${details.email}`)
            .toHaveCount(1, { timeout: 10000 });
        // Once row is confirmed, validate email cell
        const emailCell = this.rows.first().locator('td.email-cell a.mail-to-link');
        await expect(emailCell).toBeVisible({ timeout: 5000 });
        const emailText = await emailCell.textContent();
        console.log(`Email found: ${emailText?.trim()}`);

    }   catch (error) {
        console.error(`Error in clickAllCustomers for email ${details.email}:`, error);
        throw error;
    }
}   
}