import { Locator, Page } from '@playwright/test';
import { BasePage } from '../Base/basePage';

/**
 * Page object for the Pearson VUE Home/Dashboard page
 * Contains locators and common interactions used by tests
 */
export class HomePage extends BasePage {
    // Locators
    readonly headerLogo: Locator;
    readonly topNav: Locator;
    readonly welcomeHeading: Locator;
    readonly welcomeParagraph: Locator;
    readonly userGreeting: Locator; // e.g., "Welcome, PVFRUser1"
    readonly logoutLink: Locator;
    readonly configurationLink: Locator;
    readonly jobStatusLink: Locator;
    readonly voucherLink: Locator;
    readonly paymentGatewayLink: Locator;
    readonly fxRateLink: Locator;
    readonly reportsLink: Locator;
    readonly customSchemaLink: Locator;
    readonly downloadsLink: Locator;
    readonly manualReturnLink: Locator;
    readonly settlementRulesLink: Locator;
    readonly mertConfigurationLink: Locator;
    readonly MPMJobsLink: Locator;
    readonly reportSFTPFileLink: Locator;
    readonly FinReconnLink: Locator;
    readonly compTIALink: Locator;
    readonly PKMJobsLink: Locator;
    readonly settlementReportLink: Locator;
    readonly reportCSPDPIILink: Locator;
    readonly reportSupplementaryLink: Locator;
    readonly reportRedemptionLink: Locator;
    readonly reportResellerLink: Locator;
    readonly reportNewtLink: Locator;
    readonly reportModifiedCSPDPIILink: Locator;
    readonly reportB2BSalesLink: Locator;
    readonly reportShippingPaymentFeeLink: Locator;
    readonly reportPOInvoiceLink: Locator;
    readonly mertReportIndexLink: Locator;
    readonly storeCreditBalanceReportLink: Locator;





    constructor(page: Page) {
        super(page);

        // Header/logo at top-left
        this.headerLogo = page.locator('header >> text=Pearson | VUE', { hasText: 'Pearson' });

        // Primary top navigation bar (menu items shown in screenshot)
        this.topNav = page.locator('nav, header nav, .navbar, .top-nav');

        // Welcome section
        this.welcomeHeading = page.locator('h1', { hasText: 'Welcome to Pearson Vue' });
        this.welcomeParagraph = page.locator('h1 + p, h1 + div, .welcome, .content p');

        // User greeting shown on top-right (example text: "Welcome, PVFRUser1")
        this.userGreeting = page.locator('text=/Welcome,\s+\w+/');

        // Logout link near the user greeting (scoped to header to avoid accidental matches)
        this.logoutLink = page.locator('header').locator('text=Logout').first();

        // Helper to create DesktopMenu button locator by visible text
        const desktopMenuButton = (name: string) => page.locator(`//div[@id="DesktopMenu"]//button[contains(@class,"dropbtn") and normalize-space(text())="${name}"]`).first();

        // Helper to create DesktopMenu link locator by link text (within dropdown-content)
        const desktopMenuLinkByText = (text: string) => page.locator(`//div[@id="DesktopMenu"]//div[contains(@class,'dropdown-content')]//a[normalize-space(text())="${text}"]`);

        // Helper to create DesktopMenu link locator by href fragment
        const desktopMenuLinkByHref = (hrefFragment: string) => page.locator(`//div[@id="DesktopMenu"]//a[contains(@href,"${hrefFragment}")]`).first();

        // Initialize named menu locators using helper to reduce duplication
        this.configurationLink = desktopMenuButton('Configuration');
        this.jobStatusLink = desktopMenuButton('Job Status');
        this.voucherLink = desktopMenuButton('Voucher');
        this.paymentGatewayLink = desktopMenuButton('Payment Gateway');
        this.fxRateLink = desktopMenuButton('FX Rate');
        this.reportsLink = desktopMenuButton('Report');
        this.customSchemaLink = desktopMenuButton('Custom Schema');
        this.downloadsLink = desktopMenuButton('Downloads');
        this.manualReturnLink = desktopMenuButton('Manual Return');

        // Common submenu links initialized by href or visible text
        this.settlementRulesLink = desktopMenuLinkByText('Settlement Rules');
        this.mertConfigurationLink = desktopMenuLinkByText('Mert Configuration');
        this.MPMJobsLink = desktopMenuLinkByHref('/MPMJob/Jobs');
        this.reportSFTPFileLink = desktopMenuLinkByHref('ReportSFTPFile');
        this.FinReconnLink = desktopMenuLinkByText('FinRecon');
        this.compTIALink = desktopMenuLinkByText('CompTIA');
        this.PKMJobsLink = desktopMenuLinkByHref('/PKMJob/Jobs');
        this.settlementReportLink = desktopMenuLinkByHref("/Report/SettlementReport");
        this.reportCSPDPIILink = desktopMenuLinkByHref("/Report/CSPDPII");
        this.reportSupplementaryLink = desktopMenuLinkByHref("/Report/SupplementaryReport");
        this.reportRedemptionLink = desktopMenuLinkByHref("/Report/RedemptionReport");
        this.reportResellerLink = desktopMenuLinkByHref("/Report/ResellerReport");
        this.reportNewtLink = desktopMenuLinkByHref("/Report/NewReport");
        this.reportModifiedCSPDPIILink = desktopMenuLinkByHref("/Report/ModifiedCSPDPII");
        this.reportB2BSalesLink = desktopMenuLinkByHref("/Report/B2BSalesReport");
        this.reportShippingPaymentFeeLink = desktopMenuLinkByHref("/Report/ShippingPaymentFeeReport");
        this.reportPOInvoiceLink = desktopMenuLinkByHref("/Report/POInvoiceReport");
        this.mertReportIndexLink = desktopMenuLinkByHref("/MertReport/Index");
        this.storeCreditBalanceReportLink = desktopMenuLinkByHref("/StoreCredit/StoreCreditBalanceReport");
    }
    /**
     * Clicks a top navigation menu item by visible text.
     * @param name visible text of the menu item
     */
    async clickTopMenu(name: string): Promise<void> {
        const menuItem = this.page.locator(`nav >> text="${name}" , .top-nav >> text="${name}", header >> text="${name}"`);
        await this.clickElement(menuItem, `Top menu: ${name}`);
    }

    /**
     * Returns the heading text from the welcome section
     */
    async getWelcomeHeadingText(): Promise<string> {
        return (await this.getElementText(this.welcomeHeading)).trim();
    }

    /**
     * Returns the welcome paragraph text (first paragraph under the heading)
     */
    async getWelcomeParagraphText(): Promise<string> {
        return (await this.getElementText(this.welcomeParagraph)).trim();
    }

    /**
     * Checks whether a user greeting is visible (indicating logged in state)
     */
    async isUserLoggedIn(): Promise<boolean> {
        return await this.isElementVisible(this.userGreeting, 3000);
    }

    /**
     * Clicks the logout link/button in the header
     */
    async clickLogout(): Promise<void> {
        await this.clickElement(this.logoutLink, 'Logout link');
    }

    /**
     * Verifies the home page is displayed by checking the welcome heading and user greeting
     */
    async verifyHomePageDisplayed(): Promise<void> {
        await this.waitForElement(this.welcomeHeading, 5000);
        if (!(await this.isUserLoggedIn())) {
            throw new Error('User greeting not visible - home page may not be displayed or user not logged in');
        }
    }

    //Naviaget to the Configuration

    async navigationtoSpecificMenu(mainMenu: string, subMenu: string): Promise<void> {
        if (!mainMenu || !subMenu) throw new Error('Both main menu and sub menu must be provided');
        // Map main menu names to their top-level locators
        const mainMenuMap: Record<string, Locator> = {
            'Configuration': this.configurationLink,
            'Job Status': this.jobStatusLink,
            'Voucher': this.voucherLink,
            'Payment Gateway': this.paymentGatewayLink,
            'FX Rate': this.fxRateLink,
            'Report': this.reportsLink,
            'Custom Schema': this.customSchemaLink,
            'Downloads': this.downloadsLink,
            'Manual Return': this.manualReturnLink
        };

        const subMenuMap: Record<string, Record<string, Locator>> = {
            'Configuration': {
                'Settlement Rules': this.settlementRulesLink,
                'Mert Configuration': this.mertConfigurationLink
            },
            'Job Status': {
                'MPM Job': this.MPMJobsLink,
                'Report SFTP Feed': this.reportSFTPFileLink,
                'FinRecon': this.FinReconnLink,
                'CompTIA': this.compTIALink,
                'PKM Job': this.PKMJobsLink
            },
            'Report': {
                'Settlement Report': this.settlementReportLink,
                'CSPD Minus PII': this.reportCSPDPIILink,
                'Supplementary Report': this.reportSupplementaryLink,
                'Redemption Report': this.reportRedemptionLink,
                'Reseller Report': this.reportResellerLink,
                'Newt Report': this.reportNewtLink,
                'Modified CSPD Minus PII': this.reportModifiedCSPDPIILink,
                'B2B Sales Report': this.reportB2BSalesLink,
                'Shipping Payment Fee Report': this.reportShippingPaymentFeeLink,
                'PO Invoice Report': this.reportPOInvoiceLink,
                'Store Credit Balance Report': this.storeCreditBalanceReportLink
            }
        };

        const topLocator = mainMenuMap[mainMenu];
        if (!topLocator) throw new Error(`Unknown main menu: ${mainMenu}`);

        // Click the main menu to reveal submenu
        await this.clickElement(topLocator, `Main menu: ${mainMenu}`);

        // If there's a mapping for the provided mainMenu and subMenu, click it
        const subMap = subMenuMap[mainMenu];
        if (subMap && subMap[subMenu]) {
            await this.clickElement(subMap[subMenu], `Sub menu: ${subMenu}`);
            return;
        }

        // If no submenu mapping - allow some menus to be top-level only
        const isTopOnly = ['Voucher', 'Payment Gateway', 'FX Rate', 'Custom Schema', 'Downloads', 'Manual Return'];
        if (isTopOnly.includes(mainMenu)) return;

        // Fallback: try to click link by visible text under DesktopMenu
        const fallback = this.page.locator(`//div[@id="DesktopMenu"]//div[contains(@class,'dropdown-content')]//a[normalize-space(text())="${subMenu}"]`).first();
        if (await fallback.isVisible()) {
            await this.clickElement(fallback, `Sub menu (fallback): ${subMenu}`);
            return;
        }

        throw new Error(`Unknown submenu '${subMenu}' for main menu '${mainMenu}'`);

    }
}
