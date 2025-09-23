import { Locator, Page, expect } from '@playwright/test';
import { UIInteractions } from '../../../utils/uiInteractions';
import { Homepage } from '../Dashboard/homepage';

export class CouponCodePage extends Homepage {
    private couponCodesHeader: Locator;
    private createCouponCodeButton: Locator;
    private deleteCouponButton: Locator;
    private createCouponCodeFormHeader: Locator;
    private generalTab: Locator;
    private advancedTab: Locator;
    private couponDetailsHeader: Locator;
    private couponCodeInput: Locator;
    private applyCouponButton: Locator;
    private couponErrorMessage: Locator;
    private couponCodeInputField: Locator;
    private couponCodeNameInput: Locator;
    private couponDiscountType: (OptionDiscount: string) => Locator;
    private couponAmountInput: Locator;
    private minimumOrderAmountInput: Locator;
    private limitCouponUsageCheckbox: Locator;
    private maxUsageCouponsInput: Locator;
    private maxUsagePerUserCouponCheckbox: Locator;
    private maxUsagePerUserCouponsInput: Locator;
    private excludeCartLevelDiscountsCheckbox: Locator;
    private enabledCouponCheckbox: Locator;
    private couponExpiryDateInput: Locator;
    private couponCodeSpecificProductRadioButton: Locator;
    private addCouponProductButton: Locator;

    constructor(page: Page) {
        super(page);
        const iframe = this.page.frameLocator('#content-iframe');
        if (!iframe) throw new Error('Iframe not found. Ensure the iframe is loaded and accessible.');

        // Helper to initialize locators
        const initLocator = (xpath: string) => iframe.locator(xpath);

        // Coupon Code Section Locators
        this.couponCodeInput = initLocator("//input[@name='couponCode']");
        this.applyCouponButton = initLocator("//button[@name='applyCoupon']");
        this.couponErrorMessage = initLocator("//div[@class='coupon-error-message']");
        this.couponCodesHeader = initLocator("//h1[text()='Coupon codes']");
        this.createCouponCodeButton = initLocator("//div[@class='action-bar']//a[contains(@href,'CreateCoupon')]");
        this.deleteCouponButton = initLocator("//button[@id='IndexDeleteButton']");
        this.createCouponCodeFormHeader = initLocator("//form[@id='coupon-form']/h1");
        this.generalTab = initLocator("//a[@id='tab-general']");
        this.advancedTab = initLocator("//a[@id='tab-adv']");
        this.couponDetailsHeader = initLocator("//h2[text()='Coupon details']");
        this.couponCodeInputField = initLocator("//input[@id='couponcode']");
        this.couponCodeNameInput = initLocator("//input[@id='couponname']");
        this.couponDiscountType = (OptionDiscount: string) => {
            return initLocator(`//ul[@aria-labelledby="discountType"]/li[@data-discount-text='${OptionDiscount}']`);
        };
        this.couponAmountInput = initLocator("//input[@id='couponamount']");
        this.minimumOrderAmountInput = initLocator("//input[@id='couponminpurchase']");
        this.limitCouponUsageCheckbox = initLocator("//input[@id='CouponMaxUsesEnabled']");
        this.maxUsagePerUserCouponCheckbox = initLocator("//input[@id='CouponMaxUsesPerCustomerEnabled']");
        this.maxUsageCouponsInput = initLocator("//input[@id='couponmaxuses']");
        this.maxUsagePerUserCouponsInput = initLocator("//input[@id='couponmaxusespercus']");
        this.excludeCartLevelDiscountsCheckbox = initLocator("//input[@id='excludeDiscounts']");
        this.enabledCouponCheckbox = initLocator("//input[@id='couponenabled']");
        this.couponExpiryDateInput = initLocator("//input[@id='couponexpires']");
        this.couponCodeSpecificProductRadioButton = initLocator("//input[@id='usedforprod']");
        this.addCouponProductButton = initLocator("//button[@id='ProductAddButton']");

    }

    async enterCouponCode(couponCode: string) {
        await this.enterText(this.couponCodeInput, couponCode);
    }

    async applyCoupon() {
        await this.clickElement(this.applyCouponButton, 'Apply Coupon Button');
    }

    async getCouponErrorMessage() {
        return await this.couponErrorMessage.textContent();
    }
}
