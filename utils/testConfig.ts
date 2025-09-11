// Test configuration for BigCommerce tests
export interface TestScenario {
    scenario: string;
    sheetName: string;
    testCases: string[];
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
        // Example: "Scenario1:SheetName:TC1,TC2,TC3;Scenario2:SheetName:TC4,TC5,TC6"
        const envScenarios = process.env.SCENARIOS;
        let scenarios: TestScenario[] = [];
        
        if (envScenarios) {
            scenarios = envScenarios.split(';').map(scenarioStr => {
                const [scenario, sheetName, testCases] = scenarioStr.split(':');
                return {
                    scenario: scenario.trim(),
                    sheetName: sheetName.trim(),
                    testCases: testCases ? testCases.split(',').map(tc => tc.trim()) : []
                };
            });
        } else {
            // Default: Group test cases by scenario
            scenarios = [
                {
                    scenario: 'Order with Standard product - Fulfillment using Billing Address',
                    sheetName: 'Standard Product',
                    testCases: [
                        'Standard_FulfillmentusingBillingAddress_CashonDelivery_NoDiscount_NoCoupon',
                        'Standard_FulfillmentusingBillingAddress_CashonDelivery_ManualDiscount_NoCoupon',
                        'Standard_FulfillmentusingBillingAddress_BankDeposit_NoDiscount_NoCoupon',
                        'Standard_FulfillmentusingBillingAddress_BankDeposit_ManualDiscount_NoCoupon',
                        'Standard_FulfillmentusingBillingAddress_Cybersource_NoDiscount_NoCoupon',
                        'Standard_FulfillmentusingBillingAddress_Cybersource_ManualDiscount_NoCoupon',
                        'Standard_FulfillmentusingBillingAddress_ManualPayment_NoDiscount_NoCoupon',
                        'Standard_FulfillmentusingBillingAddress_ManualPayment_ManualDiscount_NoCoupon'
                    ]
                },
                {
                    scenario: 'Order with Standard product - Fulfillment using New Single Address',
                    sheetName: 'Standard Product',
                    testCases: [
                        'Standard_FulfillmentusingNewSingleAddress_CashonDelivery_NoDiscount_NoCoupon',
                        'Standard_FulfillmentusingNewSingleAddress_CashonDelivery_ManualDiscount_NoCoupon',
                        'Standard_FulfillmentusingNewSingleAddress_BankDeposit_NoDiscount_NoCoupon',
                        'Standard_FulfillmentusingNewSingleAddress_BankDeposit_ManualDiscount_NoCoupon',
                        'Standard_FulfillmentusingNewSingleAddress_Cybersource_NoDiscount_NoCoupon',
                        'Standard_FulfillmentusingNewSingleAddress_Cybersource_ManualDiscount_NoCoupon',
                        'Standard_FulfillmentusingNewSingleAddress_ManualPayment_NoDiscount_NoCoupon',
                        'Standard_FulfillmentusingNewSingleAddress_ManualPayment_ManualDiscount_NoCoupon'
                    ]
                }
            ];
        }
        return scenarios;
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
            // Keep the order from environment variable
            testCaseNames = envTestCaseNames.split(',').map(tc => tc.trim());
        } else {
            // Default: run test cases in sequential order
            testCaseNames = [
                // Standard Fulfillment using Billing Address
                'Standard_FulfillmentusingBillingAddress_CashonDelivery_NoDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_CashonDelivery_ManualDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_BankDeposit_NoDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_BankDeposit_ManualDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_Cybersource_NoDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_Cybersource_ManualDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_ManualPayment_NoDiscount_NoCoupon',
                'Standard_FulfillmentusingBillingAddress_ManualPayment_ManualDiscount_NoCoupon',

                // Standard Fulfillment using New Single Address
                'Standard_FulfillmentusingNewSingleAddress_CashonDelivery_NoDiscount_NoCoupon',
                'Standard_FulfillmentusingNewSingleAddress_CashonDelivery_ManualDiscount_NoCoupon',
                'Standard_FulfillmentusingNewSingleAddress_BankDeposit_NoDiscount_NoCoupon',
                'Standard_FulfillmentusingNewSingleAddress_BankDeposit_ManualDiscount_NoCoupon',
                'Standard_FulfillmentusingNewSingleAddress_Cybersource_NoDiscount_NoCoupon',
                'Standard_FulfillmentusingNewSingleAddress_Cybersource_ManualDiscount_NoCoupon',
                'Standard_FulfillmentusingNewSingleAddress_ManualPayment_NoDiscount_NoCoupon',
                'Standard_FulfillmentusingNewSingleAddress_ManualPayment_ManualDiscount_NoCoupon'

            ];
        }
        return testCaseNames;
    }
}