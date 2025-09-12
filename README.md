# QA Automation Framework

This repository contains a modular and extendable QA automation framework built with TypeScript and Playwright. It supports UI, API, Smoke, and Regression testing.

## Folder Structure

```
├── tests/
│   ├── BigCommerceTests/
│   │   ├── APITests/
│   │   │   ├── bigc-to-kibo.spec.ts
│   │   │   ├── customer-creation-conversion.spec.ts
│   │   ├── DbTests/
│   │   │   └── CreateOrderDBTests.spec.ts
│   │   ├── UITests/
│   │   │   ├── LoginTests/
│   │   │   │   └── login.spec.ts
│   │   │   ├── OrdersTests/
│   │   │   │   ├── createCustomProductOrder.spec.ts
│   │   │   │   ├── createStandardProductOrder.spec.ts
│   ├── PearsonVuesTests/
│   │   ├── UITests/
│   │   │   └── Reports.spec.ts
│   ├── excel-reader.test.ts
├── pages/
│   ├── abc/
│   ├── BigCommercePages/
│   │   ├── Base/
│   │   │   └── basePage.ts
│   │   ├── Dashboard/
│   │   │   └── homepage.ts
│   │   ├── Login/
│   │   │   └── loginPage.ts
│   │   ├── Orders/
│   │   │   ├── addOrderPage.ts
│   │   │   ├── allOrdersPage.ts
│   │   ├── Products/
│   │   │   ├── addProduct.ts
│   │   │   ├── allProducts.ts
│   ├── PerasonVuewPages/
│   │   └── LoginPage.ts
├── data/
│   ├── BigC_Ecomm_TestCases_AutomationMasterSheet.xlsx
│   ├── TestCases.json
│   ├── APIData/
│   │   ├── customerPayload.json
│   │   ├── dbConfig.json
│   │   ├── webhookSecret.json
│   ├── BigCommerceData/
│   │   ├── addOrdersJson.json
│   │   ├── addProductData.json
│   │   ├── loginTestData.json
│   │   ├── orderTestData.json
│   ├── PersonVueData/
├── queries/
│   ├── bigcommerce-order-queries.sql
│   └── README.md
├── mocks/
├── models/
│   └── OrderTypes.ts
├── postman/
├── test-results/
│   ├── index.html
│   └── report.json
├── utils/
│   ├── apiUtils.ts
│   ├── baseTest.ts
│   ├── db.ts
│   ├── excelReader.ts
│   ├── helpers.ts
│   ├── queryManager.ts
│   ├── testConfig.ts
│   ├── uiInteractions.ts
│   └── uiInteractions.ts.bak
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── fix-playwright.ps1
├── start-chrome-debug.ps1
├── fulfillment-table.png
├── shipping-details-1.png
├── README.md
```

## Features

1. **Modular UI Testing**: Built with Playwright and a Page Object Model, supporting reusable and maintainable UI test components for BigCommerce and Pearson Vue platforms.
2. **Comprehensive API Testing**: Utilizes Playwright's request API and custom utilities for robust API validation, including data-driven scenarios.
3. **Database Verification Testing**: Advanced database testing with comprehensive SQL queries for order verification, supporting both automated tests and manual SSMS execution.
4. **Query Management System**: Centralized SQL query management with parameterized queries, automatic loading, and separation of SQL logic from test code.
5. **Postman & Mockoon Integration**: Supports running Postman collections for API workflows and Mockoon for simulating/faking APIs in test environments.
6. **Database Utility**: SQL Server operations via the `mssql` library, enabling direct DB validation and test data setup.
7. **Test Tagging & Categorization**: Easily run targeted test suites (UI, API, DB, Smoke, Regression) using tags and organized folder structure.
8. **Rich Reporting**: Generates HTML and JSON reports, including screenshots and videos on failure, for easy debugging and sharing results.
9. **Data-Driven Testing**: Flexible test data management using JSON and Excel files, supporting scalable and maintainable test scenarios.
10. **Advanced UI Interactions**: Includes a robust `UIInteractions` utility for handling complex or problematic UI elements, with fallback strategies and iframe support.
11. **Enhanced Table Verification**: Smart comparison of both input and displayed/highlighted values in tables, with normalization for currency, numbers, and detailed error reporting.
12. **Modular Test Infrastructure**:
    - `BaseTest` class for centralized browser setup and teardown
    - `TestConfig` class for environment-based test configuration
    - `ExcelReader` utility for comprehensive Excel data operations
    - `QueryManager` class for SQL query management and execution
    - Singleton patterns for efficient resource management
13. **Extensible Utilities**: Utility modules for API, DB, Excel reading, query management, and more, making the framework adaptable to new requirements.
14. **Chrome Debug Session Support**: Ability to run tests using an existing Chrome instance with preserved login state for faster, session-persistent test execution and debugging.

## Setup

1. **Clone the repository**
   ```powershell
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the project root with your DB and app credentials:
   ```env
   # Main Database (FinRecon)
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   DB_SERVER=<your-db-server>
   DB_NAME=<your-db-name>

   # BigCommerce Database
   BIGC_DB_USER=<your-bigcommerce-db-user>
   BIGC_DB_PASSWORD=<your-bigcommerce-db-password>
   BIGC_DB_SERVER=<your-bigcommerce-db-server>
   BIGC_DB_NAME=<your-bigcommerce-db-name>

   # Application
   BASE_URL=<your-app-url>
   ```
   - For API and DB config, update files in `data/APIData/` as needed (e.g., `dbConfig.json`, `webhookSecret.json`).

4. **Install Playwright browsers**
   ```powershell
   npx playwright install
   ```

5. **(Optional) Windows PowerShell scripts**
   - Use `fix-playwright.ps1` to resolve Playwright issues on Windows if needed.
   - Use `start-chrome-debug.ps1` to launch Chrome with remote debugging for session-persistent tests.

## Running Tests


You can run tests using npm scripts or directly with Playwright. All commands below work in PowerShell on Windows.

- **Run all UI tests**
   ```powershell
   npm run test:ui
   # or
   npx playwright test tests/BigCommerceTests/UITests/ --headed
   ```

- **Run all API tests**
   ```powershell
   npm run test:api
   # or
   npx playwright test tests/BigCommerceTests/APITests/
   ```

- **Run all Database tests**
   ```powershell
   npm run test:db
   # or
   npx playwright test tests/BigCommerceTests/DbTests/
   ```

- **Run all Smoke tests**
   ```powershell
   npm run test:smoke
   ```

- **Run all Regression tests**
   ```powershell
   npm run test:regression
   ```

- **Run a specific test file**
   ```powershell
   npx playwright test tests/BigCommerceTests/UITests/OrdersTests/createStandardProductOrder.spec.ts
   ```

- **Run database verification test**
   ```powershell
   npx playwright test tests/BigCommerceTests/DbTests/CreateOrderDBTests.spec.ts
   ```

- **Run tests with Chrome debug session**
   ```powershell
   .\start-chrome-debug.ps1
   npx playwright test --project=existing-chrome
   ```

Test results and reports will be generated in the `test-results` folder after execution.

## Reporting


Test execution generates detailed reports in the `test-results` folder:

- **HTML Report**: Open `test-results/index.html` in your browser for a visual summary of all test runs, including pass/fail status, error details, and links to screenshots/videos.
- **JSON Report**: For integration or analysis, use `test-results/report.json`.
- **Screenshots & Videos**: On test failure, screenshots and videos are automatically captured and linked in the HTML report for easy debugging.

You can customize reporting options in `playwright.config.ts`.

## Using Existing Chrome Instance for Tests


### Overview
Run Playwright tests using an existing Chrome instance with preserved login state for session persistence, faster execution, and easier debugging.

#### When to Use
- Maintain login sessions between test runs (no repeated logins)
- Debug tests with the same browser state
- Speed up test execution by reusing the browser instance

### Step-by-Step Guide

1. **Launch Chrome with Remote Debugging**
   ```powershell
   .\start-chrome-debug.ps1
   ```
   - Chrome starts with remote debugging on port 9222
   - User data is stored in `C:\ChromeDebug` (profile persists)

2. **Log In Manually**
   - Use the opened Chrome window to log into your application
   - Leave the window open during test runs

3. **Run Playwright Tests**
   ```powershell
   npx playwright test --project=existing-chrome
   ```
   - Tests will use the running Chrome instance and preserved session

### Tips & Troubleshooting
- Always keep the Chrome window open while tests run
- Do not close Chrome between test runs to preserve session
- Ensure port 9222 is free (close other Chrome debug sessions if needed)
- If login state is lost, repeat the manual login step
- Profile data is saved in `C:\ChromeDebug` for future runs

### Restarting Later
1. Run `.\start-chrome-debug.ps1`
2. Log in once (if needed)
3. Run your tests

## Advanced UI Interaction & Table Verification


### UIInteractions Utility

The framework includes a robust `UIInteractions` utility class for handling complex or problematic UI elements. It supports:
- Fallback strategies for elements that are hard to interact with
- Automatic handling of iframes and dynamic content
- Custom timeouts and descriptive error messages

**Example: Interacting with a checkbox (including iframes)**
```typescript
await UIInteractions.checkElement(
   checkboxLocator,
   {
      description: 'Terms checkbox',
      timeout: 5000,
      page: this.page,
      iframe: 'content-iframe' // Optional iframe context
   }
);
```

**Tips:**
- Use descriptive `description` for better error reporting
- Specify `iframe` if the element is inside an iframe
- Adjust `timeout` for slow-loading elements

### Table Value Verification

Enhanced table verification supports:
- Comparing both input field values and displayed/highlighted text
- Smart normalization for currency, numbers, and formatting
- Detailed error reporting for mismatches

**Example: Verify product details in a table**
```typescript
// Verify input field values
await addOrderPage.verifyProductInTable(productDetails, { checkHighlightedValues: false });

// Verify highlighted/displayed text values
await addOrderPage.verifyProductInTable(productDetails, { checkHighlightedValues: true });
```

**Smart format matching:**
```typescript
"$49.99" === "49.99"      // Currency symbols ignored
"1,234.56" === "1234.56"  // Separators ignored
"49.990" === "49.99"      // Trailing zeros ignored
```

**Error reporting example:**
```
Product details validation failed for 'Test Product':
Product price does not match the expected value. Expected: "$49.99", Found: "$50.00"
Product quantity does not match the expected value. Expected: "2", Found: "1"
```

**Best Practices:**
- Use table verification for both UI and API-driven tests
- Review error messages for quick debugging
- Extend utility methods for custom table formats as needed

## Database Verification & Query Management

### Overview
The framework includes comprehensive database verification capabilities with a sophisticated query management system that supports both automated testing and manual SQL Server Management Studio (SSMS) execution.

### Key Components

#### Query Management System (`utils/queryManager.ts`)
- **Automatic SQL Loading**: Loads queries from `.sql` files in the `queries/` directory
- **Parameterized Queries**: Secure parameter binding to prevent SQL injection
- **Singleton Pattern**: Efficient resource management and caching
- **Error Handling**: Comprehensive error reporting and logging

#### Database Verification (`utils/db.ts`)
- **BigCommerce Integration**: Direct connection to BigCommerce database
- **Comprehensive Order Verification**: Validates orders with full details including items, payments, billing, and fulfillment
- **Flexible Query Execution**: Supports both simple and complex SQL queries

### Database Test Structure

#### DB Tests (`tests/BigCommerceTests/DbTests/`)
- **`CreateOrderDBTests.spec.ts`**: Comprehensive order verification tests
- **Connection Validation**: Tests database connectivity and schema
- **Order Verification**: Validates orders created through UI tests

### SQL Query Files (`queries/`)

#### `bigcommerce-order-queries.sql`
Contains the comprehensive order verification query that retrieves:
- **Core Order Information**: Order ID, number, status, dates, financial summary
- **Customer & Billing Details**: Contact information, addresses, payment methods
- **Order Items**: Products, quantities, pricing, discounts
- **Payment Information**: Transactions, interactions, refunds
- **Fulfillment Details**: Shipping addresses, methods, tracking
- **Order Notes & Attributes**: Additional order metadata

### Running Database Tests

#### Prerequisites
1. Configure BigCommerce database credentials in `.env`:
   ```env
   BIGC_DB_USER=<your-bigcommerce-db-user>
   BIGC_DB_PASSWORD=<your-bigcommerce-db-password>
   BIGC_DB_SERVER=<your-bigcommerce-db-server>
   BIGC_DB_NAME=<your-bigcommerce-db-name>
   ```

2. Ensure database firewall allows connections from your IP

#### Test Execution
```powershell
# Run all database tests
npx playwright test tests/BigCommerceTests/DbTests/

# Run specific database test
npx playwright test tests/BigCommerceTests/DbTests/CreateOrderDBTests.spec.ts

# Run with detailed output
npx playwright test tests/BigCommerceTests/DbTests/ --reporter=line
```

### Manual SSMS Verification

For manual verification or debugging, you can execute queries directly in SQL Server Management Studio:

1. **Connect to BigCommerce Database** in SSMS
2. **Replace Parameters**: Update `@OrderNumber` with actual order number from Excel
3. **Execute Query**: Copy and run the comprehensive query from `queries/bigcommerce-order-queries.sql`

#### Example Manual Query
```sql
-- Quick existence check
SELECT COUNT(*) as OrderCount
FROM [Order]
WHERE OrderNumber = '429113';

-- Full order details
DECLARE @OrderNumber VARCHAR(50) = '429113';
-- [Paste the comprehensive query here]
```

### Query Management Usage

#### In Test Code
```typescript
import { QueryManager } from '../../../utils/queryManager';

// Get query manager instance
const queryManager = QueryManager.getInstance();

// Execute parameterized query
const results = await queryManager.executeQuery('comprehensive-order-details', {
    OrderNumber: '429113'
});
```

#### Adding New Queries
1. Create new `.sql` file in `queries/` directory
2. Add query with comment header: `-- Query Name Query`
3. Use parameters with `@ParameterName` syntax
4. Query will be automatically loaded by `QueryManager`

### Best Practices

#### Database Testing
- **Order of Execution**: Run UI tests first to create orders, then DB tests to verify
- **Data Dependencies**: Ensure test data exists before running verification tests
- **Connection Management**: Database connections are automatically managed
- **Error Handling**: Tests provide detailed error messages for troubleshooting

#### Query Management
- **Parameterization**: Always use parameters instead of string concatenation
- **Query Organization**: Group related queries in logical files
- **Documentation**: Add clear comments explaining query purpose and parameters
- **Performance**: Complex queries are optimized for comprehensive data retrieval

#### Manual Verification
- **SSMS Testing**: Use manual queries for debugging and validation
- **Parameter Testing**: Test with various parameter values
- **Result Analysis**: Review all returned data fields for completeness

## License

This project is licensed under the MIT License.