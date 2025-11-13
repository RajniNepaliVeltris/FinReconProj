
// Test configuration for BigCommerce tests
export interface TestScenario {
    scenario: string;
    sheetName: string;
    testCases: string[];
    excelFilePath?: string;
}

export interface Address {
    firstName: string;
    lastName: string;
    companyName: string;
    phoneNumber: string;
    streetAddressLine1: string;
    streetAddressLine2: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    poNumber: string;
    taxID: string;
    saveaddressCheckbox: boolean;
}


export class TestConfig {
    private static instance: TestConfig;
    private constructor() { }

    public static getInstance(): TestConfig {
        if (!TestConfig.instance) {
            TestConfig.instance = new TestConfig();
        }
        return TestConfig.instance;
    }

    /**
     * Get base URL for BigCommerce store
     */
    public getBaseUrl(): string {
        return process.env.BASE_URL || 'https://store-5nfoomf2b4.mybigcommerce.com';
    }

    /**
     * Get add order URL
     */
    public getAddOrderUrl(): string {
        return `${this.getBaseUrl()}/manage/orders/add-order`;
    }

    public getAddProductUrl(): string {
        return `${this.getBaseUrl()}/manage/products/add`;
    }
    /**
     * Get all orders URL
     */
    public getAllOrdersUrl(): string {
        return `${this.getBaseUrl()}/manage/orders`;
    }

    /**
     * Get default address for fulfillment
     */
    public getDefaultAddress(): Address {
        return {
            firstName: process.env.DEFAULT_FIRST_NAME || 'John',
            lastName: process.env.DEFAULT_LAST_NAME || 'Doe',
            companyName: process.env.DEFAULT_COMPANY_NAME || 'JD Inc.',
            phoneNumber: process.env.DEFAULT_PHONE_NUMBER || '1234567890',
            streetAddressLine1: process.env.DEFAULT_STREET_ADDRESS_LINE1 || '123 Main St',
            streetAddressLine2: process.env.DEFAULT_STREET_ADDRESS_LINE2 || 'Apt 4B',
            city: process.env.DEFAULT_CITY || 'Anytown',
            state: process.env.DEFAULT_STATE || 'New York',
            country: process.env.DEFAULT_COUNTRY || 'USA',
            zip: process.env.DEFAULT_ZIP || '90210',
            poNumber: process.env.DEFAULT_PO_NUMBER || 'PO123456',
            taxID: process.env.DEFAULT_TAX_ID || 'TAXID123',
            saveaddressCheckbox: process.env.DEFAULT_SAVE_ADDRESS === 'true' || false
        };
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
                },
                {
                    scenario: 'Order with Bundle product - Fulfillment using Billing Address',
                    sheetName: 'Bundle Product',
                    testCases: [
                        'Bundle_FulfillmentusingBillingAddress_CashonDelivery_NoDiscount_NoCoupon',
                        'Bundle_FulfillmentusingBillingAddress_CashonDelivery_ManualDiscount_NoCoupon',
                        'Bundle_FulfillmentusingBillingAddress_BankDeposit_NoDiscount_NoCoupon',
                        'Bundle_FulfillmentusingBillingAddress_BankDeposit_ManualDiscount_NoCoupon',
                        'Bundle_FulfillmentusingBillingAddress_Cybersource_NoDiscount_NoCoupon',
                        'Bundle_FulfillmentusingBillingAddress_Cybersource_ManualDiscount_NoCoupon',
                        'Bundle_FulfillmentusingBillingAddress_ManualPayment_NoDiscount_NoCoupon',
                        'Bundle_FulfillmentusingBillingAddress_ManualPayment_ManualDiscount_NoCoupon'
                    ]
                },
                {
                    scenario: 'Order with Bundle product - Fulfillment using New Single Address',
                    sheetName: 'Bundle Product',
                    testCases: [
                        'Bundle_FulfillmentusingNewSingleAddress_CashonDelivery_NoDiscount_NoCoupon',
                        'Bundle_FulfillmentusingNewSingleAddress_CashonDelivery_ManualDiscount_NoCoupon',
                        'Bundle_FulfillmentusingNewSingleAddress_BankDeposit_NoDiscount_NoCoupon',
                        'Bundle_FulfillmentusingNewSingleAddress_BankDeposit_ManualDiscount_NoCoupon',
                        'Bundle_FulfillmentusingNewSingleAddress_Cybersource_NoDiscount_NoCoupon',
                        'Bundle_FulfillmentusingNewSingleAddress_Cybersource_ManualDiscount_NoCoupon',
                        'Bundle_FulfillmentusingNewSingleAddress_ManualPayment_NoDiscount_NoCoupon',
                        'Bundle_FulfillmentusingNewSingleAddress_ManualPayment_ManualDiscount_NoCoupon'
                    ]
                },
                {
                    scenario: 'Create Standard Product',
                    sheetName: 'Create_Standard_Product',
                    testCases: ['Create Standard product']
                },
                {
                    scenario: 'Create Bundle Product',
                    sheetName: 'Create_Bundle_Product',
                    testCases: ['Create Bundle Product In Modifiers With Two Products']
                }
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
                'Standard_FulfillmentusingNewSingleAddress_ManualPayment_ManualDiscount_NoCoupon',
                
                'Create Standard product',

                'Create Bundle product in modifiers with 2 products',


            ];
        }
        return testCaseNames;
    }
}