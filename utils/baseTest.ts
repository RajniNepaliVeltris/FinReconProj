import { test as baseTest, chromium } from '@playwright/test';

export class BaseTest {
    protected browser: import('@playwright/test').Browser;
    protected context: import('@playwright/test').BrowserContext;

    constructor() {
        this.browser = null as any;
        this.context = null as any;
    }

    /**
     * Setup browser and context
     */
    public async setupBrowser(): Promise<void> {
        this.browser = await chromium.connectOverCDP({
            endpointURL: 'http://localhost:9222',
            timeout: 30000,
            slowMo: 100
        });
        this.context = this.browser.contexts()[0];
    }

    /**
     * Get a new page from the context
     */
    public async getPage(): Promise<import('@playwright/test').Page> {
        const pages = await this.context.pages();
        return pages.length > 0 ? pages[0] : await this.context.newPage();
    }

    /**
     * Cleanup browser
     */
    public async cleanup(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Export the base test with browser setup
export const test = baseTest.extend<{ baseTest: BaseTest }>({
    baseTest: async ({ }, use) => {
        const baseTestInstance = new BaseTest();
        await baseTestInstance.setupBrowser();
        await use(baseTestInstance);
        await baseTestInstance.cleanup();
    },
});