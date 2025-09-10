// Test configuration for BigCommerce tests
export interface TestScenario {
    scenario: string;
    sheetName: string;
}

export class TestConfig {
    private static instance: TestConfig;
    private constructor() {}

    public static getInstance(): TestConfig {
        if (!TestConfig.instance) {
            TestConfig.instance = new TestConfig();
        }
        return TestConfig.instance;
    }

    /**
     * Get scenarios from environment variable or default
     */
    public getScenarios(): TestScenario[] {
        // Allow specifying scenarios to run via environment variable
        // Usage: set SCENARIOS="Order with Standard product - Fulfillment using Billing Address:Standard Product,Another Scenario:Sheet Name"
        const envScenarios = process.env.SCENARIOS;
        let scenarios: TestScenario[] = [];
        if (envScenarios) {
            scenarios = envScenarios.split(',').map(pair => {
                const [scenario, sheetName] = pair.split(':');
                return { scenario: scenario.trim(), sheetName: (sheetName || '').trim() };
            });
        } else {
            // Default: only run the main scenario
            scenarios = [
                { scenario: 'Order with Standard product - Fulfillment using Billing Address', sheetName: 'Standard Product' }
            ];
        }
        return scenarios;
    }

    /**
     * Get test case names from environment variable or default
     */
    public getTestCaseNames(): string[] {
        // Usage: set TESTCASE_NAMES="TC-001,TC-002" (where TC-001 is the Test Case Name in Excel)
        const envTestCaseNames = process.env.TESTCASE_NAMES;
        let testCaseNames: string[] = [];
        if (envTestCaseNames) {
            testCaseNames = envTestCaseNames.split(',').map(tc => tc.trim());
        } else {
            // Default: only run one test case
            testCaseNames = [
                'Standard_FulfillmentusingBillingAddress_CashonDelivery_NoDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_CashonDelivery_ManualDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_BankDeposit_NoDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_BankDeposit_ManualDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_Cybersource_NoDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_Cybersource_ManualDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_ManualPayment_NoDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_ManualPayment_ManualDiscount_NoCoupon'
            ];
        }
        return testCaseNames;
    }
}