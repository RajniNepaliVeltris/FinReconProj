# QA Automation Framework

This repository contains a modular and extendable QA automation framework built with TypeScript and Playwright. It supports UI, API, Smoke, and Regression testing.

## Folder Structure

```
├── tests/
│   ├── BigCommerceTests/
│   │   ├── APITests/          # API tests for BigCommerce
│   │   ├── UITests/           # UI tests for BigCommerce
│   │   │   ├── LoginTests/    # Login-related tests
│   │   │   ├── OrdersTests/   # Order-related tests
│   ├── PearsonVuesTests/      # Tests for Pearson Vue
├── pages/
│   ├── BigCommercePages/      # BigCommerce-specific pages
│   │   ├── Base/              # Base page classes
│   │   ├── Dashboard/         # Dashboard-related pages
│   │   ├── Login/             # Login-related pages
│   │   ├── Orders/            # Order-related pages
│   ├── PerasonVuewPages/      # Pages for Pearson Vue
│   ├── abc/                   # Miscellaneous pages
├── data/
│   ├── BigCommerceData/       # Data for BigCommerce tests
│   ├── PersonVueData/         # Data for Pearson Vue tests
│   ├── addOrdersJson.json     # Additional order data
├── mocks/                     # Mockoon configs for fake APIs
├── postman/                   # Postman collections + Newman runner config
├── utils/                     # Utility functions
│   ├── db.ts                  # SQL Server DB utility
│   ├── apiUtils.ts            # Helpers for API calls
│   └── helpers.ts             # Common utilities
├── test-results/              # Test result reports
│   ├── index.html             # HTML report
│   └── report.json            # JSON report
├── playwright.config.ts       # Playwright configuration
├── package.json               # NPM scripts and dependencies
├── tsconfig.json              # TypeScript configuration
├── .env                       # Environment variables (DB + API credentials)
├── README.md                  # Project documentation
```

## Features

1. **UI Testing**: Built with Playwright and Page Object Model.
2. **API Testing**: Uses Playwright's request API.
3. **Postman Integration**: Run collections in CI/CD pipelines.
4. **Mockoon Integration**: Consume fake APIs.
5. **Database Utility**: SQL Server operations using `mssql` library.
6. **Test Tagging**: Run specific test categories using tags.
7. **Reporting**: HTML and JSON reports with screenshots and videos on failure.
8. **Data-Driven Testing**: Test data stored in JSON files for flexibility.
9. **Page Object Model**: Encapsulates UI interactions in reusable classes.
10. **Robust UI Interactions**: Enhanced interaction utilities with fallback strategies for troublesome UI elements.
11. **Advanced Table Verification**: Support for comparing both input values and highlighted/displayed values in tables, with smart formatting capabilities.

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```env
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   DB_SERVER=<your-db-server>
   DB_NAME=<your-db-name>
   BASE_URL=<your-app-url>
   ```

4. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

- Run UI tests:
  ```bash
  npm run test:ui
  ```

- Run API tests:
  ```bash
  npm run test:api
  ```

- Run Smoke tests:
  ```bash
  npm run test:smoke
  ```

- Run Regression tests:
  ```bash
  npm run test:regression
  ```

## Reporting

Test results are available in the `test-results` folder. Open `test-results/index.html` to view the HTML report.

## Using Existing Chrome Instance for Tests

### Overview
You can run tests using an existing Chrome instance with preserved login state. This is useful when:
- You need to maintain login sessions between test runs
- You want to debug tests with the same browser state
- You want faster test execution by reusing the browser instance

### Setup Steps

1. **Launch Chrome with Remote Debugging**
   ```powershell
   # Run the provided PowerShell script
   .\start-chrome-debug.ps1
   ```
   This starts Chrome with:
   - Remote debugging port: 9222
   - User data directory: C:\ChromeDebug

2. **Manual Login**
   - Use the launched Chrome instance
   - Log into your application
   - Keep the Chrome window open

3. **Run Tests**
   ```powershell
   # Run tests with existing Chrome instance
   npx playwright test --project=existing-chrome
   ```

### Important Notes
- Keep the Chrome instance running during test execution
- Chrome debug profile is saved at `C:\ChromeDebug`
- Login session persists between test runs
- Do not close the Chrome window between test runs
- Port 9222 must be available

### Restarting Later
1. Run `start-chrome-debug.ps1`
2. Log in once
3. Run your tests

## Advanced UI Interaction & Table Verification

### UIInteractions Utility

The framework includes a robust `UIInteractions` utility class for handling problematic UI elements with fallback strategies:

```typescript
// Example: Working with checkboxes that might be in iframes or have interaction issues
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

### Table Value Verification

The framework provides enhanced table verification capabilities:

1. **Verify both input values and displayed/highlighted values**:
```typescript
// Verify values in input fields
await addOrderPage.verifyProductInTable(productDetails, { 
    checkHighlightedValues: false 
});

// Verify highlighted/displayed text values
await addOrderPage.verifyProductInTable(productDetails, { 
    checkHighlightedValues: true 
});
```

2. **Smart format matching for numerical and currency values**:
```typescript
// These will match with format normalization
"$49.99" === "49.99"  // Currency symbols ignored
"1,234.56" === "1234.56"  // Separators ignored
"49.990" === "49.99"  // Trailing zeros ignored
```

3. **Detailed error reporting**:
```
Product details validation failed for 'Test Product':
Product price does not match the expected value. Expected: "$49.99", Found: "$50.00"
Product quantity does not match the expected value. Expected: "2", Found: "1"
```

## License

This project is licensed under the MIT License.