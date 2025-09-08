# QA Automation Framework

This repository contains a modular and extendable QA automation framework built with TypeScript and Playwright. It supports UI, API, Smoke, and Regression testing.

## Folder Structure

```
├── tests/
│   ├── BigCommerceTests/
│   │   ├── APITests/
│   │   │   ├── bigc-to-kibo.spec.ts
│   │   │   ├── customer-creation-conversion.spec.ts
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
├── mocks/
├── models/
│   └── OrderTypes.ts
├── postman/
├── test-results/
│   ├── index.html
│   └── report.json
├── utils/
│   ├── apiUtils.ts
│   ├── db.ts
│   ├── excelReader.ts
│   ├── helpers.ts
│   ├── performanceHtmlReport.ts
│   ├── PerformanceRecorder.ts
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
3. **Postman & Mockoon Integration**: Supports running Postman collections for API workflows and Mockoon for simulating/faking APIs in test environments.
4. **Database Utility**: SQL Server operations via the `mssql` library, enabling direct DB validation and test data setup.
5. **Test Tagging & Categorization**: Easily run targeted test suites (UI, API, Smoke, Regression) using tags and organized folder structure.
6. **Rich Reporting**: Generates HTML and JSON reports, including screenshots and videos on failure, for easy debugging and sharing results.
7. **Data-Driven Testing**: Flexible test data management using JSON and Excel files, supporting scalable and maintainable test scenarios.
8. **Advanced UI Interactions**: Includes a robust `UIInteractions` utility for handling complex or problematic UI elements, with fallback strategies and iframe support.
9. **Enhanced Table Verification**: Smart comparison of both input and displayed/highlighted values in tables, with normalization for currency, numbers, and detailed error reporting.
10. **Extensible Utilities**: Utility modules for API, DB, Excel reading, performance recording, and more, making the framework adaptable to new requirements.
11. **Chrome Debug Session Support**: Ability to run tests using an existing Chrome instance with preserved login state for faster, session-persistent test execution and debugging.

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
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   DB_SERVER=<your-db-server>
   DB_NAME=<your-db-name>
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
- **Performance Data**: If enabled, performance metrics are recorded and available for review.

You can customize reporting options in `playwright.config.ts` and extend reporting with utilities in `utils/performanceHtmlReport.ts`.

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

## License

This project is licensed under the MIT License.