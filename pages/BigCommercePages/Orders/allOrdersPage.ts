import { Page, Locator } from '@playwright/test';
import { Homepage } from '../../BigCommercePages/Dashboard/homepage';


export class AllOrdersPage extends Homepage {
    // Common XPath prefixes
    private readonly ordersIndexForm = '//form[@id="orders-index"]';
    private readonly ordersQuickFilter = '//ul[@id="orders-quick-filter"]';

    //OrderSuccess Alert
    private readonly orderSuccessAlert: Locator;


    // Locators for main elements
    private readonly ordersTable: Locator;
    private readonly orderRows: Locator;
    private readonly filterInput: Locator;
    private readonly filterButton: Locator;
    private readonly searchButton: Locator;
    private readonly addButton: Locator;
    private readonly exportAllButton: Locator;
    private readonly chooseActionDropdown: Locator;
    private readonly confirmButton: Locator;
    private readonly viewSizeDropdown: Locator;

    // Tab locators
    private readonly allOrdersTab: Locator;
    private readonly awaitingPaymentTab: Locator;
    private readonly awaitingFulfillmentTab: Locator;
    private readonly awaitingShipmentTab: Locator;
    private readonly highRiskTab: Locator;
    private readonly preOrdersTab: Locator;
    private readonly moreTab: Locator;
    private readonly customViewsTab: Locator;
    private readonly moreDropdownOptions: { [key: string]: Locator };

    // Table column locators
    private readonly dateColumn: Locator;
    private readonly orderIdColumn: Locator;
    private readonly customerColumn: Locator;
    private readonly statusColumn: Locator;
    private readonly totalColumn: Locator;
    private readonly actionColumn: Locator;
    private readonly expandOrderDetails: (orderId: string) => Locator;
    private readonly orderDetailsActionButton: (orderId: string) => Locator;
    private readonly orderDetailsStatusDropdown: (orderId: string) => Locator;
    private readonly orderDetailsActionOption: (action: string) => Locator;

    constructor(page: Page) {
        super(page);
        const iframe = this.page.frameLocator('#content-iframe');
        if (!iframe) throw new Error('Iframe not found. Ensure the iframe is loaded and accessible.');

        // Helper to initialize locators
        const initLocator = (xpath: string) => iframe.locator(xpath);
        // Use common prefixes for locator definitions
        this.ordersTable = initLocator(`${this.ordersIndexForm}/table`);
        this.orderRows = initLocator(`${this.ordersIndexForm}/table/tbody/tr`);
        this.filterInput = initLocator(`${this.ordersIndexForm}/div[@class="action-bar"]//input[@id="keyword-filter"]`);
        this.filterButton = initLocator(`${this.ordersIndexForm}/div[@class="action-bar"]//span[text()="Filter"]`);
        this.searchButton = initLocator(`${this.ordersIndexForm}//a[contains(@aria-label,"Advanced search")]`);
        this.addButton = initLocator(`${this.ordersIndexForm}//a[contains(@href,"addOrder")]`);
        this.exportAllButton = initLocator(`${this.ordersIndexForm}//a[contains(@href,"startExport")]  `);
        this.chooseActionDropdown = initLocator(`${this.ordersIndexForm}//select[contains(@id,"OrderActionSelect")]`);
        this.confirmButton = initLocator(`${this.ordersIndexForm}//button[contains(@id,"action-confirm")]`);
        this.viewSizeDropdown = initLocator('//div[@class="pagination"]//button[contains(text(),"View")]');

        this.allOrdersTab = initLocator(`${this.ordersQuickFilter}/li/a[contains(text(),"All orders")]`);
        this.awaitingPaymentTab = initLocator(`${this.ordersQuickFilter}/li/a[contains(text(),"Awaiting Payment")]`);
        this.awaitingFulfillmentTab = initLocator(`${this.ordersQuickFilter}/li/a[contains(text(),"Awaiting Fulfillment")]`);
        this.awaitingShipmentTab = initLocator(`${this.ordersQuickFilter}/li/a[contains(text(),"Awaiting Shipment")]`);
        this.highRiskTab = initLocator(`${this.ordersQuickFilter}/li/a[contains(text(),"High Risk")]`);
        this.preOrdersTab = initLocator(`${this.ordersQuickFilter}/li/a[contains(text(),"Pre-orders")]`);
        this.moreTab = initLocator(`${this.ordersQuickFilter}/li/a[contains(text(),"More")]`);
        this.customViewsTab = initLocator(`${this.ordersQuickFilter}/li/a[contains(text(),"Custom views")]`);
        this.moreDropdownOptions = {
            Incomplete: initLocator(`${this.ordersQuickFilter}//div[@class="panel-inline"]//a[contains(text(),"Incomplete")]`),
            Archived: initLocator(`${this.ordersQuickFilter}//div[@class="panel-inline"]//a[contains(text(),"Archived")]`),
            Refunded: initLocator(`${this.ordersQuickFilter}//div[@class="panel-inline"]//a[contains(text(),"Refunded")]`),
            Shipped: initLocator(`${this.ordersQuickFilter}//div[@class="panel-inline"]//a[contains(text(),"Shipped")]`)
        };

        this.dateColumn = initLocator(`${this.ordersIndexForm}/table//th[@class="date"]/a/i`);
        this.orderIdColumn = initLocator(`${this.ordersIndexForm}/table//th[@class="order-id"]/a/i`);
        this.customerColumn = initLocator(`${this.ordersIndexForm}/table//th[@class="name"]/a/i`);
        this.statusColumn = initLocator(`${this.ordersIndexForm}/table//th[@class="status"]/a/i`);
        this.totalColumn = initLocator(`${this.ordersIndexForm}/table//th[@class="price"]/a/i`);
        this.actionColumn = initLocator(`${this.ordersIndexForm}/table//th[@class="action"]/button`);

        this.orderSuccessAlert = initLocator(`//div[@id="orderStatus"]//p`);
        this.expandOrderDetails = (orderId: string) => {
            return this.ordersTable.locator(
                `//tr[@data-order-id="${orderId}"]//button[@class="collapsible-trigger"]`
            );
        };
        this.orderDetailsActionButton = (orderId: string) => {
            return this.ordersTable.locator(
                `//button[@data-event-payload-order-id="${orderId}"]`
            );
        }
        this.orderDetailsStatusDropdown = (orderId: string) => {
            return this.ordersTable.locator(
                `//tr[@data-order-id="${orderId}"]//select[contains(@id,"${orderId}")]`
            );
        }
        this.orderDetailsActionOption = (action: string) => {
            return this.ordersTable.locator(
                `//div[@class="dropdown showing"]//li[contains(@aria-label,"${action}")]`
            );
        }
    }

    // Clicks the More dropdown and selects an option
    async selectMoreDropdownOption(option: 'Incomplete' | 'Archived' | 'Refunded' | 'Shipped'): Promise<void> {
        await this.moreTab.click();
        await this.moreDropdownOptions[option].click();
    }

    async selectOrderActions(action: 'Edit order' | 'Print invoice' | 'Print packing' | 'Resend invoice' | 'Send message'
        | 'View notes' | 'Ship items' | 'View shipments' | 'Refund order' | 'View order timeline'
    ): Promise<void> {
        try {
            if (action)
                await this.clickElement(this.orderDetailsActionOption(action), `Clicked on Action: "${action}"`);
            else
                console.log("Not Matching Action ");
        } catch (error) {
            console.log(`Error in selectOrderActions: ${error}`);

        }

    }

    

    // Navigation methods
    async navigateToAllOrders(): Promise<void> {
        await this.allOrdersTab.click();
        await this.ordersTable.waitFor();
    }

    // Tab navigation methods
    async navigateToAwaitingPayment(): Promise<void> {
        await this.awaitingPaymentTab.click();
    }

    async navigateToAwaitingFulfillment(): Promise<void> {
        await this.awaitingFulfillmentTab.click();
    }

    async navigateToAwaitingShipment(): Promise<void> {
        await this.awaitingShipmentTab.click();
    }

    async navigateToHighRisk(): Promise<void> {
        await this.highRiskTab.click();
    }

    async navigateToPreOrders(): Promise<void> {
        await this.preOrdersTab.click();
    }

    // Filter and search methods
    async filterOrders(keyword: string): Promise<void> {
        await this.filterInput.fill(keyword);
        await this.filterButton.click();
    }

    async searchOrders(): Promise<void> {
        await this.searchButton.click();
    }

    // Action methods
    async clickAddOrder(): Promise<void> {
        await this.addButton.click();
    }

    async getOrderIdAlertSuccess(): Promise<string | null> {
        await this.page.waitForLoadState('networkidle');
        await this.orderSuccessAlert.waitFor({ state: 'visible', timeout: 10000 });
        let orderId = await this.orderSuccessAlert.textContent();
        if (!orderId) return null;
        let orderIdMatch = orderId.match(/#(\d+)/);
        return orderIdMatch ? orderIdMatch[1] : null;
    }

    async exportAllOrders(): Promise<void> {
        await this.exportAllButton.click();
    }

    async selectBulkAction(action: string): Promise<void> {
        await this.chooseActionDropdown.selectOption(action);
    }

    async confirmBulkAction(): Promise<void> {
        await this.confirmButton.click();
    }

    async changeViewSize(size: string): Promise<void> {
        await this.viewSizeDropdown.click();
    }

    // Order data retrieval methods
    async getOrderDetails(orderId: string): Promise<{
        date: string;
        customer: string;
        status: string;
        total: string;
    }> {
        const row = await this.ordersTable.locator(`//tr:has-text("${orderId}")`);
        return {
            date: await row.locator('td').nth(0).textContent() || '',
            customer: await row.locator('td').nth(2).textContent() || '',
            status: await row.locator('td').nth(3).textContent() || '',
            total: await row.locator('td').nth(4).textContent() || ''
        };
    }

    async getOrderCount(): Promise<number> {
        return await this.orderRows.count();
    }

    // Status verification methods
    async verifyOrderStatus(orderId: string, expectedStatus: string): Promise<boolean> {
        const details = await this.getOrderDetails(orderId);
        return details.status.includes(expectedStatus);
    }

    // Order selection methods
    async selectOrder(orderId: string): Promise<void> {
        await this.ordersTable
            .locator('//tr', { has: this.orderRows.getByText(orderId) })
            .locator('input[type="checkbox"]')
            .click();
    }

    async selectMultipleOrders(orderIds: string[]): Promise<void> {
        for (const orderId of orderIds) {
            await this.selectOrder(orderId);
        }
    }

    async selectAllOrders(): Promise<void> {
        await this.ordersTable.locator('th input[type="checkbox"]').click();
    }

    // Order action methods
    async openOrderDetails(orderId: string): Promise<void> {
        await this.ordersTable
            .locator('tr', { has: this.orderRows.getByText(orderId) })
            .locator('td')
            .nth(1)
            .click();
    }

    async changeOrderStatus(orderId: string, newStatus: string): Promise<void> {
        const statusDropdown = this.ordersTable
            .locator('tr', { has: this.orderRows.getByText(orderId) })
            .locator('select');
        await statusDropdown.selectOption(newStatus);
    }

    // Verification methods
    async isOrderVisible(orderId: string): Promise<boolean> {
        return await this.ordersTable.locator(`text=${orderId}`).isVisible();
    }

    async getOrderSuccessMessage(): Promise<string | null> {
        return await this.ordersTable.locator('.alert-success').textContent();
    }

    async verifyOrderTotal(orderId: string, expectedTotal: string): Promise<boolean> {
        const details = await this.getOrderDetails(orderId);
        return details.total === expectedTotal;
    }

    // Sort methods
    async sortByDate(): Promise<void> {
        await this.clickElement(this.dateColumn, 'Date column');
    }

    async sortByOrderId(): Promise<void> {
        await this.clickElement(this.orderIdColumn, 'Order ID column');
    }

    async sortByCustomer(): Promise<void> {
        await this.clickElement(this.customerColumn, 'Customer column');
    }

    async sortByStatus(): Promise<void> {
        await this.clickElement(this.statusColumn, 'Status column');
    }

    async sortByTotal(): Promise<void> {
        await this.clickElement(this.totalColumn, 'Total column');
    }

    async searchOrderInTable(orderId: string): Promise<boolean> {
        const orderRow = this.ordersTable.locator('tr', { hasText: orderId });
        if (await orderRow.count() > 0) {
            return await orderRow.isVisible();
        }
        return false;
    }

    async extractOrderDetails(orderId: string) {
        await this.clickElement(this.expandOrderDetails(orderId), 'Expand Order Details');
    }

}
